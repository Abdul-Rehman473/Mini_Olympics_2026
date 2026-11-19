import type { GamePrice } from './games-pricing';

export type SportCategory = 'team' | 'indoor' | 'track' | 'fun' | 'esports';

export interface GameInfo {
  id: string;
  name: string;
  category: SportCategory;
  categoryLabel: string;
  headline: string;
  tagline: string;
  division: 'boys_and_girls' | 'boys_only' | 'girls_only';
  playerFormat: string;
  matchFormat: string;
  boysPlayers?: number;
  girlsPlayers?: number;
  boysFee?: number;
  girlsFee?: number;
  isTeam: boolean;
  featured?: boolean;
  featuredLayout?: 'hero' | 'tall' | 'wide' | 'standard';
  rulesOverview: string;
  venueNote: string;
  accentColor: string;
  iconKey: string;
  image: string;
}

export const CATEGORIES: { id: SportCategory; label: string; count: number; description: string }[] = [
  { id: 'team', label: 'Team Sports', count: 8, description: 'Big matches & squad events across the main campus grounds and courts.' },
  { id: 'indoor', label: 'Indoor & Table Games', count: 12, description: 'Singles & doubles precision tournaments in badminton, table tennis, carrom, ludo, foosball & darts.' },
  { id: 'track', label: 'Track & Field', count: 9, description: 'Singles athletics events, sprints, relays, endurance tests & penalty shootouts.' },
  { id: 'fun', label: 'Fun Games', count: 9, description: 'Target shooting, arm wrestling, Squid Game, Gol Gappay eating challenge, board & puzzle clashes.' },
  { id: 'esports', label: 'E-Sports Arena', count: 7, description: 'Indoor console, PC & mobile battles in PUBG, COD Mobile, Blur, Tekken, FIFA & arcade challenges.' },
];

export const CATEGORY_LABELS: Record<SportCategory, string> = {
  team: 'Team Sports',
  indoor: 'Indoor & Table Games',
  track: 'Track & Field',
  fun: 'Fun Games',
  esports: 'E-Sports Arena',
};

