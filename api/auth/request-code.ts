import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { eq, and, gte, or } from 'drizzle-orm';
import { db, authCodes, users } from '../../src/lib/auth/db';
import { generateAuthCode, hashAuthCode } from '../../src/lib/auth/jwt';
import { sendAuthCode } from '../../src/lib/auth/email';

const requestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Configurable via environment variables with sensible defaults
const RATE_LIMIT_WINDOW = parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '300000'); // 5 minutes
const RATE_LIMIT_MAX = parseInt(process.env.AUTH_RATE_LIMIT_MAX || '3');
const CODE_TTL = parseInt(process.env.AUTH_CODE_TTL_MINUTES || '10') * 60 * 1000;

// Helper to get client IP from Vercel request
function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket?.remoteAddress;
  return ip || 'unknown';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { email } = requestSchema.parse(req.body);
    const clientIp = getClientIp(req);

    // Check rate limiting (both email-based and IP-based)
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW);
    const recentCodes = await db
      .select()
      .from(authCodes)
      .where(
        and(
          or(
            eq(authCodes.email, email),
            eq(authCodes.ipAddress, clientIp)
          ),
          gte(authCodes.createdAt, windowStart)
        )
      );

    if (recentCodes.length >= RATE_LIMIT_MAX) {
      return res.status(429).json({
        error: 'Too many requests. Please wait before requesting another code.'
      });
    }

    // Generate new auth code (plaintext to send via email)
    const code = generateAuthCode();
    const expiresAt = new Date(Date.now() + CODE_TTL);

    // Hash the code before storing
    const codeHash = hashAuthCode(code, email);

    // Store hashed auth code with IP address
    await db.insert(authCodes).values({
      email,
      code: codeHash, // Store hash, not plaintext
      ipAddress: clientIp,
      expiresAt,
      used: false,
    });

    // Create user if doesn't exist (for first-time login)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length === 0) {
      await db.insert(users).values({
        email,
      });
    }

    // Send email
    await sendAuthCode({ email, code });

    return res.status(200).json({
      success: true,
      message: 'Authentication code sent to your email'
    });

  } catch (error) {
    console.error('Request code error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid email address'
      });
    }

    return res.status(500).json({
      error: 'Failed to send authentication code'
    });
  }
}

