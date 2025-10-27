import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, and, gte, or } from 'drizzle-orm';
import { db, authCodes, users, failedAuthAttempts } from '@/lib/auth/db.server';
import { signToken, verifyAuthCode } from '@/lib/auth/jwt';
import { serialize } from 'cookie';
import { normalizeEmail } from '@/lib/auth/utils';
import { initializePlanningDocs } from '@/lib/services/user-init.service';

const verifySchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Code must be 6 digits'),
});

// Maximum failed verification attempts before temporary lockout
const MAX_VERIFY_ATTEMPTS = 5;
const VERIFY_LOCKOUT_WINDOW = 15 * 60 * 1000; // 15 minutes

// Helper to get client IP
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip');
  return ip || 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email: rawEmail, code } = verifySchema.parse(body);
    const email = normalizeEmail(rawEmail);
    const clientIp = getClientIp(req);

    // Check for failed verification attempts (proper lockout logic)
    const lockoutStart = new Date(Date.now() - VERIFY_LOCKOUT_WINDOW);
    const recentFailedAttempts = await db
      .select()
      .from(failedAuthAttempts)
      .where(
        and(
          or(
            eq(failedAuthAttempts.email, email),
            eq(failedAuthAttempts.ipAddress, clientIp)
          ),
          gte(failedAuthAttempts.attemptedAt, lockoutStart)
        )
      );

    // Block if too many failed attempts from this email or IP
    if (recentFailedAttempts.length >= MAX_VERIFY_ATTEMPTS) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please wait 15 minutes or request a new code.' },
        { status: 429 }
      );
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

    console.log('🔍 Debug verify-code:');
    console.log('  Email:', email);
    console.log('  Code entered:', code);
    console.log('  Valid codes found:', validCodes.length);
    if (validCodes.length > 0) {
      console.log('  First code details:', {
        email: validCodes[0].email,
        used: validCodes[0].used,
        expiresAt: validCodes[0].expiresAt,
        expired: validCodes[0].expiresAt < new Date()
      });
    }

    if (validCodes.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired authentication code' },
        { status: 400 }
      );
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
      // Log failed verification attempt
      await db.insert(failedAuthAttempts).values({
        email,
        ipAddress: clientIp,
      });

      return NextResponse.json(
        { error: 'Invalid or expired authentication code' },
        { status: 400 }
      );
    }

    // Mark code as used
    await db
      .update(authCodes)
      .set({ used: true })
      .where(eq(authCodes.id, matchedCode.id));

    // Get or create user (for first-time login)
    console.log('🔍 Checking if user exists:', email);
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    console.log('🔍 User query result:', user.length > 0 ? `Found user ${user[0].id}` : 'No user found');

    let isNewUser = false;
    if (user.length === 0) {
      console.log('📝 Creating new user for:', email);
      const newUser = await db.insert(users).values({
        email,
      }).returning();
      user = newUser;
      isNewUser = true;
      console.log('✅ New user created:', user[0].id);
    } else {
      console.log('ℹ️  Existing user logging in:', user[0].id);
    }

    // Initialize planning docs for new users
    if (isNewUser) {
      console.log('🌱 Initializing planning docs for new user:', user[0].id);
      try {
        await initializePlanningDocs(user[0].id);
        console.log('✅ Planning docs initialization completed');
      } catch (error) {
        console.error('❌ Failed to initialize planning docs:', error);
        // Don't fail the auth flow, but log the error
      }
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

    const response = NextResponse.json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        createdAt: user[0].createdAt,
      }
    });

    response.headers.set('Set-Cookie', cookie);

    return response;

  } catch (error) {
    console.error('Verify code error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email or code format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to verify authentication code' },
      { status: 500 }
    );
  }
}

