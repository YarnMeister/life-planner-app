import fs from 'fs';
import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

// Load local env only when a .env.local file exists (local dev). Do not force in CI/Vercel.
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
}

const url =
  process.env.PROD_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.VERCEL_POSTGRES_URL ||
  '';

if (!url) {
  throw new Error(
    'DATABASE_URL is not set. Configure a Production env var in Vercel or provide .env.local for local dev.'
  );
}

// Reject mock URLs for drizzle-kit operations
if (url === 'mock' || url.startsWith('mock://')) {
  throw new Error(
    'Mock database URLs are not supported for drizzle-kit operations (generate/migrate).\n' +
    'Please set DATABASE_URL to a real PostgreSQL connection string.\n' +
    'The mock database is only for runtime development, not for schema management.'
  );
}

// Next.js compatible Drizzle configuration
// Works with both Next.js server runtime and standalone scripts
export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url,
  },
} satisfies Config;
