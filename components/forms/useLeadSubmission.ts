'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LeadFormType } from '@/lib/validations/lead.schema';
import { trackEvent } from '@/lib/analytics/tracker';

export type SubmissionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; referenceId: string; whatsappLink: string; message: string }
  | { status: 'error'; message: string };

interface SubmitResult {
  ok: boolean;
  fieldErrors?: Record<string, string[]>;
}

/** Posts a lead to /api/leads with spam-protection metadata and tracks submission state. */
export function useLeadSubmission(formType: LeadFormType, source: string) {
  const [state, setState] = useState<SubmissionState>({ status: 'idle' });
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  const submit = useCallback(
    async (data: unknown, honeypot: string): Promise<SubmitResult> => {
      setState({ status: 'submitting' });
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formType,
            data,
            honeypot,
            source,
            elapsedMs: Math.round(performance.now() - startedAt.current),
          }),
        });
        const json = await response.json().catch(() => ({}));

        if (response.ok && json.success) {
          setState({ status: 'success', referenceId: json.leadId, whatsappLink: json.whatsappLink, message: json.message });
          trackEvent('cta_click', { source, category: `${formType}_form_success` });
          return { ok: true };
        }

        setState({
          status: 'error',
          message: json.error || 'We could not send your request. Please try again, or call or WhatsApp us.',
        });
        return { ok: false, fieldErrors: json.details };
      } catch {
        setState({ status: 'error', message: 'You appear to be offline. Please check your connection, or call or WhatsApp us.' });
        return { ok: false };
      }
    },
    [formType, source]
  );

  const reset = useCallback(() => {
    startedAt.current = performance.now();
    setState({ status: 'idle' });
  }, []);

  return { state, submit, reset, submitting: state.status === 'submitting' };
}