export const GAMES_DATA: GameInfo[] = [
  // --- TEAM SPORTS (8) ---
  {
    id: 'cricket',
    name: 'Cricket',
    category: 'team',
    categoryLabel: 'Team Sports',
    headline: 'THE FLOODLIT DERBY',
    tagline: 'The flagship campus tournament. High-octane tape ball action under floodlights with official umpires and packed sidelines.',
    division: 'boys_and_girls',
    playerFormat: '♂ 8 Players | ♀ 5 Players',
    matchFormat: 'TAPE BALL KNOCKOUT',
    boysPlayers: 8,
    girlsPlayers: 5,
    boysFee: 1600,
    girlsFee: 1200,
    isTeam: true,
    featured: true,
    featuredLayout: 'hero',
    rulesOverview: 'Standard tape ball knockouts. Powerplay rules and official umpires strictly regulate play.',
    venueNote: 'Main Campus Cricket Ground',
    accentColor: '#F59E0B',
    iconKey: 'cricket',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'football',
    name: 'Football',
    category: 'team',
    categoryLabel: 'Team Sports',
    headline: 'THE TURF WAR',
    tagline: 'Tactical passing, high-pressing counters, and clinical finishing on the floodlit campus arena.',
    division: 'boys_and_girls',
    playerFormat: '♂ 11 Players | ♀ 6 Players',
    matchFormat: '2x15 MIN HALVES',
    boysPlayers: 11,
    girlsPlayers: 6,
    boysFee: 2200,
    girlsFee: 1200,
    isTeam: true,
    featured: true,
    featuredLayout: 'tall',
    rulesOverview: 'Knockout format with 15-minute halves. Tied matches proceed directly to a penalty shootout.',
    venueNote: 'FCIT Sports Complex Field',
    accentColor: '#12E2C4',
    iconKey: 'football',
    image: '/images/games/football.avif',
  },
  {
    id: 'basketball-team',
    name: 'Basketball Team',
    category: 'team',
    categoryLabel: 'Team Sports',
    headline: 'FULL-COURT SHOWDOWN',
    tagline: 'Fast breaks, perimeter shooting, and full-court defense with 7-player squad rosters.',
    division: 'boys_and_girls',
    playerFormat: '♂ 7 Players | ♀ 7 Players',
    matchFormat: '4 QUARTERS KNOCKOUT',
    boysPlayers: 7,
    girlsPlayers: 7,
    boysFee: 2200,
    girlsFee: 2200,
    isTeam: true,
    featured: true,
    featuredLayout: 'standard',
    rulesOverview: 'Standard collegiate basketball rules. Official shot clock and referee-controlled fouls.',
    venueNote: 'Main Basketball Court',
    accentColor: '#F59E0B',
    iconKey: 'basketball',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'handball',
    name: 'Handball',
    category: 'team',
    categoryLabel: 'Team Sports',
    headline: 'AERIAL TRANSITIONS',
    tagline: 'Continuous fast transitions, wing cuts, and high-velocity jump shots outside the 6-meter crease.',
    division: 'boys_and_girls',
    playerFormat: '♂ 6 Players | ♀ 6 Players',
    matchFormat: '2x12 MIN HALVES',
    boysPlayers: 6,
    girlsPlayers: 6,
    boysFee: 1200,
    girlsFee: 1200,
    isTeam: true,
    rulesOverview: 'Standard court dimensions with 6m goal crease. Rolling substitutions permitted at stoppage.',
    venueNote: 'Outdoor Multi-Purpose Court',
    accentColor: '#3B82F6',
    iconKey: 'handball',
    image: 'https://images.unsplash.com/photo-1553627220-92f0446b6a5f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'volley-ball',
    name: 'Volley Ball',
    category: 'team',
    categoryLabel: 'Team Sports',
    headline: 'ABOVE THE NET',
    tagline: 'High-flying spikes, quick middle sets, and relentless defensive digs at the collegiate net.',
    division: 'boys_and_girls',
    playerFormat: '♂ 6 Players | ♀ 6 Players',
    matchFormat: 'BEST OF 3 SETS',
    boysPlayers: 6,
    girlsPlayers: 6,
    boysFee: 1200,
    girlsFee: 1200,
    isTeam: true,
    rulesOverview: 'Best of 3 sets to 21 points with rally scoring. Official net height.',
    venueNote: 'Volleyball Court #1',
    accentColor: '#12E2C4',
    iconKey: 'volleyball',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'kabbadi',
    name: 'Kabbadi',
    category: 'team',
    categoryLabel: 'Team Sports',
    headline: 'RAW TENDON & POWER',
    tagline: 'Raw power, synchronized defensive chains, and breath-holding raids in the traditional court.',
    division: 'boys_and_girls',
    playerFormat: '♂ 7 Players | ♀ 7 Players',
    matchFormat: '30-SEC RAID TIMER',
    boysPlayers: 7,
    girlsPlayers: 7,
    boysFee: 500,
    girlsFee: 500,
    isTeam: true,
    featured: true,
    featuredLayout: 'wide',
    rulesOverview: 'Standard rules with super-tackles active. 30-second raid clock monitored by arbiters.',
    venueNote: 'Central Clay Court Arena',
    accentColor: '#F59E0B',
    iconKey: 'kabaddi',
    image: '/images/games/kabaddi.avif',
  },
  {
    id: 'tug-of-war',
    name: 'Tug of War',
    category: 'team',
    categoryLabel: 'Team Sports',
    headline: 'THE ANCHOR BATTLE',
    tagline: 'Pure collective grit, team synchronized pulling, and unyielding campus dominance.',
    division: 'boys_and_girls',
    playerFormat: '♂ 8 Players | ♀ 8 Players',
    matchFormat: 'BEST OF 3 PULLS',
    boysPlayers: 8,
    girlsPlayers: 8,
    boysFee: 600,
    girlsFee: 600,
    isTeam: true,
    featured: true,
    featuredLayout: 'wide',
    rulesOverview: 'Best of 3 pulls across the 4-meter marker tape. Cleats prohibited for safety.',
    venueNote: 'Central Arena Turf',
    accentColor: '#F068B1',
    iconKey: 'tug-of-war',
    image: '/images/games/tug-of-war.avif',
  },
  {
    id: 'frisbee',
    name: 'Frisbee',
    category: 'team',
    categoryLabel: 'Team Sports',
    headline: 'END-ZONE PRECISION',
    tagline: 'End-to-end aerial strategy, layout catches, and high-speed disc play.',
    division: 'boys_and_girls',
    playerFormat: 'Individual / Squad Entry',
    matchFormat: 'END-ZONE SCORING',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 250,
    girlsFee: 250,
    isTeam: false,
    rulesOverview: 'End zone scoring format. Non-contact officiated with tournament field marshals.',
    venueNote: 'North Lawn Arena',
    accentColor: '#12E2C4',
    iconKey: 'frisbee',
    image: 'https://images.unsplash.com/photo-1686605972972-d7b17f7ebc7a?auto=format&fit=crop&w=800&q=80',
  },

  // --- INDOOR & TABLE GAMES (12) ---
  {
    id: 'badminton-singles',
    name: 'Badminton Singles',
    category: 'indoor',
    categoryLabel: 'Indoor & Table Games',
    headline: 'SHUTTLE FLIGHT',
    tagline: 'Sub-second drops, explosive jump smashes, and total court coverage in the indoor arena.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 vs 1)',
    matchFormat: 'BEST OF 3 SETS',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    featured: true,
    featuredLayout: 'standard',
    rulesOverview: 'Single elimination BWF format. Sets played to 21 rally points.',
    venueNote: 'Indoor Gymnasium Hall 1',
    accentColor: '#3B82F6',
    iconKey: 'shuttlecock',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'badminton-doubles',
    name: 'Badminton Doubles',
    category: 'indoor',
    categoryLabel: 'Indoor & Table Games',
    headline: 'SMASH ROTATION',
    tagline: 'Synchronized tandem court coverage, net intercepts, and aggressive smash rotation.',
    division: 'boys_and_girls',
    playerFormat: 'Doubles (2 Players)',
    matchFormat: 'BWF REGULATION 21',
    boysPlayers: 2,
    girlsPlayers: 2,
    boysFee: 400,
    girlsFee: 400,
    isTeam: true,
    featured: true,
    featuredLayout: 'hero',
    rulesOverview: 'Best of 3 sets to 21. Both teammates must be registered under the squad.',
    venueNote: 'Indoor Gymnasium Hall 2',
    accentColor: '#F068B1',
    iconKey: 'shuttlecock',
    image: 'https://images.unsplash.com/photo-1626721105368-a69248e93b32?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'table-tennis-singles',
    name: 'Table Tennis Singles',
    category: 'indoor',
    categoryLabel: 'Indoor & Table Games',
    headline: 'HEAVY TOPSPIN',
    tagline: 'Sub-second spins, heavy topspins, and counter-looping showdowns.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 vs 1)',
    matchFormat: '11-POINT KNOCKOUT',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    rulesOverview: '11-point games, alternate two serves each, best of 3 sets knockout format.',
    venueNote: 'Student Lounge TT Arena',
    accentColor: '#12E2C4',
    iconKey: 'table-tennis',
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'table-tennis-doubles',
    name: 'Table Tennis Doubles',
    category: 'indoor',
    categoryLabel: 'Indoor & Table Games',
    headline: 'CROSS-COURT REFLEXES',
    tagline: 'Alternate hitting sequences, cross-court placement, and rapid reflex exchanges.',
    division: 'boys_and_girls',
    playerFormat: 'Doubles (2 Players)',
    matchFormat: 'BEST OF 3 SETS',
    boysPlayers: 2,
    girlsPlayers: 2,
    boysFee: 400,
    girlsFee: 400,
    isTeam: true,
    rulesOverview: 'Strict alternate hitting rule applies. Service must cross right-half to right-half.',
    venueNote: 'Student Lounge TT Arena',
    accentColor: '#F59E0B',
    iconKey: 'table-tennis',
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'carrom-singles',
    name: 'Carrom Singles',
    category: 'indoor',
    categoryLabel: 'Indoor & Table Games',
    headline: 'THE QUEEN POCKET',
    tagline: 'Powdered surface striker mastery, scissor rebounds, and Queen pocketing.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 vs 1)',
    matchFormat: 'FIRST TO 21 POINTS',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 150,
    girlsFee: 150,
    isTeam: false,
    rulesOverview: 'First to 21 points or 8 boards. Queen cover rule strictly applied.',
    venueNote: 'Recreation Hall B',
    accentColor: '#F59E0B',
    iconKey: 'disc',
    image: '/images/games/carrom-singles.avif',
  },
  {
    id: 'carrom-doubles',
    name: 'Carrom Doubles',
    category: 'indoor',
    categoryLabel: 'Indoor & Table Games',
    headline: 'CORNER TACTICS',
    tagline: 'Opposing corner tactics, defensive leaves, and synchronized board clearing.',
    division: 'boys_and_girls',
    playerFormat: 'Doubles (2 Players)',
    matchFormat: '8 BOARDS KNOCKOUT',
    boysPlayers: 2,
    girlsPlayers: 2,
    boysFee: 250,
    girlsFee: 250,
    isTeam: true,
    rulesOverview: 'Partners sit opposite. Clockwise turn order. Official smooth carrom boards used.',
    venueNote: 'Recreation Hall B',
    accentColor: '#F59E0B',
    iconKey: 'disc',
    image: '/images/games/carrom-doubles.avif',
  },
  {
    id: 'ludo-singles',
    name: 'Ludo Singles',
    category: 'indoor',
    categoryLabel: 'Indoor & Table Games',
    headline: 'TACTICAL DIE ROLLS',
    tagline: 'High-stakes token hunting, dice strategy, and competitive home-runs.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 vs 1)',
    matchFormat: 'FIRST TO PARK 4',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    rulesOverview: 'Four tokens per player. Mandatory cut rule. First player to park 4 tokens wins.',
    venueNote: 'Club Room 1',
    accentColor: '#3B82F6',
    iconKey: 'dice',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ludo-doubles',
    name: 'Ludo Doubles',
    category: 'indoor',
    categoryLabel: 'Indoor & Table Games',
    headline: 'DIAGONAL ALLIANCE',
    tagline: 'Partner collaboration, cross-board shield blocks, and dual victory conditions.',
    division: 'boys_and_girls',
    playerFormat: 'Doubles (2 Players)',
    matchFormat: 'TEAM OF 2 TOKENS',
    boysPlayers: 2,
    girlsPlayers: 2,
    boysFee: 300,
    girlsFee: 300,
    isTeam: true,
    rulesOverview: 'Diagonal partners. Both partners must land all tokens home to secure victory.',
    venueNote: 'Club Room 1',
    accentColor: '#12E2C4',
    iconKey: 'dice',
    image: 'https://images.unsplash.com/photo-1642056448416-b7dd0ed968cc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'foosball-singles',
    name: 'Foosball Singles',
    category: 'indoor',
    categoryLabel: 'Indoor & Table Games',
    headline: 'ROD SPIN BAN',
    tagline: 'Table soccer lightning shots, bank passes, and wall snipes.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 vs 1)',
    matchFormat: 'FIRST TO 7 GOALS',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 150,
    girlsFee: 150,
    isTeam: false,
    rulesOverview: 'First to 7 goals. No 360-degree rod spinning (spinning is foul).',
    venueNote: 'Game Room 2',
    accentColor: '#12E2C4',
    iconKey: 'football',
    image: '/images/games/foosball-singles.avif',
  },
  {
    id: 'foosball-doubles',
    name: 'Foosball Doubles',
    category: 'indoor',
    categoryLabel: 'Indoor & Table Games',
    headline: 'TANDEM TABLE SOCCER',
    tagline: 'Goalkeeper defense paired with midfield and forward rod passing coordination.',
    division: 'boys_and_girls',
    playerFormat: 'Doubles (2 Players)',
    matchFormat: 'FIRST TO 10 GOALS',
    boysPlayers: 2,
    girlsPlayers: 2,
    boysFee: 300,
    girlsFee: 300,
    isTeam: true,
    rulesOverview: 'First to 10 goals. Team coordination with defense/offense split.',
    venueNote: 'Game Room 2',
    accentColor: '#3B82F6',
    iconKey: 'football',
    image: 'https://images.unsplash.com/photo-1786025054505-abee8b30bb51?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dart-singles',
    name: 'Dart Singles',
    category: 'indoor',
    categoryLabel: 'Indoor & Table Games',
    headline: 'DOUBLE-OUT CLUTCH',
    tagline: 'Bullseye accuracy, triple-20 bed groupings, and clinical double checkouts.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 vs 1)',
    matchFormat: '501 DOUBLE-OUT',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 150,
    girlsFee: 150,
    isTeam: false,
    rulesOverview: 'Standard 501 game with double-out checkout rule. Steel tip darts provided.',
    venueNote: 'Indoor Lounge Zone C',
    accentColor: '#F068B1',
    iconKey: 'target',
    image: 'https://images.unsplash.com/photo-1517127766989-c19048cd61e1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dart-doubles',
    name: 'Dart Doubles',
    category: 'indoor',
    categoryLabel: 'Indoor & Table Games',
    headline: 'DUAL BOARD ACCURACY',
    tagline: 'Alternate leg throwing with partner strategy on the tournament bristle board.',
    division: 'boys_and_girls',
    playerFormat: 'Doubles (2 Players)',
    matchFormat: 'ALTERNATE THROW 501',
    boysPlayers: 2,
    girlsPlayers: 2,
    boysFee: 300,
    girlsFee: 300,
    isTeam: true,
    rulesOverview: 'Alternate throw format. Highest cumulative checkout takes the frame.',
    venueNote: 'Indoor Lounge Zone C',
    accentColor: '#F068B1',
    iconKey: 'target',
    image: '/images/games/darts-doubles.avif',
  },

  // --- TRACK & FIELD (9) ---
  {
    id: '100m-race',
    name: '100m Race',
    category: 'track',
    categoryLabel: 'Track & Field',
    headline: 'FASTEST SPRINTER ON CAMPUS',
    tagline: 'Laser-timed sprint showdown on the Olympic straight track for the championship title.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 Runner)',
    matchFormat: 'TIMED HEATS',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    featured: true,
    featuredLayout: 'tall',
    rulesOverview: 'Timed heats on standard running track. False start results in immediate disqualification.',
    venueNote: 'Olympic Track Straight',
    accentColor: '#12E2C4',
    iconKey: 'running',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'relay-race',
    name: 'Relay Race',
    category: 'track',
    categoryLabel: 'Track & Field',
    headline: 'THE ANCHOR LEG',
    tagline: 'Precision baton transfers, anchor leg heroics, and sprint pace across the track.',
    division: 'boys_and_girls',
    playerFormat: 'Individual Entry',
    matchFormat: 'OLYMPIC TRACK RELAY',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    rulesOverview: 'Baton must be passed strictly within the changeover zone.',
    venueNote: 'Olympic Track Arena',
    accentColor: '#F59E0B',
    iconKey: 'running',
    image: '/images/games/relay-race.avif',
  },
  {
    id: '3-leg-race',
    name: '3 Leg Race',
    category: 'track',
    categoryLabel: 'Track & Field',
    headline: 'BOUND SYNERGY',
    tagline: 'Synchronized running with ankles tethered. Coordination and pace decide the winner.',
    division: 'boys_and_girls',
    playerFormat: 'Individual Entry',
    matchFormat: '50M TETHERED SPRINT',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    rulesOverview: '50-meter sprint with center ankles securely tethered. Falling requires getting up without untethering.',
    venueNote: 'Main Grass Oval',
    accentColor: '#F59E0B',
    iconKey: 'running',
    image: 'https://images.unsplash.com/photo-1758586326118-01c566d308ca?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'egg-relay-race',
    name: 'Egg Relay Race',
    category: 'track',
    categoryLabel: 'Track & Field',
    headline: 'CALM UNDER PACE',
    tagline: 'Speed balanced with extreme calm. Drop the egg and you restart the leg.',
    division: 'boys_and_girls',
    playerFormat: 'Individual Entry',
    matchFormat: 'NO-THUMB RESTRICTION',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 150,
    girlsFee: 150,
    isTeam: false,
    rulesOverview: 'Runners must balance the egg on the wooden spoon held in hand (no thumb touching).',
    venueNote: 'Central Walkway',
    accentColor: '#F59E0B',
    iconKey: 'running',
    image: 'https://images.unsplash.com/photo-1529570634977-ec042420117b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'rope-jump',
    name: 'Rope Jump',
    category: 'track',
    categoryLabel: 'Track & Field',
    headline: '60-SECOND CADENCE',
    tagline: 'Maximum speed rope revolutions in 60 seconds with endurance stamina.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 Athlete)',
    matchFormat: '60S REVOLUTION COUNT',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    rulesOverview: '60 seconds continuous skipping. Counter sensor rope provided.',
    venueNote: 'Fitness Center Mat',
    accentColor: '#12E2C4',
    iconKey: 'stopwatch',
    image: 'https://images.unsplash.com/photo-1758875568447-aa45a5d3b351?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'track',
    categoryLabel: 'Track & Field',
    headline: 'CORE STEEL',
    tagline: 'Core stamina, isometric strength, and mental fortitude against the clock.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 Athlete)',
    matchFormat: 'CONTINUOUS TIME',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 150,
    girlsFee: 150,
    isTeam: false,
    rulesOverview: 'Forearm plank posture. Judge issues one warning for hip drop before timer stoppage.',
    venueNote: 'Fitness Center Mat',
    accentColor: '#3B82F6',
    iconKey: 'stopwatch',
    image: 'https://images.unsplash.com/photo-1765302741884-e846c7a178df?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'laser-run',
    name: 'Laser Run',
    category: 'track',
    categoryLabel: 'Track & Field',
    headline: 'SPRINT & TARGET',
    tagline: 'High-speed track laps combined with precision laser target checkpoints.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 Athlete)',
    matchFormat: 'TIMED OBSTACLE RUN',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 300,
    girlsFee: 300,
    isTeam: false,
    rulesOverview: 'Complete designated sprint legs and hit target checkpoints in minimum total time.',
    venueNote: 'Main Athletics Arena',
    accentColor: '#12E2C4',
    iconKey: 'target',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'scavenger-hunt',
    name: 'Scavenger Hunt',
    category: 'track',
    categoryLabel: 'Track & Field',
    headline: 'CAMPUS CLUE CHASE',
    tagline: 'Decode campus riddles, sprint between hidden checkpoints, and claim the fastest completion.',
    division: 'boys_and_girls',
    playerFormat: 'Solo Entry',
    matchFormat: 'TIMED CLUE CHECKPOINTS',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 400,
    girlsFee: 400,
    isTeam: false,
    rulesOverview: 'All clues must be verified sequentially at marshal desks. Fastest verified completion wins.',
    venueNote: 'Old Campus Grounds',
    accentColor: '#F59E0B',
    iconKey: 'target',
    image: 'https://images.unsplash.com/photo-1543956228-f38027e0c61f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '1-vs-1-penalty',
    name: '1 vs 1 Penalty',
    category: 'track',
    categoryLabel: 'Track & Field',
    headline: 'FROM 12 YARDS',
    tagline: 'Striker versus Goalkeeper psychological duel from 12 yards out.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 vs 1)',
    matchFormat: 'BEST OF 5 KICKS',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    rulesOverview: 'Best of 5 penalties. Sudden death kicks if tied after 5 rounds.',
    venueNote: 'Penalty Box Arena',
    accentColor: '#12E2C4',
    iconKey: 'football',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  },

  // --- FUN GAMES (9) ---
  {
    id: 'rifle-shooting',
    name: 'Rifle Shooting',
    category: 'fun',
    categoryLabel: 'Fun Games',
    headline: '10-METER PRECISION',
    tagline: 'Breathing control, trigger squeeze, and 10-meter precision paper targets.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 Shooter)',
    matchFormat: '5 SCORING SHOTS',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 150,
    girlsFee: 150,
    isTeam: false,
    rulesOverview: '.177 caliber air rifle. Bench rest position. 5 shots evaluated by target score.',
    venueNote: 'Firing Range Zone',
    accentColor: '#3B82F6',
    iconKey: 'crosshair',
    image: 'https://images.unsplash.com/photo-1700774607140-37bd97c94d80?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'arm-wrestling',
    name: 'Arm Wrestling',
    category: 'fun',
    categoryLabel: 'Fun Games',
    headline: 'THE HOOK & TOP-ROLL',
    tagline: 'Top-roll, hook, and raw tendon strength on the official arm-wrestling table.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 vs 1)',
    matchFormat: 'WEIGHT DIVISION BRACKET',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    rulesOverview: 'Referees monitor elbow pad contact and shoulder alignment.',
    venueNote: 'Central Stage Arena',
    accentColor: '#F59E0B',
    iconKey: 'bicep',
    image: 'https://images.unsplash.com/photo-1780295788839-cf987c493b4b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'squid-game',
    name: 'Squid Game',
    category: 'fun',
    categoryLabel: 'Fun Games',
    headline: 'ZERO MOTION SENSOR',
    tagline: 'Sensory reflex obstacle course inspired by viral competitive survival games.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 Competitor)',
    matchFormat: 'ELIMINATION COURSE',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    rulesOverview: 'Freeze on red light audio signal. Any movement triggers elimination.',
    venueNote: 'Indoor Sports Arena',
    accentColor: '#F068B1',
    iconKey: 'target',
    image: 'https://images.unsplash.com/photo-1607468103349-00fafe69117c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pucket',
    name: 'Pucket',
    category: 'fun',
    categoryLabel: 'Fun Games',
    headline: 'ELASTIC SLING SPEED',
    tagline: 'Fast-paced wooden puck slinging through the narrow center gate.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 vs 1)',
    matchFormat: 'BEST OF 5 ROUNDS',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    rulesOverview: 'Clear all pucks from your half of the board using the elastic band launcher.',
    venueNote: 'Activity Lounge',
    accentColor: '#12E2C4',
    iconKey: 'disc',
    image: '/images/games/pucket.avif',
  },
  {
    id: 'gol-gappay-eating-challenge',
    name: 'Gol Gappay Eating Challenge',
    category: 'fun',
    categoryLabel: 'Fun Games',
    headline: '3-MINUTE FEAST',
    tagline: 'The ultimate culinary speed test. Down the most spicy gol gappay in 3 minutes.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 Competitor)',
    matchFormat: '3-MIN TIMER',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 300,
    girlsFee: 300,
    isTeam: false,
    featured: true,
    featuredLayout: 'standard',
    rulesOverview: '3-minute timer. Full consumption verification by judges before count increments.',
    venueNote: 'Student Cafeteria Stage',
    accentColor: '#F59E0B',
    iconKey: 'flame',
    image: 'https://images.unsplash.com/photo-1653850280260-aa3b9e00b230?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'uno',
    name: 'UNO',
    category: 'fun',
    categoryLabel: 'Fun Games',
    headline: 'WILD CARD WARFARE',
    tagline: 'Wild cards, Draw-fours, color shifts, and card-shedding campus warfare.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 Player)',
    matchFormat: 'STACKING DRAW RULES',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    rulesOverview: 'Standard tournament deck rules. Stacking Draw-twos permitted.',
    venueNote: 'Activity Lounge',
    accentColor: '#E63946',
    iconKey: 'dice',
    image: '/images/games/uno.avif',
  },
  {
    id: 'jenga',
    name: 'Jenga',
    category: 'fun',
    categoryLabel: 'Fun Games',
    headline: 'STEADY HAND PRESSURE',
    tagline: 'Steady hands, structural physics, and heart-stopping tension block pulls.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 vs 1)',
    matchFormat: 'ONE-HAND SUDDEN DEATH',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    rulesOverview: 'One-hand-only rule. Block must be placed on top level before next turn starts.',
    venueNote: 'Activity Lounge',
    accentColor: '#F59E0B',
    iconKey: 'trophy',
    image: 'https://images.unsplash.com/photo-1619261529873-3c4cc299d23d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'chess',
    name: 'Chess',
    category: 'fun',
    categoryLabel: 'Fun Games',
    headline: 'THE GRANDMASTER CLASH',
    tagline: '10+0 Blitz & Rapid classical formats under digital clocks. Precision calculation with no room for error.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 vs 1)',
    matchFormat: 'FIDE 10+0 BLITZ',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    featured: true,
    featuredLayout: 'tall',
    rulesOverview: 'FIDE standard blitz rules on digital chess clocks. Touch-move strictly enforced by arbiters.',
    venueNote: 'Library Quiet Hall A',
    accentColor: '#12E2C4',
    iconKey: 'chess',
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'rubiks-cube',
    name: "Rubik's Cube",
    category: 'fun',
    categoryLabel: 'Fun Games',
    headline: 'SUB-15 ALGORITHMS',
    tagline: '3x3x3 algorithm execution, fingertricks, and sub-15 second solutions.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 Speedcuber)',
    matchFormat: 'WCA STACKMAT TIMER',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 200,
    girlsFee: 200,
    isTeam: false,
    rulesOverview: 'WCA regulation scrambles with 15-second inspection timer on Stackmat timers.',
    venueNote: 'Tech Lounge',
    accentColor: '#3B82F6',
    iconKey: 'dice',
    image: 'https://images.unsplash.com/photo-1591991731833-b4807cf7ef94?auto=format&fit=crop&w=800&q=80',
  },

  // --- E-SPORTS ARENA (7) ---
  {
    id: 'pubg',
    name: 'Pubg',
    category: 'esports',
    categoryLabel: 'E-Sports Arena',
    headline: '4 V 4 ARENA',
    tagline: '4 v 4 tactical battle royale custom rooms and clutch chicken dinner finishes.',
    division: 'boys_and_girls',
    playerFormat: '4 v 4',
    matchFormat: '4 V 4 CUSTOM ROOM',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 150,
    girlsFee: 150,
    isTeam: false,
    featured: true,
    featuredLayout: 'wide',
    rulesOverview: '4 v 4 custom room matches. Placement + Kills determine round advancement.',
    venueNote: 'Esports Mobile Stage',
    accentColor: '#F59E0B',
    iconKey: 'crosshair',
    image: 'https://images.unsplash.com/photo-1685578437686-a3240b85aaee?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'call-of-duty-mobile',
    name: 'Call of Duty Mobile',
    category: 'esports',
    categoryLabel: 'E-Sports Arena',
    headline: 'SEARCH & DESTROY',
    tagline: 'Multiplayer Search & Destroy tactical gunplay on competitive tournament rule-sets.',
    division: 'boys_and_girls',
    playerFormat: 'Solo Entry',
    matchFormat: 'S&D COMPETITIVE',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 150,
    girlsFee: 150,
    isTeam: false,
    rulesOverview: 'Competitive S&D rules. Banned operator skills and scorestreaks per tournament rules.',
    venueNote: 'Esports Mobile Stage',
    accentColor: '#F59E0B',
    iconKey: 'crosshair',
    image: 'https://images.unsplash.com/photo-1564049489314-60d154ff107d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'blur-racing',
    name: 'Blur (Racing)',
    category: 'esports',
    categoryLabel: 'E-Sports Arena',
    headline: 'POWER-UP DRIFTING',
    tagline: '1 v 1 power-up tactical racing, bolt shots, shields, and high-speed drifting.',
    division: 'boys_and_girls',
    playerFormat: '1 v 1',
    matchFormat: '1 V 1 LAN RACING',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 150,
    girlsFee: 150,
    isTeam: false,
    rulesOverview: '1 v 1 LAN lobby on preset circuits. First across the finish line advances.',
    venueNote: 'Computer Lab 3 LAN Arena',
    accentColor: '#E63946',
    iconKey: 'gamepad',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'subway-surfer',
    name: 'Subway Surfer',
    category: 'esports',
    categoryLabel: 'E-Sports Arena',
    headline: 'INFINITE RUN MULTIPLIER',
    tagline: 'Single run infinite runner arcade challenge for the highest multiplier score.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 Player)',
    matchFormat: 'SINGLE RUN SCORE',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 150,
    girlsFee: 150,
    isTeam: false,
    rulesOverview: 'Official tournament device. Default multiplier. Single life per entry.',
    venueNote: 'Gaming Zone Desk',
    accentColor: '#12E2C4',
    iconKey: 'gamepad',
    image: '/images/games/subway-surfers.avif',
  },
  {
    id: 'piano-tiles',
    name: 'Piano Tiles',
    category: 'esports',
    categoryLabel: 'E-Sports Arena',
    headline: 'MAX BPM TAPS',
    tagline: 'Insane BPM tile taps without hitting white or missing a beat.',
    division: 'boys_and_girls',
    playerFormat: 'Solo (1 Player)',
    matchFormat: 'MASTER TEMPO RUN',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 150,
    girlsFee: 150,
    isTeam: false,
    rulesOverview: 'Song played at Master speed setting. Highest tile count logged on official tablet.',
    venueNote: 'Gaming Zone Desk',
    accentColor: '#3B82F6',
    iconKey: 'gamepad',
    image: '/images/games/piano-tiles.avif',
  },
  {
    id: 'tekken',
    name: 'Tekken',
    category: 'esports',
    categoryLabel: 'E-Sports Arena',
    headline: 'IRON FIST ARENA',
    tagline: '1 v 1 • 3 Rounds heat system combos, frame-data punishes, and stage breaks.',
    division: 'boys_and_girls',
    playerFormat: '1 v 1',
    matchFormat: '1 V 1 • 3 ROUNDS',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 300,
    girlsFee: 300,
    isTeam: false,
    featured: true,
    featuredLayout: 'tall',
    rulesOverview: '1 v 1 knockout bracket, 3 rounds per match. Default stage selection rules.',
    venueNote: 'Esports Center Stage (PS5 Lounge)',
    accentColor: '#E63946',
    iconKey: 'combat',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'fifa',
    name: 'Fifa',
    category: 'esports',
    categoryLabel: 'E-Sports Arena',
    headline: 'THE CONSOLE FOOTBALL DERBY',
    tagline: '1 v 1 • 4 Min Half console soccer under stage floodlights with clutch 90th minute winners.',
    division: 'boys_and_girls',
    playerFormat: '1 v 1',
    matchFormat: '1 V 1 • 4 MIN HALF',
    boysPlayers: 1,
    girlsPlayers: 1,
    boysFee: 300,
    girlsFee: 300,
    isTeam: false,
    featured: true,
    featuredLayout: 'hero',
    rulesOverview: 'Console 1 v 1. 4-minute halves, Tactical Defending, Club teams only. Extra time + penalties in knockout.',
    venueNote: 'Esports Center Stage (PS5 Lounge)',
    accentColor: '#12E2C4',
    iconKey: 'gamepad',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  },
];

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeCategory(cat: string | undefined | null, fallbackName: string): SportCategory {
  if (cat === 'team' || cat === 'indoor' || cat === 'track' || cat === 'fun' || cat === 'esports') {
    return cat;
  }
  const lower = fallbackName.toLowerCase();
  if (/(pubg|cod|call of duty|blur|subway|piano|tekken|fifa|esport)/.test(lower)) return 'esports';
  if (/(race|plank|rope|laser|scavenger|penalty|100m|relay)/.test(lower)) return 'track';
  if (/(badminton|table tennis|carrom|ludo|foosball|dart)/.test(lower)) return 'indoor';
  if (/(cricket|football|basketball|handball|volley|kabbadi|kabaddi|tug of war|frisbee)/.test(lower)) return 'team';
  return 'fun';
}

