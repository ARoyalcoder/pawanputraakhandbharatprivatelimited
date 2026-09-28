/**
 * Cryptographic helpers for secure authentication
 * Using Node crypto with timing-safe comparison to prevent side-channel timing attacks
 */

import crypto from 'crypto';

/**
 * Constant-time comparison between two strings to prevent timing attacks
 */
export function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    // Perform dummy comparison to keep constant execution time
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Hash a plain string with SHA-256 and salt
 */
export function hashString(value: string, salt: string = 'ppab_salt_secure_2026'): string {
  return crypto.createHmac('sha256', salt).update(value).digest('hex');
}

/**
 * Verify a plain string against a hashed value
 */
export function verifyHash(plain: string, hash: string, salt: string = 'ppab_salt_secure_2026'): boolean {
  const calculated = hashString(plain, salt);
  return timingSafeCompare(calculated, hash);
}
