import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, authCodes, failedAuthAttempts } from '../../../drizzle/schema';

// Get database URL from environment (server-side only)
const DATABASE_URL = process.env.DATABASE_URL || process.env.PROD_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required for authentication');
}

// Create database connection
const sql = neon(DATABASE_URL);
export const db = drizzle(sql);

// Export schema for convenience
export { users, authCodes, failedAuthAttempts };

