import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow, accentTone } from './Typography';

export { Eyebrow };

interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  size?: 'h1' | 'h2' | 'h3';
  className?: string;
  children?: ReactNode;
}

const sizeClass = { h1: 'type-h1', h2: 'type-h2', h3: 'type-h3' } as const;

/**
 * Standard section heading: eyebrow → heading → description.
 * Wrap accent words in <em> to render them in the gold serif italic.
 */
export function SectionHeading({
  id,
  eyebrow,
  index,
  title,
  description,
  tone = 'light',
  align = 'left',
  as: Tag = 'h2',
  size = 'h2',
  className,
  children,
}: SectionHeadingProps) {
  const dark = tone === 'dark';
  return (
    <header className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <div
          data-reveal="fade"
          suppressHydrationWarning
          className={cn('mb-5', align === 'center' && 'flex justify-center')}
        >
          <Eyebrow index={index} tone={tone}>
            {eyebrow}
          </Eyebrow>
        </div>
      )}
      <Tag
        id={id}
        data-split
        suppressHydrationWarning
        className={cn(
          sizeClass[size],
          dark ? 'text-white' : 'text-navy-900',
          dark ? accentTone.dark : size === 'h3' ? accentTone.light : accentTone.lightLarge
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          data-reveal="up"
          suppressHydrationWarning
          className={cn('mt-5 max-w-2xl type-lead', dark ? 'text-white/75' : 'text-muted', align === 'center' && 'mx-auto')}
        >
          {description}
        </p>
      )}
      {children}
    </header>
  );
}
