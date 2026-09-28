import { describe, it, expect } from 'vitest';
import { siteConfig } from '@/config/site.config';
import { designTokens } from '@/config/design-tokens';
import { formatPhoneLink, formatWhatsAppLink, cn } from '@/lib/utils';
import { ppabDivisions } from '@/data/services.data';

describe('Module 01 & 02: Foundation & Design Tokens', () => {
  it('has verified site configuration data matching official collateral', () => {
    expect(siteConfig.companyName).toBe('Pawan Putra Akhand Bharat Pvt. Ltd.');
    expect(siteConfig.brandName).toBe('PPAB');
    expect(siteConfig.contact.primaryPhone).toBe('8796716111');
    expect(siteConfig.contact.email).toBe('pawanputraakhandbharat@gmail.com');
    expect(siteConfig.offices).toHaveLength(2);

    const hq = siteConfig.offices.find((o) => o.isHeadquarter);
    expect(hq).toBeDefined();
    expect(hq?.city).toBe('Lucknow');

    const branch = siteConfig.offices.find((o) => !o.isHeadquarter);
    expect(branch).toBeDefined();
    expect(branch?.city).toBe('New Delhi');
    expect(branch?.pincode).toBe('110077');
  });

  it('contains design tokens with defined palette and typography', () => {
    expect(designTokens.colors.primary.navy).toBe('#0B192C');
    expect(designTokens.colors.accent.gold).toBe('#D4AF37');
    expect(designTokens.breakpoints['2xl']).toBe('1536px');
    expect(designTokens.breakpoints.xs).toBe('320px');
    expect(designTokens.containerWidths.default).toBe('1200px');
  });

  it('verifies utility helper functions', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
    expect(formatPhoneLink('8796716111')).toBe('tel:8796716111');
    expect(formatWhatsAppLink('8796716111')).toBe('https://wa.me/8796716111');
    expect(formatWhatsAppLink('8796716111', 'Hello')).toBe('https://wa.me/8796716111?text=Hello');
  });

  it('contains the verified core divisions including digital', () => {
    expect(ppabDivisions).toHaveLength(5);
    const slugs = ppabDivisions.map((d) => d.slug);
    expect(slugs).toContain('secure');
    expect(slugs).toContain('connect');
    expect(slugs).toContain('solar');
    expect(slugs).toContain('spaces');
    expect(slugs).toContain('digital');
  });
});
