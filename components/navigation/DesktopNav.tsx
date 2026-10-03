'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { mainNav } from '@/data/navigation';
import { AIImageView } from '@/components/media/AIImageView';
import { IllustrativeLabel } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import type { NavMedia } from '@/lib/media/nav-media';
import type { NavItem, NavLink } from '@/types/content';
import { cn } from '@/lib/utils';

const GOLD = '#f4c95d';

const isActive = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

/**
 * Label with the active indicator: a hairline that draws in under the current section and
 * previews on hover. Uses currentColor, so it is gold when active and white on hover.
 */
const labelClass = (active: boolean) =>
  cn(
    'relative after:absolute after:inset-x-0 after:-bottom-1.5 after:h-[1.5px] after:rounded-full after:bg-current',
    'after:origin-left after:transition-[scale,opacity] after:duration-500 after:ease-out-expo motion-reduce:after:transition-none',
    active ? 'after:scale-x-100' : 'after:scale-x-0 after:opacity-40 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100'
  );

export function DesktopNav({ media }: { media?: NavMedia }) {
  const pathname = usePathname();
  // Remember which route a menu was opened on, so navigating closes it without an effect.
  const [open, setOpen] = useState<{ label: string; path: string } | null>(null);
  const openLabel = open?.path === pathname ? open.label : null;
  const setOpenLabel = (label: string | null) => setOpen(label ? { label, path: pathname } : null);

  return (
    <nav aria-label="Main" className="hidden lg:block">
      {/* Menus are centred under this list, so they stay on screen at every desktop width. */}
      <ul className="relative flex items-center gap-0.5 xl:gap-1">
        {mainNav.map((item) =>
          item.children ? (
            <MegaMenu
              key={item.label}
              item={item}
              links={item.children}
              media={media}
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
                  'group inline-flex rounded-full px-2.5 py-2 type-nav transition-colors xl:px-3.5',
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

interface MegaMenuProps {
  item: NavItem;
  links: NavLink[];
  media?: NavMedia;
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Row heights and columns per menu; the highlight and the keyboard grid both follow these. */
const layouts = {
  list: { columns: 1, row: '4.25rem', width: 'w-[46rem] xl:w-[50rem]', split: 'grid-cols-[minmax(0,1fr)_18.5rem]' },
  grid: { columns: 2, row: '4.25rem', width: 'w-[46rem] xl:w-[48rem]', split: 'grid-cols-[minmax(0,1fr)_18.5rem]' },
} as const;
const GAP = '0.25rem';

/**
 * A menu you explore rather than read: a compact list on the left, and on the right a live
 * preview of whichever entry is under the pointer or focus (image, tagline, a few services,
 * one action). A highlight glides between entries and the preview cross-fades, so the panel
 * answers every movement. All copy comes from the verified division and industry data.
 */
function MegaMenu({ item, links, media, active, open, onOpenChange }: MegaMenuProps) {
  const pathname = usePathname();
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLLIElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const layout = item.label === 'Solutions' ? layouts.list : layouts.grid;
  const { columns } = layout;

  // Start on the entry for the page you are on.
  const [current, setCurrent] = useState(() => Math.max(0, links.findIndex((l) => pathname.startsWith(l.href))));
  // Preview images (about 15 KB each) are requested when someone first reaches for the menu,
  // all together, so every preview is already there by the time an entry is hovered.
  const [armed, setArmed] = useState(false);
  const entry = links[current] ?? links[0];
  const accent = entry.accent ?? GOLD;

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

  // Arrow keys move through the entries like a grid.
  const onLinkKey = (e: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    const step = e.key === 'ArrowDown' ? columns : e.key === 'ArrowUp' ? -columns : e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    const target = index + step;
    if (target < 0 || target >= links.length) return;
    e.preventDefault();
    linkRefs.current[target]?.focus();
  };

  const col = current % columns;
  const row = Math.floor(current / columns);

  return (
    <li
      ref={containerRef}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return;
        setArmed(true);
        schedule(true, 90);
      }}
      onPointerLeave={(e) => e.pointerType === 'mouse' && schedule(false, 160)}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onFocus={() => setArmed(true)}
        onClick={() => {
          setArmed(true);
          onOpenChange(!open);
        }}
        className={cn(
          'group flex items-center gap-1 rounded-full px-2.5 py-2 type-nav transition-colors xl:px-3.5',
          active || open ? 'text-gold-300' : 'text-white/80 hover:text-white'
        )}
      >
        <span className={labelClass(active)}>{item.label}</span>
        <ChevronDown aria-hidden="true" className={cn('size-3.5 transition-transform duration-300', open && 'rotate-180')} />
      </button>

      <div
        id={panelId}
        inert={!open}
        className={cn(
          'absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition-[opacity,translate,visibility] duration-300 ease-out-expo',
          layout.width,
          open ? 'visible translate-y-0 opacity-100' : 'pointer-events-none invisible -translate-y-2 opacity-0'
        )}
      >
        <div className="overflow-hidden rounded-2xl border border-white/12 bg-navy-950/95 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.85)] backdrop-blur-2xl">
          <div className={cn('grid gap-3 p-3', layout.split)}>
            {/* Entries */}
            <ul className="relative grid content-start" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: GAP }}>
              {/* Highlight that glides to the current entry */}
              <li
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 rounded-xl bg-white/[0.07] ring-1 ring-inset ring-white/10 transition-transform duration-500 ease-out-expo motion-reduce:transition-none"
                style={{
                  height: layout.row,
                  width: columns === 1 ? '100%' : `calc((100% - ${GAP}) / ${columns})`,
                  transform: `translate(calc(${col} * (100% + ${GAP})), calc(${row} * (${layout.row} + ${GAP})))`,
                }}
              >
                <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full transition-colors duration-500" style={{ backgroundColor: accent }} />
              </li>

              {links.map((link, i) => {
                const selected = i === current;
                const tone = link.accent ?? GOLD;
                return (
                  <li
                    key={link.href}
                    className={cn('transition-[opacity,translate] duration-500 ease-out-expo motion-reduce:transition-none', open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0')}
                    style={{ transitionDelay: open ? `${60 + i * 35}ms` : '0ms' }}
                  >
                    <Link
                      ref={(el) => {
                        linkRefs.current[i] = el;
                      }}
                      href={link.href}
                      aria-current={pathname === link.href ? 'page' : undefined}
                      onPointerEnter={() => setCurrent(i)}
                      onFocus={() => setCurrent(i)}
                      onKeyDown={(e) => onLinkKey(e, i)}
                      className="group/row relative flex items-center gap-3.5 rounded-xl px-3 outline-offset-[-2px]"
                      style={{ height: layout.row }}
                    >
                      {columns === 1 && <span className={cn('w-5 type-index transition-colors duration-300', selected ? 'text-white/80' : 'text-white/40')}>{String(i + 1).padStart(2, '0')}</span>}
                      {link.icon && (
                        <span
                          className={cn(
                            'grid shrink-0 place-items-center rounded-xl border transition-[color,background-color,border-color,scale] duration-300',
                            columns === 1 ? 'size-11' : 'size-9',
                            selected ? 'scale-105' : 'border-white/10 bg-white/[0.03] text-white/60'
                          )}
                          style={selected ? { color: tone, borderColor: `${tone}66`, backgroundColor: `${tone}1f` } : undefined}
                        >
                          <Icon name={link.icon} size={columns === 1 ? 20 : 17} />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className={cn('block truncate type-body-sm font-semibold transition-colors duration-300', selected ? 'text-white' : 'text-white/80')}>{link.label}</span>
                        {columns === 1 && link.description && (
                          <span className="block truncate type-tagline-sm text-[0.9375rem] transition-opacity duration-300" style={{ color: tone, opacity: selected ? 1 : 0.78 }}>
                            {link.description}
                          </span>
                        )}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className={cn('size-4 shrink-0 transition-[opacity,translate] duration-300', selected ? 'translate-x-0 opacity-100' : '-translate-x-1.5 opacity-0')}
                        style={{ color: tone }}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Live preview. Mouse convenience only: every destination is also a link in the list. */}
            <div aria-hidden="true" className="relative isolate overflow-hidden rounded-xl border border-white/10 bg-navy-900">
              {armed &&
                links.map((link, i) => {
                  const image = media?.[link.href];
                  return image ? (
                    <div
                      key={link.href}
                      className={cn('absolute inset-0 transition-[opacity,scale] duration-700 ease-out-expo motion-reduce:transition-none', i === current ? 'scale-100 opacity-100' : 'scale-110 opacity-0')}
                    >
                      <AIImageView image={image} showLabel={false} loading="eager" sizes="320px" imgClassName="object-cover" />
                    </div>
                  ) : null;
                })}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/35" />
              <div className="absolute inset-0 mix-blend-soft-light transition-colors duration-700" style={{ backgroundColor: `${accent}55` }} />

              <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-navy-950/65 px-2.5 py-1 type-index text-white/85 backdrop-blur-sm">
                  {String(current + 1).padStart(2, '0')} / {String(links.length).padStart(2, '0')}
                </span>
                {media?.[entry.href]?.src && <IllustrativeLabel />}
              </div>

              {/* Re-keyed per entry so the copy rises in again on every change */}
              <div key={entry.href} className="absolute inset-x-0 bottom-0 p-4">
                <p className="menu-rise type-h4 text-white text-legible">{entry.short ?? entry.label}</p>
                {entry.description && (
                  <p
                    className={cn('menu-rise mt-0.5 text-legible', columns === 1 ? 'type-tagline-sm' : 'type-caption font-normal text-white/85')}
                    style={{ animationDelay: '40ms', ...(columns === 1 ? { color: accent } : {}) }}
                  >
                    {entry.description}
                  </p>
                )}
                {entry.chips && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {entry.chips.map((chip, i) => (
                      <li
                        key={chip}
                        className="menu-rise rounded-full border border-white/15 bg-navy-950/55 px-2.5 py-1 type-caption text-white/85 backdrop-blur-sm"
                        style={{ animationDelay: `${90 + i * 45}ms` }}
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={entry.href}
                  tabIndex={-1}
                  className="menu-rise group/cta mt-4 flex h-10 items-center justify-between rounded-full px-4 type-button text-navy-950 transition-[filter] hover:brightness-110"
                  style={{ backgroundColor: accent, animationDelay: '220ms' }}
                >
                  Explore {entry.short ?? entry.label}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-3">
            <Link href={item.href} className="group/all inline-flex items-center gap-1.5 type-body-sm font-semibold text-gold-300 hover:text-gold-200">
              All {item.label.toLowerCase()}
              <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/all:translate-x-1" />
            </Link>
            <Link href="/contact#quote" className="group/talk inline-flex items-center gap-1.5 type-body-sm text-white/65 hover:text-white">
              Not sure which fits? <span className="font-semibold text-white">Talk to our team</span>
              <ArrowUpRight aria-hidden="true" className="size-4 text-gold-300 transition-transform duration-300 group-hover/talk:-translate-y-0.5 group-hover/talk:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}
