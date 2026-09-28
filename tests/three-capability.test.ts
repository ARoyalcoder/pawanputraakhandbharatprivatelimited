import { describe, it, expect } from 'vitest';
import {
  resolveRecommendedTier,
  checkPrefersReducedMotion,
  getDevicePixelRatio,
} from '@/components/3d/DeviceCapability';
import { threeQualityPresets } from '@/config/three.config';

describe('Module 04 & 05: 3D Engine Capability & Quality Tiering', () => {
  it('returns OFF when WebGL is not supported', () => {
    const tier = resolveRecommendedTier({ supported: false, webgl2: false }, false, 2, 1200);
    expect(tier).toBe('OFF');
  });

  it('returns OFF when prefers-reduced-motion is true', () => {
    const tier = resolveRecommendedTier({ supported: true, webgl2: true }, true, 2, 1200);
    expect(tier).toBe('OFF');
  });

  it('returns OFF when software/low-power renderer is detected', () => {
    const tier = resolveRecommendedTier(
      { supported: true, webgl2: true, renderer: 'Google SwiftShader' },
      false,
      2,
      1200
    );
    expect(tier).toBe('OFF');
  });

  it('returns HIGH for Desktop viewports (>= 1024px)', () => {
    const tier = resolveRecommendedTier(
      { supported: true, webgl2: true, renderer: 'NVIDIA GeForce RTX 4070' },
      false,
      2,
      1200
    );
    expect(tier).toBe('HIGH');
  });

  it('returns MEDIUM for Tablet viewports (768px - 1023px)', () => {
    const tier = resolveRecommendedTier(
      { supported: true, webgl2: true, renderer: 'NVIDIA GeForce RTX 4070' },
      false,
      1.5,
      834
    );
    expect(tier).toBe('MEDIUM');
  });

  it('returns LOW for Mobile viewports (< 768px)', () => {
    const tier = resolveRecommendedTier(
      { supported: true, webgl2: true, renderer: 'Apple GPU' },
      false,
      1,
      390
    );
    expect(tier).toBe('LOW');
  });

  it('contains valid presets for all 4 quality tiers', () => {
    expect(threeQualityPresets.HIGH.maxDpr).toBe(2);
    expect(threeQualityPresets.HIGH.shadows).toBe(true);

    expect(threeQualityPresets.MEDIUM.maxDpr).toBe(1.5);
    expect(threeQualityPresets.MEDIUM.shadows).toBe(false);

    expect(threeQualityPresets.LOW.maxDpr).toBe(1);
    expect(threeQualityPresets.LOW.targetFps).toBe(30);

    expect(threeQualityPresets.OFF.maxDpr).toBe(0);
    expect(threeQualityPresets.OFF.targetFps).toBe(0);
  });
});
