'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { GeneralLeadForm } from './GeneralLeadForm';
import { CCTVLeadForm } from './CCTVLeadForm';
import { SolarLeadForm } from './SolarLeadForm';
import { ConnectLeadForm } from './ConnectLeadForm';
import { DigitalLeadForm } from './DigitalLeadForm';
import { SpaceLeadForm } from './SpaceLeadForm';

const forms = [
  { id: 'general', label: 'General', render: () => <GeneralLeadForm source="contact-general" /> },
  { id: 'cctv', label: 'CCTV', render: () => <CCTVLeadForm source="contact-cctv" /> },
  { id: 'solar', label: 'Solar', render: () => <SolarLeadForm source="contact-solar" /> },
  { id: 'connect', label: 'Networking', render: () => <ConnectLeadForm source="contact-connect" /> },
  { id: 'digital', label: 'Digital', render: () => <DigitalLeadForm source="contact-digital" /> },
  { id: 'space', label: 'Space', render: () => <SpaceLeadForm source="contact-space" /> },
];

/** One contact form per division, switched with accessible tabs. */
export function LeadFormTabs() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = forms.length - 1;
    const next = e.key === 'ArrowRight' ? (index === last ? 0 : index + 1) : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1) : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Choose an enquiry type" className="no-scrollbar -mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {forms.map((f, i) => (
          <button
            key={f.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`${baseId}-tab-${f.id}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              'h-10 shrink-0 rounded-full border px-4 text-small font-semibold transition-colors',
              i === active ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-900/15 text-navy-900/70 hover:text-navy-900'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${forms[active].id}`}>
        {forms[active].render()}
      </div>
    </div>
  );
}
