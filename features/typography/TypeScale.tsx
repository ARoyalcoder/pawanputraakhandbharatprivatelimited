import { cn } from '@/lib/utils';

interface Role {
  name: string;
  className: string;
  spec: string;
  sample: string;
  use: string;
}

/* Literal class names so Tailwind can detect them. */
const roles: { group: string; items: Role[] }[] = [
  {
    group: 'Display (Manrope)',
    items: [
      { name: 'Display XL', className: 'type-display-xl font-extrabold', spec: '38 → 100px · 800 · −0.038em · 0.98', sample: 'Powering Security', use: 'Homepage hero only' },
      { name: 'Display LG', className: 'type-display-lg', spec: '36 → 76px · 700 · −0.038em · 1.0', sample: 'Pawan Putra Solar', use: 'Inner page heroes' },
      { name: 'Display MD', className: 'type-display-md', spec: '32 → 64px · 700 · −0.034em · 1.02', sample: 'Let’s plan it together', use: 'Final CTA, listing heroes' },
    ],
  },
  {
    group: 'Headings (Manrope)',
    items: [
      { name: 'H1', className: 'type-h1', spec: '32 → 56px · 700 · −0.03em', sample: 'Which solar system fits?', use: 'Article and legal titles' },
      { name: 'H2', className: 'type-h2', spec: '28 → 48px · 700 · −0.026em', sample: 'Complete solutions', use: 'Section headings' },
      { name: 'H3', className: 'type-h3', spec: '22 → 30px · 600 · −0.016em', sample: 'Request a site survey', use: 'Sub-sections, form titles' },
      { name: 'H4', className: 'type-h4', spec: '18 → 21px · 600 · −0.012em', sample: 'CCTV for offices', use: 'Card titles' },
      { name: 'H5', className: 'type-h5', spec: '16 → 17px · 600 · −0.008em', sample: 'Network & Wi-Fi', use: 'Compact titles, tabs' },
    ],
  },
  {
    group: 'Reading and interface (Inter)',
    items: [
      { name: 'Lead', className: 'type-lead', spec: '17 → 19px · 400 · 1.65', sample: 'Complete technology, security and solar solutions.', use: 'Intro paragraphs' },
      { name: 'Body', className: 'type-body', spec: '16px · 400 · 1.65', sample: 'Consultation, installation and maintenance by one team.', use: 'Paragraphs' },
      { name: 'Body S', className: 'type-body-sm', spec: '15px · 400 · 1.6', sample: 'Lucknow · New Delhi', use: 'Footer, secondary copy' },
      { name: 'Nav', className: 'type-nav', spec: '15px · 500 · −0.008em', sample: 'Solutions', use: 'Desktop navigation' },
      { name: 'Button', className: 'type-button', spec: '15px · 600 · +0.012em', sample: 'Get Free Consultation', use: 'Buttons and CTAs' },
      { name: 'Label', className: 'type-label', spec: '14px · 600', sample: 'Mobile number', use: 'Form labels' },
      { name: 'Help', className: 'type-help', spec: '14px · 400', sample: 'We only use this to discuss your requirement.', use: 'Form hints' },
      { name: 'Meta', className: 'type-meta', spec: '14px · 400 · tabular', sample: '25 September 2026 · 5 min read', use: 'Dates, breadcrumbs' },
      { name: 'Caption', className: 'type-caption', spec: '13px · 500', sample: 'Illustrative concept', use: 'Chips, badges, fine print' },
      { name: 'Eyebrow', className: 'type-eyebrow', spec: '12px · 600 · +0.16em · uppercase', sample: 'Our solutions', use: 'Section labels (only uppercase role)' },
    ],
  },
  {
    group: 'Accent (Instrument Serif italic)',
    items: [
      { name: 'Accent', className: 'type-h2 [&_em]:type-accent [&_em]:text-gold-600', spec: '1.04em of its heading · 400', sample: '', use: 'One gold phrase per heading' },
      { name: 'Tagline', className: 'type-tagline text-secure-ink', spec: '19 → 22px · 400 (-sm 17px, -lg 22 → 28px)', sample: 'Har Nazar Se Suraksha', use: 'Division taglines' },
      { name: 'Quote', className: 'type-quote text-navy-900', spec: '20 → 26px · 400', sample: 'Your monthly bill is the best starting point.', use: 'Promises, pull quotes' },
      { name: 'Ordinal', className: 'type-ordinal text-gold-600', spec: '32 → 44px · 400', sample: '01', use: 'Process and pillar numbers' },
    ],
  },
];

/** Living reference of every typography role, rendered with the real utilities. */
export function TypeScale() {
  return (
    <div className="space-y-12">
      {roles.map((group) => (
        <section key={group.group} aria-label={group.group}>
          <h3 className="type-eyebrow text-gold-700">{group.group}</h3>
          <ul className="mt-4 divide-y divide-line rounded-panel border border-line bg-white">
            {group.items.map((role) => (
              <li key={role.name} className="grid gap-3 p-5 md:grid-cols-[11rem_1fr] md:gap-8 md:p-6">
                <div>
                  <p className="type-label text-navy-900">{role.name}</p>
                  <p className="mt-1 type-caption font-normal text-muted">{role.spec}</p>
                  <p className="mt-1 type-caption font-normal text-muted">{role.use}</p>
                </div>
                <p className={cn('min-w-0 wrap-words text-navy-900', role.className)}>
                  {role.name === 'Accent' ? (
                    <>
                      One trusted <em>partner.</em>
                    </>
                  ) : (
                    role.sample
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
