import type { VercelRequest, VercelResponse } from '@vercel/node';
import { serialize } from 'cookie';

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
    // Clear the auth token cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookie = serialize('auth-token', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 0, // Immediately expire
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({
      success: true,
      message: 'Successfully logged out'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      error: 'Failed to logout'
    });
  }
}

