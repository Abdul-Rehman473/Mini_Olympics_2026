import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import {
  ADMIN_PAGES,
  ALL_ADMIN_PAGE_KEYS,
  ensureAuthAndPermissionsSchema,
  getAdminSession,
  hasPagePermission,
  normalizeRole,
  parseAssignedGames,
  rolePermissions,
} from '@/lib/auth';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt.toString('base64')}:${derivedKey.toString('base64')}`;
}

type IncomingPermission = {
  pageKey: string;
  canView?: boolean;
  canEdit?: boolean;
  canDelegate?: boolean;
};

function sanitizeIncomingPermissions(
  rawList: unknown,
  actorSession: NonNullable<Awaited<ReturnType<typeof getAdminSession>>>
): { pageKey: string; canView: boolean; canEdit: boolean; canDelegate: boolean }[] {
  if (!Array.isArray(rawList)) return [];

  const isSuper = actorSession.role === 'super_admin';
  const result: { pageKey: string; canView: boolean; canEdit: boolean; canDelegate: boolean }[] = [];

  for (const item of rawList as IncomingPermission[]) {
    const pageKey = String(item?.pageKey || '').trim();
    if (!ALL_ADMIN_PAGE_KEYS.includes(pageKey)) continue;

    let canView = Boolean(item?.canView);
    let canEdit = canView && Boolean(item?.canEdit);
    let canDelegate = canView && Boolean(item?.canDelegate);

    if (!isSuper) {
      const actorDetail = actorSession.permissionDetails?.[pageKey];
      if (!actorDetail?.canView) {
        canView = false;
        canEdit = false;
        canDelegate = false;
      } else {
        canEdit = canEdit && actorDetail.canEdit;
        canDelegate = canDelegate && actorDetail.canDelegate;
      }
    }

    result.push({ pageKey, canView, canEdit, canDelegate });
  }

  return result;
}

// GET - List users, their permissions, available pages, and games
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    const session = await getAdminSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPagePermission(session, '/admin/permissions', 'view')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await ensureAuthAndPermissionsSchema();

    const usersRows = (await sql`
      SELECT id, username, display_name, role, assigned_games, assigned_gender, created_by, is_active, created_at, updated_at
      FROM admin_users
      ORDER BY created_at DESC
    `) as any[];

    const permRows = (await sql`
      SELECT id, user_id, page_key, can_view, can_edit, can_delegate, granted_by, updated_at
      FROM permissions
    `) as any[];

    const permsByUser = new Map<string, any[]>();
    for (const p of permRows) {
      const list = permsByUser.get(p.user_id) || [];
      list.push({
        pageKey: p.page_key,
        canView: Boolean(p.can_view),
        canEdit: Boolean(p.can_edit),
        canDelegate: Boolean(p.can_delegate),
        grantedBy: p.granted_by,
      });
      permsByUser.set(p.user_id, list);
    }

    const users = usersRows.map((u) => {
      const role = normalizeRole(u.role);
      const explicitPerms = permsByUser.get(u.id) || [];
      // Show effective permissions if no explicit rows exist yet for legacy roles
      const effectivePerms =
        explicitPerms.length > 0
          ? explicitPerms
          : (rolePermissions[role] || []).map((key) => ({
              pageKey: key,
              canView: true,
              canEdit: true,
              canDelegate: role === 'super_admin',
              grantedBy: 'role_default',
            }));

      return {
        id: u.id,
        username: u.username,
        displayName: u.display_name || u.username,
        role,
        assignedGames: parseAssignedGames(u.assigned_games),
        assignedGender: (u.assigned_gender || 'both') as 'boys' | 'girls' | 'both',
        createdBy: u.created_by || null,
        isActive: u.is_active !== false,
        createdAt: u.created_at,
        hasExplicitPermissions: explicitPerms.length > 0,
        permissions: effectivePerms,
      };
    });

    const gamesRows = (await sql`
      SELECT DISTINCT game_name FROM games_pricing ORDER BY game_name ASC
    `) as any[];

    return NextResponse.json({
      success: true,
      users,
      pages: ADMIN_PAGES,
      games: gamesRows.map((g) => g.game_name),
      currentUser: {
        userId: session.adminUserId,
        username: session.username,
        role: session.role,
        permissions: session.permissions,
        permissionDetails: session.permissionDetails,
      },
    });
  } catch (error: any) {
    console.error('Fetch permissions error:', error);
    return NextResponse.json({ error: 'Failed to load permissions', details: error.message }, { status: 500 });
  }
}

// POST - Create a new user (sub_admin, coordinator, or role) with explicit page permissions
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    const session = await getAdminSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPagePermission(session, '/admin/permissions', 'edit')) {
      return NextResponse.json({ error: 'Forbidden - Edit permission required' }, { status: 403 });
    }

    await ensureAuthAndPermissionsSchema();

    const body = await request.json();
    const username = String(body?.username || '').trim();
    const displayName = String(body?.displayName || username).trim();
    const password = String(body?.password || '').trim();
    const requestedRole = normalizeRole(body?.role || 'sub_admin');
    const assignedGames = Array.isArray(body?.assignedGames)
      ? body.assignedGames.map((g: any) => String(g).trim()).filter(Boolean)
      : [];
    const assignedGender = ['boys', 'girls', 'both'].includes(body?.assignedGender)
      ? body.assignedGender
      : 'both';
    const isActive = body?.isActive !== false;

    if (!username || username.length < 2) {
      return NextResponse.json({ error: 'Username must be at least 2 characters' }, { status: 400 });
    }
    if (!password || password.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400 });
    }

    if (requestedRole === 'super_admin' && session.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only Super Admin can create Super Admin accounts' }, { status: 403 });
    }

    const existing = (await sql`SELECT id FROM admin_users WHERE LOWER(username) = LOWER(${username}) LIMIT 1`) as any[];
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const userId = uuidv4();
    const passwordHash = hashPassword(password);

    await sql`
      INSERT INTO admin_users (
        id, username, display_name, password_hash, role,
        assigned_games, assigned_gender, created_by, is_active, created_at, updated_at
      ) VALUES (
        ${userId}, ${username}, ${displayName}, ${passwordHash}, ${requestedRole},
        ${JSON.stringify(assignedGames)}, ${assignedGender}, ${session.username || 'system'}, ${isActive}, NOW(), NOW()
      )
    `;

    // Store explicit rows in permissions table
    let sanitizedPerms = sanitizeIncomingPermissions(body?.permissions, session);
    if (sanitizedPerms.length === 0 && requestedRole === 'coordinator') {
      sanitizedPerms = [{ pageKey: '/admin/coordinator', canView: true, canEdit: true, canDelegate: false }];
    }

    for (const perm of sanitizedPerms) {
      await sql`
        INSERT INTO permissions (id, user_id, page_key, can_view, can_edit, can_delegate, granted_by, created_at, updated_at)
        VALUES (${uuidv4()}, ${userId}, ${perm.pageKey}, ${perm.canView}, ${perm.canEdit}, ${perm.canDelegate}, ${session.username || 'system'}, NOW(), NOW())
        ON CONFLICT (user_id, page_key) DO UPDATE SET
          can_view = EXCLUDED.can_view,
          can_edit = EXCLUDED.can_edit,
          can_delegate = EXCLUDED.can_delegate,
          granted_by = EXCLUDED.granted_by,
          updated_at = NOW()
      `;
    }

    return NextResponse.json({ success: true, userId });
  } catch (error: any) {
    console.error('Create user/permissions error:', error);
    return NextResponse.json({ error: 'Failed to create user', details: error.message }, { status: 500 });
  }
}

// PUT - Update user details, role, assigned games, and permissions table rows
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    const session = await getAdminSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPagePermission(session, '/admin/permissions', 'edit')) {
      return NextResponse.json({ error: 'Forbidden - Edit permission required' }, { status: 403 });
    }

    await ensureAuthAndPermissionsSchema();

    const body = await request.json();
    const userId = String(body?.userId || '').trim();
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const existingRows = (await sql`SELECT * FROM admin_users WHERE id = ${userId} LIMIT 1`) as any[];
    if (existingRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const targetUser = existingRows[0];
    const targetCurrentRole = normalizeRole(targetUser.role);

    if (targetCurrentRole === 'super_admin' && session.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only Super Admin can modify a Super Admin account' }, { status: 403 });
    }

    const nextRole = body?.role ? normalizeRole(body.role) : targetCurrentRole;
    if (nextRole === 'super_admin' && session.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only Super Admin can assign the Super Admin role' }, { status: 403 });
    }

    const displayName =
      body?.displayName !== undefined ? String(body.displayName).trim() : targetUser.display_name || targetUser.username;
    const assignedGames =
      body?.assignedGames !== undefined
        ? JSON.stringify(
            Array.isArray(body.assignedGames)
              ? body.assignedGames.map((g: any) => String(g).trim()).filter(Boolean)
              : []
          )
        : targetUser.assigned_games;
    const assignedGender =
      body?.assignedGender && ['boys', 'girls', 'both'].includes(body.assignedGender)
        ? body.assignedGender
        : targetUser.assigned_gender || 'both';
    const isActive = body?.isActive !== undefined ? Boolean(body.isActive) : targetUser.is_active !== false;

    if (body?.password && String(body.password).trim().length >= 4) {
      const passwordHash = hashPassword(String(body.password).trim());
      await sql`
        UPDATE admin_users
        SET display_name = ${displayName},
            role = ${nextRole},
            password_hash = ${passwordHash},
            assigned_games = ${assignedGames},
            assigned_gender = ${assignedGender},
            is_active = ${isActive},
            updated_at = NOW()
        WHERE id = ${userId}
      `;
    } else {
      await sql`
        UPDATE admin_users
        SET display_name = ${displayName},
            role = ${nextRole},
            assigned_games = ${assignedGames},
            assigned_gender = ${assignedGender},
            is_active = ${isActive},
            updated_at = NOW()
        WHERE id = ${userId}
      `;
    }

    // Update permissions table if provided
    if (Array.isArray(body?.permissions) && nextRole !== 'super_admin') {
      const sanitized = sanitizeIncomingPermissions(body.permissions, session);

      if (session.role === 'super_admin') {
        await sql`DELETE FROM permissions WHERE user_id = ${userId}`;
      } else {
        // Sub-admin can only overwrite permissions for pages the sub-admin holds
        for (const p of sanitized) {
          if (session.permissionDetails?.[p.pageKey]?.canView) {
            await sql`DELETE FROM permissions WHERE user_id = ${userId} AND page_key = ${p.pageKey}`;
          }
        }
      }

      for (const perm of sanitized) {
        await sql`
          INSERT INTO permissions (id, user_id, page_key, can_view, can_edit, can_delegate, granted_by, created_at, updated_at)
          VALUES (${uuidv4()}, ${userId}, ${perm.pageKey}, ${perm.canView}, ${perm.canEdit}, ${perm.canDelegate}, ${session.username || 'system'}, NOW(), NOW())
          ON CONFLICT (user_id, page_key) DO UPDATE SET
            can_view = EXCLUDED.can_view,
            can_edit = EXCLUDED.can_edit,
            can_delegate = EXCLUDED.can_delegate,
            granted_by = EXCLUDED.granted_by,
            updated_at = NOW()
        `;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update user/permissions error:', error);
    return NextResponse.json({ error: 'Failed to update user', details: error.message }, { status: 500 });
  }
}

// DELETE - Delete user (cascades permissions rows)
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    const session = await getAdminSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPagePermission(session, '/admin/permissions', 'edit')) {
      return NextResponse.json({ error: 'Forbidden - Edit permission required' }, { status: 403 });
    }

    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (session.adminUserId === userId) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    const targetRows = (await sql`SELECT id, role FROM admin_users WHERE id = ${userId} LIMIT 1`) as any[];
    if (targetRows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const targetRole = normalizeRole(targetRows[0].role);
    if (targetRole === 'super_admin') {
      if (session.role !== 'super_admin') {
        return NextResponse.json({ error: 'Only Super Admin can delete a Super Admin account' }, { status: 403 });
      }
      const countRes = (await sql`
        SELECT COUNT(*)::int AS cnt FROM admin_users WHERE role IN ('super_admin', 'admin')
      `) as any[];
      if ((Number(countRes[0]?.cnt) || 0) <= 1) {
        return NextResponse.json({ error: 'Cannot delete the last Super Admin account' }, { status: 400 });
      }
    }

    await sql`DELETE FROM admin_users WHERE id = ${userId}`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user', details: error.message }, { status: 500 });
  }
}
