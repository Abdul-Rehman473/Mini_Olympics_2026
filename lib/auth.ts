import { sql } from '@/lib/db';

export type AdminRole =
  | 'super_admin'
  | 'sub_admin'
  | 'coordinator'
  | 'registration_admin'
  | 'inventory_admin'
  | 'hoc_admin'
  | 'finance_admin';

export type PagePermissionDetail = {
  canView: boolean;
  canEdit: boolean;
  canDelegate: boolean;
};

export type AdminSession = {
  sessionToken: string;
  adminUserId: string | null;
  username: string | null;
  displayName: string | null;
  role: AdminRole;
  permissions: string[];
  permissionDetails: Record<string, PagePermissionDetail>;
  assignedGames: string[];
  assignedGender: 'boys' | 'girls' | 'both';
  defaultPage: string;
  expiresAt: string | null;
};

export type AdminPageMeta = {
  key: string;
  label: string;
  description: string;
};

export const ADMIN_PAGES: AdminPageMeta[] = [
  { key: '/admin/dashboard', label: 'Dashboard', description: 'Operations KPIs & overview metrics' },
  { key: '/admin/registrations', label: 'Registrations', description: 'View, verify, approve & export registrations' },
  { key: '/admin/inventory', label: 'Inventory', description: 'Equipment inventory & loan tracking' },
  { key: '/admin/finance', label: 'Finance', description: 'Treasury income, expense & ledger sync' },
  { key: '/admin/super', label: 'Sport Groups', description: 'WhatsApp groups & coordinator contact links' },
  { key: '/admin/hoc', label: 'HOC & Match Records', description: 'AI schedules & all coordinator match records' },
  { key: '/admin/coordinator', label: 'Coordinator Portal', description: 'Assigned game players, match scheduling & results' },
  { key: '/admin/email', label: 'Email Composer', description: 'Send bulk or individual emails to participants' },
  { key: '/admin/esports', label: 'Esports Controls', description: 'Esports registration toggle & announcements' },
  { key: '/admin/settings', label: 'Settings & Games', description: 'Manage games, prices, coupons, SMTP & registration lock' },
  { key: '/admin/permissions', label: 'Permissions & Users', description: 'Create sub-admins/coordinators & assign page permissions' },
];

export const ALL_ADMIN_PAGE_KEYS = ADMIN_PAGES.map((p) => p.key);

// Default pages for each role when no explicit rows exist in the `permissions` table
export const rolePermissions: Record<AdminRole, string[]> = {
  super_admin: ALL_ADMIN_PAGE_KEYS,
  sub_admin: [],
  coordinator: ['/admin/coordinator'],
  registration_admin: ['/admin/registrations'],
  inventory_admin: ['/admin/inventory'],
  hoc_admin: ['/admin/super', '/admin/hoc', '/admin/coordinator'],
  finance_admin: ['/admin/finance'],
};

// Default redirect page for each role
export const roleDefaultPage: Record<AdminRole, string> = {
  super_admin: '/admin/dashboard',
  sub_admin: '/admin/dashboard',
  coordinator: '/admin/coordinator',
  registration_admin: '/admin/registrations',
  inventory_admin: '/admin/inventory',
  hoc_admin: '/admin/hoc',
  finance_admin: '/admin/finance',
};

let schemaEnsurePromise: Promise<void> | null = null;

/**
 * Idempotently ensure auth, permissions, coordinator_matches, and games_pricing.category exist.
 * Runs at most once per server process (or resets on error so a transient outage can recover).
 */
export async function ensureAuthAndPermissionsSchema(): Promise<void> {
  if (schemaEnsurePromise) return schemaEnsurePromise;

  schemaEnsurePromise = (async () => {
    try {
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
      await sql`CREATE INDEX IF NOT EXISTS idx_permissions_user_id ON permissions(user_id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_permissions_page_key ON permissions(page_key)`;

      await sql`
        CREATE TABLE IF NOT EXISTS coordinator_matches (
          id TEXT PRIMARY KEY,
          game_name VARCHAR(100) NOT NULL,
          gender VARCHAR(10) NOT NULL CHECK (gender IN ('boys', 'girls')),
          round_name VARCHAR(100) NOT NULL DEFAULT 'Round 1',
          match_number INTEGER NOT NULL DEFAULT 1,
          player1_name VARCHAR(255) NOT NULL,
          player1_reg_id TEXT,
          player1_roll VARCHAR(50),
          player1_contact VARCHAR(30),
          player2_name VARCHAR(255) NOT NULL,
          player2_reg_id TEXT,
          player2_roll VARCHAR(50),
          player2_contact VARCHAR(30),
          scheduled_date VARCHAR(50),
          scheduled_time VARCHAR(120),
          venue VARCHAR(150),
          status VARCHAR(30) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'walkover')),
          winner_name VARCHAR(255),
          score_summary VARCHAR(255),
          notes TEXT,
          coordinator_id TEXT,
          coordinator_username TEXT,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS idx_coord_matches_game_gender ON coordinator_matches(game_name, gender)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_coord_matches_coord_id ON coordinator_matches(coordinator_id)`;
    } catch (err) {
      schemaEnsurePromise = null;
      throw err;
    }
  })();

  return schemaEnsurePromise;
}

