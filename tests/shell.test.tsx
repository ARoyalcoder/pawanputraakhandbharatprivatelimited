import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { FloatingActions } from '@/components/common/floating-actions';
import { siteConfig } from '@/config/site.config';

describe('Module 03: Global Website Shell Components', () => {
  it('renders Header with brand identity and CTA triggers', () => {
    render(<Header />);
    // Check brand name
    const brandElements = screen.getAllByText(siteConfig.brandName);
    expect(brandElements.length).toBeGreaterThan(0);

    // Check Call Now and WhatsApp
    expect(screen.getByText('Call Now')).toBeDefined();
    expect(screen.getByText('WhatsApp')).toBeDefined();
  });

  it('renders Footer with corporate identity and verified offices', () => {
    render(<Footer />);
    // Check Lucknow and Delhi offices
    expect(screen.getByText(/Arjunganj, Lucknow/i)).toBeDefined();
    expect(screen.getByText(/Palam Extension, Dwarka/i)).toBeDefined();

    // Check legal links
    expect(screen.getByText('Privacy Policy')).toBeDefined();
    expect(screen.getByText('Terms & Conditions')).toBeDefined();
  });

  it('renders FloatingActions with direct contact channels', () => {
    render(<FloatingActions />);
    // Check mobile quick action labels
    expect(screen.getByText('Call')).toBeDefined();
    expect(screen.getByText('Get Quote')).toBeDefined();
  });
});
