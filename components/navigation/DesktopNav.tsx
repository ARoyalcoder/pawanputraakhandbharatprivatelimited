'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { mainNav } from '@/data/navigation';
import { Icon } from '@/components/ui/Icon';
import type { NavItem } from '@/types/content';
import { cn } from '@/lib/utils';

const isActive = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

export function DesktopNav() {
  const pathname = usePathname();
  // Remember which route a dropdown was opened on, so navigating closes it without an effect.
  const [open, setOpen] = useState<{ label: string; path: string } | null>(null);
  const openLabel = open?.path === pathname ? open.label : null;
  const setOpenLabel = (label: string | null) => setOpen(label ? { label, path: pathname } : null);

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-0.5 xl:gap-1">
        {mainNav.map((item) =>
          item.children ? (
            <DropdownItem
              key={item.label}
              item={item}
              active={isActive(pathname, item.href)}
              open={openLabel === item.label}
              onOpenChange={(open) => setOpenLabel(open ? item.label : null)}
            />
          ) : (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={cn(
                  'rounded-full px-2.5 py-2 text-[0.9rem] font-medium transition-colors xl:px-3.5',
                  isActive(pathname, item.href) ? 'text-gold-300' : 'text-white/80 hover:text-white'
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </nav>
  );
}

interface DropdownItemProps {
  item: NavItem;
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DropdownItem({ item, active, open, onOpenChange }: DropdownItemProps) {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLLIElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSolutions = item.label === 'Solutions';

  const schedule = useCallback(
    (next: boolean, delay: number) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => onOpenChange(next), delay);
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, onOpenChange]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      onOpenChange(false);
      triggerRef.current?.focus();
    }
  };

  const onBlur = (e: FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) onOpenChange(false);
  };

  return (
    <li
      ref={containerRef}
      className="relative"
      onPointerEnter={(e) => e.pointerType === 'mouse' && schedule(true, 90)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && schedule(false, 160)}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className={cn(
          'flex items-center gap-1 rounded-full px-2.5 py-2 text-[0.9rem] font-medium transition-colors xl:px-3.5',
          active || open ? 'text-gold-300' : 'text-white/80 hover:text-white'
        )}
      >
        {item.label}
        <ChevronDown aria-hidden="true" className={cn('size-3.5 transition-transform duration-300', open && 'rotate-180')} />
      </button>

      <div
        id={panelId}
        inert={!open}
        className={cn(
          'absolute top-full pt-4 transition-[opacity,translate] duration-300 ease-out-expo',
          isSolutions ? '-left-40 w-[46rem]' : '-left-24 w-[34rem]',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        )}
      >
        <div className="overflow-hidden rounded-card border border-white/10 bg-navy-900/95 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] backdrop-blur-xl">
          <div className={cn('grid gap-1 p-3', isSolutions ? 'grid-cols-[1fr_15rem]' : 'grid-cols-1')}>
            <ul className={cn('grid gap-1', isSolutions ? 'grid-cols-1' : 'grid-cols-2')}>
              {item.children?.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="group flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-white/[0.05] focus-visible:bg-white/[0.05]"
                  >
                    {child.icon && (
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-gold-300 transition-colors group-hover:border-gold-500/40">
                        <Icon name={child.icon} size={18} />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block text-[0.92rem] font-semibold text-white">{child.label}</span>
                      {child.description && (
                        <span className={cn('mt-0.5 block text-[0.8rem] text-white/55', isSolutions && 'italic')}>
                          {child.description}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {isSolutions && (
              <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-navy-950 p-5 bg-blueprint">
                <div>
                  <p className="font-mono text-caption uppercase text-gold-300">One partner</p>
                  <p className="mt-3 text-h4 text-white">Five divisions. One trusted team.</p>
                  <p className="mt-2 text-small text-white/60">Security, connectivity, solar, digital and infrastructure, planned together.</p>
                </div>
                <Link href={item.href} className="mt-6 inline-flex items-center gap-2 text-small font-semibold text-gold-300 hover:text-gold-200">
                  All solutions <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            )}
          </div>
          {!isSolutions && (
            <div className="border-t border-white/10 px-6 py-3.5">
              <Link href={item.href} className="inline-flex items-center gap-2 text-small font-semibold text-gold-300 hover:text-gold-200">
                All industries <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
