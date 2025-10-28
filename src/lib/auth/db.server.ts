/**
 * Server-only database module for Next.js
 * This file must NEVER be imported in client components
 */
import 'server-only';

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../../../drizzle/schema';
import { users, authCodes, failedAuthAttempts, planningDoc } from '../../../drizzle/schema';
import { serverEnv } from '../env';
import { mockDb, isMockDbEnabled } from './db.mock';

// Use validated env from centralized config
const DATABASE_URL = serverEnv.DATABASE_URL;

// Check if we should use mock database
const useMockDb = isMockDbEnabled();

let db: any;

if (useMockDb) {
  // Use mock database for development without real DB
  console.log('🗄️  Using MOCK DATABASE (in-memory storage)');
  console.log('🗄️  DATABASE_URL:', DATABASE_URL);
  db = mockDb as any;
} else {
  // Configure WebSocket for Neon serverless (required for transactions)
  neonConfig.webSocketConstructor = ws;

  // Create Neon serverless connection with WebSocket support for transactions
  console.log('🗄️  Using REAL DATABASE with WebSocket (transactions enabled)');
  console.log('🗄️  DATABASE_URL:', DATABASE_URL.replace(/:[^:@]+@/, ':****@')); // Redact password

  const pool = new Pool({ connectionString: DATABASE_URL });

  /**
   * Database client instance
   * Exported as a singleton to prevent connection leaks in development
   * Pass schema to enable query API
   * Uses WebSocket driver for transaction support
   */
  db = drizzle(pool, { schema });
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
export { users, authCodes, failedAuthAttempts, planningDoc };

/**
 * Type exports for use in server components and API routes
 */
export type User = typeof users.$inferSelect;
export type AuthCode = typeof authCodes.$inferSelect;
export type FailedAuthAttempt = typeof failedAuthAttempts.$inferSelect;

