import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getAdminSession, hasPagePermission } from '@/lib/auth';
import { gamesPricing } from '@/lib/games-pricing';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

let categoryColumnEnsured = false;

async function ensureCategoryColumn() {
  if (categoryColumnEnsured) return;
  try {
    await sql`ALTER TABLE games_pricing ADD COLUMN IF NOT EXISTS category VARCHAR(50)`;
    categoryColumnEnsured = true;
  } catch {
    // Non-fatal
  }
}

// GET - Fetch all games pricing
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    const session = await getAdminSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureCategoryColumn();

    const games = await sql`
      SELECT id, game_name, gender, price, players, category, created_at
      FROM games_pricing
      ORDER BY id ASC
    `;

    return NextResponse.json({ success: true, data: games });
  } catch (error: any) {
    console.error('Fetch games error:', error);
    return NextResponse.json({ error: 'Failed to fetch games', details: error.message }, { status: 500 });
  }
}

// POST - Add, update, rename, or sync official PDF games pricing
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    const session = await getAdminSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPagePermission(session, '/admin/settings', 'edit')) {
      return NextResponse.json({ error: 'Forbidden - Settings edit permission required' }, { status: 403 });
    }

    await ensureCategoryColumn();

    const body = await request.json();

    // Sync official 45 PDF games & prices
    if (body?.action === 'sync_pdf_defaults') {
      const replaceAll = Boolean(body?.replaceAll);
      if (replaceAll) {
        const officialNames = gamesPricing.map((g) => g.name);
        const existing = (await sql`SELECT DISTINCT game_name FROM games_pricing`) as any[];
        for (const row of existing) {
          if (!officialNames.includes(row.game_name)) {
            await sql`DELETE FROM games_pricing WHERE game_name = ${row.game_name}`;
          }
        }
      }

      for (const item of gamesPricing) {
        if (item.boys !== null) {
          await sql`
            INSERT INTO games_pricing (game_name, gender, price, players, category, created_at)
            VALUES (${item.name}, 'boys', ${item.boys}, ${item.boysPlayers ?? 1}, ${item.category ?? null}, NOW())
            ON CONFLICT (game_name, gender) DO UPDATE SET
              price = EXCLUDED.price,
              players = EXCLUDED.players,
              category = COALESCE(EXCLUDED.category, games_pricing.category)
          `;
        }
        if (item.girls !== null) {
          await sql`
            INSERT INTO games_pricing (game_name, gender, price, players, category, created_at)
            VALUES (${item.name}, 'girls', ${item.girls}, ${item.girlsPlayers ?? 1}, ${item.category ?? null}, NOW())
            ON CONFLICT (game_name, gender) DO UPDATE SET
              price = EXCLUDED.price,
              players = EXCLUDED.players,
              category = COALESCE(EXCLUDED.category, games_pricing.category)
          `;
        }
      }

      return NextResponse.json({ success: true, syncedCount: gamesPricing.length });
    }

    const { game_name, original_game_name, gender, price, players, category } = body;
    const trimmedName = typeof game_name === 'string' ? game_name.trim() : '';
    const trimmedOriginal = typeof original_game_name === 'string' ? original_game_name.trim() : '';

    // Handle rename across games_pricing (and related tables) before upserting
    if (trimmedOriginal && trimmedName && trimmedOriginal !== trimmedName) {
      await sql`
        UPDATE games_pricing
        SET game_name = ${trimmedName}
        WHERE game_name = ${trimmedOriginal}
      `;
      try {
        await sql`
          UPDATE sport_groups
          SET game_name = ${trimmedName}
          WHERE game_name = ${trimmedOriginal}
        `;
      } catch {}
      try {
        await sql`
          UPDATE coordinator_matches
          SET game_name = ${trimmedName}
          WHERE game_name = ${trimmedOriginal}
        `;
      } catch {}
      try {
        await sql`
          UPDATE match_schedules
          SET game_name = ${trimmedName}
          WHERE game_name = ${trimmedOriginal}
        `;
      } catch {}
    }

    if (!trimmedName || !gender || price === undefined) {
      return NextResponse.json({ error: 'game_name, gender, and price are required' }, { status: 400 });
    }

    await sql`
      INSERT INTO games_pricing (game_name, gender, price, players, category, created_at)
      VALUES (${trimmedName}, ${gender}, ${price}, ${players || null}, ${category || null}, NOW())
      ON CONFLICT (game_name, gender) DO UPDATE SET
        price = ${price},
        players = ${players || null},
        category = COALESCE(${category || null}, games_pricing.category)
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Add/update game error:', error);
    return NextResponse.json({ error: 'Failed to save game', details: error.message }, { status: 500 });
  }
}

// DELETE - Remove game pricing
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    const session = await getAdminSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPagePermission(session, '/admin/settings', 'edit')) {
      return NextResponse.json({ error: 'Forbidden - Settings edit permission required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const game_name = searchParams.get('game_name');
    const gender = searchParams.get('gender');

    if (id) {
      await sql`DELETE FROM games_pricing WHERE id = ${parseInt(id)}`;
    } else if (game_name && gender) {
      await sql`DELETE FROM games_pricing WHERE game_name = ${game_name} AND gender = ${gender}`;
    } else {
      return NextResponse.json({ error: 'id or (game_name + gender) required' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete game error:', error);
    return NextResponse.json({ error: 'Failed to delete game', details: error.message }, { status: 500 });
  }
}
