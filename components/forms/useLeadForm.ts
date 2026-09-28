'use client';

import type { FormEvent } from 'react';
import { useForm, type DefaultValues, type FieldValues, type Path } from 'react-hook-form';
import { leadSchemas, type LeadFormType, type LeadInput } from '@/lib/validations/lead.schema';
import { HONEYPOT_NAME } from './fields';
import { zodResolver } from './zodResolver';
import { useLeadSubmission } from './useLeadSubmission';

/**
 * React Hook Form + Zod + submission state for one lead form type. The same Zod schema
 * validates on the client and again on the server in /api/leads.
 */
export function useLeadForm<T extends LeadFormType>(
  formType: T,
  source: string,
  defaultValues: DefaultValues<LeadInput<T> & FieldValues>
) {
  const submission = useLeadSubmission(formType, source);
  const form = useForm<LeadInput<T> & FieldValues>({
    // The payload is validated again on the server with the same schema.
    resolver: zodResolver<LeadInput<T> & FieldValues>(leadSchemas[formType]),
    defaultValues,
    mode: 'onTouched',
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const honeypot = (event.currentTarget.elements.namedItem(HONEYPOT_NAME) as HTMLInputElement | null)?.value ?? '';
    return form.handleSubmit(async (values) => {
      const result = await submission.submit(values, honeypot);
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) form.setError(field as Path<LeadInput<T> & FieldValues>, { message: messages[0] });
        }
      }
    })(event);
  };

  const reset = () => {
    form.reset(defaultValues);
    submission.reset();
  };

  const errorOf = (field: string) => {
    const error = (form.formState.errors as Record<string, { message?: unknown } | undefined>)[field];
    return typeof error?.message === 'string' ? error.message : undefined;
  };

  return { ...submission, form, onSubmit, reset, errorOf };
}
