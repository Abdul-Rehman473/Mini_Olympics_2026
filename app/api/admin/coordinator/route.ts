import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureAuthAndPermissionsSchema, getAdminSession, hasPagePermission, parseAssignedGames } from '@/lib/auth';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

function parseJsonField<T>(val: unknown, fallback: T): T {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  }
  return val as T;
}

function isWithinCoordinatorScope(
  session: NonNullable<Awaited<ReturnType<typeof getAdminSession>>>,
  gameName: string,
  gender: string
): boolean {
  if (session.role === 'super_admin' || hasPagePermission(session, '/admin/hoc', 'edit')) {
    return true;
  }
  if (session.role !== 'coordinator' && session.assignedGames.length === 0) {
    return true;
  }
  const gameOk =
    session.assignedGames.length > 0 &&
    session.assignedGames.some((g) => g.toLowerCase() === gameName.toLowerCase());
  const genderOk =
    session.assignedGender === 'both' || session.assignedGender === gender;
  return gameOk && genderOk;
}

// GET - Fetch players/teams and match records for Coordinator or Admin/HOC
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    const session = await getAdminSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canAccessCoordinator =
      hasPagePermission(session, '/admin/coordinator', 'view') ||
      hasPagePermission(session, '/admin/hoc', 'view');

    if (!canAccessCoordinator) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await ensureAuthAndPermissionsSchema();

    const { searchParams } = new URL(request.url);
    const filterGame = searchParams.get('game');
    const filterGender = searchParams.get('gender');
    const filterStatus = searchParams.get('status');

    const isScopedCoordinator =
      session.role === 'coordinator' ||
      (session.assignedGames.length > 0 && !hasPagePermission(session, '/admin/hoc', 'view') && session.role !== 'super_admin');

    const gamesRows = (await sql`
      SELECT DISTINCT game_name FROM games_pricing ORDER BY game_name ASC
    `) as any[];
    const allDbGames = gamesRows.map((g) => String(g.game_name));

    const allowedGames = isScopedCoordinator
      ? session.assignedGames
      : allDbGames;

    if (isScopedCoordinator && allowedGames.length === 0) {
      return NextResponse.json({
        success: true,
        isScopedCoordinator: true,
        assignedGames: [],
        assignedGender: session.assignedGender,
        games: [],
        players: [],
        matches: [],
        coordinators: [],
      });
    }

    // Fetch registrations
    const regRows = (await sql`
      SELECT id, registration_number, name, roll_number, contact_number, alternative_contact_number,
             email, gender, team_name, selected_games, team_members, status, created_at
      FROM registrations
      WHERE status != 'rejected'
      ORDER BY registration_number ASC, created_at DESC
    `) as any[];

    const allowedGamesLower = new Set(allowedGames.map((g) => g.toLowerCase()));

    const players = regRows
      .map((r) => {
        const selectedGames = parseJsonField<string[]>(r.selected_games, []);
        const teamMembers = parseJsonField<Record<string, any[]>>(r.team_members, {});
        return {
          id: r.id,
          registrationNumber: r.registration_number,
          name: r.name,
          rollNumber: r.roll_number,
          contactNumber: r.contact_number,
          alternativeContactNumber: r.alternative_contact_number,
          email: r.email,
          gender: r.gender as 'boys' | 'girls',
          teamName: r.team_name || r.name,
          selectedGames,
          teamMembers,
          status: r.status,
          createdAt: r.created_at,
        };
      })
      .filter((p) => {
        if (isScopedCoordinator) {
          if (session.assignedGender !== 'both' && p.gender !== session.assignedGender) {
            return false;
          }
          const hasAssignedGame = p.selectedGames.some((g) => allowedGamesLower.has(g.toLowerCase()));
          if (!hasAssignedGame) return false;
        }
        if (filterGender && filterGender !== 'all' && p.gender !== filterGender) {
          return false;
        }
        if (filterGame && filterGame !== 'all') {
          if (!p.selectedGames.some((g) => g.toLowerCase() === filterGame.toLowerCase())) {
            return false;
          }
        }
        return true;
      });

    // Fetch coordinator matches
    const matchRows = (await sql`
      SELECT *
      FROM coordinator_matches
      ORDER BY created_at DESC
    `) as any[];

    const matches = matchRows.filter((m) => {
      if (isScopedCoordinator) {
        if (session.assignedGender !== 'both' && m.gender !== session.assignedGender) {
          return false;
        }
        if (!allowedGamesLower.has(String(m.game_name).toLowerCase())) {
          return false;
        }
      }
      if (filterGame && filterGame !== 'all' && String(m.game_name).toLowerCase() !== filterGame.toLowerCase()) {
        return false;
      }
      if (filterGender && filterGender !== 'all' && m.gender !== filterGender) {
        return false;
      }
      if (filterStatus && filterStatus !== 'all' && m.status !== filterStatus) {
        return false;
      }
      return true;
    });

    // Fetch coordinators summary for Admin/HOC visibility
    let coordinators: any[] = [];
    if (!isScopedCoordinator) {
      const coordRows = (await sql`
        SELECT id, username, display_name, assigned_games, assigned_gender, is_active
        FROM admin_users
        WHERE role = 'coordinator'
        ORDER BY username ASC
      `) as any[];
      coordinators = coordRows.map((c) => ({
        id: c.id,
        username: c.username,
        displayName: c.display_name || c.username,
        assignedGames: parseAssignedGames(c.assigned_games),
        assignedGender: c.assigned_gender || 'both',
        isActive: c.is_active !== false,
      }));
    }

    return NextResponse.json({
      success: true,
      isScopedCoordinator,
      assignedGames: session.assignedGames,
      assignedGender: session.assignedGender,
      games: allowedGames,
      players,
      matches,
      coordinators,
    });
  } catch (error: any) {
    console.error('Coordinator GET error:', error);
    return NextResponse.json({ error: 'Failed to load coordinator data', details: error.message }, { status: 500 });
  }
}

