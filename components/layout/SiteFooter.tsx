import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { footerNav, legalLinks } from '@/data/navigation';
import { Logo } from '@/components/ui/Logo';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { mailHref, mapsHref, telHref, whatsappHref } from '@/lib/contact';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer data-theme="ppab-night" className="relative isolate overflow-hidden bg-navy-950 pb-24 text-white lg:pb-0">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint mask-fade-radial opacity-60" />

      <div className="container-ppab">
        {/* Statement */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-16 md:flex-row md:items-end md:justify-between lg:py-20">
          <div>
            <Logo />
            <p className="mt-8 max-w-2xl text-h2 font-display text-balance">
              Powering Security, Connectivity <em className="font-serif font-normal italic text-gold-300">&amp; Growth</em>
            </p>
          </div>
          <p className="max-w-sm text-body text-white/60">{siteConfig.positioning}</p>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_1.35fr]">
          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="font-mono text-caption uppercase text-gold-300">{group.title}</h2>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-underline text-small text-white/70 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="font-mono text-caption uppercase text-gold-300">Contact</h2>
            <ul className="mt-5 space-y-3 text-small text-white/70">
              <li>
                <a href={telHref} className="flex items-center gap-2.5 hover:text-white">
                  <Phone className="size-4 text-gold-300" aria-hidden="true" />
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-white">
                  <WhatsAppIcon size={16} className="text-gold-300" />
                  WhatsApp {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={mailHref} className="flex items-center gap-2.5 break-all hover:text-white">
                  <Mail className="size-4 shrink-0 text-gold-300" aria-hidden="true" />
                  {siteConfig.contact.email}
                </a>
              </li>
              {siteConfig.offices.map((office) => (
                <li key={office.id}>
                  <a href={mapsHref(office.mapQuery)} target="_blank" rel="noopener noreferrer" className="flex gap-2.5 hover:text-white">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold text-white/90">{office.type}</span>
                      {office.addressLines.join(', ')}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-[0.8rem] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.companyName}. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex gap-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
