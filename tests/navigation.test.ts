import { describe, it, expect } from 'vitest';
import {
  mainNavItems,
  solutionsNavItems,
  industriesNavItems,
  footerLegalLinks,
  footerCompanyLinks,
} from '@/data/navigation.data';

describe('Module 03: Global Navigation Data Taxonomy', () => {
  it('contains all 8 primary navigation items', () => {
    const labels = mainNavItems.map((item) => item.label);
    expect(labels).toEqual([
      'Home',
      'About',
      'Solutions',
      'Industries',
      'Projects',
      'Why Us',
      'Blog',
      'Contact',
    ]);
  });

  it('contains all 5 required solutions in dropdown taxonomy', () => {
    const solutionLabels = solutionsNavItems.map((item) => item.label);
    expect(solutionLabels).toContain('Pawan Putra Secure');
    expect(solutionLabels).toContain('Pawan Putra Connect');
    expect(solutionLabels).toContain('Pawan Putra Solar');
    expect(solutionLabels).toContain('Pawan Putra Digital');
    expect(solutionLabels).toContain('Pawan Putra Space');
    expect(solutionsNavItems).toHaveLength(5);
  });

  it('contains all 7 required industries in dropdown taxonomy', () => {
    const industryLabels = industriesNavItems.map((item) => item.label);
    expect(industryLabels).toEqual([
      'Residential',
      'Education',
      'Healthcare',
      'Corporate',
      'Hospitality',
      'Manufacturing',
      'Commercial',
    ]);
    expect(industriesNavItems).toHaveLength(7);
  });

  it('contains Privacy Policy and Terms & Conditions legal links', () => {
    const legalLabels = footerLegalLinks.map((item) => item.label);
    expect(legalLabels).toContain('Privacy Policy');
    expect(legalLabels).toContain('Terms & Conditions');
  });

  it('links correctly in footer company section', () => {
    expect(footerCompanyLinks.length).toBeGreaterThan(0);
    const aboutLink = footerCompanyLinks.find((l) => l.href === '/about');
    expect(aboutLink).toBeDefined();
  });
});
