-- Create sequence for auto-incrementing registration numbers
CREATE SEQUENCE IF NOT EXISTS registration_number_seq START 1;

-- Create admin users table (for admin login)
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  assigned_games TEXT,
  assigned_gender TEXT DEFAULT 'both',
  created_by TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create permissions table (per-page access control)
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
);

-- Create coordinator matches table
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
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  registration_number INTEGER UNIQUE DEFAULT nextval('registration_number_seq'),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  roll_number VARCHAR(50) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  alternative_contact_number VARCHAR(20),
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('boys', 'girls')),
  selected_games TEXT NOT NULL, -- JSON array of selected games
  team_members TEXT, -- JSON object: { gameName: [{ name, rollNumber, contactNumber }] }
  total_amount DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0, -- Discount amount (e.g., 200)
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'online')),
  slip_id VARCHAR(50),
  transaction_id VARCHAR(255),
  screenshot_url TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending_cash' CHECK (status IN ('pending_cash', 'pending_online', 'paid', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create games_pricing table for reference
CREATE TABLE IF NOT EXISTS games_pricing (
  id SERIAL PRIMARY KEY,
  game_name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('boys', 'girls', 'both')),
  price DECIMAL(10, 2) NOT NULL,
  players INTEGER,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE(game_name, gender)
);

