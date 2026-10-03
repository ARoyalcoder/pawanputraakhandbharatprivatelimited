import { Mail, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { mailHref, telHref } from '@/lib/contact';

export function TopUtilityBar() {
  return (
    <aside aria-label="Offices and contact" className="hidden h-10 border-b border-white/[0.08] bg-navy-950 type-caption text-white/65 lg:block">
      <div className="container-ppab flex h-full items-center justify-between gap-6">
        <p className="flex items-center gap-2 truncate">
          <MapPin aria-hidden="true" className="size-3.5 text-gold-300" />
          <span>
            Head Office: BCC Tower, Arjunganj, Lucknow
            <span className="mx-2 text-white/25">/</span>
            Branch: Dwarka, New Delhi
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-6">
          <a href={telHref} className="flex items-center gap-2 transition-colors hover:text-white">
            <Phone aria-hidden="true" className="size-3.5 text-gold-300" />
            {siteConfig.contact.phoneDisplay}
          </a>
          <a href={mailHref} className="hidden items-center gap-2 transition-colors hover:text-white xl:flex">
            <Mail aria-hidden="true" className="size-3.5 text-gold-300" />
            {siteConfig.contact.email}
          </a>
        </div>
      </div>
    </aside>
  );
}
