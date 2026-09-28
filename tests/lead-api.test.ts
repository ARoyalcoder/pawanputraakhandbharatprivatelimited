// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/leads/route';

let ip = 0;
const post = (body: unknown) =>
  POST(
    new NextRequest('http://localhost/api/leads', {
      method: 'POST',
      // A fresh client IP per request keeps these tests clear of the rate limiter.
      headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.0.0.${++ip}` },
      body: JSON.stringify(body),
    })
  );

const cctv = { name: 'Asha Verma', phone: '+91 98765 43210', city: 'Gomti Nagar', propertyType: 'Office', cameras: '9 – 16' };

describe('POST /api/leads', () => {
  it('accepts a valid lead and returns a reference and WhatsApp link', async () => {
    const res = await post({ formType: 'cctv', data: cctv, honeypot: '', elapsedMs: 5000, source: 'test' });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.leadId).toMatch(/^PPAB-\d{4}-\d{5}$/);
    expect(json.whatsappLink).toMatch(/^https:\/\/wa\.me\/918796716111\?text=/);
  });

  it('rejects submissions that fill the honeypot', async () => {
    const res = await post({ formType: 'cctv', data: cctv, honeypot: 'http://spam', elapsedMs: 5000 });
    expect(res.status).toBe(400);
  });

  it('rejects implausibly fast submissions', async () => {
    const res = await post({ formType: 'cctv', data: cctv, honeypot: '', elapsedMs: 120 });
    expect(res.status).toBe(400);
  });

  it('rejects unknown form types', async () => {
    const res = await post({ formType: 'unknown', data: cctv, elapsedMs: 5000 });
    expect(res.status).toBe(400);
  });

  it('returns field errors for invalid data', async () => {
    const res = await post({ formType: 'cctv', data: { ...cctv, phone: '123' }, elapsedMs: 5000 });
    const json = await res.json();
    expect(res.status).toBe(422);
    expect(json.details.phone).toBeDefined();
  });
});
