'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronRight,
  Copy,
  Mail,
  Phone,
  Sparkles,
} from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { footerNav, legalLinks } from '@/data/navigation';
import { divisions, divisionAccent } from '@/data/divisions';
import { Logo } from '@/components/ui/Logo';
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from '@/components/ui/Icon';
import { mailHref, telHref, whatsappHref } from '@/lib/contact';
import { useQuote } from '@/components/forms/QuoteProvider';

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { openQuote } = useQuote();
  // The consultation banner belongs to the contact page only.
  const showConsultation = usePathname() === '/contact';
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(siteConfig.contact.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Group division map for fast accent lookup
  const divisionMap = Object.fromEntries(divisions.map((d) => [d.href, d]));

  return (
    <footer
      data-theme="ppab-night"
      role="contentinfo"
      className="relative isolate overflow-hidden bg-navy-950 pb-28 text-white lg:pb-12"
    >
      {/* Cinematic Blueprint & Radial Glow Background */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint mask-fade-radial opacity-45 pointer-events-none" />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 -z-10 h-96 w-[70rem] -translate-x-1/2 rounded-full bg-gold-400/[0.04] blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 right-10 -z-10 h-96 w-96 rounded-full bg-blue-600/[0.05] blur-3xl pointer-events-none"
      />

      <div className="container-ppab">
        {/* ================================================================= */}
        {/* 1. HIGH-CONVERSION PRE-FOOTER CTA BANNER                          */}
        {/* ================================================================= */}
        {showConsultation && (
        <section
          aria-label="Consultation and Quick Action"
          className="relative mt-12 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-navy-900/80 to-navy-950/90 p-8 shadow-2xl backdrop-blur-xl md:p-12 lg:mt-16 lg:p-14"
        >
          {/* Subtle gold accent corner wash */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-gold-400/15 blur-3xl"
          />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-gold-300">
                <Sparkles className="size-3.5 text-gold-300" aria-hidden="true" />
                <span>CONSULTATION &amp; DEPLOYMENT</span>
              </div>
              <h2 className="type-h2 tracking-tight text-white">
                Ready to engineer your next{' '}
                <span className="type-accent text-gold-300 font-serif italic">infrastructure project?</span>
              </h2>
              <p className="type-body text-white/75 text-sm sm:text-base leading-relaxed">
                Connect directly with our technical coordinators. From thorough site surveys to verified implementation
                and ongoing AMC support, we deliver single-source accountability across Northern India.
              </p>
            </div>

            {/* Quick Action Triggers */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => openQuote({ source: 'footer-precta' })}
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-gold-400 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-navy-950 transition-all duration-200 hover:bg-gold-300 hover:shadow-lg hover:shadow-gold-400/20 active:scale-[0.98]"
              >
                <span>Request Free Consultation</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <a
                href={telHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/10"
              >
                <Phone className="size-4 text-gold-300" aria-hidden="true" />
                <span>{siteConfig.contact.phoneDisplay}</span>
              </a>

              <a
                href={whatsappHref('Hello PPAB, I would like to consult on my upcoming requirement.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/50 hover:bg-emerald-500/20"
                aria-label="Direct WhatsApp Consultation"
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
        )}

        {/* ================================================================= */}
        {/* 2. CORPORATE DIRECTORY & NAVIGATION COLUMNS                       */}
        {/* ================================================================= */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Overview Column */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-6">
            <div>
              <Logo tone="dark" variant="footer" />
              <p className="mt-4 font-serif text-xl sm:text-2xl text-white font-normal leading-snug">
                Powering Security, Connectivity{' '}
                <span className="type-accent text-gold-300 italic font-serif">&amp; Growth</span>
              </p>
            </div>

            <p className="max-w-sm text-sm text-white/65 leading-relaxed">
              {siteConfig.positioning}
            </p>

            {/* Operating Status & Time */}
            <div className="space-y-2.5 pt-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Field Operations &amp; Support Active</span>
              </div>
              <p className="text-xs text-white/50">
                Desk Hours: Mon – Sat · 9:00 AM – 7:00 PM IST
              </p>
            </div>
          </div>

          {/* Solutions Column */}
          <nav aria-label="Solutions" className="sm:col-span-1 lg:col-span-2">
            <h2 className="type-eyebrow text-gold-300 tracking-wider">Solutions</h2>
            <ul className="mt-5 space-y-2.5">
              {divisions.map((d) => {
                const accent = divisionAccent[d.id];
                return (
                  <li key={d.id}>
                    <Link
                      href={d.href}
                      className="group flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
                    >
                      <span
                        className="size-1.5 rounded-full transition-transform duration-200 group-hover:scale-125"
                        style={{ backgroundColor: accent.hex }}
                        aria-hidden="true"
                      />
                      <span className="link-underline">{d.name}</span>
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2">
                <Link
                  href="/solutions"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gold-300 transition-colors hover:text-gold-200"
                >
                  <span>All Solutions</span>
                  <ChevronRight className="size-3.5" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Industries Column */}
          <nav aria-label="Industries" className="sm:col-span-1 lg:col-span-2">
            <h2 className="type-eyebrow text-gold-300 tracking-wider">Industries</h2>
            <ul className="mt-5 space-y-2.5">
              {footerNav.find((g) => g.title === 'Industries')?.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-white/75 transition-colors hover:text-white block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company & Quick Links */}
          <nav aria-label="Company" className="sm:col-span-1 lg:col-span-2">
            <h2 className="type-eyebrow text-gold-300 tracking-wider">Company</h2>
            <ul className="mt-5 space-y-2.5">
              {footerNav.find((g) => g.title === 'Company')?.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-white/75 transition-colors hover:text-white block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/projects"
                  className="link-underline text-sm text-white/75 transition-colors hover:text-white block"
                >
                  Projects &amp; Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="link-underline text-sm text-white/75 transition-colors hover:text-white block"
                >
                  Engineering Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="link-underline text-sm text-white/75 transition-colors hover:text-white block"
                >
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact & Regional Offices Column */}
          <div className="sm:col-span-1 lg:col-span-2 space-y-5">
            <h2 className="type-eyebrow text-gold-300 tracking-wider">Connect</h2>

            {/* Direct Channels */}
            <div className="space-y-3 text-sm text-white/80">
              <a
                href={telHref}
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Phone className="size-4 text-gold-300 shrink-0" aria-hidden="true" />
                <span className="font-medium">{siteConfig.contact.phoneDisplay}</span>
              </a>

              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <WhatsAppIcon size={16} className="text-gold-300 shrink-0" />
                <span>WhatsApp Instant</span>
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={mailHref}
                  className="flex items-center gap-2.5 text-xs break-all transition-colors hover:text-white"
                >
                  <Mail className="size-4 shrink-0 text-gold-300" aria-hidden="true" />
                  <span>{siteConfig.contact.email}</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  title="Copy email to clipboard"
                  aria-label="Copy corporate email"
                  className="p-1 rounded text-white/50 hover:text-white transition-colors"
                >
                  {copiedEmail ? (
                    <Check className="size-3 text-emerald-400" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </div>
            </div>

            {siteConfig.social.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-300/90 mb-2.5">
                  Follow PPAB
                </p>
                <div className="flex items-center gap-2.5">
                  {siteConfig.social.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 transition-all duration-200 hover:border-gold-400/50 hover:bg-gold-400/10 hover:text-gold-300"
                      aria-label={`Visit PPAB on ${s.label}`}
                      title={s.label}
                    >
                      {s.label === 'Facebook' && <FacebookIcon size={16} />}
                      {s.label === 'Instagram' && <InstagramIcon size={16} />}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>


        {/* ================================================================= */}
        {/* 4. LEGAL NOTICE, COPYRIGHT & EXPERIENCE UTILITIES                 */}
        {/* ================================================================= */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Copyright & Entity */}
            <div className="space-y-1 text-xs text-white/55">
              <p>
                &copy; {year} {siteConfig.companyName} All rights reserved.
              </p>
              <p className="text-[11px] text-white/40">
                CIN Registered Corporate Entity &bull; Technology &amp; Infrastructure Solutions
              </p>
              {siteConfig.offices.map((office) => (
                <address key={office.id} className="not-italic text-[11px] text-white/40">
                  {office.type}: {office.addressLines.join(', ')}
                </address>
              ))}
            </div>

            {/* Legal Navigation */}
            <nav aria-label="Legal & Policies">
              <ul className="flex flex-wrap items-center gap-6 text-xs text-white/65">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/contact" className="transition-colors hover:text-white">
                    Corporate Inquiries
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Back to Top & Regional Time Tag */}
            <div className="flex items-center gap-4">
              <span className="hidden xl:inline-block text-[11px] font-mono text-white/45">
                IST (UTC+5:30) &bull; New Delhi &amp; Lucknow
              </span>
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Scroll back to top of page"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/75 transition-all duration-200 hover:border-gold-400/50 hover:bg-gold-400/10 hover:text-white active:scale-95"
              >
                <span>Back to top</span>
                <ArrowUp className="size-3.5 text-gold-300 transition-transform duration-200 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
