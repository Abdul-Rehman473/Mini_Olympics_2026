// Games pricing for Mini Olympics 2026 (Synced with Official 5-Page Games Prices PDF)

export type GameCategorySlug = 'team' | 'indoor' | 'track' | 'fun' | 'esports';

export interface GamePrice {
  name: string;
  boys: number | null;
  girls: number | null;
  boysPlayers?: number;
  girlsPlayers?: number;
  category?: GameCategorySlug;
}

export const gamesPricing: GamePrice[] = [
  // Page 1: TEAM SPORTS (8)
  { name: 'Cricket', boys: 1600, girls: 1200, boysPlayers: 8, girlsPlayers: 5, category: 'team' },
  { name: 'Football', boys: 2200, girls: 1200, boysPlayers: 11, girlsPlayers: 6, category: 'team' },
  { name: 'Basketball Team', boys: 2200, girls: 2200, boysPlayers: 7, girlsPlayers: 7, category: 'team' },
  { name: 'Handball', boys: 1200, girls: 1200, boysPlayers: 6, girlsPlayers: 6, category: 'team' },
  { name: 'Volley Ball', boys: 1200, girls: 1200, boysPlayers: 6, girlsPlayers: 6, category: 'team' },
  { name: 'Kabbadi', boys: 500, girls: 500, boysPlayers: 7, girlsPlayers: 7, category: 'team' },
  { name: 'Tug of War', boys: 600, girls: 600, boysPlayers: 8, girlsPlayers: 8, category: 'team' },
  { name: 'Frisbee', boys: 250, girls: 250, boysPlayers: 1, girlsPlayers: 1, category: 'team' },

  // Page 2: INDOOR & TABLE GAMES (12)
  { name: 'Badminton Singles', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'indoor' },
  { name: 'Badminton Doubles', boys: 400, girls: 400, boysPlayers: 2, girlsPlayers: 2, category: 'indoor' },
  { name: 'Table Tennis Singles', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'indoor' },
  { name: 'Table Tennis Doubles', boys: 400, girls: 400, boysPlayers: 2, girlsPlayers: 2, category: 'indoor' },
  { name: 'Carrom Singles', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'indoor' },
  { name: 'Carrom Doubles', boys: 250, girls: 250, boysPlayers: 2, girlsPlayers: 2, category: 'indoor' },
  { name: 'Ludo Singles', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'indoor' },
  { name: 'Ludo Doubles', boys: 300, girls: 300, boysPlayers: 2, girlsPlayers: 2, category: 'indoor' },
  { name: 'Foosball Singles', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'indoor' },
  { name: 'Foosball Doubles', boys: 300, girls: 300, boysPlayers: 2, girlsPlayers: 2, category: 'indoor' },
  { name: 'Dart Singles', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'indoor' },
  { name: 'Dart Doubles', boys: 300, girls: 300, boysPlayers: 2, girlsPlayers: 2, category: 'indoor' },

  // Page 3: TRACK & FIELD (9)
  { name: '100m Race', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'track' },
  { name: 'Relay Race', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'track' },
  { name: '3 Leg Race', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'track' },
  { name: 'Egg Relay Race', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'track' },
  { name: 'Rope Jump', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'track' },
  { name: 'Plank', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'track' },
  { name: 'Laser Run', boys: 300, girls: 300, boysPlayers: 1, girlsPlayers: 1, category: 'track' },
  { name: 'Scavenger Hunt', boys: 400, girls: 400, boysPlayers: 1, girlsPlayers: 1, category: 'track' },
  { name: '1 vs 1 Penalty', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'track' },

  // Page 4: FUN GAMES (9)
  { name: 'Rifle Shooting', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'fun' },
  { name: 'Arm Wrestling', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'fun' },
  { name: 'Squid Game', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'fun' },
  { name: 'Pucket', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'fun' },
  { name: 'Gol Gappay Eating Challenge', boys: 300, girls: 300, boysPlayers: 1, girlsPlayers: 1, category: 'fun' },
  { name: 'UNO', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'fun' },
  { name: 'Jenga', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'fun' },
  { name: 'Chess', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'fun' },
  { name: "Rubik's Cube", boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'fun' },

  // Page 5: E-SPORTS ARENA (7)
  { name: 'Pubg', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'esports' },
  { name: 'Call of Duty Mobile', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'esports' },
  { name: 'Blur (Racing)', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'esports' },
  { name: 'Subway Surfer', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'esports' },
  { name: 'Piano Tiles', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'esports' },
  { name: 'Tekken', boys: 300, girls: 300, boysPlayers: 1, girlsPlayers: 1, category: 'esports' },
  { name: 'Fifa', boys: 300, girls: 300, boysPlayers: 1, girlsPlayers: 1, category: 'esports' },
];

export function getGamePrice(gameName: string, gender: 'boys' | 'girls'): number | null {
  const game = gamesPricing.find((g) => g.name.toLowerCase() === gameName.toLowerCase());
  if (!game) return null;
  return gender === 'boys' ? game.boys : game.girls;
}

export function getAvailableGames(gender: 'boys' | 'girls'): GamePrice[] {
  return gamesPricing.filter((game) => {
    return gender === 'boys' ? game.boys !== null : game.girls !== null;
  });
}

export function calculateTotal(selectedGames: string[], gender: 'boys' | 'girls'): number {
  let total = 0;
  selectedGames.forEach((gameName) => {
    const price = getGamePrice(gameName, gender);
    if (price !== null) {
      total += price;
    }
  });
  return total;
}

export function getRequiredPlayers(gameName: string, gender: 'boys' | 'girls'): number | null {
  const game = gamesPricing.find((g) => g.name.toLowerCase() === gameName.toLowerCase());
  if (!game) return null;
  return gender === 'boys' ? (game.boysPlayers || null) : (game.girlsPlayers || null);
}

export function isTeamGame(gameName: string, gender: 'boys' | 'girls'): boolean {
  const requiredPlayers = getRequiredPlayers(gameName, gender);
  return requiredPlayers !== null && requiredPlayers > 1;
}
