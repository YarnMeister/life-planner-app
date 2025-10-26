import { z } from 'zod';

/**
 * Server-side environment variables schema
 * These variables should NEVER be exposed to the client
 */
const serverSchema = z.object({
  // Database (can be 'mock' or 'mock://' for in-memory testing)
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').refine(
    (url) => url === 'mock' || url.startsWith('mock://') || url.startsWith('postgresql://') || url.startsWith('postgres://'),
    { message: 'DATABASE_URL must be a PostgreSQL URL or "mock" for testing' }
  ),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  
  // Email (Resend) - Optional in dev/test with bypass
  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().email('FROM_EMAIL must be a valid email').default('noreply@example.com'),
  
  // Development/Test Bypass (NEVER use in production)
  DEV_BYPASS_CODE: z.string().optional(),
  DEV_TEST_EMAIL: z.string().email().optional(),
  
  // Auth configuration (optional with defaults)
  AUTH_RATE_LIMIT_WINDOW_MS: z.string().default('300000'),
  AUTH_RATE_LIMIT_MAX: z.string().default('3'),
  AUTH_CODE_TTL_MINUTES: z.string().default('10'),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Vercel (optional)
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
  PROD_DATABASE_URL: z.string().url().optional(),
  POSTGRES_URL: z.string().url().optional(),
  VERCEL_POSTGRES_URL: z.string().url().optional(),
}).refine((data) => {
  // In production, RESEND_API_KEY is required
  if (data.NODE_ENV === 'production' && !data.RESEND_API_KEY) {
    return false;
  }
  // DEV_BYPASS_CODE should NEVER be used in production
  if (data.NODE_ENV === 'production' && data.DEV_BYPASS_CODE) {
    throw new Error('DEV_BYPASS_CODE must not be set in production!');
  }
  return true;
}, {
  message: 'RESEND_API_KEY is required in production',
});

/**
 * Client-side environment variables schema
 * These variables are prefixed with NEXT_PUBLIC_ and safe to expose
 */
const clientSchema = z.object({
  // Add any NEXT_PUBLIC_ variables here as needed
  // NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

/**
 * Server environment variables
 * Only accessible on the server side
 */
export const serverEnv = serverSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL || process.env.PROD_DATABASE_URL || process.env.POSTGRES_URL || process.env.VERCEL_POSTGRES_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  FROM_EMAIL: process.env.FROM_EMAIL,
  DEV_BYPASS_CODE: process.env.DEV_BYPASS_CODE,
  DEV_TEST_EMAIL: process.env.DEV_TEST_EMAIL,
  AUTH_RATE_LIMIT_WINDOW_MS: process.env.AUTH_RATE_LIMIT_WINDOW_MS,
  AUTH_RATE_LIMIT_MAX: process.env.AUTH_RATE_LIMIT_MAX,
  AUTH_CODE_TTL_MINUTES: process.env.AUTH_CODE_TTL_MINUTES,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
  PROD_DATABASE_URL: process.env.PROD_DATABASE_URL,
  POSTGRES_URL: process.env.POSTGRES_URL,
  VERCEL_POSTGRES_URL: process.env.VERCEL_POSTGRES_URL,
});

/**
 * Helper to check if dev bypass mode is enabled
 * Only works in development/test, never in production
 */
export function isDevBypassEnabled(): boolean {
  return (
    (serverEnv.NODE_ENV === 'development' || serverEnv.NODE_ENV === 'test') &&
    !!serverEnv.DEV_BYPASS_CODE
  );
}

/**
 * Get the dev bypass code if enabled
 */
export function getDevBypassCode(): string | null {
  return isDevBypassEnabled() ? serverEnv.DEV_BYPASS_CODE! : null;
}

/**
 * Get the dev test email if set
 */
export function getDevTestEmail(): string | null {
  return isDevBypassEnabled() && serverEnv.DEV_TEST_EMAIL 
    ? serverEnv.DEV_TEST_EMAIL 
    : null;
}

/**
 * Client environment variables
 * Safe to use in client components
 */
export const clientEnv = clientSchema.parse({
  // Add client env vars here
});

// Type exports
export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

