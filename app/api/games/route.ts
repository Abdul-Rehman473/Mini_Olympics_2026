import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { gamesPricing } from '@/lib/games-pricing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

// GET - Fetch all games pricing (public - no auth needed)
export async function GET(request: NextRequest) {
  try {
    await ensureCategoryColumn();

    let games = (await sql`
      SELECT id, game_name, gender, price, players, category
      FROM games_pricing
      ORDER BY id ASC
    `) as any[];

    // Auto-seed official 45 PDF games if table is completely empty
    if (games.length === 0) {
      for (const item of gamesPricing) {
        if (item.boys !== null) {
          await sql`
            INSERT INTO games_pricing (game_name, gender, price, players, category)
            VALUES (${item.name}, 'boys', ${item.boys}, ${item.boysPlayers ?? 1}, ${item.category ?? null})
            ON CONFLICT (game_name, gender) DO NOTHING
          `;
        }
        if (item.girls !== null) {
          await sql`
            INSERT INTO games_pricing (game_name, gender, price, players, category)
            VALUES (${item.name}, 'girls', ${item.girls}, ${item.girlsPlayers ?? 1}, ${item.category ?? null})
            ON CONFLICT (game_name, gender) DO NOTHING
          `;
        }
      }
      games = (await sql`
        SELECT id, game_name, gender, price, players, category
        FROM games_pricing
        ORDER BY id ASC
      `) as any[];
    }

    // Transform to match the frontend format
    const gamesMap: Record<
      string,
      {
        name: string;
        boys: number | null;
        girls: number | null;
        boysPlayers?: number;
        girlsPlayers?: number;
        category?: string;
      }
    > = {};

    games.forEach((g: any) => {
      const name = g.game_name;
      if (!gamesMap[name]) {
        gamesMap[name] = {
          name,
          boys: null,
          girls: null,
          category: g.category || undefined,
        };
      }
      if (!gamesMap[name].category && g.category) {
        gamesMap[name].category = g.category;
      }
      if (g.gender === 'boys') {
        gamesMap[name].boys = parseFloat(g.price);
        if (g.players) gamesMap[name].boysPlayers = Number(g.players);
      } else if (g.gender === 'girls') {
        gamesMap[name].girls = parseFloat(g.price);
        if (g.players) gamesMap[name].girlsPlayers = Number(g.players);
      }
    });

    const formattedGames = Object.values(gamesMap);

    const response = NextResponse.json({ success: true, data: formattedGames });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error: any) {
    console.error('Fetch games error:', error);
    return NextResponse.json({ error: 'Failed to fetch games', details: error.message }, { status: 500 });
  }
}
