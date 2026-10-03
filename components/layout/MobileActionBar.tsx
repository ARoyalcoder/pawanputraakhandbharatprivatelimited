'use client';

import { FileText, Phone } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { useQuote } from '@/components/forms/QuoteProvider';
import { telHref, whatsappHref } from '@/lib/contact';
import { trackEvent } from '@/lib/analytics/tracker';

const cell = 'flex flex-1 flex-col items-center justify-center gap-1 type-caption font-semibold';

/** Sticky bottom bar on phones and small tablets: Call · WhatsApp · Get Quote. */
export function MobileActionBar() {
  const { openQuote } = useQuote();

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <div className="flex h-16 items-stretch text-white">
        <a href={telHref} className={cell} onClick={() => trackEvent('call_click', { source: 'mobile-bar' })}>
          <Phone className="size-5 text-gold-300" aria-hidden="true" />
          Call
        </a>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className={`${cell} border-x border-white/10`}
          onClick={() => trackEvent('whatsapp_click', { source: 'mobile-bar' })}
        >
          <WhatsAppIcon size={20} className="text-gold-300" />
          WhatsApp
        </a>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => openQuote({ source: 'mobile-bar' })}
          className={`${cell} bg-gold-500 text-navy-950`}
        >
          <FileText className="size-5" aria-hidden="true" />
          Get Quote
        </button>
      </div>
    </nav>
  );
}