// POST - Create a match or auto-pair Round 1 fixtures
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    const session = await getAdminSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canEdit =
      hasPagePermission(session, '/admin/coordinator', 'edit') ||
      hasPagePermission(session, '/admin/hoc', 'edit');

    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden - Edit permission required' }, { status: 403 });
    }

    await ensureAuthAndPermissionsSchema();

    const body = await request.json();

    // Auto-pair Round 1 fixtures from a list of players
    if (body?.action === 'auto_pair') {
      const gameName = String(body?.gameName || '').trim();
      const gender = body?.gender === 'girls' ? 'girls' : 'boys';
      const roundName = String(body?.roundName || 'Round 1').trim();
      const venue = body?.venue ? String(body.venue).trim() : '';
      const scheduledDate = body?.scheduledDate ? String(body.scheduledDate).trim() : '';
      const playersList = Array.isArray(body?.players) ? body.players : [];

      if (!gameName || playersList.length < 2) {
        return NextResponse.json({ error: 'Select a game and at least 2 players to auto-pair' }, { status: 400 });
      }

      if (!isWithinCoordinatorScope(session, gameName, gender)) {
        return NextResponse.json({ error: 'Forbidden - Game/Gender is outside your assigned coordinator scope' }, { status: 403 });
      }

      // Shuffle players for fair pairing
      const shuffled = [...playersList].sort(() => Math.random() - 0.5);
      const createdMatches: any[] = [];

      let matchNum = 1;
      for (let i = 0; i < shuffled.length; i += 2) {
        const p1 = shuffled[i];
        const p2 = shuffled[i + 1] || null;
        const id = uuidv4();
        const p1Name = p1?.teamName || p1?.name || 'Player 1';
        const p2Name = p2 ? (p2.teamName || p2.name || 'Player 2') : 'BYE';
        const status = p2 ? 'scheduled' : 'completed';
        const winnerName = p2 ? null : p1Name;

        await sql`
          INSERT INTO coordinator_matches (
            id, game_name, gender, round_name, match_number,
            player1_name, player1_reg_id, player1_roll, player1_contact,
            player2_name, player2_reg_id, player2_roll, player2_contact,
            scheduled_date, scheduled_time, venue, status, winner_name,
            coordinator_id, coordinator_username, created_at, updated_at
          ) VALUES (
            ${id}, ${gameName}, ${gender}, ${roundName}, ${matchNum},
            ${p1Name}, ${p1?.id || null}, ${p1?.rollNumber || null}, ${p1?.contactNumber || null},
            ${p2Name}, ${p2?.id || null}, ${p2?.rollNumber || null}, ${p2?.contactNumber || null},
            ${scheduledDate || null}, ${null}, ${venue || null}, ${status}, ${winnerName},
            ${session.adminUserId}, ${session.username}, NOW(), NOW()
          )
        `;
        createdMatches.push({ id, matchNumber: matchNum, player1Name: p1Name, player2Name: p2Name });
        matchNum++;
      }

      return NextResponse.json({ success: true, count: createdMatches.length, matches: createdMatches });
    }

    // Create single match
    const gameName = String(body?.gameName || '').trim();
    const gender = body?.gender === 'girls' ? 'girls' : 'boys';
    const roundName = String(body?.roundName || 'Round 1').trim();
    const matchNumber = Number(body?.matchNumber) || 1;
    const player1Name = String(body?.player1Name || '').trim();
    const player2Name = String(body?.player2Name || '').trim();

    if (!gameName || !player1Name || !player2Name) {
      return NextResponse.json({ error: 'gameName, player1Name, and player2Name are required' }, { status: 400 });
    }

    if (!isWithinCoordinatorScope(session, gameName, gender)) {
      return NextResponse.json({ error: 'Forbidden - Game/Gender is outside your assigned coordinator scope' }, { status: 403 });
    }

    const id = uuidv4();
    await sql`
      INSERT INTO coordinator_matches (
        id, game_name, gender, round_name, match_number,
        player1_name, player1_reg_id, player1_roll, player1_contact,
        player2_name, player2_reg_id, player2_roll, player2_contact,
        scheduled_date, scheduled_time, venue, status, notes,
        coordinator_id, coordinator_username, created_at, updated_at
      ) VALUES (
        ${id}, ${gameName}, ${gender}, ${roundName}, ${matchNumber},
        ${player1Name}, ${body?.player1RegId || null}, ${body?.player1Roll || null}, ${body?.player1Contact || null},
        ${player2Name}, ${body?.player2RegId || null}, ${body?.player2Roll || null}, ${body?.player2Contact || null},
        ${body?.scheduledDate || null}, ${body?.scheduledTime || null}, ${body?.venue || null},
        ${'scheduled'}, ${body?.notes || null},
        ${session.adminUserId}, ${session.username}, NOW(), NOW()
      )
    `;

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Coordinator POST error:', error);
    return NextResponse.json({ error: 'Failed to create match', details: error.message }, { status: 500 });
  }
}

