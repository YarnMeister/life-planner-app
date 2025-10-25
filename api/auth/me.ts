import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { parse } from 'cookie';
import { db, users } from '../../src/lib/auth/db';
import { verifyToken } from '../../src/lib/auth/jwt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Parse cookies from request
    const cookies = parse(req.headers.cookie || '');
    const token = cookies['auth-token'];

    if (!token) {
      return res.status(401).json({
        error: 'Not authenticated'
      });
    }

    // Verify JWT token
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({
        error: 'Invalid token'
      });
    }

    // Get current user from database
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

    if (user.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    return res.status(200).json({
      user: user[0]
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      error: 'Failed to get user information'
    });
  }
}

