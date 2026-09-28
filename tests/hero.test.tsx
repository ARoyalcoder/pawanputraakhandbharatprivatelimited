import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { HeroSection } from '@/sections/hero/HeroSection';

// Mock 3D dynamic scene to isolate DOM tests
vi.mock('@/components/3d/Hero3DScene', () => ({
  Hero3DScene: () => <div data-testid="mock-hero-3d">Mock 3D Constellation</div>,
}));

describe('Module 06: Cinematic Hero Section', () => {
  it('renders exact real HTML H1 heading for SEO', () => {
    render(<HeroSection />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toContain('Powering Security');
    expect(heading.textContent).toContain('Connectivity & Growth');
  });

  it('renders exact required subheading in real HTML', () => {
    render(<HeroSection />);
    expect(
      screen.getByText(
        /Complete technology, security, solar, digital and infrastructure solutions for Homes, Businesses, Institutions & Industries/i
      )
    ).toBeDefined();
  });

  it('renders all 6 required service badges with valid links', () => {
    render(<HeroSection />);
    const expectedBadges = ['CCTV', 'Networking', 'Solar', 'Digital', 'IT', 'Infrastructure'];

    expectedBadges.forEach((badge) => {
      const els = screen.getAllByRole('link', { name: new RegExp(`^${badge}$`, 'i') });
      expect(els.length).toBeGreaterThan(0);
      expect(els[0].getAttribute('href')).toMatch(/^\/solutions\/(secure|connect|solar|digital|space)/);
    });
  });

  it('renders both primary and WhatsApp consultation CTAs', () => {
    render(<HeroSection />);
    const consultationBtn = screen.getByRole('button', { name: /Get Free Consultation/i });
    expect(consultationBtn).toBeDefined();

    const whatsappLink = screen.getByRole('link', { name: /WhatsApp Us/i });
    expect(whatsappLink).toBeDefined();
    expect(whatsappLink.getAttribute('href')).toContain('wa.me/918796716111');
  });

  it('renders accessible scroll indicator pointing to trust bar', () => {
    render(<HeroSection />);
    const scrollLink = screen.getByRole('link', { name: /Scroll to company overview/i });
    expect(scrollLink).toBeDefined();
    expect(scrollLink.getAttribute('href')).toBe('#trust-bar');
  });
});
