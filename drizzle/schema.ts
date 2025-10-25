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
  emailIdx: index('auth_codes_email_idx').on(table.email),
  ipIdx: index('auth_codes_ip_idx').on(table.ipAddress),
}));
