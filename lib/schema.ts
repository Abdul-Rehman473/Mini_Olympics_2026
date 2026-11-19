import { pgTable, text, timestamp, varchar, boolean, integer } from 'drizzle-orm/pg-core';

export const registrations = pgTable('registrations', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  rollNumber: varchar('roll_number', { length: 50 }).notNull(),
  department: varchar('department', { length: 100 }).notNull(),
  semester: varchar('semester', { length: 20 }).notNull(),
  contactNumber: varchar('contact_number', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  sport: varchar('sport', { length: 100 }).notNull(),
  esportsSubcategory: varchar('esports_subcategory', { length: 100 }),
  paymentMethod: varchar('payment_method', { length: 20 }).notNull(), // 'cash' or 'online'
  slipId: varchar('slip_id', { length: 50 }),
  transactionId: varchar('transaction_id', { length: 255 }),
  screenshotUrl: text('screenshot_url'),
  status: varchar('status', { length: 50 }).notNull().default('pending_cash'), // 'pending_cash', 'pending_online', 'paid', 'rejected'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const esportsSettings = pgTable('esports_settings', {
  id: text('id').primaryKey().default('1'),
  isOpen: boolean('is_open').default(true).notNull(),
  openDate: timestamp('open_date'),
  closeDate: timestamp('close_date'),
  announcement: text('announcement'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const adminSessions = pgTable('admin_sessions', {
  id: text('id').primaryKey(),
  sessionToken: text('session_token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  adminUserId: text('admin_user_id'),
  role: text('role'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const permissions = pgTable('permissions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  pageKey: text('page_key').notNull(),
  canView: boolean('can_view').default(true).notNull(),
  canEdit: boolean('can_edit').default(false).notNull(),
  canDelegate: boolean('can_delegate').default(false).notNull(),
  grantedBy: text('granted_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const coordinatorMatches = pgTable('coordinator_matches', {
  id: text('id').primaryKey(),
  gameName: varchar('game_name', { length: 100 }).notNull(),
  gender: varchar('gender', { length: 10 }).notNull(),
  roundName: varchar('round_name', { length: 100 }).notNull().default('Round 1'),
  matchNumber: integer('match_number').notNull().default(1),
  player1Name: varchar('player1_name', { length: 255 }).notNull(),
  player1RegId: text('player1_reg_id'),
  player1Roll: varchar('player1_roll', { length: 50 }),
  player1Contact: varchar('player1_contact', { length: 30 }),
  player2Name: varchar('player2_name', { length: 255 }).notNull(),
  player2RegId: text('player2_reg_id'),
  player2Roll: varchar('player2_roll', { length: 50 }),
  player2Contact: varchar('player2_contact', { length: 30 }),
  scheduledDate: varchar('scheduled_date', { length: 50 }),
  scheduledTime: varchar('scheduled_time', { length: 120 }),
  venue: varchar('venue', { length: 150 }),
  status: varchar('status', { length: 30 }).notNull().default('scheduled'),
  winnerName: varchar('winner_name', { length: 255 }),
  scoreSummary: varchar('score_summary', { length: 255 }),
  notes: text('notes'),
  coordinatorId: text('coordinator_id'),
  coordinatorUsername: text('coordinator_username'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;
export type EsportsSettings = typeof esportsSettings.$inferSelect;
export type UserPermission = typeof permissions.$inferSelect;
export type CoordinatorMatch = typeof coordinatorMatches.$inferSelect;
