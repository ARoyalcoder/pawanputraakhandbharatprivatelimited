'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { mainNav } from '@/data/navigation';
import { Icon } from '@/components/ui/Icon';
import type { NavItem, NavLink } from '@/types/content';
import { cn } from '@/lib/utils';

const GOLD = '#f4c95d';

const isActive = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

const labelClass = (active: boolean) =>
  cn(
    'relative after:absolute after:inset-x-0 after:-bottom-1.5 after:h-[1.5px] after:rounded-full after:bg-current',
    'after:origin-left after:transition-[scale,opacity] after:duration-300 after:ease-out motion-reduce:after:transition-none',
    active ? 'after:scale-x-100' : 'after:scale-x-0 after:opacity-40 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100'
  );

export function DesktopNav({ media }: { media?: unknown }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<{ label: string; path: string } | null>(null);
  const openLabel = open?.path === pathname ? open.label : null;
  const setOpenLabel = (label: string | null) => setOpen(label ? { label, path: pathname } : null);

  return (
    <nav aria-label="Main navigation" className="hidden lg:block">
      <ul className="relative flex items-center gap-0.5 xl:gap-1">
        {mainNav.map((item) =>
          item.children ? (
            <NormalDropdown
              key={item.label}
              item={item}
              links={item.children}
              active={isActive(pathname, item.href)}
              open={openLabel === item.label}
              onOpenChange={(next) => setOpenLabel(next ? item.label : null)}
            />
          ) : (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={cn(
                  'group inline-flex rounded-full px-2.5 py-2 text-[0.92rem] font-medium transition-colors xl:px-3.5',
                  isActive(pathname, item.href) ? 'text-gold-300' : 'text-white/80 hover:text-white'
                )}
              >
                <span className={labelClass(isActive(pathname, item.href))}>{item.label}</span>
              </Link>
            </li>
          )
        )}
      </ul>
    </nav>
  );
}

interface NormalDropdownProps {
  item: NavItem;
  links: NavLink[];
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Normal, clean, elegant dropdown popup for Solutions and Industries.
 * Lightweight, fast, and stays neatly aligned beneath the menu item.
 */
function NormalDropdown({ item, links, active, open, onOpenChange }: NormalDropdownProps) {
  const pathname = usePathname();
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

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

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
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return;
        schedule(true, 80);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return;
        schedule(false, 150);
      }}
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
          'group flex items-center gap-1 rounded-full px-2.5 py-2 text-[0.92rem] font-medium transition-colors xl:px-3.5 select-none cursor-pointer',
          active || open ? 'text-gold-300' : 'text-white/80 hover:text-white'
        )}
      >
        <span className={labelClass(active)}>{item.label}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'size-3.5 transition-transform duration-250 opacity-70 group-hover:opacity-100',
            open && 'rotate-180 opacity-100'
          )}
        />
      </button>

      {/* Normal Dropdown Popover */}
      <div
        id={panelId}
        inert={!open}
        className={cn(
          'absolute top-full pt-2.5 z-50 transition-all duration-200 ease-out',
          isSolutions ? '-left-6 w-[24rem]' : '-left-20 sm:-left-32 w-[32rem]',
          open
            ? 'visible opacity-100 translate-y-0 pointer-events-auto'
            : 'invisible opacity-0 -translate-y-2 pointer-events-none'
        )}
      >
        <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#040e22]/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-2.5">
          {/* List or 2-column Grid of Items */}
          <ul
            className={cn(
              'gap-1.5',
              isSolutions ? 'flex flex-col' : 'grid grid-cols-2'
            )}
          >
            {links.map((link) => {
              const tone = link.accent ?? GOLD;
              const isCurrentPage = pathname === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => onOpenChange(false)}
                    aria-current={isCurrentPage ? 'page' : undefined}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 outline-none',
                      isCurrentPage
                        ? 'bg-white/[0.08] text-white'
                        : 'hover:bg-white/[0.06] text-white/90 hover:text-white'
                    )}
                  >
                    {link.icon && (
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] transition-colors group-hover:border-gold-400/40"
                        style={{ color: tone }}
                      >
                        <Icon name={link.icon} size={17} />
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold tracking-wide text-white group-hover:text-gold-200 transition-colors">
                        {link.label}
                      </span>
                      {link.description && (
                        <span className="block truncate text-xs text-white/50 group-hover:text-white/75 transition-colors">
                          {link.description}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Clean Bottom Footer Row */}
          <div className="mt-2 flex items-center justify-between border-t border-white/10 px-3 pt-2.5 pb-0.5">
            <Link
              href={item.href}
              onClick={() => onOpenChange(false)}
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300 hover:text-gold-200 transition-colors"
            >
              <span>All {item.label.toLowerCase()}</span>
              <ArrowRight className="size-3 transition-transform duration-250 group-hover:translate-x-1" />
            </Link>

            <span className="text-[11px] font-mono text-white/40">
              {links.length} {isSolutions ? 'Divisions' : 'Sectors'}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}
