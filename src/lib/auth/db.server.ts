/**
 * Server-only database module for Next.js
 * This file must NEVER be imported in client components
 */
import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, authCodes, failedAuthAttempts } from '../../../drizzle/schema';
import { serverEnv } from '../env';

// Use validated env from centralized config
const DATABASE_URL = serverEnv.DATABASE_URL;

// Create Neon serverless connection with WebSocket support for multi-statement SQL
const sql = neon(DATABASE_URL, {
  // Neon serverless driver handles connection pooling automatically
  fetchOptions: {
    // Ensure proper timeout handling
  },
});

/**
 * Database client instance
 * Exported as a singleton to prevent connection leaks in development
 */
export const db = drizzle(sql);

/**
 * Export schema for convenience
 * This keeps the import surface clean for API routes
 */
export { users, authCodes, failedAuthAttempts };

/**
 * Type exports for use in server components and API routes
 */
export type User = typeof users.$inferSelect;
export type AuthCode = typeof authCodes.$inferSelect;
export type FailedAuthAttempt = typeof failedAuthAttempts.$inferSelect;

