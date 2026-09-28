import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type SectionTone = 'light' | 'white' | 'dark' | 'darker';

const toneClasses: Record<SectionTone, string> = {
  light: 'bg-surface text-ink',
  white: 'bg-white text-ink',
  dark: 'bg-navy-900 text-white',
  darker: 'bg-navy-950 text-white',
};

export const isDarkTone = (tone: SectionTone) => tone === 'dark' || tone === 'darker';

type SectionProps = {
  tone?: SectionTone;
  spacing?: 'default' | 'compact' | 'none';
  children: ReactNode;
} & ComponentPropsWithoutRef<'section'>;

/** Page section with a surface tone. Dark tones switch daisyUI components to the night theme. */
export function Section({ tone = 'light', spacing = 'default', className, children, ...rest }: SectionProps) {
  return (
    <section
      data-theme={isDarkTone(tone) ? 'ppab-night' : 'ppab'}
      className={cn(
        'relative isolate',
        toneClasses[tone],
        spacing === 'default' && 'section-y',
        spacing === 'compact' && 'section-y-sm',
        className
      )}
      {...rest}
    >
      {children}
    </section>
  );
}

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'nav' | 'ul' | 'ol';
  children: ReactNode;
}

export function Container({ as = 'div', className, children, ...rest }: ContainerProps) {
  const Tag = as as 'div';
  return (
    <Tag className={cn('container-ppab', className)} {...rest}>
      {children}
    </Tag>
  );
}
