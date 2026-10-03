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
        <fieldset disabled={submitting} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField label="Name" autoComplete="name" error={errorOf('name')} {...register('name')} />
            <TextField label="Mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" error={errorOf('phone')} {...register('phone')} />
            <SelectField label="Service" options={leadOptions.digitalService} error={errorOf('service')} {...register('service')} />
            <TextField label="Business name" autoComplete="organization" optional error={errorOf('business')} {...register('business')} />
            <TextField label="Email" type="email" autoComplete="email" optional error={errorOf('email')} containerClassName="lg:col-span-2" {...register('email')} />
          </div>
          <TextareaField
            label="About your project"
            rows={2}
            className="min-h-[4.5rem]"
            placeholder="What does your business do, and what would you like to build or improve?"
            error={errorOf('message')}
            {...register('message')}
          />
          <HoneypotField />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Button type="submit" className="shrink-0" withArrow={!submitting} icon={submitting ? <SubmitSpinner /> : undefined}>
              {submitting ? 'Sending…' : 'Discuss Your Project'}
            </Button>
            <ConsentNote />
          </div>
        </fieldset>
      </form>
    </LeadFormShell>
  );
}
