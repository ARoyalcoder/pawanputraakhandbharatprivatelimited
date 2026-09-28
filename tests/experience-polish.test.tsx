import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageTransition } from '@/components/layout/PageTransition';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Module 34: Premium Experience Polish & Micro-Interactions', () => {
  it('renders PageTransition with motion-reduce safety class', () => {
    const { container } = render(
      <PageTransition>
        <div>Content Inside Page Transition</div>
      </PageTransition>
    );

    expect(screen.getByText('Content Inside Page Transition')).toBeDefined();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('motion-reduce:transition-none');
  });

  it('renders ScrollReveal with transition delay and entrance opacity styles', () => {
    const { container } = render(
      <ScrollReveal delayMs={150}>
        <div>Animated Section Content</div>
      </ScrollReveal>
    );

    expect(screen.getByText('Animated Section Content')).toBeDefined();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('duration-500');
    expect(wrapper.style.transitionDelay).toBe('150ms');
  });
});
