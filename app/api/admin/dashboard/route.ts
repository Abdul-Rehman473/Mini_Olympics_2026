import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { hasPagePermission, requireAdminPermission } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Aggregate KPIs & system health for /admin/dashboard without exposing row-level PII,
 * finance ledgers, or borrower records unless the user holds those page permissions.
 */
export async function GET() {
  try {
    const auth = await requireAdminPermission('/admin/dashboard', 'view');
    if (auth.error) return auth.error;
    const { session } = auth;

    const regRows = (await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'paid')::int AS paid,
        COUNT(*) FILTER (WHERE status = 'pending_online')::int AS pending_online,
        COUNT(*) FILTER (WHERE status = 'pending_cash')::int AS pending_cash,
        COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected
      FROM registrations
    `) as any[];

    const reg = regRows[0] || {};
    const stats = {
      total: Number(reg.total) || 0,
      paid: Number(reg.paid) || 0,
      pendingOnline: Number(reg.pending_online) || 0,
      pendingCash: Number(reg.pending_cash) || 0,
      rejected: Number(reg.rejected) || 0,
    };

    let financeSummary: { income: number; expense: number; balance: number } | null = null;
    if (hasPagePermission(session, '/admin/finance', 'view')) {
      const finRows = (await sql`
        SELECT record_type, COALESCE(SUM(amount), 0)::float AS total
        FROM finance_records
        GROUP BY record_type
      `) as any[];
      let income = 0;
      let expense = 0;
      for (const r of finRows) {
        if (r.record_type === 'income') income = Number(r.total) || 0;
        if (r.record_type === 'expense') expense = Number(r.total) || 0;
      }
      financeSummary = { income, expense, balance: income - expense };
    }

    let inventorySummary: { totalItems: number; activeLoans: number; overdueLoans: number } | null = null;
    if (hasPagePermission(session, '/admin/inventory', 'view')) {
      const [itemCount] = (await sql`SELECT COUNT(*)::int AS cnt FROM inventory_items WHERE is_active = true`) as any[];
      const [loanCount] = (await sql`
        SELECT
          COUNT(*) FILTER (WHERE status = 'active')::int AS active_cnt,
          COUNT(*) FILTER (WHERE status = 'overdue' OR (status = 'active' AND expected_return_date < NOW()))::int AS overdue_cnt
        FROM inventory_loans
      `) as any[];
      inventorySummary = {
        totalItems: Number(itemCount?.cnt) || 0,
        activeLoans: Number(loanCount?.active_cnt) || 0,
        overdueLoans: Number(loanCount?.overdue_cnt) || 0,
      };
    }

    let systemHealth: Record<string, unknown> | null = null;
    if (session.role === 'super_admin') {
      const [sess] = (await sql`
        SELECT
          COUNT(*) FILTER (WHERE expires_at > NOW())::int AS active_sessions,
          COUNT(*) FILTER (WHERE expires_at <= NOW())::int AS expired_sessions
        FROM admin_sessions
      `) as any[];
      const [unsynced] = (await sql`
        SELECT COUNT(*)::int AS cnt
        FROM registrations r
        LEFT JOIN finance_records f ON f.reference_id = r.id AND f.reference_type = 'registration'
        WHERE r.status = 'paid' AND f.id IS NULL
      `) as any[];
      const smtpRows = (await sql`
        SELECT key FROM system_settings WHERE key IN ('smtp_email', 'smtp_password') AND value IS NOT NULL AND value != ''
      `) as any[];
      systemHealth = {
        activeSessions: Number(sess?.active_sessions) || 0,
        expiredSessions: Number(sess?.expired_sessions) || 0,
        unsyncedPaidRegistrations: Number(unsynced?.cnt) || 0,
        smtpConfigured: smtpRows.length >= 2,
      };
    }

    return NextResponse.json({
      success: true,
      stats,
      financeSummary,
      inventorySummary,
      systemHealth,
    });
  } catch (error: any) {
    console.error('Dashboard GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
