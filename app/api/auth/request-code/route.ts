import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, and, gte, or } from 'drizzle-orm';
import { db, authCodes, users } from '@/lib/auth/db.server';
import { generateAuthCode, hashAuthCode } from '@/lib/auth/jwt';
import { sendAuthCode } from '@/lib/auth/email';
import { normalizeEmail } from '@/lib/auth/utils';
import { serverEnv } from '@/lib/env';

const requestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Configurable via environment variables with sensible defaults
const RATE_LIMIT_WINDOW = parseInt(serverEnv.AUTH_RATE_LIMIT_WINDOW_MS);
const RATE_LIMIT_MAX = parseInt(serverEnv.AUTH_RATE_LIMIT_MAX);
const CODE_TTL = parseInt(serverEnv.AUTH_CODE_TTL_MINUTES) * 60 * 1000;

// Helper to get client IP from Next.js request
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip');
  return ip || 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email: rawEmail } = requestSchema.parse(body);
    const email = normalizeEmail(rawEmail);
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
      return NextResponse.json(
        { error: 'Too many requests. Please wait before requesting another code.' },
        { status: 429 }
      );
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

    return NextResponse.json({
      success: true,
      message: 'Authentication code sent to your email'
    });

  } catch (error) {
    console.error('Request code error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send authentication code' },
      { status: 500 }
    );
  }
}

