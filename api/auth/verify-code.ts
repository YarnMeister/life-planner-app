import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { eq, and, gte } from 'drizzle-orm';
import { db, authCodes, users } from '../../src/lib/auth/db';
import { signToken } from '../../src/lib/auth/jwt';
import { serialize } from 'cookie';

const verifySchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Code must be 6 digits'),
});

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
    const { email, code } = verifySchema.parse(req.body);

    // Find valid auth code
    const authCode = await db
      .select()
      .from(authCodes)
      .where(
        and(
          eq(authCodes.email, email),
          eq(authCodes.code, code),
          eq(authCodes.used, false),
          gte(authCodes.expiresAt, new Date()) // Not expired
        )
      )
      .limit(1);

    if (authCode.length === 0) {
      return res.status(400).json({
        error: 'Invalid or expired authentication code'
      });
    }

    // Mark code as used
    await db
      .update(authCodes)
      .set({ used: true })
      .where(eq(authCodes.id, authCode[0].id));

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

