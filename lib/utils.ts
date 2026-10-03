import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge taught about the PPAB design tokens, so e.g. `text-h2` (a font size)
 * is not mistaken for a text colour and dropped when combined with `text-white`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: ['display-xl', 'display-lg', 'display-md', 'h1', 'h2', 'h3', 'h4', 'h5', 'body-lg', 'body', 'body-sm', 'small', 'caption', 'eyebrow', 'button'],
        },
      ],
      shadow: [{ shadow: ['card', 'lift', 'gold'] }],
      rounded: [{ rounded: ['card', 'panel'] }],
      ease: [{ ease: ['out-expo', 'in-out-quart'] }],
    },
  },
});

/** Merge Tailwind class names safely with clsx and twMerge. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format phone number for tel: links. */
export function formatPhoneLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/** Format phone number for WhatsApp direct links. */
export function formatWhatsAppLink(phone: string, text?: string): string {
  const cleanNumber = phone.replace(/[^\d]/g, '');
  const url = `https://wa.me/${cleanNumber}`;
  return text ? `${url}?text=${encodeURIComponent(text)}` : url;
}
