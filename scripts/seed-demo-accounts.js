#!/usr/bin/env node
/**
 * Seeds demo accounts (Super Admin, Sub-Admin, Coordinator) with permissions
 * in the database for testing RBAC, Coordinator Portal, and Admin sync.
 * Safe & idempotent: never overwrites existing non-demo accounts or registrations.
 */
const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envFiles = ['env.local', '.env.local', '.env'];
  for (const envFile of envFiles) {
    const envPath = path.join(__dirname, '..', envFile);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach((line) => {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          if (key && value && !process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  }
}

loadEnv();

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const dk = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt.toString('base64')}:${dk.toString('base64')}`;
}

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
}

async function run() {
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS display_name TEXT`;
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS assigned_games TEXT`;
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS assigned_gender TEXT DEFAULT 'both'`;
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS created_by TEXT`;
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL`;

  await sql`
    CREATE TABLE IF NOT EXISTS permissions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      page_key TEXT NOT NULL,
      can_view BOOLEAN DEFAULT true NOT NULL,
      can_edit BOOLEAN DEFAULT false NOT NULL,
      can_delegate BOOLEAN DEFAULT false NOT NULL,
      granted_by TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      UNIQUE(user_id, page_key)
    )
  `;

  // 1. Demo Super Admin
  const superId = 'demo-super-admin-001';
  await sql`
    INSERT INTO admin_users (id, username, display_name, password_hash, role, assigned_games, assigned_gender, created_by, is_active, created_at, updated_at)
    VALUES (${superId}, 'demo_super', 'Demo Super Admin', ${hashPassword('Demo@123')}, 'super_admin', '[]', 'both', 'seed_script', true, NOW(), NOW())
    ON CONFLICT (username) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      password_hash = EXCLUDED.password_hash,
      role = 'super_admin',
      is_active = true,
      updated_at = NOW()
  `;
  const [superRow] = await sql`SELECT id FROM admin_users WHERE username = 'demo_super' LIMIT 1`;

  // 2. Demo Sub-Admin (Dashboard, Registrations, Coordinator Portal, Permissions)
  const subId = 'demo-sub-admin-001';
  await sql`
    INSERT INTO admin_users (id, username, display_name, password_hash, role, assigned_games, assigned_gender, created_by, is_active, created_at, updated_at)
    VALUES (${subId}, 'demo_subadmin', 'Demo Sub-Admin (Ops)', ${hashPassword('SubAdmin@123')}, 'sub_admin', '[]', 'both', 'demo_super', true, NOW(), NOW())
    ON CONFLICT (username) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      password_hash = EXCLUDED.password_hash,
      role = 'sub_admin',
      is_active = true,
      updated_at = NOW()
  `;
  const [subRow] = await sql`SELECT id FROM admin_users WHERE username = 'demo_subadmin' LIMIT 1`;

  const subPerms = [
    ['/admin/dashboard', true, true, false],
    ['/admin/registrations', true, true, false],
    ['/admin/coordinator', true, true, true],
    ['/admin/permissions', true, true, false],
  ];
  await sql`DELETE FROM permissions WHERE user_id = ${subRow.id}`;
  for (const [pageKey, canView, canEdit, canDelegate] of subPerms) {
    await sql`
      INSERT INTO permissions (id, user_id, page_key, can_view, can_edit, can_delegate, granted_by, created_at, updated_at)
      VALUES (${uid()}, ${subRow.id}, ${pageKey}, ${canView}, ${canEdit}, ${canDelegate}, 'demo_super', NOW(), NOW())
    `;
  }

  // 3. Demo Coordinator (Cricket)
  const coordId = 'demo-coordinator-cricket-001';
  const assignedCricket = JSON.stringify(['Tape Ball Cricket', 'Cricket']);
  await sql`
    INSERT INTO admin_users (id, username, display_name, password_hash, role, assigned_games, assigned_gender, created_by, is_active, created_at, updated_at)
    VALUES (${coordId}, 'demo_cricket', 'Demo Cricket Coordinator', ${hashPassword('Coord@123')}, 'coordinator', ${assignedCricket}, 'both', 'demo_super', true, NOW(), NOW())
    ON CONFLICT (username) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      password_hash = EXCLUDED.password_hash,
      role = 'coordinator',
      assigned_games = EXCLUDED.assigned_games,
      assigned_gender = 'both',
      is_active = true,
      updated_at = NOW()
  `;
  const [coordRow] = await sql`SELECT id FROM admin_users WHERE username = 'demo_cricket' LIMIT 1`;
  await sql`DELETE FROM permissions WHERE user_id = ${coordRow.id}`;
  await sql`
    INSERT INTO permissions (id, user_id, page_key, can_view, can_edit, can_delegate, granted_by, created_at, updated_at)
    VALUES (${uid()}, ${coordRow.id}, '/admin/coordinator', true, true, false, 'demo_super', NOW(), NOW())
  `;

  const gamesCountRes = await sql`SELECT COUNT(DISTINCT game_name)::int AS cnt FROM games_pricing`;
  const usersRes = await sql`SELECT username, role, is_active FROM admin_users ORDER BY created_at ASC`;

  console.log('✅ Demo accounts seeded successfully!');
  console.log('   Games in games_pricing:', gamesCountRes[0]?.cnt);
  console.log('   Admin/Coordinator accounts:', usersRes.map((u) => `${u.username}(${u.role})`).join(', '));
}

run().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
