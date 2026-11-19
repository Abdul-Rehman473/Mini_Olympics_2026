#!/usr/bin/env node
/**
 * Sync database schema (permissions, coordinator_matches, admin_users columns)
 * and upsert all 45 official Mini Olympics 2026 PDF games & prices.
 *
 * Usage:
 *   node scripts/sync-pdf-games.js [--replace-all]
 */
const { neon } = require('@neondatabase/serverless');
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

const PDF_GAMES = [
  ["Tape Ball Cricket", "boys", 1600, 8, "team"],
  ["Tape Ball Cricket", "girls", 1200, 5, "team"],
  ["Football Championship", "boys", 2200, 11, "team"],
  ["Football Championship", "girls", 1200, 6, "team"],
  ["Field Hockey", "boys", 1500, 10, "team"],
  ["Kabaddi Championship", "boys", 500, 7, "team"],
  ["Kabaddi Championship", "girls", 500, 7, "team"],
  ["Handball Clash", "boys", 1200, 6, "team"],
  ["Handball Clash", "girls", 1200, 6, "team"],
  ["Volleyball Spike", "boys", 1200, 6, "team"],
  ["Volleyball Spike", "girls", 1200, 6, "team"],
  ["Ultimate Frisbee", "boys", 250, 1, "team"],
  ["Ultimate Frisbee", "girls", 250, 1, "team"],
  ["Pitho Gol Garam", "boys", 1000, 6, "team"],
  ["Tug of War", "boys", 600, 8, "team"],
  ["Tug of War", "girls", 600, 8, "team"],
  ["Double Wicket Cricket", "boys", 500, 2, "team"],
  ["Basketball (1 vs 1)", "boys", 200, 1, "team"],
  ["Swimming Sprint", "boys", 300, 1, "team"],
  ["Badminton Singles", "boys", 200, 1, "racket"],
  ["Badminton Singles", "girls", 200, 1, "racket"],
  ["Badminton Doubles", "boys", 400, 2, "racket"],
  ["Badminton Doubles", "girls", 400, 2, "racket"],
  ["Table Tennis Singles", "boys", 200, 1, "racket"],
  ["Table Tennis Singles", "girls", 200, 1, "racket"],
  ["Table Tennis Doubles", "boys", 400, 2, "racket"],
  ["Table Tennis Doubles", "girls", 400, 2, "racket"],
  ["Championship Chess", "boys", 200, 1, "board"],
  ["Championship Chess", "girls", 200, 1, "board"],
  ["Ludo Singles", "boys", 200, 1, "board"],
  ["Ludo Singles", "girls", 200, 1, "board"],
  ["Ludo Doubles", "boys", 300, 2, "board"],
  ["Ludo Doubles", "girls", 300, 2, "board"],
  ["Carrom Singles", "boys", 150, 1, "board"],
  ["Carrom Singles", "girls", 150, 1, "board"],
  ["Carrom Doubles", "boys", 250, 2, "board"],
  ["Carrom Doubles", "girls", 250, 2, "board"],
  ["Jenga Tower Challenge", "boys", 200, 1, "board"],
  ["Jenga Tower Challenge", "girls", 200, 1, "board"],
  ["Uno Championship", "boys", 200, 1, "board"],
  ["Uno Championship", "girls", 200, 1, "board"],
  ["Pucket Fast-Track", "boys", 200, 1, "board"],
  ["Pucket Fast-Track", "girls", 200, 1, "board"],
  ["100m Sprint Dash", "boys", 200, 1, "race"],
  ["100m Sprint Dash", "girls", 200, 1, "race"],
  ["3 Legged Race", "boys", 200, 2, "race"],
  ["3 Legged Race", "girls", 200, 2, "race"],
  ["4x100m Baton Relay", "boys", 200, 4, "race"],
  ["4x100m Baton Relay", "girls", 200, 4, "race"],
  ["Egg & Spoon Relay", "boys", 150, 2, "race"],
  ["Egg & Spoon Relay", "girls", 150, 2, "race"],
  ["Arm Wrestling", "boys", 200, 1, "skill"],
  ["Arm Wrestling", "girls", 200, 1, "skill"],
  ["Foosball Singles", "boys", 150, 1, "skill"],
  ["Foosball Singles", "girls", 150, 1, "skill"],
  ["Foosball Doubles", "boys", 300, 2, "skill"],
  ["Foosball Doubles", "girls", 300, 2, "skill"],
  ["Darts Singles (501)", "boys", 150, 1, "skill"],
  ["Darts Singles (501)", "girls", 150, 1, "skill"],
  ["Darts Doubles", "boys", 300, 2, "skill"],
  ["Darts Doubles", "girls", 300, 2, "skill"],
  ["1v1 Penalty Shootout", "boys", 200, 1, "skill"],
  ["1v1 Penalty Shootout", "girls", 200, 1, "skill"],
  ["Archery Target Shoot", "boys", 200, 1, "skill"],
  ["Air Rifle Target Shooting", "boys", 150, 1, "skill"],
  ["Air Rifle Target Shooting", "girls", 150, 1, "skill"],
  ["Gol Gappay Challenge", "boys", 300, 1, "skill"],
  ["Gol Gappay Challenge", "girls", 300, 1, "skill"],
  ["Plank Endurance Test", "boys", 150, 1, "skill"],
  ["Plank Endurance Test", "girls", 150, 1, "skill"],
  ["Rope Jump Sprint", "boys", 200, 1, "skill"],
  ["Rope Jump Sprint", "girls", 200, 1, "skill"],
  ["Rubik's Speedcubing", "boys", 200, 1, "skill"],
  ["Rubik's Speedcubing", "girls", 200, 1, "skill"],
  ["Thula Traditional", "boys", 150, 1, "skill"],
  ["Red Light Green Light", "boys", 200, 1, "skill"],
  ["Red Light Green Light", "girls", 200, 1, "skill"],
  ["Subway Surfers High Score", "boys", 150, 1, "skill"],
  ["Subway Surfers High Score", "girls", 150, 1, "skill"],
  ["Blur PC Racing", "boys", 150, 1, "skill"],
  ["Blur PC Racing", "girls", 150, 1, "skill"],
  ["Piano Tiles Reflex Test", "boys", 150, 1, "skill"],
  ["Piano Tiles Reflex Test", "girls", 150, 1, "skill"],
  ["EA Sports FC / FIFA 24", "boys", 300, 1, "esports"],
  ["EA Sports FC / FIFA 24", "girls", 300, 1, "esports"],
  ["Tekken 8 Tournament", "boys", 300, 1, "esports"],
  ["Tekken 8 Tournament", "girls", 300, 1, "esports"],
  ["Call of Duty: Mobile", "boys", 150, 1, "esports"],
  ["Call of Duty: Mobile", "girls", 150, 1, "esports"],
  ["PUBG Mobile Championship", "boys", 150, 1, "esports"],
  ["PUBG Mobile Championship", "girls", 150, 1, "esports"]
];

