import 'server-only';
import { divisions, divisionAccent } from '@/data/divisions';
import { resolveAIImage } from '@/lib/media/ai-assets';
import type { SolutionCardData } from './types';

const telemetryMap: Record<string, string> = {
  secure: 'SURVEILLANCE INFRASTRUCTURE // PERIMETER SECURE',
  connect: 'ENTERPRISE OPTICAL BACKBONE // 10G SWITCHING',
  solar: 'PHOTOVOLTAIC ROOFTOP ARRAY // NET METERING EPC',
  digital: 'FULL-STACK SOFTWARE SUITE // CLOUD MATRIX',
  space: 'CIVIL & INTERIOR ARCHITECTURE // TURNKEY SPACES',
};

const highlightsMap: Record<string, string[]> = {
  secure: ['4K / HD Night Vision', 'AI Face & Biometrics', 'Zero-Downtime AMC', 'Mobile Live Feeds'],
  connect: ['10 Gbps Fiber Core', 'Wi-Fi 6 Mesh Roaming', 'Organized Server Racks', '99.9% Network SLA'],
  solar: ['High-Yield Solar Panels', 'Up to 80% Bill Savings', 'Net-Metering & Subsidy', '25-Yr Performance Life'],
  digital: ['Modern Next.js & React', 'Custom ERP & CRM', 'ROI-Driven Ads & SEO', 'Scalable Cloud Architecture'],
  space: ['End-to-End Turnkey', '3D Architectural Renders', 'Quality-Assured Civil EPC', 'Legal Clear Titles'],
};

const statsMap: Record<string, { value: string; label: string }> = {
  secure: { value: '1,200+', label: 'Protected Properties' },
  connect: { value: '99.9%', label: 'Network Uptime SLA' },
  solar: { value: '80%', label: 'Max Energy Bill Savings' },
  digital: { value: '10x', label: 'Average Client ROAS' },
  space: { value: 'Turnkey', label: 'Handover Standard' },
};

const categoryMap: Record<string, string> = {
  secure: 'SURVEILLANCE & SECURITY',
  connect: 'ENTERPRISE NETWORKING',
  solar: 'SOLAR ROOFTOP EPC',
  digital: 'SOFTWARE & DIGITAL',
  space: 'CIVIL & ARCHITECTURE',
};

/** Division card data with AI imagery resolved on the server. */
export function getSolutionCards(): SolutionCardData[] {
  return divisions.map((d, i) => ({
    id: d.id,
    index: String(i + 1).padStart(2, '0'),
    name: d.name,
    short: d.short,
    tagline: d.tagline,
    subTagline: d.subTagline || undefined,
    summary: d.summary,
    services: d.services.slice(0, 5).map((s) => s.name),
    href: d.href,
    accent: divisionAccent[d.id].hex,
    icon: d.icon,
    image: resolveAIImage(d.imageId),
    imageUrl: `/images/solutions/${d.id}.jpg`,
    environmentTelemetry: telemetryMap[d.id] || 'PPAB OFFICIAL DEPLOYMENT',
    highlights: highlightsMap[d.id] || [],
    stat: statsMap[d.id],
    category: categoryMap[d.id] || d.short,
  }));
}
