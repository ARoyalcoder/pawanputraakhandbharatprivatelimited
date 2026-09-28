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
        <fieldset disabled={submitting} className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Name" autoComplete="name" error={errorOf('name')} {...register('name')} />
            <TextField label="Mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" error={errorOf('phone')} {...register('phone')} />
            <TextField label="Email" type="email" autoComplete="email" optional error={errorOf('email')} {...register('email')} />
            <TextField label="City / Area" autoComplete="address-level2" error={errorOf('city')} {...register('city')} />
          </div>
          <SelectField label="What do you need?" options={leadOptions.generalService} error={errorOf('service')} {...register('service')} />
          <TextareaField
            label="Tell us your requirement"
            placeholder="For example: 8 CCTV cameras for a two-floor office, or rooftop solar for a home"
            error={errorOf('message')}
            {...register('message')}
          />
          <HoneypotField />
          <div>
            <Button type="submit" size="lg" withArrow={!submitting} icon={submitting ? <SubmitSpinner /> : undefined}>
              {submitting ? 'Sending…' : submitLabel}
            </Button>
          </div>
          <ConsentNote />
        </fieldset>
      </form>
    </LeadFormShell>
  );
}
