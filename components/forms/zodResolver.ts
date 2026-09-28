import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form';
import type { ZodType } from 'zod';

/**
 * Minimal React Hook Form resolver for Zod 4 schemas.
 *
 * Replaces @hookform/resolvers, whose Zod adapter also bundles Zod v3 for compatibility
 * detection and roughly doubled the size of every page with a form.
 */
export function zodResolver<TFieldValues extends FieldValues>(schema: ZodType): Resolver<TFieldValues> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) {
      return { values: result.data as TFieldValues, errors: {} };
    }

    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.');
      if (path && !errors[path]) errors[path] = { type: issue.code, message: issue.message };
    }
    return { values: {}, errors: errors as FieldErrors<TFieldValues> };
  };
}
