import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { eq, and, gte } from 'drizzle-orm';
import { db, authCodes, users } from '../../src/lib/auth/db';
import { generateAuthCode } from '../../src/lib/auth/jwt';
import { sendAuthCode } from '../../src/lib/auth/email';

const requestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX = 3; // Maximum requests per window

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { email } = requestSchema.parse(req.body);

    // Check rate limiting
    const fiveMinutesAgo = new Date(Date.now() - RATE_LIMIT_WINDOW);
    const recentCodes = await db
      .select()
      .from(authCodes)
      .where(
        and(
          eq(authCodes.email, email),
          gte(authCodes.createdAt, fiveMinutesAgo)
        )
      );

    if (recentCodes.length >= RATE_LIMIT_MAX) {
      return res.status(429).json({
        error: 'Too many requests. Please wait before requesting another code.'
      });
    }

    // Generate new auth code
    const code = generateAuthCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store auth code
    await db.insert(authCodes).values({
      email,
      code,
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

