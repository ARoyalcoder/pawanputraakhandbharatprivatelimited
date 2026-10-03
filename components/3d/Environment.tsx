'use client';

import { Environment as DreiEnvironment, Lightformer } from '@react-three/drei';

export interface IntroEnvironmentProps {
  intensity?: number;
  enableLightformers?: boolean;
}

export function Environment({
  intensity = 1.0,
  enableLightformers = true,
}: IntroEnvironmentProps) {
  return (
    <>
      {/* Cinematic Deep Navy Fog & Atmospheric Depth */}
      <color attach="background" args={['#020b1d']} />
      <fog attach="fog" args={['#020b1d', 4, 25]} />

      {enableLightformers && (
        <DreiEnvironment resolution={256} frames={1}>
          {/* Warm gold overhead key lightformer */}
          <Lightformer
            form="rect"
            intensity={2.8 * intensity}
            position={[0, 5, -3]}
            scale={[12, 3, 1]}
            color="#ffe082"
          />
          {/* Cool navy lateral fill */}
          <Lightformer
            form="rect"
            intensity={1.5 * intensity}
            position={[-7, 0, 2]}
            rotation-y={Math.PI / 2}
            scale={[9, 4, 1]}
            color="#2563eb"
          />
          {/* Subtle gold specular rim ring */}
          <Lightformer
            form="ring"
            intensity={3.2 * intensity}
            position={[4, 2, 4]}
            scale={3}
            color="#d8a62a"
          />
        </DreiEnvironment>
      )}
    </>
  );
}
