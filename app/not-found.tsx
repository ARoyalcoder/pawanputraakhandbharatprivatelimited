import Link from 'next/link';
import { Phone } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { divisions } from '@/data/divisions';
import { telHref } from '@/lib/contact';
import { siteConfig } from '@/config/site.config';

export default function NotFound() {
  return (
    <div data-theme="ppab-night" className="relative isolate flex min-h-dvh flex-col bg-navy-950 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint mask-fade-radial" />
      <div className="container-ppab flex h-20 items-center">
        <Logo />
      </div>
      <main className="container-ppab flex flex-1 flex-col justify-center py-16">
        <p className="type-eyebrow text-gold-300">Error 404</p>
        <h1 className="mt-5 max-w-3xl type-h1">
          This page could not be found. <em className="type-accent text-gold-300">Let&apos;s get you back.</em>
        </h1>
        <p className="mt-5 max-w-xl type-lead text-white/65">
          The link may be old or mistyped. Explore our solutions below, or call us on {siteConfig.contact.phoneDisplay}.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/" withArrow>
            Back to home
          </ButtonLink>
          <ButtonLink href={telHref} variant="outline-light" icon={<Phone className="size-4" aria-hidden="true" />}>
            Call us
          </ButtonLink>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-8 text-small">
          {divisions.map((d) => (
            <li key={d.id}>
              <Link href={d.href} className="link-underline text-white/70 hover:text-white">
                {d.name}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
