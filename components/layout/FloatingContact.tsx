'use client';

import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { Magnetic } from '@/components/animation/Magnetic';
import { telHref, whatsappHref } from '@/lib/contact';
import { trackEvent } from '@/lib/analytics/tracker';
import { cn } from '@/lib/utils';

const itemClass =
  'group relative grid size-12 place-items-center rounded-full shadow-[0_12px_30px_-10px_rgb(2_11_29/0.55)] transition-transform duration-300 ease-out-expo hover:-translate-x-1';

function Tip({ children }: { children: string }) {
  return (
    <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-navy-950 px-3 py-1.5 type-caption font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
      {children}
    </span>
  );
}

/** Desktop-only contact rail; appears once the visitor scrolls past the hero. */
export function FloatingContact() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <aside
      aria-label="Quick contact"
      className={cn(
        'fixed bottom-8 right-6 z-40 hidden flex-col gap-3 transition-[opacity,translate] duration-500 ease-out-expo lg:flex',
        visible ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-4 opacity-0'
      )}
    >
      <Magnetic strength={0.3}>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with PPAB on WhatsApp"
          tabIndex={visible ? 0 : -1}
          onClick={() => trackEvent('whatsapp_click', { source: 'floating' })}
          className={cn(itemClass, 'bg-gold-500 text-navy-950')}
        >
          <WhatsAppIcon size={22} />
          <Tip>WhatsApp us</Tip>
        </a>
      </Magnetic>
      <Magnetic strength={0.3}>
        <a
          href={telHref}
          aria-label="Call PPAB"
          tabIndex={visible ? 0 : -1}
          onClick={() => trackEvent('call_click', { source: 'floating' })}
          className={cn(itemClass, 'border border-white/15 bg-navy-900 text-white')}
        >
          <Phone className="size-5" aria-hidden="true" />
          <Tip>Call now</Tip>
        </a>
      </Magnetic>
    </aside>
  );
}
