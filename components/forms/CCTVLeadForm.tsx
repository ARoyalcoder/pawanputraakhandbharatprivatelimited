'use client';

import { leadOptions } from '@/lib/validations/lead.schema';
import { Button } from '@/components/ui/Button';
import { ChoiceChips, HoneypotField, SelectField, TextField } from './fields';
import { ConsentNote, LeadFormShell, SubmitSpinner } from './LeadFormShell';
import { useLeadForm } from './useLeadForm';

export function CCTVLeadForm({ source = 'cctv-lead' }: { source?: string }) {
  const { form, onSubmit, reset, errorOf, state, submitting } = useLeadForm('cctv', source, {
    name: '',
    phone: '',
    city: '',
  });
  const { register } = form;

  return (
    <LeadFormShell state={state} onReset={reset}>
      <form onSubmit={onSubmit} noValidate aria-label="Request a free CCTV site survey">
        <fieldset disabled={submitting} className="grid gap-4">
          <ChoiceChips legend="Property type" options={leadOptions.cctvProperty} error={errorOf('propertyType')} {...register('propertyType')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Name" autoComplete="name" error={errorOf('name')} {...register('name')} />
            <TextField label="Mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" error={errorOf('phone')} {...register('phone')} />
            <TextField label="City / Area" autoComplete="address-level2" error={errorOf('city')} {...register('city')} />
            <SelectField label="Number of cameras required" options={leadOptions.cctvCameras} error={errorOf('cameras')} {...register('cameras')} />
          </div>
          <HoneypotField />
          <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" withArrow={!submitting} icon={submitting ? <SubmitSpinner /> : undefined}>
              {submitting ? 'Sending…' : 'Get FREE CCTV Site Survey'}
            </Button>
          </div>
          <ConsentNote />
        </fieldset>
      </form>
    </LeadFormShell>
  );
}
