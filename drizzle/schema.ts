import { pgTable, text, timestamp, uuid, boolean, index } from 'drizzle-orm/pg-core';
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
