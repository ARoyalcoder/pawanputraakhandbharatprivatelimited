'use client';

import React, { useState } from 'react';
import { MEDIA_REGISTRY, MediaCategory, MediaItem } from '@/config/media.config';
import { Image as ImageIcon, Video, Box, FileText, CheckCircle2 } from 'lucide-react';

const CATEGORIES: MediaCategory[] = [
  'Brand',
  'Hero',
  'Secure',
  'Connect',
  'Solar',
  'Digital',
  'Space',
  'Industries',
  'Projects',
  'Blog',
];

export default function AdminMediaPage() {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const allMedia = Object.values(MEDIA_REGISTRY);

  const filteredMedia =
    selectedCat === 'All'
      ? allMedia
      : allMedia.filter((m) => m.category === selectedCat);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-navy-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Central Media & Asset Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Registered corporate imagery, posters, videos, and 3D scene manifests across 10 defined categories.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCat('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedCat === 'All'
              ? 'bg-gold-500 text-navy-950 font-bold'
              : 'bg-navy-900 border border-navy-800 text-slate-300 hover:text-white'
          }`}
        >
          All Assets ({allMedia.length})
        </button>

        {CATEGORIES.map((cat) => {
          const count = allMedia.filter((m) => m.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCat === cat
                  ? 'bg-gold-500 text-navy-950 font-bold'
                  : 'bg-navy-900 border border-navy-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800/80 backdrop-blur-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded bg-navy-800 text-gold-400 font-mono text-[11px] font-semibold">
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {(item.sizeBytes / 1024).toFixed(0)} KB
                </span>
              </div>

              <div className="aspect-video w-full rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-center overflow-hidden mb-3 relative group">
                <div className="text-center p-4">
                  <ImageIcon className="w-8 h-8 text-gold-400/60 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-mono text-slate-300 truncate max-w-[200px]">
                    {item.filename}
                  </p>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-white truncate">{item.filename}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {item.altText}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-navy-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{item.mimeType}</span>
              <span>
                {item.width && item.height ? `${item.width}x${item.height}px` : 'Dynamic Vector'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
