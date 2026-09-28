import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FaqAccordion } from '@/components/trust/FaqAccordion';
import { TestimonialSection } from '@/components/trust/TestimonialSection';
import { EngineeringTrustGuarantee } from '@/components/trust/EngineeringTrustGuarantee';

describe('Module 23: Trust Content & Engineering Assurance', () => {
  it('renders FAQ questions and toggles answers on accordion click', () => {
    render(<FaqAccordion />);

    // Check first question heading
    const firstButton = screen.getAllByRole('button').find((btn) =>
      btn.textContent?.includes('core engineering domains')
    );
    expect(firstButton).toBeDefined();

    if (firstButton) {
      // Toggle
      fireEvent.click(firstButton);
      expect(firstButton.getAttribute('aria-expanded')).toBe('false');

      fireEvent.click(firstButton);
      expect(firstButton.getAttribute('aria-expanded')).toBe('true');
    }
  });

  it('filters FAQs when typing in the search box', () => {
    render(<FaqAccordion />);

    const searchInput = screen.getByLabelText(/search frequently asked questions/i);
    fireEvent.change(searchInput, { target: { value: 'Solar' } });

    // Questions about CCTV should not be visible
    expect(screen.queryByText(/What types of CCTV and surveillance/i)).toBeNull();
    // Solar question should be visible
    expect(screen.getByText(/calculate solar capacity/i)).toBeDefined();
  });

  it('renders EngineeringTrustGuarantee with official commitments', () => {
    render(<EngineeringTrustGuarantee />);

    expect(screen.getByText(/The PPAB Engineering Trust Guarantee/i)).toBeDefined();
    expect(screen.getByText(/Certified Engineering Architecture/i)).toBeDefined();
    expect(screen.getByText(/Authentic Tier-1 Equipment Sourcing/i)).toBeDefined();
    expect(screen.getByText(/Dedicated Project Management/i)).toBeDefined();
  });

  it('strictly adheres to Rule 8 & 9: zero fake testimonials, falling back to EngineeringTrustGuarantee', () => {
    render(<TestimonialSection />);

    // Because TESTIMONIALS_DATA has 0 approved testimonials, it must NOT render fake quotes.
    // Instead it must cleanly render the EngineeringTrustGuarantee!
    expect(screen.getByText(/The PPAB Engineering Trust Guarantee/i)).toBeDefined();
  });
});
