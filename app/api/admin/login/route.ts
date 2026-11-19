import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureAuthAndPermissionsSchema, normalizeRole, resolveUserPermissions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export const runtime = 'nodejs';

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt.toString('base64')}:${derivedKey.toString('base64')}`;
}

function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (password === '' || stored === null || stored === undefined || typeof stored !== 'string') {
    return false;
  }
  // Legacy/plaintext compatibility (in case someone manually inserted a row)
  if (!stored.startsWith('scrypt:')) {
    return password === stored;
  }

  const parts = stored.split(':');
  if (parts.length !== 3) return false;
  const salt = Buffer.from(parts[1], 'base64');
  const expected = Buffer.from(parts[2], 'base64');
  const actual = crypto.scryptSync(password, salt, expected.length);
  return crypto.timingSafeEqual(expected, actual);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawUsername = body?.username;
    const rawPassword = body?.password;
    const username = typeof rawUsername === 'string' ? rawUsername.trim() : '';
    const password = typeof rawPassword === 'string' ? rawPassword.trim() : '';

    const sessionsTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'admin_sessions'
      ) AS exists
    `;
    const sessionsTableExists = Boolean((sessionsTableCheck as any)[0]?.exists);
    if (!sessionsTableExists) {
      return NextResponse.json(
        {
          error: 'Database is not initialized (admin_sessions table is missing).',
          fix: 'Run DB migration against the same DATABASE_URL used in production.',
        },
        { status: 500 }
      );
    }

    const adminUsersTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'admin_users'
      ) AS exists
    `;
    const adminUsersTableExists = Boolean((adminUsersTableCheck as any)[0]?.exists);

    if (adminUsersTableExists) {
      const countRes = await sql`SELECT COUNT(*)::int AS count FROM admin_users`;
      const count = Number((countRes as any)[0]?.count) || 0;

      // Only use env to create the very first admin when table is empty. Once users exist, only DB is used — env never overwrites DB (fixes production reverting after 1–2 days).
      if (count === 0) {
        const adminUsername = (process.env.ADMIN_USERNAME ?? '').trim();
        const adminPassword = (process.env.ADMIN_PASSWORD ?? '').trim();
        const hasEnv = adminUsername !== '' && adminPassword !== '';
        const envMatch = hasEnv && username === adminUsername && password === adminPassword;
        if (envMatch) {
          await sql`
            INSERT INTO admin_users (id, username, password_hash)
            VALUES (${uuidv4()}, ${adminUsername}, ${hashPassword(adminPassword)})
          `;
        } else {
          return NextResponse.json(
            { error: 'No admin users yet. Create one: node scripts/create-admin-node.js admin YourPassword' },
            { status: 500 }
          );
        }
      }

      const userRes = await sql`SELECT * FROM admin_users WHERE username = ${username} LIMIT 1`;
      const user = (userRes as any)[0] || null;
      const storedPassword = user?.password_hash ?? user?.password;

      // When table has any users: only DB verification. Env is never used and never overwrites the DB.
      const accepted = user && verifyPassword(password, storedPassword);
      if (!accepted) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      if (user?.is_active === false) {
        return NextResponse.json({ error: 'Account is deactivated. Contact Super Admin.' }, { status: 403 });
      }
    } else {
      const adminUsername = (process.env.ADMIN_USERNAME ?? '').trim();
      const adminPassword = (process.env.ADMIN_PASSWORD ?? '').trim();
      if (!adminUsername || !adminPassword) {
        return NextResponse.json(
          { error: 'Admin users table missing. Set ADMIN_USERNAME and ADMIN_PASSWORD in production env, or run DB migration.' },
          { status: 500 }
        );
      }
      if (username !== adminUsername || password !== adminPassword) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    }

    // Create session token
    const sessionToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

    // Store session in database
    // Newer schema supports admin_user_id + role. Older schema will ignore missing columns by failing,
    // so we fall back to the legacy insert.
    try {
      const userRow = await sql`SELECT id, role FROM admin_users WHERE username = ${username} LIMIT 1`;
      const u = (userRow as any)[0] || null;
      await sql`
        INSERT INTO admin_sessions (id, session_token, expires_at, admin_user_id, role)
        VALUES (${uuidv4()}, ${sessionToken}, ${expiresAt.toISOString()}, ${u?.id || null}, ${u?.role || null})
      `;
    } catch {
      await sql`
        INSERT INTO admin_sessions (id, session_token, expires_at)
        VALUES (${uuidv4()}, ${sessionToken}, ${expiresAt.toISOString()})
      `;
    }

    try {
      await ensureAuthAndPermissionsSchema();
    } catch {}

    // Get user role and id for session + redirect
    let userRole = 'super_admin';
    let userId: string | null = null;
    try {
      const userRow = await sql`SELECT id, role FROM admin_users WHERE username = ${username} LIMIT 1`;
      userId = (userRow as any)[0]?.id || null;
      userRole = (userRow as any)[0]?.role || 'super_admin';
    } catch {}

    const normalizedRole = normalizeRole(userRole);
    const { defaultPage } = await resolveUserPermissions(userId, normalizedRole);
    const redirectTo = defaultPage || '/admin/dashboard';

    // Set cookie in response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      sessionToken,
      role: normalizedRole,
      redirectTo,
    });
    
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
    });
    
    return response;

  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 500 }
    );
  }
}

