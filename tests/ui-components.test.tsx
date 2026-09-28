import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Accordion } from '@/components/ui/Accordion';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { parseMarkdown, headingsOf } from '@/lib/blog/markdown';
import { cn } from '@/lib/utils';

const items = [
  { id: 'one', question: 'First question?', answer: 'First answer.' },
  { id: 'two', question: 'Second question?', answer: 'Second answer.' },
  { id: 'three', question: 'Third question?', answer: 'Third answer.' },
];

describe('Accordion', () => {
  it('opens the default panel and wires ARIA relationships', () => {
    render(<Accordion items={items} defaultOpenId="one" />);
    const first = screen.getByRole('button', { name: 'First question?' });
    expect(first).toHaveProperty('ariaExpanded', 'true');
    const panel = document.getElementById(first.getAttribute('aria-controls')!);
    expect(panel?.getAttribute('role')).toBe('region');
    expect(panel?.getAttribute('aria-labelledby')).toBe(first.id);
  });

  it('toggles panels on click and makes collapsed panels inert', () => {
    render(<Accordion items={items} />);
    const second = screen.getByRole('button', { name: 'Second question?' });
    const panel = document.getElementById(second.getAttribute('aria-controls')!)!;
    expect(panel.hasAttribute('inert')).toBe(true);
    fireEvent.click(second);
    expect(second.getAttribute('aria-expanded')).toBe('true');
    expect(panel.hasAttribute('inert')).toBe(false);
  });

  it('moves focus between headers with arrow, Home and End keys', () => {
    render(<Accordion items={items} />);
    const [a, b, c] = screen.getAllByRole('button');
    a.focus();
    fireEvent.keyDown(a, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(b);
    fireEvent.keyDown(b, { key: 'End' });
    expect(document.activeElement).toBe(c);
    fireEvent.keyDown(c, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(a);
  });
});

describe('Breadcrumbs', () => {
  it('marks the current page and links the rest', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Solutions', href: '/solutions' },
          { label: 'Secure', href: '/solutions/secure' },
        ]}
      />
    );
    expect(screen.getByText('Secure').getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: 'Solutions' }).getAttribute('href')).toBe('/solutions');
  });
});

describe('Markdown', () => {
  it('parses headings, paragraphs and both list types', () => {
    const blocks = parseMarkdown('## Title\n\nIntro **bold** text.\n\n- one\n- two\n\n1. first\n2. second\n### Sub');
    expect(blocks.map((b) => b.type)).toEqual(['h2', 'p', 'ul', 'ol', 'h3']);
    expect(headingsOf('## A heading\n## Another one')).toEqual([
      { id: 'a-heading', text: 'A heading' },
      { id: 'another-one', text: 'Another one' },
    ]);
  });
});

describe('cn', () => {
  it('keeps custom font sizes alongside text colours', () => {
    expect(cn('text-h2 text-navy-900', 'text-white')).toBe('text-h2 text-white');
    expect(cn('text-button', 'text-small')).toBe('text-small');
  });
});
