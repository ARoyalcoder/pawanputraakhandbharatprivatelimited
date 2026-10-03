'use client';

import { useEffect, useState } from 'react';
import { resolveTier, getCapabilityReport, type QualityTier } from './DeviceCapability';

export interface PerformanceConfig {
  tier: QualityTier;
  particleCount: number;
  enableLightformers: boolean;
  antialias: boolean;
  dpr: [number, number];
  isMobile: boolean;
}

export function usePerformanceController(): PerformanceConfig {
  const [config, setConfig] = useState<PerformanceConfig>({
    tier: 'HIGH',
    particleCount: 650,
    enableLightformers: true,
    antialias: true,
    dpr: [1, 2],
    isMobile: false,
  });

  useEffect(() => {
    const report = getCapabilityReport();
    const tier = resolveTier(report);
    const isMobile = report.width < 768;

    switch (tier) {
      case 'LOW':
        setConfig({
          tier: 'LOW',
          particleCount: 160,
          enableLightformers: false,
          antialias: false,
          dpr: [1, 1],
          isMobile,
        });
        break;
      case 'MEDIUM':
        setConfig({
          tier: 'MEDIUM',
          particleCount: 380,
          enableLightformers: true,
          antialias: true,
          dpr: [1, 1.5],
          isMobile,
        });
        break;
      case 'OFF':
        setConfig({
          tier: 'OFF',
          particleCount: 0,
          enableLightformers: false,
          antialias: false,
          dpr: [1, 1],
          isMobile,
        });
        break;
      case 'HIGH':
      default:
        setConfig({
          tier: 'HIGH',
          particleCount: 750,
          enableLightformers: true,
          antialias: true,
          dpr: [1, 2],
          isMobile,
        });
        break;
    }
  }, []);

  return config;
}
