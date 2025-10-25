import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

export interface UserPayload {
  userId: string;
  email: string;
}

export function signToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
    issuer: 'app-template',
    audience: 'app-template-users'
  });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'app-template',
      audience: 'app-template-users'
    }) as UserPayload;

    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export function generateAuthCode(): string {
  // Generate 6-digit numeric code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

