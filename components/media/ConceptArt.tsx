import { useId, type ComponentType } from 'react';
import type { ConceptArtVariant } from '@/types/content';
import { cn } from '@/lib/utils';
import { ConnectScene, DigitalScene, HeroScene, SecureScene, SolarScene, SpaceScene } from './concept/division-scenes';
import {
  CommercialScene,
  CorporateScene,
  EducationScene,
  HealthcareScene,
  HospitalityScene,
  ManufacturingScene,
  ResidentialScene,
} from './concept/industry-scenes';

const scenes: Record<ConceptArtVariant, ComponentType<{ id: string }>> = {
  hero: HeroScene,
  secure: SecureScene,
  connect: ConnectScene,
  solar: SolarScene,
  digital: DigitalScene,
  space: SpaceScene,
  residential: ResidentialScene,
  education: EducationScene,
  healthcare: HealthcareScene,
  corporate: CorporateScene,
  hospitality: HospitalityScene,
  manufacturing: ManufacturingScene,
  commercial: CommercialScene,
};

interface ConceptArtProps {
  variant: ConceptArtVariant;
  /** Accessible description. Omit to mark the illustration as decorative. */
  label?: string;
  className?: string;
}

/**
 * Built-in line-art illustration for each division and industry. Used wherever an AI
 * concept image has not been generated yet, so layouts never show empty boxes.
 */
export function ConceptArt({ variant, label, className }: ConceptArtProps) {
  const id = `ca${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const Scene = scenes[variant];
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={cn('block size-full', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <Scene id={id} />
    </svg>
  );
}
