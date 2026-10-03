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
        <fieldset disabled={submitting} className="grid gap-4">
          <ChoiceChips legend="What do you need?" options={leadOptions.spaceService} error={errorOf('service')} {...register('service')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField label="Name" autoComplete="name" error={errorOf('name')} {...register('name')} />
            <TextField label="Mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" error={errorOf('phone')} {...register('phone')} />
            <TextField label="City / Area" autoComplete="address-level2" error={errorOf('city')} {...register('city')} />
            <SelectField label="Property type" options={leadOptions.spaceProperty} error={errorOf('propertyType')} {...register('propertyType')} />
            <TextareaField
              label="About your project"
              optional
              rows={2}
              className="min-h-[4.5rem]"
              containerClassName="sm:col-span-2"
              error={errorOf('message')}
              {...register('message')}
            />
          </div>
          <HoneypotField />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Button type="submit" className="shrink-0" withArrow={!submitting} icon={submitting ? <SubmitSpinner /> : undefined}>
              {submitting ? 'Sending…' : 'Talk to Our Space Team'}
            </Button>
            <ConsentNote />
          </div>
        </fieldset>
      </form>
    </LeadFormShell>
  );
}
