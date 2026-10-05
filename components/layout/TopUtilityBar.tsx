import { Mail, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { mailHref, telHref } from '@/lib/contact';
import { FacebookIcon, InstagramIcon } from '@/components/ui/Icon';

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
          {siteConfig.social.length > 0 && (
            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              {siteConfig.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-300"
                  aria-label={`Visit PPAB on ${s.label}`}
                  title={s.label}
                >
                  {s.label === 'Facebook' && <FacebookIcon size={14} />}
                  {s.label === 'Instagram' && <InstagramIcon size={14} />}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
