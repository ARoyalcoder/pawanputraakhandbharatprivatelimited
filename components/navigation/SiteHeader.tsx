'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { DesktopNav } from '@/components/navigation/DesktopNav';
import { MobileNav } from '@/components/navigation/MobileNav';
import { telHref, whatsappHref } from '@/lib/contact';
import type { NavMedia } from '@/lib/media/nav-media';
import { cn } from '@/lib/utils';

/**
 * Fixed site header. Starts transparent over the dark page hero; once the page scrolls,
 * the utility bar slides away and the header compacts onto a navy glass surface.
 */
export function SiteHeader({ utilityBar, navMedia }: { utilityBar: ReactNode; navMedia?: NavMedia }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return (
    <div
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out-expo',
        scrolled && 'lg:-translate-y-10'
      )}
    >
      {utilityBar}
      <header
        className={cn(
          'transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-out-expo',
          scrolled
            ? 'bg-navy-950/85 shadow-[0_1px_0_rgb(255_255_255/0.06),0_20px_40px_-24px_rgb(0_0_0/0.6)] backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <div
          className={cn(
            'container-ppab flex items-center justify-between gap-6 transition-[height] duration-500 ease-out-expo',
            scrolled ? 'h-16 lg:h-[4.25rem]' : 'h-[4.5rem] lg:h-20'
          )}
        >
          <Logo className="lg:hidden xl:inline-flex" />
          <Logo compact className="hidden lg:inline-flex xl:hidden" />

          <DesktopNav media={navMedia} />

          <div className="flex items-center gap-2.5">
            <a
              href={telHref}
              aria-label="Call PPAB"
              className="hidden size-10 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-white/60 lg:grid xl:hidden"
            >
              <Phone className="size-4" aria-hidden="true" />
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with PPAB on WhatsApp"
              className="hidden size-10 place-items-center rounded-full bg-gold-500 text-navy-950 transition-colors hover:bg-gold-400 lg:grid xl:hidden"
            >
              <WhatsAppIcon size={18} />
            </a>
            <ButtonLink
              href={telHref}
              variant="outline-light"
              size="sm"
              icon={<Phone className="size-4" aria-hidden="true" />}
              className="hidden xl:inline-flex"
            >
              Call Now
            </ButtonLink>
            <ButtonLink
              href={whatsappHref()}
              variant="primary"
              size="sm"
              icon={<WhatsAppIcon size={17} />}
              className="hidden xl:inline-flex"
            >
              WhatsApp
            </ButtonLink>
            <MobileNav />
          </div>
        </div>
      </header>
    </div>
  );
}
