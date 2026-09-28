import { describe, it, expect } from 'vitest';
import { getViewportTier, threeQualityPresets } from '@/config/three.config';
import { resolveRecommendedTier, checkLowPowerDevice } from '@/components/3d/DeviceCapability';

describe('Module 05: Responsive 3D Performance & Tiering', () => {
  it('assigns HIGH quality tier to Desktop viewports (>= 1024px)', () => {
    const desktop1024 = getViewportTier({ width: 1024 });
    const desktop1440 = getViewportTier({ width: 1440 });
    const desktop1920 = getViewportTier({ width: 1920 });

    expect(desktop1024).toBe('HIGH');
    expect(desktop1440).toBe('HIGH');
    expect(desktop1920).toBe('HIGH');
  });

  it('assigns MEDIUM quality tier to Tablet viewports (768px - 1023px)', () => {
    const tablet768 = getViewportTier({ width: 768 });
    const tablet834 = getViewportTier({ width: 834 });
    const tablet1023 = getViewportTier({ width: 1023 });

    expect(tablet768).toBe('MEDIUM');
    expect(tablet834).toBe('MEDIUM');
    expect(tablet1023).toBe('MEDIUM');
  });

  it('assigns LOW quality tier to Mobile viewports (< 768px)', () => {
    const mobile320 = getViewportTier({ width: 320 });
    const mobile375 = getViewportTier({ width: 375 });
    const mobile390 = getViewportTier({ width: 390 });
    const mobile414 = getViewportTier({ width: 414 });
    const mobile767 = getViewportTier({ width: 767 });

    expect(mobile320).toBe('LOW');
    expect(mobile375).toBe('LOW');
    expect(mobile390).toBe('LOW');
    expect(mobile414).toBe('LOW');
    expect(mobile767).toBe('LOW');
  });

  it('assigns OFF quality tier to Low-power devices', () => {
    const lowPower = getViewportTier({ width: 1440, isLowPower: true });
    expect(lowPower).toBe('OFF');
  });

  it('assigns OFF quality tier when prefers-reduced-motion is enabled', () => {
    const reducedMotion = getViewportTier({ width: 1440, reducedMotion: true });
    expect(reducedMotion).toBe('OFF');
  });

  it('assigns OFF quality tier when WebGL is unavailable', () => {
    const noWebGL = getViewportTier({ width: 1440, hasWebGL: false });
    expect(noWebGL).toBe('OFF');
  });

  it('correctly maps particle count and shadow map sizes across presets', () => {
    // High: full particles (1.0), 1024 shadow map
    expect(threeQualityPresets.HIGH.particleMultiplier).toBe(1.0);
    expect(threeQualityPresets.HIGH.shadowMapSize).toBe(1024);

    // Medium: half particles (0.5), 512 shadow map
    expect(threeQualityPresets.MEDIUM.particleMultiplier).toBe(0.5);
    expect(threeQualityPresets.MEDIUM.shadowMapSize).toBe(512);

    // Low: reduced particles (0.2), 0 shadow map
    expect(threeQualityPresets.LOW.particleMultiplier).toBe(0.2);
    expect(threeQualityPresets.LOW.shadowMapSize).toBe(0);

    // Off: 0 particles, 0 shadow map
    expect(threeQualityPresets.OFF.particleMultiplier).toBe(0);
    expect(threeQualityPresets.OFF.shadowMapSize).toBe(0);
  });

  it('detects low power software renderers', () => {
    expect(checkLowPowerDevice('Google SwiftShader')).toBe(true);
    expect(checkLowPowerDevice('llvmpipe (LLVM 12.0.0, 256 bits)')).toBe(true);
    expect(checkLowPowerDevice('Apple M2 Pro')).toBe(false);
  });
});
