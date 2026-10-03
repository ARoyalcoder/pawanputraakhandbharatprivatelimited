'use client';

import { useState, useEffect } from 'react';
import { getCapabilityReport, resolveTier, type CapabilityReport, type QualityTier } from '@/components/3d/DeviceCapability';
import { loadingManager } from '@/lib/loading/loadingManager';

export interface DeviceCapabilityState {
  tier: QualityTier;
  report: CapabilityReport | null;
  isMobile: boolean;
  isLowPower: boolean;
  canRender3D: boolean;
}

export function useDeviceCapability(): DeviceCapabilityState {
  const [capability, setCapability] = useState<DeviceCapabilityState>({
    tier: 'HIGH',
    report: null,
    isMobile: false,
    isLowPower: false,
    canRender3D: true,
  });

  useEffect(() => {
    const report = getCapabilityReport();
    const tier = resolveTier(report);
    const isMobile = report.width < 768;
    const canRender3D = tier !== 'OFF' && report.webgl;

    setCapability({
      tier,
      report,
      isMobile,
      isLowPower: report.lowPower,
      canRender3D,
    });

    loadingManager.setQualityTier(tier);
  }, []);

  return capability;
}
