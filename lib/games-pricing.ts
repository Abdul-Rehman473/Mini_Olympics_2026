// Games pricing for Mini Olympics 2026 (Previous 49 games with official PDF prices)

export type GameCategorySlug = 'team' | 'race' | 'racket' | 'esports' | 'board' | 'skill';

export interface GamePrice {
  name: string;
  boys: number | null;
  girls: number | null;
  boysPlayers?: number;
  girlsPlayers?: number;
  category?: GameCategorySlug;
}

export const gamesPricing: GamePrice[] = [
  { name: 'Tape Ball Cricket', boys: 1600, girls: 1200, boysPlayers: 8, girlsPlayers: 5, category: 'team' },
  { name: 'Football Championship', boys: 2200, girls: 1200, boysPlayers: 11, girlsPlayers: 6, category: 'team' },
  { name: 'Field Hockey', boys: 1500, girls: null, boysPlayers: 10, category: 'team' },
  { name: 'Kabaddi Championship', boys: 500, girls: 500, boysPlayers: 7, girlsPlayers: 7, category: 'team' },
  { name: 'Handball Clash', boys: 1200, girls: 1200, boysPlayers: 6, girlsPlayers: 6, category: 'team' },
  { name: 'Volleyball Spike', boys: 1200, girls: 1200, boysPlayers: 6, girlsPlayers: 6, category: 'team' },
  { name: 'Ultimate Frisbee', boys: 250, girls: 250, boysPlayers: 1, girlsPlayers: 1, category: 'team' },
  { name: 'Pitho Gol Garam', boys: 1000, girls: null, boysPlayers: 6, category: 'team' },
  { name: 'Tug of War', boys: 600, girls: 600, boysPlayers: 8, girlsPlayers: 8, category: 'team' },
  { name: 'Double Wicket Cricket', boys: 500, girls: null, boysPlayers: 2, category: 'team' },
  { name: 'Basketball (1 vs 1)', boys: 200, girls: null, boysPlayers: 1, category: 'team' },
  { name: 'Swimming Sprint', boys: 300, girls: null, boysPlayers: 1, category: 'team' },
  { name: 'Badminton Singles', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'racket' },
  { name: 'Badminton Doubles', boys: 400, girls: 400, boysPlayers: 2, girlsPlayers: 2, category: 'racket' },
  { name: 'Table Tennis Singles', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'racket' },
  { name: 'Table Tennis Doubles', boys: 400, girls: 400, boysPlayers: 2, girlsPlayers: 2, category: 'racket' },
  { name: 'Championship Chess', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'board' },
  { name: 'Ludo Singles', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'board' },
  { name: 'Ludo Doubles', boys: 300, girls: 300, boysPlayers: 2, girlsPlayers: 2, category: 'board' },
  { name: 'Carrom Singles', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'board' },
  { name: 'Carrom Doubles', boys: 250, girls: 250, boysPlayers: 2, girlsPlayers: 2, category: 'board' },
  { name: 'Jenga Tower Challenge', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'board' },
  { name: 'Uno Championship', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'board' },
  { name: 'Pucket Fast-Track', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'board' },
  { name: '100m Sprint Dash', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'race' },
  { name: '3 Legged Race', boys: 200, girls: 200, boysPlayers: 2, girlsPlayers: 2, category: 'race' },
  { name: '4x100m Baton Relay', boys: 200, girls: 200, boysPlayers: 4, girlsPlayers: 4, category: 'race' },
  { name: 'Egg & Spoon Relay', boys: 150, girls: 150, boysPlayers: 2, girlsPlayers: 2, category: 'race' },
  { name: 'Arm Wrestling', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'skill' },
  { name: 'Foosball Singles', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'skill' },
  { name: 'Foosball Doubles', boys: 300, girls: 300, boysPlayers: 2, girlsPlayers: 2, category: 'skill' },
  { name: 'Darts Singles (501)', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'skill' },
  { name: 'Darts Doubles', boys: 300, girls: 300, boysPlayers: 2, girlsPlayers: 2, category: 'skill' },
  { name: '1v1 Penalty Shootout', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'skill' },
  { name: 'Archery Target Shoot', boys: 200, girls: null, boysPlayers: 1, category: 'skill' },
  { name: 'Air Rifle Target Shooting', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'skill' },
  { name: 'Gol Gappay Challenge', boys: 300, girls: 300, boysPlayers: 1, girlsPlayers: 1, category: 'skill' },
  { name: 'Plank Endurance Test', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'skill' },
  { name: 'Rope Jump Sprint', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'skill' },
  { name: 'Rubik\'s Speedcubing', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'skill' },
  { name: 'Thula Traditional', boys: 150, girls: null, boysPlayers: 1, category: 'skill' },
  { name: 'Red Light Green Light', boys: 200, girls: 200, boysPlayers: 1, girlsPlayers: 1, category: 'skill' },
  { name: 'Subway Surfers High Score', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'skill' },
  { name: 'Blur PC Racing', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'skill' },
  { name: 'Piano Tiles Reflex Test', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'skill' },
  { name: 'EA Sports FC / FIFA 24', boys: 300, girls: 300, boysPlayers: 1, girlsPlayers: 1, category: 'esports' },
  { name: 'Tekken 8 Tournament', boys: 300, girls: 300, boysPlayers: 1, girlsPlayers: 1, category: 'esports' },
  { name: 'Call of Duty: Mobile', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'esports' },
  { name: 'PUBG Mobile Championship', boys: 150, girls: 150, boysPlayers: 1, girlsPlayers: 1, category: 'esports' },
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
