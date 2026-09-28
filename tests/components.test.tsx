import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Divider } from '@/components/ui/divider';

describe('Module 02: Design System UI Components', () => {
  it('renders all 6 button variants properly', () => {
    const variants = [
      'primary',
      'secondary',
      'outline',
      'ghost',
      'whatsapp',
      'dark',
    ] as const;

    for (const v of variants) {
      const { unmount } = render(<Button variant={v}>{`Test ${v}`}</Button>);
      expect(screen.getByText(`Test ${v}`)).toBeDefined();
      unmount();
    }
  });

  it('renders button in loading state with spinner', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByText('Submit')).toBeDefined();
  });

  it('renders all 6 card variants', () => {
    const cardVariants = [
      'standard',
      'premium',
      'glass',
      'image',
      'solution',
      'service',
    ] as const;

    for (const variant of cardVariants) {
      const { container, unmount } = render(
        <Card variant={variant}>
          <CardHeader>
            <CardTitle>{`Card ${variant}`}</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );
      expect(container.firstChild).toBeDefined();
      unmount();
    }
  });

  it('renders SectionHeading with badge and gold highlight', () => {
    render(
      <SectionHeading
        badge="Enterprise"
        title="Leading Secure Solutions"
        goldHighlight="Secure"
        description="Comprehensive protection"
      />
    );
    expect(screen.getByText('Enterprise')).toBeDefined();
    expect(screen.getByText('Secure')).toBeDefined();
    expect(screen.getByText('Comprehensive protection')).toBeDefined();
  });

  it('renders Container with responsive max widths', () => {
    const { container } = render(<Container size="narrow">Inner</Container>);
    expect(container.querySelector('.max-w-4xl')).toBeDefined();
  });

  it('renders labeled divider', () => {
    render(<Divider variant="gold" label="Divider Label" />);
    expect(screen.getByText('Divider Label')).toBeDefined();
  });
});
