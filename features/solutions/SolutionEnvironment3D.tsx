'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SolutionEnvironment3DProps {
  accentColor: string; // hex
  activeId: string;
  className?: string;
}

export const SolutionEnvironment3D: React.FC<SolutionEnvironment3DProps> = ({
  accentColor,
  activeId,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    spotlight: THREE.SpotLight | null;
    targetColor: THREE.Color;
    currentColor: THREE.Color;
    gridHelper: THREE.GridHelper | null;
    particleSystem: THREE.Points | null;
    lightBeams: THREE.LineSegments | null;
    reqId: number | null;
    mouseX: number;
    mouseY: number;
    targetMouseX: number;
    targetMouseY: number;
    isVisible: boolean;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    spotlight: null,
    targetColor: new THREE.Color(accentColor),
    currentColor: new THREE.Color(accentColor),
    gridHelper: null,
    particleSystem: null,
    lightBeams: null,
    reqId: null,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    isVisible: true,
  });

  // Update target color on accent change
  useEffect(() => {
    stateRef.current.targetColor.set(accentColor);
  }, [accentColor]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020b1d, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 9);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch {
      // WebGL not supported, fallback gracefully
      return;
    }

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1931, 1.4);
    scene.add(ambientLight);

    const initialColor = new THREE.Color(accentColor);
    const spotlight = new THREE.SpotLight(initialColor, 4.5, 25, Math.PI / 4, 0.4, 1.2);
    spotlight.position.set(0, 8, 4);
    spotlight.target.position.set(0, 0, 0);
    scene.add(spotlight);
    scene.add(spotlight.target);

    // Secondary rim backlight
    const rimLight = new THREE.DirectionalLight(0xd4af37, 0.6);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    // 5. Grid Floor (Architectural Infrastructure Ground)
    const gridSize = 32;
    const gridDivisions = 32;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, initialColor, 0x0c234a);
    gridHelper.position.y = -2.2;
    // Fade grid slightly
    if (gridHelper.material instanceof THREE.Material) {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.35;
    }
    scene.add(gridHelper);

    // 6. Atmospheric Floating Particles
    const particleCount = prefersReducedMotion ? 40 : 140;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      scales[i] = Math.random() * 0.8 + 0.2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const particleMaterial = new THREE.PointsMaterial({
      color: initialColor,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 7. Subtle vertical light beams / structural lines
    const beamCount = 14;
    const beamPositions: number[] = [];
    for (let i = 0; i < beamCount; i++) {
      const bx = (Math.random() - 0.5) * 16;
      const bz = (Math.random() - 0.5) * 12 - 2;
      beamPositions.push(bx, -2.2, bz);
      beamPositions.push(bx, Math.random() * 4 + 1.5, bz);
    }
    const beamGeometry = new THREE.BufferGeometry();
    beamGeometry.setAttribute('position', new THREE.Float32BufferAttribute(beamPositions, 3));
    const beamMaterial = new THREE.LineBasicMaterial({
      color: initialColor,
      transparent: true,
      opacity: 0.22,
    });
    const lightBeams = new THREE.LineSegments(beamGeometry, beamMaterial);
    scene.add(lightBeams);

    // Store state
    stateRef.current = {
      renderer,
      scene,
      camera,
      spotlight,
      targetColor: new THREE.Color(accentColor),
      currentColor: initialColor,
      gridHelper,
      particleSystem,
      lightBeams,
      reqId: null,
      mouseX: 0,
      mouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      isVisible: true,
    };

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      stateRef.current.targetMouseX = x;
      stateRef.current.targetMouseY = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Visibility observer to save battery / GPU
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        stateRef.current.isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 8. Animation Render Loop
    let clock = new THREE.Clock();
    const animate = () => {
      stateRef.current.reqId = requestAnimationFrame(animate);

      if (!stateRef.current.isVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth color interpolation towards target division accent
      const { currentColor, targetColor } = stateRef.current;
      currentColor.lerp(targetColor, 0.05);

      if (spotlight) {
        spotlight.color.copy(currentColor);
      }
      if (particleMaterial) {
        particleMaterial.color.copy(currentColor);
      }
      if (beamMaterial) {
        beamMaterial.color.copy(currentColor);
      }

      // Smooth camera sway with subtle mouse lag
      if (!prefersReducedMotion) {
        stateRef.current.mouseX +=
          (stateRef.current.targetMouseX - stateRef.current.mouseX) * 0.04;
        stateRef.current.mouseY +=
          (stateRef.current.targetMouseY - stateRef.current.mouseY) * 0.04;

        camera.position.x = stateRef.current.mouseX * 1.8 + Math.sin(time * 0.15) * 0.2;
        camera.position.y = 1.5 - stateRef.current.mouseY * 0.9 + Math.cos(time * 0.12) * 0.1;
        camera.lookAt(stateRef.current.mouseX * 0.5, 0, 0);

        // Slowly rotate particles
        if (particleSystem) {
          particleSystem.rotation.y = time * 0.03;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      if (stateRef.current.reqId) {
        cancelAnimationFrame(stateRef.current.reqId);
      }

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }

      particleGeometry.dispose();
      particleMaterial.dispose();
      beamGeometry.dispose();
      beamMaterial.dispose();
      scene.clear();
    };
  }, []); // Run once on mount

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    />
  );
};
