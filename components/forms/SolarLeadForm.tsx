'use client';

import { leadOptions } from '@/lib/validations/lead.schema';
import { Button } from '@/components/ui/Button';
import { ChoiceChips, HoneypotField, SelectField, TextField } from './fields';
import { ConsentNote, LeadFormShell, SubmitSpinner } from './LeadFormShell';
import { useLeadForm } from './useLeadForm';

/**
 * Both actions submit the same details. "Calculate" asks the team to work out the system
 * size from the bill; we deliberately do not show generic savings or ROI figures.
 */
export function SolarLeadForm({ source = 'solar-lead' }: { source?: string }) {
  const { form, onSubmit, reset, errorOf, state, submitting } = useLeadForm('solar', source, {
    name: '',
    phone: '',
    location: '',
    intent: 'calculate',
  });
  const { register, setValue } = form;

  return (
    <LeadFormShell state={state} onReset={reset}>
      <form onSubmit={onSubmit} noValidate aria-label="Solar requirement request">
        <fieldset disabled={submitting} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Monthly electricity bill" options={leadOptions.solarBill} error={errorOf('monthlyBill')} {...register('monthlyBill')} />
            <TextField label="Location" placeholder="City / Area" autoComplete="address-level2" error={errorOf('location')} {...register('location')} />
          </div>
          <ChoiceChips legend="Property type" options={leadOptions.solarProperty} error={errorOf('propertyType')} {...register('propertyType')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Name" autoComplete="name" error={errorOf('name')} {...register('name')} />
            <TextField label="Mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" error={errorOf('phone')} {...register('phone')} />
          </div>
          <input type="hidden" {...register('intent')} />
          <HoneypotField />
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
            <Button
              type="submit"
              withArrow={!submitting}
              icon={submitting ? <SubmitSpinner /> : undefined}
              onClick={() => setValue('intent', 'calculate')}
            >
              {submitting ? 'Sending…' : 'Calculate My Solar Requirement'}
            </Button>
            <Button type="submit" variant="outline-dark" className="border-base-content/25 text-base-content" onClick={() => setValue('intent', 'consultation')}>
              Get Free Solar Consultation
            </Button>
          </div>
          <ConsentNote />
        </fieldset>
      </form>
    </LeadFormShell>
  );
}