export function parseAssignedGames(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((x) => String(x).trim()).filter(Boolean);
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((x) => String(x).trim()).filter(Boolean);
        }
      } catch {
        // Fall through to comma-split
      }
    }
    return trimmed
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function normalizeRole(rawRole: unknown): AdminRole {
  const r = String(rawRole || 'super_admin').trim();
  if (r === 'admin') return 'super_admin';
  if (
    r === 'super_admin' ||
    r === 'sub_admin' ||
    r === 'coordinator' ||
    r === 'registration_admin' ||
    r === 'inventory_admin' ||
    r === 'hoc_admin' ||
    r === 'finance_admin'
  ) {
    return r;
  }
  return 'sub_admin';
}

export async function resolveUserPermissions(
  userId: string | null,
  role: AdminRole
): Promise<{
  permissions: string[];
  permissionDetails: Record<string, PagePermissionDetail>;
  defaultPage: string;
}> {
  if (role === 'super_admin') {
    const details: Record<string, PagePermissionDetail> = {};
    for (const key of ALL_ADMIN_PAGE_KEYS) {
      details[key] = { canView: true, canEdit: true, canDelegate: true };
    }
    return {
      permissions: ALL_ADMIN_PAGE_KEYS,
      permissionDetails: details,
      defaultPage: '/admin/dashboard',
    };
  }

  let rows: any[] = [];
  if (userId) {
    try {
      rows = (await sql`
        SELECT page_key, can_view, can_edit, can_delegate
        FROM permissions
        WHERE user_id = ${userId}
      `) as any[];
    } catch {
      rows = [];
    }
  }

  const details: Record<string, PagePermissionDetail> = {};
  if (rows.length > 0) {
    for (const row of rows) {
      if (row.can_view) {
        details[String(row.page_key)] = {
          canView: Boolean(row.can_view),
          canEdit: Boolean(row.can_edit),
          canDelegate: Boolean(row.can_delegate),
        };
      }
    }
  } else {
    const defaults = rolePermissions[role] || [];
    for (const key of defaults) {
      details[key] = { canView: true, canEdit: true, canDelegate: false };
    }
  }

  const allowedKeys = Object.keys(details);
  const preferredDefault = roleDefaultPage[role];
  const defaultPage = allowedKeys.includes(preferredDefault)
    ? preferredDefault
    : allowedKeys[0] || '/admin/login';

  return {
    permissions: allowedKeys,
    permissionDetails: details,
    defaultPage,
  };
}

/**
 * Get admin session by session token string from database, including resolved permissions.
 */
export async function getAdminSession(sessionToken: string | undefined): Promise<AdminSession | null> {
  if (!sessionToken) return null;

  try {
    await ensureAuthAndPermissionsSchema();
  } catch {
    // Non-fatal: continue with legacy query if DDL fails
  }

  let result: any = null;

  try {
    result = await sql`
      SELECT
        s.session_token,
        s.expires_at,
        COALESCE(s.admin_user_id, NULL) AS admin_user_id,
        COALESCE(u.username, NULL) AS username,
        COALESCE(u.display_name, NULL) AS display_name,
        COALESCE(u.role, s.role, 'super_admin') AS role,
        u.assigned_games,
        COALESCE(u.assigned_gender, 'both') AS assigned_gender,
        COALESCE(u.is_active, true) AS is_active
      FROM admin_sessions s
      LEFT JOIN admin_users u ON u.id = s.admin_user_id
      WHERE s.session_token = ${sessionToken} AND s.expires_at > NOW()
      LIMIT 1
    `;
  } catch (err: any) {
    const code = err?.code ? String(err.code) : '';
    if (code !== '42703') throw err;

    result = await sql`
      SELECT session_token, expires_at
      FROM admin_sessions
      WHERE session_token = ${sessionToken} AND expires_at > NOW()
      LIMIT 1
    `;
  }

  const rows = result?.rows ? result.rows : result;
  const row: any = rows?.[0] || null;

  if (!row) return null;
  if (row.is_active === false) return null;

  const effectiveRole = normalizeRole(row.role);
  const adminUserId = row.admin_user_id ? String(row.admin_user_id) : null;
  const { permissions, permissionDetails, defaultPage } = await resolveUserPermissions(
    adminUserId,
    effectiveRole
  );

  const rawGender = String(row.assigned_gender || 'both').toLowerCase();
  const assignedGender: 'boys' | 'girls' | 'both' =
    rawGender === 'boys' || rawGender === 'girls' ? rawGender : 'both';

  return {
    sessionToken: row.session_token,
    expiresAt: row.expires_at ? String(row.expires_at) : null,
    adminUserId,
    username: row.username ? String(row.username) : null,
    displayName: row.display_name ? String(row.display_name) : null,
    role: effectiveRole,
    permissions,
    permissionDetails,
    assignedGames: parseAssignedGames(row.assigned_games),
    assignedGender,
    defaultPage,
  };
}

export function hasAnyRole(session: AdminSession | null, allowed: AdminRole[]) {
  if (!session?.role) return false;
  if (session.role === 'super_admin') return true;
  return allowed.includes(session.role);
}

/**
 * Check whether the authenticated session has permission for a specific admin pageKey.
 */
export function hasPagePermission(
  session: AdminSession | null,
  pageKey: string,
  mode: 'view' | 'edit' | 'delegate' = 'view'
): boolean {
  if (!session) return false;
  if (session.role === 'super_admin') return true;

  const detail = session.permissionDetails?.[pageKey];
  if (!detail) return false;
  if (mode === 'delegate') return detail.canView && detail.canDelegate;
  if (mode === 'edit') return detail.canView && detail.canEdit;
  return detail.canView;
}
