'use client';

import { leadOptions } from '@/lib/validations/lead.schema';
import { Button } from '@/components/ui/Button';
import { ChoiceChips, HoneypotField, SelectField, TextareaField, TextField } from './fields';
import { ConsentNote, LeadFormShell, SubmitSpinner } from './LeadFormShell';
import { useLeadForm } from './useLeadForm';

export function SpaceLeadForm({ source = 'space-lead' }: { source?: string }) {
  const { form, onSubmit, reset, errorOf, state, submitting } = useLeadForm('space', source, {
    name: '',
    phone: '',
    city: '',
    message: '',
  });
  const { register } = form;

  return (
    <LeadFormShell state={state} onReset={reset}>
      <form onSubmit={onSubmit} noValidate aria-label="Property and construction requirement">
        <fieldset disabled={submitting} className="grid gap-5">
          <ChoiceChips legend="What do you need?" options={leadOptions.spaceService} error={errorOf('service')} {...register('service')} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Name" autoComplete="name" error={errorOf('name')} {...register('name')} />
            <TextField label="Mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" error={errorOf('phone')} {...register('phone')} />
            <TextField label="City / Area" autoComplete="address-level2" error={errorOf('city')} {...register('city')} />
            <SelectField label="Property type" options={leadOptions.spaceProperty} error={errorOf('propertyType')} {...register('propertyType')} />
          </div>
          <TextareaField label="About your project" optional error={errorOf('message')} {...register('message')} />
          <HoneypotField />
          <div>
            <Button type="submit" size="lg" withArrow={!submitting} icon={submitting ? <SubmitSpinner /> : undefined}>
              {submitting ? 'Sending…' : 'Talk to Our Space Team'}
            </Button>
          </div>
          <ConsentNote />
        </fieldset>
      </form>
    </LeadFormShell>
  );
}