async function run() {
  const replaceAll = process.argv.includes('--replace-all');
  console.log('🚀 Syncing permissions, coordinator_matches, and 49 championship games with official PDF prices...');

  await sql`ALTER TABLE games_pricing ADD COLUMN IF NOT EXISTS category VARCHAR(50)`;
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

  if (replaceAll) {
    const officialNames = new Set(PDF_GAMES.map((g) => g[0]));
    const existing = await sql`SELECT DISTINCT game_name FROM games_pricing`;
    for (const row of existing) {
      if (!officialNames.has(row.game_name)) {
        await sql`DELETE FROM games_pricing WHERE game_name = ${row.game_name}`;
        console.log(`🗑️  Removed non-PDF game: ${row.game_name}`);
      }
    }
  }

  for (const [game, gender, price, players, category] of PDF_GAMES) {
    await sql`
      INSERT INTO games_pricing (game_name, gender, price, players, category, created_at)
      VALUES (${game}, ${gender}, ${price}, ${players}, ${category}, NOW())
      ON CONFLICT (game_name, gender) DO UPDATE SET
        price = EXCLUDED.price,
        players = EXCLUDED.players,
        category = EXCLUDED.category
    `;
  }

  console.log('✅ Synced 49 championship games with official PDF prices (90 gender entries) and ensured permissions/coordinator tables.');
}

run().catch((err) => {
  console.error('❌ Sync failed:', err.message);
  process.exit(1);
});
