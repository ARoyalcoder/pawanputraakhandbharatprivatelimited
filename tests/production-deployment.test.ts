import { describe, it, expect } from 'vitest';
import { env } from '@/lib/env';

describe('Module 35: Production Deployment & Readiness', () => {
  it('enforces canonical domain in site URL configuration', () => {
    expect(env.NEXT_PUBLIC_SITE_URL).toBe('https://www.pawanputraakhandbharat.com');
    expect(env.NEXT_PUBLIC_WEBSITE).toBe('https://www.pawanputraakhandbharat.com');
  });

  it('validates verified Lucknow contact coordinates across environment', () => {
    expect(env.NEXT_PUBLIC_PHONE).toBe('+918796716111');
    expect(env.NEXT_PUBLIC_WHATSAPP).toBe('+918796716111');
    expect(env.NEXT_PUBLIC_EMAIL).toBe('pawanputraakhandbharat@gmail.com');
    expect(env.NEXT_PUBLIC_HEAD_OFFICE).toBe('BCC Tower, Arjunganj, Lucknow');
  });

  it('ensures official company name and tagline are configured correctly', () => {
    expect(env.NEXT_PUBLIC_COMPANY_NAME).toBe('Pawan Putra Akhand Bharat Pvt. Ltd.');
    expect(env.NEXT_PUBLIC_COMPANY_TAGLINE).toBe('Powering Security, Connectivity & Growth');
  });
});
