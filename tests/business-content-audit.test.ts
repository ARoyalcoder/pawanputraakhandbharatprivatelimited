import { describe, it, expect } from 'vitest';
import { siteConfig } from '@/config/site.config';
import { env } from '@/lib/env';
import { TESTIMONIALS_DATA } from '@/data/trust.data';

describe('Module 36: Comprehensive Business Content Audit', () => {
  it('strictly verifies official company name across site configs', () => {
    expect(siteConfig.companyName).toBe('Pawan Putra Akhand Bharat Pvt. Ltd.');
    expect(siteConfig.brandName).toBe('PPAB');
    expect(env.NEXT_PUBLIC_COMPANY_NAME).toBe('Pawan Putra Akhand Bharat Pvt. Ltd.');
  });

  it('strictly verifies master tagline and official division naming', () => {
    // Master Tagline
    expect(siteConfig.masterTagline).toBe('Powering Security, Connectivity & Growth');
    expect(env.NEXT_PUBLIC_COMPANY_TAGLINE).toBe('Powering Security, Connectivity & Growth');

    // Official solution division taglines
    const divisions = siteConfig.divisions;
    expect(divisions.secure.tagline).toBe('Har Nazar Se Suraksha');
    expect(divisions.solar.tagline).toBe('Suraj Ki Shakti, Aapki Bachat');
    expect(divisions.spaces.tagline).toBe('Har Space Ka Bharosa');
  });

  it('strictly verifies Lucknow headquarters and contact coordinates', () => {
    expect(siteConfig.contact.formattedPhone).toContain('8796716111');
    expect(siteConfig.contact.whatsapp).toContain('8796716111');
    expect(siteConfig.contact.email).toBe('pawanputraakhandbharat@gmail.com');

    const hq = siteConfig.offices.find((o) => o.isHeadquarter);
    expect(hq).toBeDefined();
    expect(hq?.city).toBe('Lucknow');
    expect(hq?.state).toBe('Uttar Pradesh');
    expect(hq?.addressLines).toContain('BCC Tower');
  });

  it('verifies zero unapproved or fake testimonials exist in public registry', () => {
    // Strict requirement: Only approved testimonials are allowed.
    // In our trust registry, all entries require approved === true.
    const unapproved = TESTIMONIALS_DATA.filter((t) => !t.approved);
    expect(unapproved.length).toBe(0);
  });
});
