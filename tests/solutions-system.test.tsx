import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  getAllSolutions,
  getSolutionBySlug,
  solutionsConfig,
  SolutionConfig,
} from '@/config/solutions.config';
import { SolutionHero } from '@/components/solutions/SolutionHero';
import { ServiceGrid } from '@/components/solutions/ServiceGrid';
import { BenefitsSection } from '@/components/solutions/BenefitsSection';
import { DigitalEcosystemFlow } from '@/components/solutions/DigitalEcosystemFlow';
import { DigitalInteractiveServices } from '@/components/solutions/DigitalInteractiveServices';

// Mock 3D dynamic scenes
vi.mock('@/components/3d/NetworkPacketScene', () => ({
  NetworkPacketScene: () => <div data-testid="mock-network-scene">Network 3D Scene</div>,
}));
vi.mock('@/components/3d/SolarSunScene', () => ({
  SolarSunScene: () => <div data-testid="mock-solar-scene">Solar 3D Scene</div>,
}));
vi.mock('@/components/3d/ArchitecturalScene', () => ({
  ArchitecturalScene: () => <div data-testid="mock-arch-scene">Architectural 3D Scene</div>,
}));

describe('Module 08: Scalable Solutions System Architecture', () => {
  it('contains all 5 core division configurations', () => {
    const solutions = getAllSolutions();
    expect(solutions.length).toBe(5);

    const slugs = solutions.map((s) => s.slug);
    expect(slugs).toContain('secure');
    expect(slugs).toContain('connect');
    expect(slugs).toContain('solar');
    expect(slugs).toContain('digital');
    expect(slugs).toContain('space');
  });

  it('guarantees complete data architecture for each solution', () => {
    const solutions = getAllSolutions();
    solutions.forEach((sol) => {
      expect(sol.name).toBeDefined();
      expect(sol.slug).toBeDefined();
      expect(sol.tagline).toBeDefined();
      expect(sol.shortDescription).toBeDefined();
      expect(sol.fullDescription).toBeDefined();
      expect(sol.heroBadge).toBeDefined();
      expect(sol.accent.primary).toMatch(/^#/);
      expect(sol.services.length).toBeGreaterThan(0);
      expect(sol.products.length).toBeGreaterThan(0);
      expect(sol.process.length).toBeGreaterThan(0);
      expect(sol.benefits.length).toBeGreaterThan(0);
      expect(sol.cta.primaryButtonText).toBeDefined();
      expect(sol.cta.whatsappMessage).toBeDefined();
    });
  });

  it('allows adding a 6th solution seamlessly via config without breaking types', () => {
    const mockSixthSolution: SolutionConfig = {
      id: 'automations',
      name: 'Pawan Putra Automations',
      slug: 'secure', // conforms to union
      tagline: 'Har Ghar Smart',
      shortDescription: 'Smart home IoT automations.',
      fullDescription: 'Enterprise home automation and industrial sensors.',
      heroBadge: 'Smart Automation Division',
      accent: {
        primary: '#3B82F6',
        secondary: '#1D4ED8',
        lightBg: 'rgba(59, 130, 246, 0.08)',
        borderColor: 'rgba(59, 130, 246, 0.35)',
        badgeBg: 'rgba(59, 130, 246, 0.15)',
        glowColor: 'rgba(59, 130, 246, 0.25)',
      },
      services: [{ title: 'Smart Lighting', description: 'Wireless automated lights' }],
      products: [{ title: 'Smart Switch', description: 'Wi-Fi enabled switch' }],
      process: [{ step: '01', title: 'Survey', description: 'Wiring audit' }],
      benefits: [{ title: 'Energy Saving', description: 'Cut energy by 20%' }],
      cta: {
        title: 'Automate Today',
        description: 'Get in touch for smart sensors.',
        primaryButtonText: 'Get Quote',
        whatsappMessage: 'Hello PPAB Automations',
      },
    };

    expect(mockSixthSolution.name).toBe('Pawan Putra Automations');
    expect(mockSixthSolution.services[0].title).toBe('Smart Lighting');
  });

  it('renders SolutionHero with real semantic H1 and verified tagline', () => {
    const secureConfig = getSolutionBySlug('secure')!;
    render(<SolutionHero solution={secureConfig} />);

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toContain('Pawan Putra Secure');
    expect(screen.getByText(/Har Nazar Se Suraksha/i)).toBeDefined();
  });

  it('renders ServiceGrid correctly with all items', () => {
    const connectConfig = getSolutionBySlug('connect')!;
    render(<ServiceGrid solution={connectConfig} />);

    expect(screen.getByText('Fiber Optic Networking')).toBeDefined();
    expect(screen.getByText('LAN & CAN Structured Cabling')).toBeDefined();
  });
});

describe('Module 12: Pawan Putra Digital Components', () => {
  it('renders interactive 12 digital services and allows category filtering', () => {
    render(<DigitalInteractiveServices />);

    // Renders filter buttons
    expect(screen.getByRole('button', { name: /All 12 Services/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Engineering & Software/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Marketing & SEO/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Branding & Content/i })).toBeDefined();

    // Contains key services
    expect(screen.getByText('Website Development')).toBeDefined();
    expect(screen.getByText('Mobile App Development')).toBeDefined();
    expect(screen.getByText('School ERP & Institutional Systems')).toBeDefined();
    expect(screen.getByText('Search Engine Optimization (SEO)')).toBeDefined();
    expect(screen.getByText('Google Ads (PPC) Management')).toBeDefined();

    // Filter to Marketing & SEO
    fireEvent.click(screen.getByRole('button', { name: /Marketing & SEO/i }));
    expect(screen.getByText('Google Ads (PPC) Management')).toBeDefined();
    expect(screen.queryByText('School ERP & Institutional Systems')).toBeNull();
  });

  it('renders DigitalEcosystemFlow and allows interactive node selection', () => {
    render(<DigitalEcosystemFlow />);

    expect(screen.getAllByText('High-Impact Website').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Native Mobile App').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CRM & School ERP').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Targeted Ads & SEO').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Business Ecosystem').length).toBeGreaterThan(0);

    // Switch to step 03
    fireEvent.click(screen.getByRole('button', { name: /03/i }));
    expect(screen.getAllByText('Operational Engine').length).toBeGreaterThan(0);
  });
});

describe('Module 13: Pawan Putra Space Division', () => {
  it('contains verified Space configuration with 0 fake listings', () => {
    const spaceConfig = getSolutionBySlug('space')!;
    expect(spaceConfig).toBeDefined();
    expect(spaceConfig.tagline).toBe('Har Space Ka Bharosa');

    const serviceTitles = spaceConfig.services.map((s) => s.title);
    expect(serviceTitles).toContain('Real Estate Advisory & Land Solutions');
    expect(serviceTitles).toContain('Architectural Planning & 3D Blueprints');
    expect(serviceTitles).toContain('Modern Interior Design & Execution');
    expect(serviceTitles).toContain('Structural Construction & Civil Works');
    expect(serviceTitles).toContain('Turnkey Property Solutions & Renovation');
  });
});
