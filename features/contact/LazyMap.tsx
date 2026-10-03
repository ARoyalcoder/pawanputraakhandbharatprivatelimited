'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';

/** Click-to-load Google Map: no third-party request until the visitor asks for it. */
export function LazyMap({ query, title }: { query: string; title: string }) {
  const [load, setLoad] = useState(false);
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-line bg-navy-900">
      {load ? (
        <iframe
          title={title}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
          className="absolute inset-0 size-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoad(true)}
          className="absolute inset-0 grid place-items-center bg-blueprint text-white transition-colors hover:bg-navy-800"
        >
          <span className="flex flex-col items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-gold-500 text-navy-950">
              <MapPin aria-hidden="true" className="size-5" />
            </span>
            <span className="text-small font-semibold">Show map: {title}</span>
            <span className="type-caption text-white/55">Loads Google Maps</span>
          </span>
        </button>
      )}
    </div>
  );
}
