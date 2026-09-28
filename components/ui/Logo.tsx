import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  tone?: 'light' | 'dark';
  className?: string;
  compact?: boolean;
}

/** PPAB lockup: the gold mark with a typeset company name for crisp rendering at small sizes. */
export function Logo({ tone = 'dark', className, compact = false }: LogoProps) {
  return (
    <Link href="/" aria-label="Pawan Putra Akhand Bharat, home" className={cn('group inline-flex items-center gap-3', className)}>
      <Image
        src="/brand/ppab-mark.png"
        alt=""
        width={331}
        height={320}
        priority
        sizes="48px"
        className="h-10 w-auto transition-transform duration-500 ease-out-expo group-hover:scale-[1.04] sm:h-11"
      />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={cn('text-[0.95rem] font-bold tracking-[0.02em]', tone === 'dark' ? 'text-white' : 'text-navy-900')}>
            Pawan Putra
          </span>
          <span
            className={cn(
              'mt-1 font-mono text-[0.6rem] uppercase tracking-[0.22em]',
              tone === 'dark' ? 'text-gold-300' : 'text-gold-700'
            )}
          >
            Akhand Bharat
          </span>
        </span>
      )}
    </Link>
  );
}