function buildPlayerFormat(boysPlayers?: number, girlsPlayers?: number): string {
  const b = boysPlayers ?? 1;
  const g = girlsPlayers ?? 1;
  if (b <= 1 && g <= 1) return 'Solo (1 Player)';
  if (b === 2 && g === 2) return 'Doubles (2 Players)';
  if (boysPlayers && girlsPlayers && boysPlayers !== girlsPlayers) {
    return `♂ ${boysPlayers} Players | ♀ ${girlsPlayers} Players`;
  }
  if (boysPlayers && !girlsPlayers) return `${boysPlayers} Players per Team`;
  if (girlsPlayers && !boysPlayers) return `${girlsPlayers} Players per Team`;
  return `${Math.max(b, g)} Players per Team`;
}

/**
 * Merge live database games (`GET /api/games`) with static catalog metadata so any
 * game name, price, player count, addition, or deletion done in Admin Settings
 * immediately reflects across the entire public website.
 */
export function mergeLiveGamesWithCatalog(liveRows: GamePrice[]): GameInfo[] {
  if (!Array.isArray(liveRows) || liveRows.length === 0) {
    return GAMES_DATA;
  }

  return liveRows.map((row) => {
    const exactMatch = GAMES_DATA.find(
      (g) => g.name.toLowerCase() === row.name.toLowerCase() || g.id === slugify(row.name)
    );

    const hasBoys = row.boys !== null && row.boys !== undefined;
    const hasGirls = row.girls !== null && row.girls !== undefined;
    const division: GameInfo['division'] =
      hasBoys && hasGirls ? 'boys_and_girls' : hasBoys ? 'boys_only' : 'girls_only';

    const boysPlayers = hasBoys ? (row.boysPlayers ?? exactMatch?.boysPlayers ?? 1) : undefined;
    const girlsPlayers = hasGirls ? (row.girlsPlayers ?? exactMatch?.girlsPlayers ?? 1) : undefined;
    const maxPlayers = Math.max(boysPlayers ?? 1, girlsPlayers ?? 1);
    const category = normalizeCategory(row.category ?? exactMatch?.category, row.name);
    const categoryLabel = CATEGORY_LABELS[category];

    return {
      id: exactMatch?.id ?? slugify(row.name),
      name: row.name,
      category,
      categoryLabel,
      headline: exactMatch?.headline ?? row.name.toUpperCase(),
      tagline:
        exactMatch?.tagline ??
        `Official Mini Olympics 2026 ${categoryLabel.toLowerCase()} competition for ${row.name}.`,
      division,
      playerFormat:
        exactMatch &&
        exactMatch.boysPlayers === boysPlayers &&
        exactMatch.girlsPlayers === girlsPlayers
          ? exactMatch.playerFormat
          : buildPlayerFormat(boysPlayers, girlsPlayers),
      matchFormat: exactMatch?.matchFormat ?? 'TOURNAMENT BRACKET',
      boysPlayers,
      girlsPlayers,
      boysFee: hasBoys ? Number(row.boys) : undefined,
      girlsFee: hasGirls ? Number(row.girls) : undefined,
      isTeam: maxPlayers > 1,
      featured: exactMatch?.featured ?? false,
      featuredLayout: exactMatch?.featuredLayout,
      rulesOverview:
        exactMatch?.rulesOverview ??
        `Standard FCIT Sports Society tournament regulations apply for ${row.name}.`,
      venueNote: exactMatch?.venueNote ?? 'PUCIT Old Campus Arena',
      accentColor: exactMatch?.accentColor ?? '#12E2C4',
      iconKey: exactMatch?.iconKey ?? 'trophy',
      image: exactMatch?.image ?? DEFAULT_FALLBACK_IMAGE,
    };
  });
}

