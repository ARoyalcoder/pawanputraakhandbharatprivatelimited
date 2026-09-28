'use client';

import dynamic from 'next/dynamic';
import { ThreeScene } from '@/components/3d/ThreeScene';
import { SceneLoader } from '@/components/3d/SceneLoader';
import { ConceptArt } from '@/components/media/ConceptArt';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const fallback = <ConceptArt variant="secure" />;

const CameraTrackerScene = dynamic(() => import('@/components/3d/scenes/CameraTrackerScene'), {
  ssr: false,
  loading: () => <SceneLoader>{fallback}</SceneLoader>,
});

export function SecureHeroVisual() {
  const finePointer = useMediaQuery('(pointer: fine)');
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-white/10 bg-[radial-gradient(70%_70%_at_50%_40%,#12305c,#020b1d)]">
      <div aria-hidden="true" className="absolute inset-0 bg-blueprint opacity-50" />
      <ThreeScene
        splineUrl={process.env.NEXT_PUBLIC_SPLINE_SECURE_URL || undefined}
        fallback={fallback}
        render={(ctx) => <CameraTrackerScene {...ctx} pointer={finePointer} />}
      />
      <CornerFrame inset={16} className="text-secure/70" />
      <p className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-navy-950/70 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/75 backdrop-blur-sm">
        <span aria-hidden="true" className="size-1.5 animate-pulse-soft rounded-full bg-red-400" />
        Har Nazar Se Suraksha
      </p>
    </div>
  );
}
