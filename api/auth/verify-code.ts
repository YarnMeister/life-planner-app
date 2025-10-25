import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { eq, and, gte } from 'drizzle-orm';
import { db, authCodes, users } from '../../src/lib/auth/db';
import { signToken, verifyAuthCode } from '../../src/lib/auth/jwt';
import { serialize } from 'cookie';

const verifySchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Code must be 6 digits'),
});

// Maximum failed verification attempts before temporary lockout
const MAX_VERIFY_ATTEMPTS = 5;
const VERIFY_LOCKOUT_WINDOW = 15 * 60 * 1000; // 15 minutes

// Helper to get client IP
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
    const { email, code } = verifySchema.parse(req.body);
    const _clientIp = getClientIp(req); // Reserved for future IP-based verification logging

    // Check for verification attempt abuse (failed attempts)
    const lockoutStart = new Date(Date.now() - VERIFY_LOCKOUT_WINDOW);
    const recentAttempts = await db
      .select()
      .from(authCodes)
      .where(
        and(
          eq(authCodes.email, email),
          eq(authCodes.used, false),
          gte(authCodes.createdAt, lockoutStart)
        )
      );

    // If too many unused codes exist, someone is trying many codes
    if (recentAttempts.length >= MAX_VERIFY_ATTEMPTS) {
      return res.status(429).json({
        error: 'Too many failed attempts. Please wait 15 minutes or request a new code.'
      });
    }

    // Find valid auth codes for this email
    const validCodes = await db
      .select()
      .from(authCodes)
      .where(
        and(
          eq(authCodes.email, email),
          eq(authCodes.used, false),
          gte(authCodes.expiresAt, new Date()) // Not expired
        )
      );

    if (validCodes.length === 0) {
      return res.status(400).json({
        error: 'Invalid or expired authentication code'
      });
    }

    // Try to verify the code against each valid hash
    let matchedCode = null;
    for (const storedCode of validCodes) {
      if (verifyAuthCode(code, email, storedCode.code)) {
        matchedCode = storedCode;
        break;
      }
    }

    if (!matchedCode) {
      return res.status(400).json({
        error: 'Invalid or expired authentication code'
      });
    }

    // Mark code as used
    await db
      .update(authCodes)
      .set({ used: true })
      .where(eq(authCodes.id, matchedCode.id));

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Generate JWT token
    const token = signToken({
      userId: user[0].id,
      email: user[0].email,
    });

    // Set httpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookie = serialize('auth-token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        createdAt: user[0].createdAt,
      }
    });

  } catch (error) {
    console.error('Verify code error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid email or code format'
      });
    }

    return res.status(500).json({
      error: 'Failed to verify authentication code'
    });
  }
}

