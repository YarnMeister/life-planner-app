import { pgTable, text, timestamp, uuid, boolean, index, integer, enum as pgEnum, date, foreignKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Minimal placeholder schema for template consumers to extend
export const appExample = pgTable('app_example', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Authentication tables
export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}));

export const authCodes = pgTable('auth_codes', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').notNull(),
  code: text('code').notNull(), // Stores HMAC-SHA256 hash, not plaintext
  ipAddress: text('ip_address'), // For IP-based rate limiting
  expiresAt: timestamp('expires_at').notNull(),
  used: boolean('used').notNull().default(false),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
}, (table) => ({
  // Composite indexes for efficient rate-limit queries
  emailCreatedIdx: index('auth_codes_email_created_idx').on(table.email, table.createdAt),
  ipCreatedIdx: index('auth_codes_ip_created_idx').on(table.ipAddress, table.createdAt),
}));

// Track failed authentication attempts for proper lockout
export const failedAuthAttempts = pgTable('failed_auth_attempts', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').notNull(),
  ipAddress: text('ip_address').notNull(),
  attemptedAt: timestamp('attempted_at').notNull().default(sql`now()`),
}, (table) => ({
  emailAttemptedIdx: index('failed_attempts_email_attempted_idx').on(table.email, table.attemptedAt),
  ipAttemptedIdx: index('failed_attempts_ip_attempted_idx').on(table.ipAddress, table.attemptedAt),
}));

// ============================================================================
// LIFE PLANNER TABLES
// ============================================================================

// Enum types for Life Planner
export const pillarDomainEnum = pgEnum('pillar_domain', ['work', 'personal']);
export const timeEstimateEnum = pgEnum('time_estimate', ['15m', '30m', '1h', '2h+']);
export const impactEnum = pgEnum('impact', ['H', 'M', 'L']);
export const taskStatusEnum = pgEnum('task_status', ['open', 'done']);
export const taskTypeEnum = pgEnum('task_type', ['adhoc', 'recurring']);
export const recurrenceFrequencyEnum = pgEnum('recurrence_frequency', ['daily', 'weekly', 'monthly']);

// Pillars table - represents the 5 life pillars (Health, Finance, Social, Family, Work)
export const pillars = pgTable('pillars', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color').notNull(), // Hex color code (e.g., '#7C3AED')
  domain: pillarDomainEnum('domain').notNull().default('personal'),
  avgPercent: integer('avg_percent').notNull().default(0), // Computed from themes
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
}, (table) => ({
  userIdIdx: index('pillars_user_id_idx').on(table.userId),
  userIdNameIdx: index('pillars_user_id_name_idx').on(table.userId, table.name),
}));

// Themes table - represents themes within each pillar
export const themes = pgTable('themes', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  pillarId: uuid('pillar_id').notNull().references(() => pillars.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  ratingPercent: integer('rating_percent').notNull().default(50), // 0-100
  lastReflectionNote: text('last_reflection_note'),
  previousRating: integer('previous_rating'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
}, (table) => ({
  userIdIdx: index('themes_user_id_idx').on(table.userId),
  pillarIdIdx: index('themes_pillar_id_idx').on(table.pillarId),
  userIdPillarIdIdx: index('themes_user_id_pillar_id_idx').on(table.userId, table.pillarId),
}));

// Tasks table - represents individual tasks within themes
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  pillarId: uuid('pillar_id').notNull().references(() => pillars.id, { onDelete: 'cascade' }),
  themeId: uuid('theme_id').notNull().references(() => themes.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  timeEstimate: timeEstimateEnum('time_estimate'),
  impact: impactEnum('impact'),
  status: taskStatusEnum('status').notNull().default('open'),
  dueDate: date('due_date'),
  rank: integer('rank').notNull().default(0), // For ordering within theme
  notes: text('notes'),
  taskType: taskTypeEnum('task_type').notNull().default('adhoc'),
  recurrenceFrequency: recurrenceFrequencyEnum('recurrence_frequency'),
  recurrenceInterval: integer('recurrence_interval'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
}, (table) => ({
  userIdIdx: index('tasks_user_id_idx').on(table.userId),
  themeIdIdx: index('tasks_theme_id_idx').on(table.themeId),
  pillarIdIdx: index('tasks_pillar_id_idx').on(table.pillarId),
  userIdThemeIdIdx: index('tasks_user_id_theme_id_idx').on(table.userId, table.themeId),
  statusIdx: index('tasks_status_idx').on(table.status),
  userIdStatusIdx: index('tasks_user_id_status_idx').on(table.userId, table.status),
}));
