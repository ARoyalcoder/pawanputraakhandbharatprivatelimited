import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactHero, ContactInfo, ContactForm, LazyMap } from '@/components/contact';
import { env } from '@/lib/env';

describe('Module 24: Contact System', () => {
  it('renders ContactHero with verified direct communication triggers', () => {
    render(<ContactHero />);

    const callLink = screen.getByRole('link', { name: /8796716111/i });
    expect(callLink.getAttribute('href')).toBe(`tel:${env.NEXT_PUBLIC_PHONE}`);

    const emailLink = screen.getByRole('link', { name: new RegExp(env.NEXT_PUBLIC_EMAIL, 'i') });
    expect(emailLink.getAttribute('href')).toBe(`mailto:${env.NEXT_PUBLIC_EMAIL}`);

    const whatsappLink = screen.getByRole('link', { name: /Chat on WhatsApp/i });
    expect(whatsappLink.getAttribute('href')).toContain('wa.me');
  });

  it('renders ContactInfo with official Lucknow headquarters details', () => {
    render(<ContactInfo />);

    expect(screen.getByText(new RegExp(env.NEXT_PUBLIC_HEAD_OFFICE, 'i'))).toBeDefined();
    expect(screen.getByText(/Monday - Saturday: 9:00 AM - 7:00 PM/i)).toBeDefined();
  });

  it('renders LazyMap with interactive button and directions link', () => {
    render(<LazyMap />);

    const directionsLink = screen.getByRole('link', { name: /Get Directions/i });
    expect(directionsLink.getAttribute('href')).toContain('google.com/maps/dir');

    const loadMapButton = screen.getByRole('button', { name: /Load Interactive Map/i });
    expect(loadMapButton).toBeDefined();
  });

  it('renders ContactForm with tabs for all divisions', () => {
    render(<ContactForm initialDivision="general" />);

    expect(screen.getByText(/Request an Engineering Consultation/i)).toBeDefined();
    expect(screen.getByRole('tab', { name: /General/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /CCTV/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /Solar/i })).toBeDefined();
  });
});
