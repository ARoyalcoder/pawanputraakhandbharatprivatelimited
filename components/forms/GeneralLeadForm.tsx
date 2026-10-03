'use client';

import { leadOptions } from '@/lib/validations/lead.schema';
import { Button } from '@/components/ui/Button';
import { HoneypotField, SelectField, TextareaField, TextField } from './fields';
import { ConsentNote, LeadFormShell, SubmitSpinner } from './LeadFormShell';
import { useLeadForm } from './useLeadForm';

type GeneralService = (typeof leadOptions.generalService)[number];

interface GeneralLeadFormProps {
  source?: string;
  defaultService?: GeneralService;
  submitLabel?: string;
}

export function GeneralLeadForm({ source = 'general-lead', defaultService, submitLabel = 'Get Free Consultation' }: GeneralLeadFormProps) {
  const { form, onSubmit, reset, errorOf, state, submitting } = useLeadForm('general', source, {
    name: '',
    phone: '',
    email: '',
    city: '',
    message: '',
    ...(defaultService ? { service: defaultService } : {}),
  });
  const { register } = form;

  return (
    <LeadFormShell state={state} onReset={reset}>
      <form onSubmit={onSubmit} noValidate aria-label="Consultation request">
        <fieldset disabled={submitting} className="grid gap-4">
          {/* Five short fields: two rows of three on desktop, so the form stays within a laptop screen */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField label="Name" autoComplete="name" error={errorOf('name')} {...register('name')} />
            <TextField label="Mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" error={errorOf('phone')} {...register('phone')} />
            <TextField label="City / Area" autoComplete="address-level2" error={errorOf('city')} {...register('city')} />
            <SelectField label="What do you need?" options={leadOptions.generalService} error={errorOf('service')} {...register('service')} />
            <TextField label="Email" type="email" autoComplete="email" optional error={errorOf('email')} containerClassName="lg:col-span-2" {...register('email')} />
          </div>
          <TextareaField
            label="Tell us your requirement"
            rows={2}
            className="min-h-[4.5rem]"
            placeholder="For example: 8 CCTV cameras for a two-floor office, or rooftop solar for a home"
            error={errorOf('message')}
            {...register('message')}
          />
          <HoneypotField />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Button type="submit" className="shrink-0" withArrow={!submitting} icon={submitting ? <SubmitSpinner /> : undefined}>
              {submitting ? 'Sending…' : submitLabel}
            </Button>
            <ConsentNote />
          </div>
        </fieldset>
      </form>
    </LeadFormShell>
  );
}
