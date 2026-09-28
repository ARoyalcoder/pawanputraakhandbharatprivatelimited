import { email, enum as zEnum, flattenError, literal, object, string, union, type input, type output, type ZodError } from 'zod';
import { leadOptions } from './lead-options';

export { leadOptions };


/* ------------------------------------------------------------------ */
/* Shared fields                                                      */
/* ------------------------------------------------------------------ */

/** Accepts "+91 98765 43210", "098765-43210", "9876543210" and normalises to 10 digits. */
export const normalisePhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
};

const name = string()
  .trim()
  .min(2, { error: 'Please enter your name' })
  .max(80, { error: 'Name is too long' });

const phone = string()
  .trim()
  .min(1, { error: 'Please enter your mobile number' })
  .transform(normalisePhone)
  .pipe(string().regex(/^[6-9]\d{9}$/, { error: 'Enter a valid 10-digit Indian mobile number' }));

const city = string()
  .trim()
  .min(2, { error: 'Please enter your city or area' })
  .max(120, { error: 'Please shorten this' });

const optionalEmail = union([literal(''), email({ error: 'Enter a valid email address' })]).optional();

const requiredMessage = string().trim().min(10, { error: 'Please describe your requirement in a few words' }).max(2000);
const optionalMessage = string().trim().max(2000).optional();

const choice = <const T extends readonly [string, ...string[]]>(values: T, error: string) => zEnum(values, { error });

/* ------------------------------------------------------------------ */
/* Schemas (option sets live in lead-options.ts)                      */
/* ------------------------------------------------------------------ */

export const cctvLeadSchema = object({
  name,
  phone,
  city,
  propertyType: choice(leadOptions.cctvProperty, 'Select your property type'),
  cameras: choice(leadOptions.cctvCameras, 'Select the number of cameras'),
});

export const solarLeadSchema = object({
  name,
  phone,
  monthlyBill: choice(leadOptions.solarBill, 'Select your monthly electricity bill'),
  propertyType: choice(leadOptions.solarProperty, 'Select your property type'),
  location: city,
  intent: choice(leadOptions.solarIntent, 'Choose an option'),
});

export const generalLeadSchema = object({
  name,
  phone,
  email: optionalEmail,
  city,
  service: choice(leadOptions.generalService, 'Select a service'),
  message: requiredMessage,
});

export const digitalLeadSchema = object({
  name,
  phone,
  email: optionalEmail,
  business: string().trim().max(120).optional(),
  service: choice(leadOptions.digitalService, 'Select a service'),
  message: requiredMessage,
});

export const connectLeadSchema = object({
  name,
  phone,
  city,
  propertyType: choice(leadOptions.connectProperty, 'Select your property type'),
  service: choice(leadOptions.connectService, 'Select a service'),
  message: optionalMessage,
});

export const spaceLeadSchema = object({
  name,
  phone,
  city,
  service: choice(leadOptions.spaceService, 'Select a service'),
  propertyType: choice(leadOptions.spaceProperty, 'Select a property type'),
  message: optionalMessage,
});

export const leadSchemas = {
  cctv: cctvLeadSchema,
  solar: solarLeadSchema,
  general: generalLeadSchema,
  digital: digitalLeadSchema,
  connect: connectLeadSchema,
  space: spaceLeadSchema,
} as const;

export type LeadFormType = keyof typeof leadSchemas;
export type LeadInput<T extends LeadFormType> = input<(typeof leadSchemas)[T]>;
export type LeadData<T extends LeadFormType> = output<(typeof leadSchemas)[T]>;

export const isLeadFormType = (value: unknown): value is LeadFormType =>
  typeof value === 'string' && value in leadSchemas;

/* ------------------------------------------------------------------ */
/* Server-side lead description (used by /api/leads)                  */
/* ------------------------------------------------------------------ */

export interface LeadDescription {
  division: string;
  service: string;
  name: string;
  phone: string;
  email?: string;
  organization?: string;
  city: string;
  requirement: string;
  summaryLines: string[];
}

export function describeLead(type: LeadFormType, raw: unknown): { success: true; lead: LeadDescription } | { success: false; fieldErrors: Record<string, string[]> } {
  const parsed = leadSchemas[type].safeParse(raw);
  if (!parsed.success) {
    return { success: false, fieldErrors: flattenError(parsed.error as ZodError).fieldErrors as Record<string, string[]> };
  }

  switch (type) {
    case 'cctv': {
      const d = parsed.data as LeadData<'cctv'>;
      return ok({
        division: 'SECURE',
        service: 'CCTV Site Survey',
        name: d.name,
        phone: d.phone,
        city: d.city,
        requirement: `${d.cameras} cameras for a ${d.propertyType.toLowerCase()}`,
        summaryLines: [`Property: ${d.propertyType}`, `Cameras: ${d.cameras}`, `City / Area: ${d.city}`],
      });
    }
    case 'solar': {
      const d = parsed.data as LeadData<'solar'>;
      return ok({
        division: 'SOLAR',
        service: d.intent === 'calculate' ? 'Solar Requirement Assessment' : 'Solar Consultation',
        name: d.name,
        phone: d.phone,
        city: d.location,
        requirement: `Monthly bill ${d.monthlyBill}, ${d.propertyType}`,
        summaryLines: [`Monthly bill: ${d.monthlyBill}`, `Property: ${d.propertyType}`, `Location: ${d.location}`],
      });
    }
    case 'general': {
      const d = parsed.data as LeadData<'general'>;
      return ok({
        division: 'GENERAL',
        service: d.service,
        name: d.name,
        phone: d.phone,
        email: d.email || undefined,
        city: d.city,
        requirement: d.message,
        summaryLines: [`Service: ${d.service}`, `City: ${d.city}`, `Requirement: ${d.message}`],
      });
    }
    case 'digital': {
      const d = parsed.data as LeadData<'digital'>;
      return ok({
        division: 'DIGITAL',
        service: d.service,
        name: d.name,
        phone: d.phone,
        email: d.email || undefined,
        organization: d.business || undefined,
        city: 'Not specified',
        requirement: d.message,
        summaryLines: [`Service: ${d.service}`, d.business ? `Business: ${d.business}` : '', `Requirement: ${d.message}`].filter(Boolean),
      });
    }
    case 'connect': {
      const d = parsed.data as LeadData<'connect'>;
      return ok({
        division: 'CONNECT',
        service: d.service,
        name: d.name,
        phone: d.phone,
        city: d.city,
        requirement: d.message || `${d.service} for a ${d.propertyType.toLowerCase()}`,
        summaryLines: [`Service: ${d.service}`, `Property: ${d.propertyType}`, `City: ${d.city}`, d.message ? `Details: ${d.message}` : ''].filter(Boolean),
      });
    }
    case 'space': {
      const d = parsed.data as LeadData<'space'>;
      return ok({
        division: 'SPACE',
        service: d.service,
        name: d.name,
        phone: d.phone,
        city: d.city,
        requirement: d.message || `${d.service}: ${d.propertyType}`,
        summaryLines: [`Service: ${d.service}`, `Property: ${d.propertyType}`, `City: ${d.city}`, d.message ? `Details: ${d.message}` : ''].filter(Boolean),
      });
    }
  }
}

function ok(lead: LeadDescription) {
  return { success: true as const, lead };
}
