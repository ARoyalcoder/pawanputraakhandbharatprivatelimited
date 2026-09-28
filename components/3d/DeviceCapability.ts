export type QualityTier = 'HIGH' | 'MEDIUM' | 'LOW' | 'OFF';

export interface QualitySettings {
  dpr: [number, number];
  antialias: boolean;
  particles: number;
  environment: boolean;
}

export const qualitySettings: Record<Exclude<QualityTier, 'OFF'>, QualitySettings> = {
  HIGH: { dpr: [1, 2], antialias: true, particles: 900, environment: true },
  MEDIUM: { dpr: [1, 1.5], antialias: true, particles: 420, environment: true },
  LOW: { dpr: [1, 1], antialias: false, particles: 160, environment: false },
};

export interface CapabilityReport {
  webgl: boolean;
  reducedMotion: boolean;
  touch: boolean;
  lowPower: boolean;
  width: number;
  renderer?: string;
}

function detectWebGL(): { supported: boolean; renderer?: string } {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return { supported: false };
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : undefined;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { supported: true, renderer };
  } catch {
    return { supported: false };
  }
}

export function getCapabilityReport(): CapabilityReport {
  const webgl = detectWebGL();
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const softwareRenderer = /swiftshader|llvmpipe|software|basic render/i.test(webgl.renderer ?? '');
  const lowPower =
    softwareRenderer ||
    (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) ||
    nav.connection?.saveData === true;

  return {
    webgl: webgl.supported,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    touch: window.matchMedia('(pointer: coarse)').matches,
    lowPower,
    width: window.innerWidth,
    renderer: webgl.renderer,
  };
}

/** Desktop → HIGH, tablet → MEDIUM, phone → LOW, no WebGL / low power / reduced motion → OFF. */
export function resolveTier(report: CapabilityReport, override?: string): QualityTier {
  if (!report.webgl || report.reducedMotion || report.lowPower) return 'OFF';
  if (override && ['HIGH', 'MEDIUM', 'LOW', 'OFF'].includes(override.toUpperCase())) {
    return override.toUpperCase() as QualityTier;
  }
  if (report.width < 768) return 'LOW';
  if (report.width < 1280 || report.touch) return 'MEDIUM';
  return 'HIGH';
}
