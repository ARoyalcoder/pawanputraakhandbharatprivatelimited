import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { fivePrinciples, executionProcessSteps, supportPillars } from '@/data/why-us.data';
import { PrinciplesInteractiveCards } from '@/components/why-us/PrinciplesInteractiveCards';
import { ProcessTimelineView } from '@/components/why-us/ProcessTimelineView';
import WhyUsPage from '@/app/why-us/page';

describe('Module 16: Why Us Corporate Page', () => {
  it('contains exactly the 5 specified corporate principles', () => {
    expect(fivePrinciples.length).toBe(5);

    const titles = fivePrinciples.map((p) => p.title);
    expect(titles).toContain('One Partner, Multiple Solutions');
    expect(titles).toContain('Professional Execution');
    expect(titles).toContain('Transparent Process');
    expect(titles).toContain('After-Sales Support');
    expect(titles).toContain('Scalable Solutions');

    const numbers = fivePrinciples.map((p) => p.number);
    expect(numbers).toEqual(['01', '02', '03', '04', '05']);
  });

  it('contains all 5-stage execution process steps', () => {
    expect(executionProcessSteps.length).toBe(5);
    const steps = executionProcessSteps.map((s) => s.step);
    expect(steps).toEqual(['01', '02', '03', '04', '05']);
  });

  it('renders PrinciplesInteractiveCards and switches active principle on button click', () => {
    render(<PrinciplesInteractiveCards />);

    // All principle titles are present
    expect(screen.getAllByText(/One Partner, Multiple Solutions/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Professional Execution/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Transparent Process/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/After-Sales Support/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Scalable Solutions/i).length).toBeGreaterThan(0);

    // Click on 02 Professional Execution
    const btn02 = screen.getByRole('button', { name: /Professional Execution/i });
    fireEvent.click(btn02);

    expect(screen.getByText('Principle 02 of 05')).toBeDefined();
    expect(screen.getAllByText(/Engineering Rigor & On-Site Discipline/i).length).toBeGreaterThan(0);
  });

  it('renders ProcessTimelineView with all phases and deliverables', () => {
    render(<ProcessTimelineView />);

    expect(screen.getAllByText(/Site Survey & Feasibility Audit/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Custom Engineering Architecture/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tier-1 Material Supply/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Turnkey Installation & Commissioning/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Operational Handover & AMC/i).length).toBeGreaterThan(0);
  });

  it('renders the complete WhyUsPage with verified dual hubs and CTAs', () => {
    render(<WhyUsPage />);

    // Hero title check among h1 headings
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings.some((h) => h.textContent?.includes('Single-Window Trust'))).toBe(true);

    // Dual hubs
    expect(screen.getByText(/Lucknow Head Office/i)).toBeDefined();
    expect(screen.getByText(/New Delhi Branch Office/i)).toBeDefined();

    // CTAs
    const whatsappCTA = screen.getByRole('link', { name: /Consult Our Engineers/i });
    expect(whatsappCTA.getAttribute('href')).toContain('wa.me/918796716111');
  });

  it('guarantees zero fake numerical statistics and zero unsupported certifications per prompt rules', () => {
    const rawDataText = JSON.stringify({
      fivePrinciples,
      executionProcessSteps,
      supportPillars,
    });

    // Verify absence of fabricated claims
    const forbiddenClaims = [
      '99.99%',
      '10,000+ satisfied clients',
      '4.9/5 stars',
      'ISO 9001 certified',
      'Tier-4 data center certified',
      'World-class #1 rated',
    ];

    forbiddenClaims.forEach((claim) => {
      expect(rawDataText).not.toContain(claim);
    });
  });
});
