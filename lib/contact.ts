import { siteConfig } from '@/config/site.config';
import { formatPhoneLink, formatWhatsAppLink } from '@/lib/utils';

export const DEFAULT_WHATSAPP_MESSAGE =
  'Hello PPAB, I would like a free consultation for my requirement.';

export const telHref = formatPhoneLink(siteConfig.contact.phoneE164);

export function whatsappHref(message: string = DEFAULT_WHATSAPP_MESSAGE): string {
  return formatWhatsAppLink(siteConfig.contact.whatsapp, message);
}

export const mailHref = `mailto:${siteConfig.contact.email}`;

export function mapsHref(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
