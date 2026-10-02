import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Deterministic pseudo-random float generator
 */
const pseudoRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

/**
 * Subtle Ambient Depth Dust Particles:
 * Tiny floating specks of sunset light in the background depth field.
 * Strictly behind the portrait.
 */
const SubtleAmbientDust = ({ count = 25 }) => {
  const pointsRef = useRef(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color('#D59CC5'),
      new THREE.Color('#BE5CA9'),
      new THREE.Color('#4D3A4D')
    ];

    for (let i = 0; i < count; i++) {
      const r1 = pseudoRandom(i * 1.37 + 1);
      const r2 = pseudoRandom(i * 2.71 + 3);
      const r3 = pseudoRandom(i * 3.14 + 7);
      const r4 = pseudoRandom(i * 4.92 + 11);

      const radius = 2.2 + r1 * 2.5;
      const theta = r2 * Math.PI * 2;
      const phi = Math.acos(2 * r3 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = -1.8 - r3 * 2.0; // Strictly deep behind portrait

      const chosenColor = colorPalette[Math.floor(r4 * colorPalette.length)];
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.012;
      pointsRef.current.rotation.x = Math.sin(time * 0.008) * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.4}
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
};

/**
 * Hero3DCanvas: Pure Cinematic Volumetric Lighting & Depth Scene
 * NO spheres, NO balls, NO bubbles, NO rings, NO loops, NO cages.
 * Provides soft volumetric lighting depth behind the editorial portrait.
 */
const Hero3DCanvas = ({ className = '', style = {} }) => {
  const [isReducedMotion, setIsReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  return (
    <div className={`hero-3d-canvas-container ${className}`} style={style} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        {/* Soft Ambient Fill: #EADADA */}
        <ambientLight color="#EADADA" intensity={2.6} />
        
        {/* Key Directional Sunset Light: #D59CC5 */}
        <directionalLight
          position={[3.0, 3.2, 2.5]}
          color="#D59CC5"
          intensity={4.2}
        />

        {/* Accent Point Magenta Rim: #BE5CA9 */}
        <pointLight
          position={[-3.2, -1.0, 2.0]}
          color="#BE5CA9"
          intensity={4.8}
          distance={15}
        />

        {/* Subtle Ambient Dust Particles in Depth */}
        {!isReducedMotion && <SubtleAmbientDust count={25} />}
      </Canvas>
    </div>
  );
};

export default Hero3DCanvas;
