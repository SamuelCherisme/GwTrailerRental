import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-this';

export interface TokenPayload {
  userId: string;
  email: string;
}

// Generate access token (short-lived: 15 minutes)
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

// Generate refresh token (long-lived: 7 days)
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Verify access token
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

// Generate random token for email verification / password reset
export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash token for storage (don't store plain tokens in DB)
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
