'use client';

import dynamic from 'next/dynamic';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { DivisionId } from '@/types/content';
import { leadOptions } from '@/lib/validations/lead-options';

// Form code (React Hook Form + Zod) loads the first time the dialog opens, not on every page.
const GeneralLeadForm = dynamic(() => import('./GeneralLeadForm').then((m) => m.GeneralLeadForm), {
  ssr: false,
  loading: () => (
    <div className="grid h-72 place-items-center" aria-busy="true">
      <span className="loading loading-spinner loading-md text-navy-900" aria-label="Loading form" />
    </div>
  ),
});

interface QuoteOptions {
  division?: DivisionId;
  source?: string;
}

interface QuoteContextValue {
  openQuote: (options?: QuoteOptions) => void;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

const serviceByDivision: Record<DivisionId, (typeof leadOptions.generalService)[number]> = {
  secure: leadOptions.generalService[0],
  connect: leadOptions.generalService[1],
  solar: leadOptions.generalService[2],
  digital: leadOptions.generalService[3],
  space: leadOptions.generalService[4],
};

/** Provides a single site-wide consultation dialog, built on the native <dialog> element. */
export function QuoteProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [options, setOptions] = useState<QuoteOptions>({});
  const [session, setSession] = useState(0);

  const openQuote = useCallback((next: QuoteOptions = {}) => {
    setOptions(next);
    setSession((s) => s + 1);
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = 'hidden';
  }, []);

  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const dialog = dialogRef.current;
    const onClose = () => {
      document.documentElement.style.overflow = '';
    };
    dialog?.addEventListener('close', onClose);
    return () => dialog?.removeEventListener('close', onClose);
  }, []);

  const value = useMemo(() => ({ openQuote }), [openQuote]);

  return (
    <QuoteContext.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="quote-dialog-title"
        data-theme="ppab"
        data-lenis-prevent
        onClick={(e) => e.target === dialogRef.current && close()}
        className="m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-2xl overflow-y-auto overscroll-contain rounded-panel bg-white p-0 text-ink opacity-0 shadow-lift transition-[opacity,translate,display,overlay] duration-300 ease-out-expo transition-discrete open:translate-y-0 open:opacity-100 starting:open:translate-y-4 starting:open:opacity-0"
      >
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-navy-900/15 text-navy-900 transition-colors hover:border-navy-900/50"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <p className="type-eyebrow text-gold-700">Free consultation</p>
          <h2 id="quote-dialog-title" className="mt-3 pr-12 type-h3 text-navy-900">
            Tell us what you need. We&apos;ll suggest the right solution.
          </h2>
          <p className="mt-2 text-small text-muted">Our team usually replies by phone or WhatsApp.</p>
          <div className="mt-8">
            {session > 0 && (
              <GeneralLeadForm
                key={session}
                source={options.source ?? 'quote-dialog'}
                defaultService={options.division ? serviceByDivision[options.division] : undefined}
                submitLabel="Request Consultation"
              />
            )}
          </div>
        </div>
      </dialog>
    </QuoteContext.Provider>
  );
}

export function useQuote(): QuoteContextValue {
  const context = useContext(QuoteContext);
  if (!context) throw new Error('useQuote must be used inside <QuoteProvider>');
  return context;
}
