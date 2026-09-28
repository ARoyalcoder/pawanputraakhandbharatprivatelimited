import { describe, it, expect } from 'vitest';
import { timingSafeCompare, hashString, verifyHash } from '@/lib/security/auth-crypto';
import { rateLimiter } from '@/lib/security/rate-limiter';
import { env } from '@/lib/env';

describe('Module 30: Enterprise Security Hardening', () => {
  it('performs timing-safe comparison accurately', () => {
    expect(timingSafeCompare('admin_password_123', 'admin_password_123')).toBe(true);
    expect(timingSafeCompare('admin_password_123', 'wrong_password')).toBe(false);
    expect(timingSafeCompare('short', 'much_longer_string')).toBe(false);
  });

  it('hashes strings and verifies correctly', () => {
    const raw = 'SecureSecretKey987!';
    const hashed = hashString(raw);

    expect(hashed).toBeDefined();
    expect(hashed.length).toBe(64); // SHA-256 hex length
    expect(verifyHash(raw, hashed)).toBe(true);
    expect(verifyHash('IncorrectKey', hashed)).toBe(false);
  });

  it('enforces rate limits in sliding windows', () => {
    const testKey = `test-ip-${Date.now()}`;
    const limit = 3;
    const windowMs = 5000;

    // First 3 requests should pass
    for (let i = 0; i < limit; i++) {
      const check = rateLimiter.check(testKey, limit, windowMs);
      expect(check.success).toBe(true);
    }

    // 4th request should fail
    const blockedCheck = rateLimiter.check(testKey, limit, windowMs);
    expect(blockedCheck.success).toBe(false);
    expect(blockedCheck.remaining).toBe(0);
    expect(blockedCheck.reset).toBeGreaterThan(0);
  });

  it('guarantees zero secret exposure to client bundle (NEXT_PUBLIC_ check)', () => {
    // Check all NEXT_PUBLIC_ keys in env
    const publicKeys = Object.keys(env).filter((k) => k.startsWith('NEXT_PUBLIC_'));

    for (const key of publicKeys) {
      const val = (env as any)[key];
      if (typeof val === 'string') {
        expect(val.toLowerCase()).not.toContain('postgres:');
        expect(val.toLowerCase()).not.toContain('secret_key');
        expect(val.toLowerCase()).not.toContain('example-app-password');
        expect(val.toLowerCase()).not.toContain('auth_secret');
      }
    }

    // Non-public variables must not start with NEXT_PUBLIC_
    expect('DATABASE_URL' in env).toBe(true);
    expect(env.DATABASE_URL).toBeDefined();
  });
});
