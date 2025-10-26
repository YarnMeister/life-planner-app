import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { serverEnv } from '../env';

// Use validated JWT_SECRET from centralized env
const JWT_SECRET = serverEnv.JWT_SECRET;

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

/**
 * Generate a cryptographically secure 6-digit numeric OTP code
 */
export function generateAuthCode(): string {
  // Use crypto.randomInt for secure random generation (0-999,999)
  const code = crypto.randomInt(0, 1_000_000);
  // Pad with leading zeros to ensure 6 digits
  return code.toString().padStart(6, '0');
}

/**
 * Hash an OTP code with email as salt for secure storage
 * Uses HMAC-SHA256 with JWT_SECRET as the key
 */
export function hashAuthCode(code: string, email: string): string {
  const hmac = crypto.createHmac('sha256', JWT_SECRET);
  hmac.update(`${code}:${email}`);
  return hmac.digest('hex');
}

/**
 * Verify an OTP code against its hash
 */
export function verifyAuthCode(code: string, email: string, hash: string): boolean {
  const computedHash = hashAuthCode(code, email);
  return crypto.timingSafeEqual(
    Buffer.from(computedHash),
    Buffer.from(hash)
  );
}

