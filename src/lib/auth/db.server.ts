/**
 * Server-only database module for Next.js
 * This file must NEVER be imported in client components
 */
import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, authCodes, failedAuthAttempts } from '../../../drizzle/schema';
import { serverEnv } from '../env';
import { mockDb, isMockDbEnabled } from './db.mock';

// Use validated env from centralized config
const DATABASE_URL = serverEnv.DATABASE_URL;

// Check if we should use mock database
const useMockDb = isMockDbEnabled();

let db: any;

if (useMockDb) {
  // Use mock database for development without real DB
  if (process.env.NODE_ENV !== 'production') {
    console.log('🗄️  Using MOCK DATABASE (in-memory storage)');
  }
  db = mockDb as any;
} else {
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
  db = drizzle(sql);
}

/**
 * Database client instance
 * Uses mock DB if DATABASE_URL starts with 'mock://' or is 'mock'
 * Otherwise uses real Neon database
 */
export { db };

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

