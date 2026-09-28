'use client';

import { useSyncExternalStore } from 'react';
import { getCapabilityReport, resolveTier, type QualityTier } from './DeviceCapability';

const override = process.env.NEXT_PUBLIC_3D_QUALITY;
const enabled = process.env.NEXT_PUBLIC_ENABLE_3D !== 'false';

let cached: QualityTier | null = null;

function getTier(): QualityTier {
  if (!cached) {
    cached = enabled ? resolveTier(getCapabilityReport(), override === 'auto' ? undefined : override) : 'OFF';
  }
  return cached;
}

const subscribe = () => () => {};

/**
 * Resolves the 3D quality tier on the client. Returns null on the server and during
 * hydration so both render the static fallback, then the client tier.
 */
export function useQualityTier(): QualityTier | null {
  return useSyncExternalStore(subscribe, getTier, () => null);
}
