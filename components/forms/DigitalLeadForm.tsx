'use client';

import { leadOptions } from '@/lib/validations/lead.schema';
import { Button } from '@/components/ui/Button';
import { HoneypotField, SelectField, TextareaField, TextField } from './fields';
import { ConsentNote, LeadFormShell, SubmitSpinner } from './LeadFormShell';
import { useLeadForm } from './useLeadForm';

export function DigitalLeadForm({ source = 'digital-lead' }: { source?: string }) {
  const { form, onSubmit, reset, errorOf, state, submitting } = useLeadForm('digital', source, {
    name: '',
    phone: '',
    email: '',
    business: '',
    message: '',
  });
  const { register } = form;

  return (
    <LeadFormShell state={state} onReset={reset}>
      <form onSubmit={onSubmit} noValidate aria-label="Discuss your digital project">
        <fieldset disabled={submitting} className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Name" autoComplete="name" error={errorOf('name')} {...register('name')} />
            <TextField label="Mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" error={errorOf('phone')} {...register('phone')} />
            <TextField label="Business name" autoComplete="organization" optional error={errorOf('business')} {...register('business')} />
            <TextField label="Email" type="email" autoComplete="email" optional error={errorOf('email')} {...register('email')} />
          </div>
          <SelectField label="Service" options={leadOptions.digitalService} error={errorOf('service')} {...register('service')} />
          <TextareaField
            label="About your project"
            placeholder="What does your business do, and what would you like to build or improve?"
            error={errorOf('message')}
            {...register('message')}
          />
          <HoneypotField />
          <div>
            <Button type="submit" size="lg" withArrow={!submitting} icon={submitting ? <SubmitSpinner /> : undefined}>
              {submitting ? 'Sending…' : 'Discuss Your Project'}
            </Button>
          </div>
          <ConsentNote />
        </fieldset>
      </form>
    </LeadFormShell>
  );
}
