import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EyebrowProps {
  children: ReactNode;
  index?: string;
  tone?: 'light' | 'dark';
  className?: string;
}

/** Mono micro-label with the gold hairline taken from the PPAB logo lockup. */
export function Eyebrow({ children, index, tone = 'light', className }: EyebrowProps) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-3 font-mono text-caption uppercase',
        tone === 'dark' ? 'text-gold-300' : 'text-gold-700',
        className
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-70" />
      {index && <span className={tone === 'dark' ? 'text-white/45' : 'text-navy-900/40'}>{index}</span>}
      <span>{children}</span>
    </p>
  );
}

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

/**
 * Standard section heading. Wrap accent words in <em> to render them in the
 * gold serif italic used across the site.
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
        <div data-reveal="fade" className={cn('mb-5', align === 'center' && 'flex justify-center')}>
          <Eyebrow index={index} tone={tone}>
            {eyebrow}
          </Eyebrow>
        </div>
      )}
      <Tag
        id={id}
        data-split
        className={cn(
          'text-balance font-display',
          size === 'h1' && 'text-h1',
          size === 'h2' && 'text-h2',
          size === 'h3' && 'text-h3',
          dark ? 'text-white' : 'text-navy-900',
          '[&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-normal',
          dark ? '[&_em]:text-gold-300' : '[&_em]:text-gold-600'
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          data-reveal="up"
          className={cn('mt-5 text-pretty text-body-lg', dark ? 'text-white/70' : 'text-muted', align === 'center' && 'mx-auto')}
        >
          {description}
        </p>
      )}
      {children}
    </header>
  );
}
