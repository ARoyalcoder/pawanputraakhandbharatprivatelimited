import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  getAllIndustries,
  getIndustryBySlug,
  industriesConfig,
} from '@/config/industries.config';

describe('Module 14: Industries System Architecture', () => {
  it('contains all 7 verified industry verticals', () => {
    const industries = getAllIndustries();
    expect(industries.length).toBe(7);

    const slugs = industries.map((ind) => ind.slug);
    expect(slugs).toContain('residential');
    expect(slugs).toContain('education');
    expect(slugs).toContain('healthcare');
    expect(slugs).toContain('corporate');
    expect(slugs).toContain('hospitality');
    expect(slugs).toContain('manufacturing');
    expect(slugs).toContain('commercial');
  });

  it('guarantees complete domain data structure for every industry', () => {
    const industries = getAllIndustries();
    industries.forEach((ind) => {
      expect(ind.name).toBeDefined();
      expect(ind.slug).toBeDefined();
      expect(ind.heroTitle).toBeDefined();
      expect(ind.heroSubtitle).toBeDefined();
      expect(ind.tagline).toBeDefined();
      expect(ind.overviewDescription).toBeDefined();
      expect(ind.badge).toBeDefined();
      expect(ind.accentColor).toMatch(/^#/);
      expect(ind.businessNeeds.length).toBeGreaterThan(0);
      expect(ind.relevantSolutions.length).toBeGreaterThan(0);
      expect(ind.services.length).toBeGreaterThan(0);
      expect(ind.useCases.length).toBeGreaterThan(0);
      expect(ind.cta.buttonText).toBeDefined();
      expect(ind.cta.whatsappMessage).toBeDefined();
    });
  });

  it('maps multi-division solutions cleanly for Healthcare', () => {
    const healthcare = getIndustryBySlug('healthcare');
    expect(healthcare).toBeDefined();

    const mappedSlugs = healthcare!.relevantSolutions.map((s) => s.solutionSlug);
    // Healthcare should map to Secure, Connect, Solar, Digital
    expect(mappedSlugs).toContain('secure');
    expect(mappedSlugs).toContain('connect');
    expect(mappedSlugs).toContain('solar');
    expect(mappedSlugs).toContain('digital');
  });

  it('ensures zero fabricated named organizations in use cases per Rule 8 & 9', () => {
    const industries = getAllIndustries();
    const bannedFakeNames = [
      'Google',
      'Apple',
      'Microsoft',
      'Tata',
      'Reliance',
      'Apollo Hospital',
      'Fortis',
      'IIT Delhi',
    ];

    industries.forEach((ind) => {
      ind.useCases.forEach((uc) => {
        bannedFakeNames.forEach((fake) => {
          expect(uc.title).not.toContain(fake);
          expect(uc.challenge).not.toContain(fake);
          expect(uc.solutionProvided).not.toContain(fake);
        });
      });
    });
  });
});
