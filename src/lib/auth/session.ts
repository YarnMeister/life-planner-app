/**
 * Session management utilities for API routes
 */
import 'server-only';

import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db, users } from './db.server';
import { verifyToken } from './jwt';

export interface Session {
  user: {
    id: string;
    email: string;
  };
}

/**
 * Get the current session from the auth token cookie
 * Returns null if not authenticated or token is invalid
 */
export async function getSession(): Promise<Session | null> {
  try {
    // Get token from cookies (Next.js 16 async API)
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    // Verify JWT token
    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    // Get current user from database
    const user = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    return {
      user: user[0],
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

