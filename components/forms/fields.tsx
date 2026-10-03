'use client';

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldFrameProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}

function FieldFrame({ id, label, error, hint, optional, children, className }: FieldFrameProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="type-label text-base-content">
        {label}
        {optional && <span className="ml-1.5 font-normal text-base-content/60">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 type-error text-error">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="type-help text-base-content/65">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

const controlClass =
  'w-full rounded-field border-base-content/15 bg-base-100 text-base leading-normal text-base-content shadow-none transition-colors placeholder:text-base-content/45 focus:border-gold-500 focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-error';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  containerClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, optional, containerClassName, className, id: idProp, ...rest },
  ref
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldFrame id={id} label={label} error={error} hint={hint} optional={optional} className={containerClassName}>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn('input h-11', controlClass, className)}
        {...rest}
      />
    </FieldFrame>
  );
});

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly string[];
  placeholder?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, options, placeholder = 'Select an option', error, hint, containerClassName, className, id: idProp, ...rest },
  ref
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldFrame id={id} label={label} error={error} hint={hint} className={containerClassName}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          defaultValue=""
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn('h-11 appearance-none border px-4 pr-10', controlClass, className)}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-base-content/50" />
      </div>
    </FieldFrame>
  );
});

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  containerClassName?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { label, error, hint, optional, containerClassName, className, id: idProp, rows = 3, ...rest },
  ref
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldFrame id={id} label={label} error={error} hint={hint} optional={optional} className={containerClassName}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn('textarea min-h-24 py-2.5', controlClass, className)}
        {...rest}
      />
    </FieldFrame>
  );
});

interface ChoiceChipsProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  legend: string;
  options: readonly string[];
  error?: string;
  name: string;
  className?: string;
}

/** Radio group rendered as tappable chips — faster than a dropdown on mobile. */
export const ChoiceChips = forwardRef<HTMLInputElement, ChoiceChipsProps>(function ChoiceChips(
  { legend, options, error, name, className, ...rest },
  ref
) {
  const id = useId();
  return (
    <fieldset
      className={cn('flex flex-col gap-2', className)}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend className="mb-2 type-label text-base-content">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="relative cursor-pointer">
            <input ref={ref} type="radio" name={name} value={option} className="peer sr-only" {...rest} />
            <span
              className={cn(
                'inline-flex h-9 items-center rounded-full border px-3.5 type-body-sm font-medium transition-colors',
                'border-base-content/15 text-base-content/80 hover:border-base-content/40',
                'peer-checked:border-gold-500 peer-checked:bg-gold-500 peer-checked:text-navy-950',
                'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-500'
              )}
            >
              {option}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 type-error text-error">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </fieldset>
  );
});

export const HONEYPOT_NAME = 'company_website';

/** Off-screen honeypot. Real visitors never see or fill it; many bots do. */
export function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name={HONEYPOT_NAME} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
