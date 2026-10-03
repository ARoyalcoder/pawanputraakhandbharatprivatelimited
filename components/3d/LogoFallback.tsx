import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface LogoFallbackProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  tone?: 'light' | 'dark';
  className?: string;
  isLink?: boolean;
}

const sizeDimensions = {
  sm: { box: 'size-10', img: 40 },
  md: { box: 'size-12', img: 48 },
  lg: { box: 'size-16', img: 64 },
  hero: { box: 'size-24 sm:size-28 lg:size-32', img: 128 },
};

/**
 * Accessible, static fallback for the PPAB Logo.
 * Renders the official PPAB mark with high-fidelity metallic sheen styles.
 * Ensures complete accessibility, SEO indexing, and keyboard navigation.
 */
export function LogoFallback({
  size = 'md',
  showText = true,
  tone = 'dark',
  className,
  isLink = true,
}: LogoFallbackProps) {
  const dims = sizeDimensions[size];

  const content = (
    <div className={cn('group relative inline-flex items-center gap-3 select-none', className)}>
      <div
        className={cn(
          'relative grid place-items-center rounded-full transition-transform duration-500 ease-out-expo group-hover:scale-105',
          dims.box
        )}
      >
        {/* Soft gold ambient glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gold-500/15 blur-sm transition-opacity duration-300 group-hover:opacity-100 opacity-60"
        />

        <Image
          src="/brand/ppab-mark.png"
          alt="Pawan Putra Akhand Bharat official brand mark"
          width={dims.img}
          height={dims.img}
          priority
          className="relative z-10 size-full object-contain filter drop-shadow-[0_2px_8px_rgba(216,166,42,0.35)]"
        />
      </div>

      {showText && (
        <span className="flex flex-col leading-none">
          <span className={cn('type-wordmark tracking-tight', tone === 'dark' ? 'text-white' : 'text-navy-900')}>
            Pawan Putra
          </span>
          <span
            className={cn(
              'mt-1 type-wordmark-sub font-semibold',
              tone === 'dark' ? 'text-gold-300' : 'text-gold-700'
            )}
          >
            Akhand Bharat
          </span>
        </span>
      )}
    </div>
  );

  if (!isLink) return content;

  return (
    <Link href="/" aria-label="Pawan Putra Akhand Bharat - Return to Homepage">
      {content}
    </Link>
  );
}
