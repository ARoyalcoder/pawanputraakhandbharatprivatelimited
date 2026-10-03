'use client';

import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Phone, RotateCcw } from 'lucide-react';
import { ButtonLink, Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { telHref, whatsappHref } from '@/lib/contact';
import type { SubmissionState } from './useLeadSubmission';

interface LeadFormShellProps {
  state: SubmissionState;
  onReset: () => void;
  children: ReactNode;
}

/** Wraps a lead form with its success and error states. */
export function LeadFormShell({ state, onReset, children }: LeadFormShellProps) {
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === 'success' || state.status === 'error') statusRef.current?.focus();
  }, [state.status]);

  if (state.status === 'success') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="flex flex-col items-start gap-5 py-4 outline-none">
        <span className="grid size-14 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>
        <div>
          <p className="type-h3 text-base-content">Request received</p>
          <p className="mt-2 type-body text-base-content/70">{state.message}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-base-content/15 px-3.5 py-1.5 type-meta font-semibold text-base-content/80">
            Reference <strong className="font-semibold text-base-content">{state.referenceId}</strong>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={state.whatsappLink} icon={<WhatsAppIcon size={17} />}>
            Continue on WhatsApp
          </ButtonLink>
          <Button variant="ghost-dark" className="text-base-content" onClick={onReset} icon={<RotateCcw className="size-4" aria-hidden="true" />}>
            Send another request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {state.status === 'error' && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="alert alert-error alert-soft mb-6 items-start outline-none">
          <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
          <div className="text-small">
            <p className="font-semibold">{state.message}</p>
            <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <a href={telHref} className="inline-flex items-center gap-1.5 underline underline-offset-4">
                <Phone className="size-3.5" aria-hidden="true" /> Call us
              </a>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 underline underline-offset-4">
                <WhatsAppIcon size={14} /> WhatsApp us
              </a>
            </p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export function ConsentNote() {
  return (
    <p className="type-caption leading-relaxed text-base-content/55">
      By submitting, you agree to be contacted by PPAB about your requirement. See our{' '}
      <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-base-content">
        privacy policy
      </Link>
      .
    </p>
  );
}

export function SubmitSpinner() {
  return (
    <span className="inline-flex items-center gap-2" aria-hidden="true">
      <span className="inline-block size-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      <span className="text-xs font-semibold tracking-wide">Sending Request...</span>
    </span>
  );
}
