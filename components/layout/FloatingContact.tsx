'use client';

import type { ReactNode } from 'react';
import { Phone } from 'lucide-react';
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from '@/components/ui/Icon';
import { siteConfig } from '@/config/site.config';
import { telHref, whatsappHref } from '@/lib/contact';
import { trackEvent } from '@/lib/analytics/tracker';
import { cn } from '@/lib/utils';

const itemClass =
  'group relative grid size-12 place-items-center text-white transition-[filter] duration-200 hover:brightness-110 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300';

/** Brand colour and icon for each social profile listed in siteConfig.social. */
const socialStyles: Record<string, { className: string; icon: ReactNode }> = {
  Instagram: {
    className: 'bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]',
    icon: <InstagramIcon size={22} />,
  },
  Facebook: { className: 'bg-[#1877f2]', icon: <FacebookIcon size={22} /> },
  YouTube: { className: 'bg-[#ff0000]', icon: <YouTubeIcon size={24} /> },
};

/** Display order of the social tiles, whatever order the profiles are listed in. */
const socialOrder = Object.keys(socialStyles);
const socialProfiles = [...siteConfig.social].sort((a, b) => socialOrder.indexOf(a.label) - socialOrder.indexOf(b.label));

function Tip({ children }: { children: string }) {
  return (
    <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-full bg-navy-950 px-3 py-1.5 type-caption font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
      {children}
    </span>
  );
}

/**
 * Contact and social rail pinned to the right edge of the page: WhatsApp, call, then every
 * profile in siteConfig.social. Tablet and desktop only; phones have the bottom action bar.
 */
export function FloatingContact() {
  return (
    <aside
      aria-label="Quick contact and social media"
      className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col overflow-visible shadow-[0_12px_30px_-10px_rgb(2_11_29/0.55)] md:flex"
    >
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with PPAB on WhatsApp"
        onClick={() => trackEvent('whatsapp_click', { source: 'floating' })}
        className={cn(itemClass, 'bg-[#25d366]')}
      >
        <WhatsAppIcon size={24} />
        <Tip>WhatsApp us</Tip>
      </a>
      <a
        href={telHref}
        aria-label="Call PPAB"
        onClick={() => trackEvent('call_click', { source: 'floating' })}
        className={cn(itemClass, 'bg-[#3b5998]')}
      >
        <Phone className="size-5" fill="currentColor" strokeWidth={0} aria-hidden="true" />
        <Tip>Call now</Tip>
      </a>
      {socialProfiles.map((profile) => {
        const style = socialStyles[profile.label];
        if (!style) return null;
        return (
          <a
            key={profile.label}
            href={profile.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit PPAB on ${profile.label}`}
            className={cn(itemClass, style.className)}
          >
            {style.icon}
            <Tip>{profile.label}</Tip>
          </a>
        );
      })}
    </aside>
  );
}
