import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, authCodes } from '../../../drizzle/schema';

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL or VITE_DATABASE_URL environment variable is required');
}

// Create database connection
const sql = neon(DATABASE_URL);
export const db = drizzle(sql);

// Export schema for convenience
export { users, authCodes };