export function getGameById(id: string): GameInfo | undefined {
  return GAMES_DATA.find((g) => g.id === id || g.name.toLowerCase() === id.toLowerCase());
}

export function getGamesByCategory(category: SportCategory): GameInfo[] {
  return GAMES_DATA.filter((g) => g.category === category);
}

export function getFeaturedGames(): GameInfo[] {
  return GAMES_DATA.filter((g) => g.featured);
}

export type DivisionFilter =
  | 'all'
  | 'boys_and_girls'
  | 'boys_only'
  | 'girls_only';

export type TeamSizeFilter = 'all' | 'solo' | 'duo' | 'squad';

export type SortOption = 'default' | 'name_asc' | 'fee_asc' | 'fee_desc' | 'players_desc';

const CATEGORY_ORDER_INDEX = new Map(CATEGORIES.map((c, idx) => [c.id, idx]));

/** Sort games according to the curated CATEGORIES order, preserving relative order inside each category. */
export function sortByCategoryOrder(games: GameInfo[]): GameInfo[] {
  return [...games].sort(
    (a, b) =>
      (CATEGORY_ORDER_INDEX.get(a.category) ?? 99) -
      (CATEGORY_ORDER_INDEX.get(b.category) ?? 99)
  );
}

/** Check whether a game matches the selected division filter. */
export function matchesDivisionFilter(game: GameInfo, division: DivisionFilter): boolean {
  if (division === 'all') return true;
  return game.division === division;
}

