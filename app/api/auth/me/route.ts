import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { db, users } from '@/lib/auth/db.server';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(_req: NextRequest) {
  try {
    // Get token from cookies (Next.js 16 async API)
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get current user from database
    console.log('🔍 Looking up user with ID:', payload.userId);
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    console.log('🔍 Found users:', user.length);

    if (user.length === 0) {
      console.error('❌ User not found in DB. Token userId:', payload.userId);
      // Clear the invalid cookie
      return NextResponse.json(
        { error: 'Not authenticated' },
        { 
          status: 401,
          headers: {
            'Set-Cookie': 'auth-token=; Path=/; HttpOnly; Max-Age=0'
          }
        }
      );
    }

    return NextResponse.json({
      user: user[0]
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user information' },
      { status: 500 }
    );
  }
}

