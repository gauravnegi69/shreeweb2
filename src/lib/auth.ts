import crypto from 'crypto';

// Dynamically generate server-side secret on startup (invalidates all tokens if server restarts)
const SERVER_SECRET = crypto.randomBytes(32).toString('hex');

export interface SessionToken {
  expires: number;
  signature: string;
}

// Generate token valid for 24 hours
export function generateToken(): string {
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const hmac = crypto.createHmac('sha256', SERVER_SECRET);
  hmac.update(String(expires));
  const signature = hmac.digest('hex');

  const tokenData: SessionToken = { expires, signature };
  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
}

// Verify token authenticity and expiry status
export function verifyToken(token: string | null): boolean {
  if (!token) return false;
  try {
    const rawData = Buffer.from(token, 'base64').toString('utf-8');
    const tokenData: SessionToken = JSON.parse(rawData);

    // Check expiry
    if (Date.now() > tokenData.expires) {
      return false;
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', SERVER_SECRET);
    hmac.update(String(tokenData.expires));
    const expectedSignature = hmac.digest('hex');

    return tokenData.signature === expectedSignature;
  } catch (error) {
    return false;
  }
}