-- Insert 45 official PDF games pricing data
INSERT INTO games_pricing (game_name, gender, price, players, category) VALUES
-- Team Sports (Boys)
('Cricket', 'boys', 1600.00, 8, 'team'),
('Football', 'boys', 2200.00, 11, 'team'),
('Basketball Team', 'boys', 2200.00, 7, 'team'),
('Handball', 'boys', 1200.00, 6, 'team'),
('Volley Ball', 'boys', 1200.00, 6, 'team'),
('Kabbadi', 'boys', 500.00, 7, 'team'),
('Tug of War', 'boys', 600.00, 8, 'team'),
('Frisbee', 'boys', 250.00, 1, 'team'),
-- Team Sports (Girls)
('Cricket', 'girls', 1200.00, 5, 'team'),
('Football', 'girls', 1200.00, 6, 'team'),
('Basketball Team', 'girls', 2200.00, 7, 'team'),
('Handball', 'girls', 1200.00, 6, 'team'),
('Volley Ball', 'girls', 1200.00, 6, 'team'),
('Kabbadi', 'girls', 500.00, 7, 'team'),
('Tug of War', 'girls', 600.00, 8, 'team'),
('Frisbee', 'girls', 250.00, 1, 'team'),
-- Indoor & Table Games (Boys)
('Badminton Singles', 'boys', 200.00, 1, 'indoor'),
('Badminton Doubles', 'boys', 400.00, 2, 'indoor'),
('Table Tennis Singles', 'boys', 200.00, 1, 'indoor'),
('Table Tennis Doubles', 'boys', 400.00, 2, 'indoor'),
('Carrom Singles', 'boys', 150.00, 1, 'indoor'),
('Carrom Doubles', 'boys', 250.00, 2, 'indoor'),
('Ludo Singles', 'boys', 200.00, 1, 'indoor'),
('Ludo Doubles', 'boys', 300.00, 2, 'indoor'),
('Foosball Singles', 'boys', 150.00, 1, 'indoor'),
('Foosball Doubles', 'boys', 300.00, 2, 'indoor'),
('Dart Singles', 'boys', 150.00, 1, 'indoor'),
('Dart Doubles', 'boys', 300.00, 2, 'indoor'),
-- Indoor & Table Games (Girls)
('Badminton Singles', 'girls', 200.00, 1, 'indoor'),
('Badminton Doubles', 'girls', 400.00, 2, 'indoor'),
('Table Tennis Singles', 'girls', 200.00, 1, 'indoor'),
('Table Tennis Doubles', 'girls', 400.00, 2, 'indoor'),
('Carrom Singles', 'girls', 150.00, 1, 'indoor'),
('Carrom Doubles', 'girls', 250.00, 2, 'indoor'),
('Ludo Singles', 'girls', 200.00, 1, 'indoor'),
('Ludo Doubles', 'girls', 300.00, 2, 'indoor'),
('Foosball Singles', 'girls', 150.00, 1, 'indoor'),
('Foosball Doubles', 'girls', 300.00, 2, 'indoor'),
('Dart Singles', 'girls', 150.00, 1, 'indoor'),
('Dart Doubles', 'girls', 300.00, 2, 'indoor'),
-- Track & Field (Boys & Girls)
('100m Race', 'boys', 200.00, 1, 'track'),
('100m Race', 'girls', 200.00, 1, 'track'),
('Relay Race', 'boys', 200.00, 1, 'track'),
('Relay Race', 'girls', 200.00, 1, 'track'),
('3 Leg Race', 'boys', 200.00, 1, 'track'),
('3 Leg Race', 'girls', 200.00, 1, 'track'),
('Egg Relay Race', 'boys', 150.00, 1, 'track'),
('Egg Relay Race', 'girls', 150.00, 1, 'track'),
('Rope Jump', 'boys', 200.00, 1, 'track'),
('Rope Jump', 'girls', 200.00, 1, 'track'),
('Plank', 'boys', 150.00, 1, 'track'),
('Plank', 'girls', 150.00, 1, 'track'),
('Laser Run', 'boys', 300.00, 1, 'track'),
('Laser Run', 'girls', 300.00, 1, 'track'),
('Scavenger Hunt', 'boys', 400.00, 1, 'track'),
('Scavenger Hunt', 'girls', 400.00, 1, 'track'),
('1 vs 1 Penalty', 'boys', 200.00, 1, 'track'),
('1 vs 1 Penalty', 'girls', 200.00, 1, 'track'),
-- Fun Games (Boys & Girls)
('Rifle Shooting', 'boys', 150.00, 1, 'fun'),
('Rifle Shooting', 'girls', 150.00, 1, 'fun'),
('Arm Wrestling', 'boys', 200.00, 1, 'fun'),
('Arm Wrestling', 'girls', 200.00, 1, 'fun'),
('Squid Game', 'boys', 200.00, 1, 'fun'),
('Squid Game', 'girls', 200.00, 1, 'fun'),
('Pucket', 'boys', 200.00, 1, 'fun'),
('Pucket', 'girls', 200.00, 1, 'fun'),
('Gol Gappay Eating Challenge', 'boys', 300.00, 1, 'fun'),
('Gol Gappay Eating Challenge', 'girls', 300.00, 1, 'fun'),
('UNO', 'boys', 200.00, 1, 'fun'),
('UNO', 'girls', 200.00, 1, 'fun'),
('Jenga', 'boys', 200.00, 1, 'fun'),
('Jenga', 'girls', 200.00, 1, 'fun'),
('Chess', 'boys', 200.00, 1, 'fun'),
('Chess', 'girls', 200.00, 1, 'fun'),
('Rubik''s Cube', 'boys', 200.00, 1, 'fun'),
('Rubik''s Cube', 'girls', 200.00, 1, 'fun'),
-- E-Sports Arena (Boys & Girls)
('Pubg', 'boys', 150.00, 1, 'esports'),
('Pubg', 'girls', 150.00, 1, 'esports'),
('Call of Duty Mobile', 'boys', 150.00, 1, 'esports'),
('Call of Duty Mobile', 'girls', 150.00, 1, 'esports'),
('Blur (Racing)', 'boys', 150.00, 1, 'esports'),
('Blur (Racing)', 'girls', 150.00, 1, 'esports'),
('Subway Surfer', 'boys', 150.00, 1, 'esports'),
('Subway Surfer', 'girls', 150.00, 1, 'esports'),
('Piano Tiles', 'boys', 150.00, 1, 'esports'),
('Piano Tiles', 'girls', 150.00, 1, 'esports'),
('Tekken', 'boys', 300.00, 1, 'esports'),
('Tekken', 'girls', 300.00, 1, 'esports'),
('Fifa', 'boys', 300.00, 1, 'esports'),
('Fifa', 'girls', 300.00, 1, 'esports')
ON CONFLICT DO NOTHING;

-- Create esports_settings table
CREATE TABLE IF NOT EXISTS esports_settings (
  id TEXT PRIMARY KEY DEFAULT '1',
  is_open BOOLEAN DEFAULT true NOT NULL,
  open_date TIMESTAMP,
  close_date TIMESTAMP,
  announcement TEXT,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Insert default esports settings
INSERT INTO esports_settings (id, is_open, announcement)
VALUES ('1', true, '')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_method ON registrations(payment_method);
CREATE INDEX IF NOT EXISTS idx_registrations_registration_number ON registrations(registration_number);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_games_pricing_game_gender ON games_pricing(game_name, gender);