// PATCH - Update match time, venue, status, score, or winner
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    const session = await getAdminSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canEdit =
      hasPagePermission(session, '/admin/coordinator', 'edit') ||
      hasPagePermission(session, '/admin/hoc', 'edit');

    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden - Edit permission required' }, { status: 403 });
    }

    await ensureAuthAndPermissionsSchema();

    const body = await request.json();
    const id = String(body?.id || '').trim();
    if (!id) {
      return NextResponse.json({ error: 'Match id is required' }, { status: 400 });
    }

    const existingRows = (await sql`SELECT * FROM coordinator_matches WHERE id = ${id} LIMIT 1`) as any[];
    if (existingRows.length === 0) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    const current = existingRows[0];

    if (!isWithinCoordinatorScope(session, current.game_name, current.gender)) {
      return NextResponse.json({ error: 'Forbidden - Match is outside your assigned coordinator scope' }, { status: 403 });
    }

    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled', 'walkover'];
    const nextStatus =
      body?.status && validStatuses.includes(body.status) ? body.status : current.status;

    const roundName = body?.roundName !== undefined ? String(body.roundName).trim() : current.round_name;
    const matchNumber = body?.matchNumber !== undefined ? Number(body.matchNumber) || 1 : current.match_number;
    const player1Name = body?.player1Name !== undefined ? String(body.player1Name).trim() : current.player1_name;
    const player2Name = body?.player2Name !== undefined ? String(body.player2Name).trim() : current.player2_name;
    const scheduledDate = body?.scheduledDate !== undefined ? (body.scheduledDate || null) : current.scheduled_date;
    const scheduledTime = body?.scheduledTime !== undefined ? (body.scheduledTime || null) : current.scheduled_time;
    const venue = body?.venue !== undefined ? (body.venue || null) : current.venue;
    const winnerName = body?.winnerName !== undefined ? (body.winnerName || null) : current.winner_name;
    const scoreSummary = body?.scoreSummary !== undefined ? (body.scoreSummary || null) : current.score_summary;
    const notes = body?.notes !== undefined ? (body.notes || null) : current.notes;

    await sql`
      UPDATE coordinator_matches
      SET round_name = ${roundName},
          match_number = ${matchNumber},
          player1_name = ${player1Name},
          player2_name = ${player2Name},
          scheduled_date = ${scheduledDate},
          scheduled_time = ${scheduledTime},
          venue = ${venue},
          status = ${nextStatus},
          winner_name = ${winnerName},
          score_summary = ${scoreSummary},
          notes = ${notes},
          updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Coordinator PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update match', details: error.message }, { status: 500 });
  }
}

// DELETE - Remove a coordinator match
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('admin_session')?.value;
    const session = await getAdminSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canEdit =
      hasPagePermission(session, '/admin/coordinator', 'edit') ||
      hasPagePermission(session, '/admin/hoc', 'edit');

    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden - Edit permission required' }, { status: 403 });
    }

    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Match id is required' }, { status: 400 });
    }

    const existingRows = (await sql`SELECT game_name, gender FROM coordinator_matches WHERE id = ${id} LIMIT 1`) as any[];
    if (existingRows.length === 0) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    if (!isWithinCoordinatorScope(session, existingRows[0].game_name, existingRows[0].gender)) {
      return NextResponse.json({ error: 'Forbidden - Match is outside your assigned coordinator scope' }, { status: 403 });
    }

    await sql`DELETE FROM coordinator_matches WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Coordinator DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete match', details: error.message }, { status: 500 });
  }
}
