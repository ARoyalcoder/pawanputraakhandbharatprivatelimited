'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, RefreshCw } from 'lucide-react';
import { CMSHeroContent, CMSCtaContent } from '@/lib/cms/content.service';

export default function AdminContentPage() {
  const [hero, setHero] = useState<CMSHeroContent | null>(null);
  const [cta, setCta] = useState<CMSCtaContent | null>(null);
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [isSavingCta, setIsSavingCta] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState(false);
  const [ctaSuccess, setCtaSuccess] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        const [heroRes, ctaRes] = await Promise.all([
          fetch('/api/admin/content?section=hero'),
          fetch('/api/admin/content?section=cta'),
        ]);

        if (heroRes.ok) {
          const hData = await heroRes.json();
          if (hData.success) setHero(hData.data);
        }

        if (ctaRes.ok) {
          const cData = await ctaRes.json();
          if (cData.success) setCta(cData.data);
        }
      } catch {
        // Non-blocking
      }
    }

    loadContent();
  }, []);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero) return;
    setIsSavingHero(true);
    setHeroSuccess(false);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'hero', data: hero }),
      });

      if (res.ok) {
        setHeroSuccess(true);
        setTimeout(() => setHeroSuccess(false), 2500);
      }
    } finally {
      setIsSavingHero(false);
    }
  };

  const handleSaveCta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cta) return;
    setIsSavingCta(true);
    setCtaSuccess(false);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'cta', data: cta }),
      });

      if (res.ok) {
        setCtaSuccess(true);
        setTimeout(() => setCtaSuccess(false), 2500);
      }
    } finally {
      setIsSavingCta(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-navy-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Site Content Management (CMS)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Update public homepage headings, marketing taglines, and call-to-action parameters in real time.
        </p>
      </div>

      {/* Hero CMS Editor */}
      {hero && (
        <form onSubmit={handleSaveHero} className="p-6 sm:p-8 rounded-2xl bg-navy-900/60 border border-navy-800/80 backdrop-blur-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Homepage Hero Section</h2>
              <p className="text-xs text-slate-400">Primary visual headline and introductory copy</p>
            </div>
            {heroSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
                <CheckCircle className="w-4 h-4" />
                Hero updated
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Main Headline Lead
              </label>
              <input
                type="text"
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Headline Highlight (Gold Accent)
              </label>
              <input
                type="text"
                value={hero.headlineHighlight}
                onChange={(e) => setHero({ ...hero, headlineHighlight: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Top Badge Text
            </label>
            <input
              type="text"
              value={hero.badgeText}
              onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Subheadline / Descriptive Body
            </label>
            <textarea
              rows={3}
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                value={hero.primaryCtaText}
                onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Secondary CTA Button Label
              </label>
              <input
                type="text"
                value={hero.secondaryCtaText}
                onChange={(e) => setHero({ ...hero, secondaryCtaText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingHero}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold transition-all shadow-md shadow-gold-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingHero ? 'Saving Hero...' : 'Save Hero Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* CTA CMS Editor */}
      {cta && (
        <form onSubmit={handleSaveCta} className="p-6 sm:p-8 rounded-2xl bg-navy-900/60 border border-navy-800/80 backdrop-blur-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Call To Action (CTA) Banner</h2>
              <p className="text-xs text-slate-400">Bottom consultation banner across key landing pages</p>
            </div>
            {ctaSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
                <CheckCircle className="w-4 h-4" />
                CTA updated
              </span>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              CTA Headline
            </label>
            <input
              type="text"
              value={cta.headline}
              onChange={(e) => setCta({ ...cta, headline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              CTA Subheadline
            </label>
            <textarea
              rows={2}
              value={cta.subheadline}
              onChange={(e) => setCta({ ...cta, subheadline: e.target.value })}
              className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={cta.buttonText}
                onChange={(e) => setCta({ ...cta, buttonText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Direct Contact Phone
              </label>
              <input
                type="text"
                value={cta.phone}
                onChange={(e) => setCta({ ...cta, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Direct Contact Email
              </label>
              <input
                type="email"
                value={cta.email}
                onChange={(e) => setCta({ ...cta, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-gold-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingCta}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold transition-all shadow-md shadow-gold-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingCta ? 'Saving CTA...' : 'Save CTA Changes'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