/** Return the maximum player count per side for a game. */
export function getMaxPlayers(game: GameInfo): number {
  return Math.max(game.boysPlayers ?? 1, game.girlsPlayers ?? 1);
}

/** Check whether a game matches the selected team size filter. */
export function matchesTeamSizeFilter(game: GameInfo, size: TeamSizeFilter): boolean {
  if (size === 'all') return true;
  const maxPlayers = getMaxPlayers(game);
  if (size === 'solo') return maxPlayers <= 1;
  if (size === 'duo') return maxPlayers === 2;
  return maxPlayers >= 3;
}

/** Return the minimum non-null entry fee for sorting/display. */
export function getLowestFee(game: GameInfo): number {
  const fees = [game.boysFee, game.girlsFee].filter((f): f is number => typeof f === 'number');
  return fees.length > 0 ? Math.min(...fees) : 0;
}

/** Compact division badge label for cards and modals. */
export function getDivisionLabel(division: GameInfo['division']): string {
  if (division === 'boys_and_girls') return 'Boys & Girls';
  if (division === 'boys_only') return 'Boys Only';
  return 'Girls Only';
}

/** Compact player-count summary string (e.g. "♂ 8p · ♀ 5p" or "1p"). */
export function getCompactPlayerLabel(game: GameInfo): string {
  const b = game.boysPlayers;
  const g = game.girlsPlayers;
  if (b && g && b !== g) return `♂ ${b}p · ♀ ${g}p`;
  const count = b ?? g ?? 1;
  return `${count}p`;
}

