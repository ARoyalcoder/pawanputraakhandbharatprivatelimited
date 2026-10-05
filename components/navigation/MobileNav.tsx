'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import { mainNav } from '@/data/navigation';
import { Icon, WhatsAppIcon, FacebookIcon, InstagramIcon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { telHref, whatsappHref } from '@/lib/contact';
import { siteConfig } from '@/config/site.config';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const baseId = useId();

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.style.overflow = '';
      setExpanded(null);
    };
    const observer = new MutationObserver(() => {
      if (dialog.open) document.documentElement.style.overflow = 'hidden';
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    dialog.addEventListener('close', onClose);
    return () => {
      observer.disconnect();
      dialog.removeEventListener('close', onClose);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Open menu"
        aria-haspopup="dialog"
        className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-white/60 lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        data-lenis-prevent
        onClick={(e) => e.target === dialogRef.current && close()}
        className={cn(
          'fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md bg-transparent p-0 text-white',
          'translate-x-full transition-[translate,display,overlay] duration-500 ease-out-expo transition-discrete',
          'open:translate-x-0 starting:open:translate-x-full backdrop:bg-navy-950/70'
        )}
      >
        <div className="flex h-full flex-col bg-navy-950 bg-blueprint">
          <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-white/10 px-5">
            <Logo />
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="grid size-11 place-items-center rounded-full border border-white/20 transition-colors hover:border-white/60"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            <ul className="divide-y divide-white/[0.07]">
              {mainNav.map((item) => {
                const groupId = `${baseId}-${item.label}`;
                const isOpen = expanded === item.label;
                if (!item.children) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        aria-current={pathname === item.href ? 'page' : undefined}
                        className="flex items-center justify-between py-4 type-nav-lg aria-[current=page]:text-gold-300"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={groupId}
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                      className="flex w-full items-center justify-between py-4 text-left type-nav-lg"
                    >
                      {item.label}
                      <ChevronDown aria-hidden="true" className={cn('size-5 text-gold-300 transition-transform duration-300', isOpen && 'rotate-180')} />
                    </button>
                    <div
                      id={groupId}
                      inert={!isOpen}
                      className="grid transition-[grid-template-rows] duration-500 ease-out-expo"
                      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                    >
                      <ul className="overflow-hidden">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} className="flex items-center gap-3 rounded-lg py-2.5 pl-1 text-white/80 hover:text-white">
                              {child.icon && <Icon name={child.icon} size={18} className="text-gold-300" />}
                              <span>{child.label}</span>
                            </Link>
                          </li>
                        ))}
                        <li className="pb-4 pt-1">
                          <Link href={item.href} className="pl-1 text-small font-semibold text-gold-300">
                            View all {item.label.toLowerCase()} →
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0 space-y-3 border-t border-white/10 p-5">
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink href={telHref} variant="outline-light" icon={<Phone className="size-4" aria-hidden="true" />}>
                Call Now
              </ButtonLink>
              <ButtonLink href={whatsappHref()} variant="primary" icon={<WhatsAppIcon size={17} />}>
                WhatsApp
              </ButtonLink>
            </div>
            {siteConfig.social.length > 0 && (
              <div className="flex items-center justify-center gap-3 pt-1">
                {siteConfig.social.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:border-gold-400/50 hover:bg-gold-400/10 hover:text-gold-300 transition-colors"
                    aria-label={`Visit PPAB on ${s.label}`}
                    title={s.label}
                  >
                    {s.label === 'Facebook' && <FacebookIcon size={16} />}
                    {s.label === 'Instagram' && <InstagramIcon size={16} />}
                  </a>
                ))}
              </div>
            )}
            <p className="text-center type-caption text-white/50">{siteConfig.contact.phoneDisplay} · Lucknow · New Delhi</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
