import { describe, expect, it } from 'vitest';
import { describeLead, leadSchemas, normalisePhone } from '@/lib/validations/lead.schema';

const valid = {
  cctv: { name: 'Asha Verma', phone: '9876543210', city: 'Gomti Nagar', propertyType: 'Shop', cameras: '5 – 8' },
  solar: { name: 'Ravi', phone: '9876543210', monthlyBill: '₹5,000 – ₹10,000', propertyType: 'Home', location: 'Lucknow', intent: 'calculate' },
  general: { name: 'Ravi', phone: '9876543210', email: '', city: 'Lucknow', service: 'Pawan Putra Solar', message: 'Rooftop solar for a two-storey home' },
  digital: { name: 'Ravi', phone: '9876543210', service: 'Website Development', message: 'A website for our clinic with appointment enquiries' },
  connect: { name: 'Ravi', phone: '9876543210', city: 'Dwarka', propertyType: 'Office', service: 'Wi-Fi' },
  space: { name: 'Ravi', phone: '9876543210', city: 'Lucknow', service: 'Interior Design', propertyType: 'Flat / Apartment' },
} as const;

describe('lead schemas', () => {
  it.each(Object.keys(valid))('%s accepts a complete submission', (type) => {
    const result = leadSchemas[type as keyof typeof valid].safeParse(valid[type as keyof typeof valid]);
    expect(result.success).toBe(true);
  });

  it.each(Object.keys(valid))('%s rejects a missing name and phone', (type) => {
    const result = leadSchemas[type as keyof typeof valid].safeParse({ ...valid[type as keyof typeof valid], name: '', phone: '' });
    expect(result.success).toBe(false);
  });

  it('normalises common Indian mobile formats', () => {
    expect(normalisePhone('+91 98765 43210')).toBe('9876543210');
    expect(normalisePhone('098765-43210')).toBe('9876543210');
    expect(normalisePhone('9876543210')).toBe('9876543210');
  });

  it('rejects numbers that are not Indian mobiles', () => {
    expect(leadSchemas.cctv.safeParse({ ...valid.cctv, phone: '1234567890' }).success).toBe(false);
    expect(leadSchemas.cctv.safeParse({ ...valid.cctv, phone: '98765' }).success).toBe(false);
  });

  it('only accepts the property types from the brief for CCTV', () => {
    expect(leadSchemas.cctv.safeParse({ ...valid.cctv, propertyType: 'Castle' }).success).toBe(false);
    for (const type of ['Home', 'Shop', 'Office', 'School', 'Hospital', 'Warehouse', 'Factory']) {
      expect(leadSchemas.cctv.safeParse({ ...valid.cctv, propertyType: type }).success).toBe(true);
    }
  });

  it('rejects an invalid optional email but allows it to be empty', () => {
    expect(leadSchemas.general.safeParse({ ...valid.general, email: 'not-an-email' }).success).toBe(false);
    expect(leadSchemas.general.safeParse({ ...valid.general, email: '' }).success).toBe(true);
  });
});

describe('describeLead', () => {
  it('maps each form to its division', () => {
    const divisions = Object.fromEntries(
      (Object.keys(valid) as (keyof typeof valid)[]).map((type) => {
        const result = describeLead(type, valid[type]);
        if (!result.success) throw new Error(`${type} failed`);
        return [type, result.lead.division];
      })
    );
    expect(divisions).toEqual({ cctv: 'SECURE', solar: 'SOLAR', general: 'GENERAL', digital: 'DIGITAL', connect: 'CONNECT', space: 'SPACE' });
  });

  it('returns field errors for invalid input', () => {
    const result = describeLead('solar', { ...valid.solar, monthlyBill: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(Object.keys(result.fieldErrors)).toContain('monthlyBill');
  });

  it('distinguishes solar calculation requests from consultations', () => {
    const calc = describeLead('solar', valid.solar);
    const consult = describeLead('solar', { ...valid.solar, intent: 'consultation' });
    expect(calc.success && calc.lead.service).toBe('Solar Requirement Assessment');
    expect(consult.success && consult.lead.service).toBe('Solar Consultation');
  });
});
