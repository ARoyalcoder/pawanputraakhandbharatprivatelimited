import type { Division, DivisionId } from '@/types/content';
import { secure } from './secure';
import { connect } from './connect';
import { solar } from './solar';
import { digital } from './digital';
import { space } from './space';

export const divisions: Division[] = [secure, connect, solar, digital, space];

export const divisionIds = divisions.map((d) => d.id);

export function getDivision(id: DivisionId): Division {
  const division = divisions.find((d) => d.id === id);
  if (!division) throw new Error(`Unknown division: ${id}`);
  return division;
}

export function isDivisionId(value: string): value is DivisionId {
  return (divisionIds as string[]).includes(value);
}

/**
 * Tailwind classes per division accent — kept literal so Tailwind can detect them.
 * `hex` is the bright accent for dark surfaces; `ink` is the darker variant for text on
 * light surfaces (≥ 4.5:1 on white and surface, see scripts/check-contrast.mjs).
 */
export const divisionAccent: Record<DivisionId, { text: string; bg: string; border: string; hex: string; ink: string }> = {
  secure: { text: 'text-secure', bg: 'bg-secure', border: 'border-secure', hex: '#2fb5a7', ink: '#17786e' },
  connect: { text: 'text-connect', bg: 'bg-connect', border: 'border-connect', hex: '#4a90ff', ink: '#1f5fc4' },
  solar: { text: 'text-solar', bg: 'bg-solar', border: 'border-solar', hex: '#f2a516', ink: '#9a6200' },
  digital: { text: 'text-digital', bg: 'bg-digital', border: 'border-digital', hex: '#8c73f7', ink: '#6447d1' },
  space: { text: 'text-space', bg: 'bg-space', border: 'border-space', hex: '#c9925e', ink: '#8f5c2c' },
};

export { secure, connect, solar, digital, space };
export { cctvSectors, cctvProducts } from './secure';
export { networkFlow } from './connect';
export { solarSegments, solarSystems, solarBenefits } from './solar';
export { digitalClusters } from './digital';
export { spaceJourney } from './space';
