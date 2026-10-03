import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Crumb {
  label: string;
  href: string;
}

/** Visible breadcrumb trail; pair with breadcrumbSchema() for structured data. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('type-meta', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-white/55">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-white/90">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="link-underline transition-colors hover:text-white">
                    {item.label}
                  </Link>
                  <ChevronRight aria-hidden="true" className="size-3.5 opacity-60" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
