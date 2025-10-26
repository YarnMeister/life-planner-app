import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
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

    const response = NextResponse.json({
      success: true,
      message: 'Successfully logged out'
    });

    response.headers.set('Set-Cookie', cookie);

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}

