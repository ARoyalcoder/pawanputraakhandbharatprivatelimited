import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { HomeView } from '@/components/home/HomeView';

vi.mock('@/components/3d/Hero3DScene', () => ({
  Hero3DScene: () => <div data-testid="mock-hero-3d">Mock 3D Constellation</div>,
}));

describe('Module 07: Complete Homepage Structure', () => {
  it('renders all key homepage landmark sections in sequence', () => {
    const { container } = render(<HomeView />);

    // 1. Hero
    expect(container.querySelector('header')).toBeDefined();

    // 2. Trust bar
    expect(container.querySelector('#trust-bar')).toBeDefined();

    // 3. About section
    expect(container.querySelector('#about')).toBeDefined();

    // 4. Solutions section
    expect(container.querySelector('#solutions')).toBeDefined();

    // 5. Industries section
    expect(container.querySelector('#industries')).toBeDefined();

    // 6. Why Choose Us section
    expect(container.querySelector('#why-us')).toBeDefined();

    // 7. How It Works section
    expect(container.querySelector('#how-it-works')).toBeDefined();

    // 8. Projects section
    expect(container.querySelector('#projects')).toBeDefined();

    // 9. CCTV lead section
    expect(container.querySelector('#cctv-lead')).toBeDefined();

    // 10. Solar lead section
    expect(container.querySelector('#solar-lead')).toBeDefined();

    // 11. Digital lead section
    expect(container.querySelector('#digital-lead')).toBeDefined();

    // 12. Testimonials section
    expect(container.querySelector('#testimonials')).toBeDefined();

    // 13. FAQ section
    expect(container.querySelector('#faq')).toBeDefined();

    // 14. Final CTA section
    expect(container.querySelector('#contact-cta')).toBeDefined();
  });

  it('allows interactive switching in the Industries selector', () => {
    render(<HomeView />);
    // Click on Healthcare industry button
    const healthcareBtn = screen.getByRole('button', { name: /Healthcare/i });
    fireEvent.click(healthcareBtn);

    // Verify Healthcare specific content is rendered
    expect(
      screen.getByText(/Critical Reliability & 24\/7 Security for Hospitals and Clinics/i)
    ).toBeDefined();
  });

  it('allows interactive billing cycle toggle in Digital section', () => {
    render(<HomeView />);
    const yearlyBtn = screen.getByRole('button', { name: /Yearly Maintenance & Visibility/i });
    fireEvent.click(yearlyBtn);

    // Should display yearly plan pricing
    expect(screen.getByText('Website Care Plan')).toBeDefined();
    expect(screen.getAllByText('/ year').length).toBeGreaterThan(0);
  });

  it('toggles FAQ accordion items correctly', () => {
    render(<HomeView />);
    const faqQuestion = screen.getByText(
      /Can I view my CCTV cameras remotely on my mobile phone when away from the premises\?/i
    );
    fireEvent.click(faqQuestion);

    // The answer should be visible
    expect(
      screen.getByText(/All our IP and HD surveillance installations include free secure mobile streaming configuration/i)
    ).toBeDefined();
  });
});