const PRICING_ALIASES: Record<string, string> = {
  'tape ball cricket': 'Cricket',
  'football championship': 'Football',
  'volleyball spike': 'Volley Ball',
  'kabaddi championship': 'Kabbadi',
  'kabaddi': 'Kabbadi',
  'ultimate frisbee': 'Frisbee',
  'darts singles': 'Dart Singles',
  'darts singles (501)': 'Dart Singles',
  'darts doubles': 'Dart Doubles',
  '100m sprint dash': '100m Race',
  '4x100m baton relay': 'Relay Race',
  '3 legged race': '3 Leg Race',
  'egg & spoon relay': 'Egg Relay Race',
  'rope jump sprint': 'Rope Jump',
  'plank endurance test': 'Plank',
  '1v1 penalty shootout': '1 vs 1 Penalty',
  'air rifle target shooting': 'Rifle Shooting',
  'red light green light': 'Squid Game',
  'pucket fast-track': 'Pucket',
  'gol gappay challenge': 'Gol Gappay Eating Challenge',
  'uno championship': 'UNO',
  'jenga tower challenge': 'Jenga',
  'championship chess': 'Chess',
  "rubik's speedcubing": "Rubik's Cube",
  'pubg mobile': 'Pubg',
  'pubg mobile championship': 'Pubg',
  'call of duty: mobile': 'Call of Duty Mobile',
  'blur pc racing': 'Blur (Racing)',
  'subway surfers high score': 'Subway Surfer',
  'piano tiles reflex test': 'Piano Tiles',
  'tekken 8 tournament': 'Tekken',
  'ea sports fc / fifa 24': 'Fifa',
};

/** Resolve a catalog game name or id to a matching pricing entry name. */
export function resolvePricingName(input: string, availableNames: string[]): string | null {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;

  const exact = availableNames.find((n) => n.toLowerCase() === normalized);
  if (exact) return exact;

  const aliasTarget = PRICING_ALIASES[normalized];
  if (aliasTarget) {
    const aliased = availableNames.find((n) => n.toLowerCase() === aliasTarget.toLowerCase());
    if (aliased) return aliased;
  }

  const contains = availableNames.find(
    (n) => normalized.includes(n.toLowerCase()) || n.toLowerCase().includes(normalized)
  );
  return contains ?? null;
}
