import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Deterministic pseudo-random float generator for pure renders
 */
const pseudoRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

/**
 * Soft Ambient Depth Spheres & Pastel Blobs:
 * Subtle, soft translucent spheres drifting far behind the portrait.
 * NOT forming rings, loops, or frames.
 * Palette:
 * - #D59CC5 (Soft Sunset Rose)
 * - #BE5CA9 (Vibrant Magenta accent)
 * - #4D3A4D (Deep Plum depth)
 * - #EADADA (Pastel Stone)
 */
const AtmosphericPastelOrbs = ({ mouseRef, isReducedMotion }) => {
  const groupRef = useRef(null);

  // Soft scattered spheres at deep background Z positions (z: -1.4 to -3.2)
  const orbsData = useMemo(() => [
    { pos: [-2.2, 1.6, -2.0], radius: 0.45, color: '#D59CC5', emissive: '#4D3A4D', opacity: 0.65, speed: 0.4, phase: 0 },
    { pos: [2.4, 1.4, -2.5], radius: 0.55, color: '#BE5CA9', emissive: '#4D3A4D', opacity: 0.55, speed: 0.35, phase: 1.5 },
    { pos: [-2.6, -1.2, -2.2], radius: 0.4, color: '#BE5CA9', emissive: '#4D3A4D', opacity: 0.6, speed: 0.45, phase: 3.0 },
    { pos: [2.5, -1.5, -1.8], radius: 0.5, color: '#D59CC5', emissive: '#4D3A4D', opacity: 0.65, speed: 0.38, phase: 4.2 },
    { pos: [0.6, 2.4, -2.8], radius: 0.35, color: '#EADADA', emissive: '#BE5CA9', opacity: 0.7, speed: 0.3, phase: 2.1 },
    { pos: [-0.8, -2.2, -2.6], radius: 0.42, color: '#4D3A4D', emissive: '#BE5CA9', opacity: 0.5, speed: 0.42, phase: 5.1 },
    { pos: [2.8, 0.2, -3.0], radius: 0.38, color: '#D59CC5', emissive: '#4D3A4D', opacity: 0.6, speed: 0.32, phase: 0.8 },
    { pos: [-2.9, 0.4, -2.7], radius: 0.32, color: '#BE5CA9', emissive: '#4D3A4D', opacity: 0.55, speed: 0.48, phase: 2.6 }
  ], []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (!isReducedMotion && groupRef.current) {
      const mouseX = mouseRef.current ? mouseRef.current.x : 0;
      const mouseY = mouseRef.current ? mouseRef.current.y : 0;

      // Slow, subtle parallax tilt
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouseX * 0.15, 0.03);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouseY * 0.12, 0.03);

      groupRef.current.children.forEach((mesh, idx) => {
        const item = orbsData[idx];
        if (!item) return;

        // Very slow organic floating
        mesh.position.y = item.pos[1] + Math.sin(time * item.speed + item.phase) * 0.14;
        mesh.position.x = item.pos[0] + Math.cos(time * item.speed * 0.8 + item.phase) * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {orbsData.map((item, idx) => (
        <mesh key={idx} position={item.pos}>
          <sphereGeometry args={[item.radius, 32, 32]} />
          <meshPhysicalMaterial
            color={item.color}
            emissive={item.emissive}
            emissiveIntensity={0.2}
            roughness={0.25}
            metalness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.12}
            transmission={0.6}
            thickness={0.8}
            transparent
            opacity={item.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Soft Ambient Depth Particles in Pastel Palette
 */
const AmbientPastelDust = ({ count = 35 }) => {
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

      const radius = 2.0 + r1 * 2.5;
      const theta = r2 * Math.PI * 2;
      const phi = Math.acos(2 * r3 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = -1.5 - r3 * 1.8; // Strictly deep behind portrait

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
      pointsRef.current.rotation.y = time * 0.018;
      pointsRef.current.rotation.x = Math.sin(time * 0.012) * 0.02;
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
        size={0.045}
        vertexColors
        transparent
        opacity={0.5}
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
};

/**
 * Hero3DCanvas: Soft Atmospheric 3D Environment
 * NO rings, NO loops, NO tubes, NO toruses, NO cages.
 * Pure atmospheric depth layers and soft volumetric pastel light.
 */
const Hero3DCanvas = ({ className = '', style = {} }) => {
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
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
        <ambientLight color="#EADADA" intensity={2.4} />
        
        {/* Key Directional Light: #D59CC5 */}
        <directionalLight
          position={[3.2, 3.0, 2.5]}
          color="#D59CC5"
          intensity={4.0}
        />

        {/* Accent Point Light: #BE5CA9 */}
        <pointLight
          position={[-3.2, -1.0, 2.0]}
          color="#BE5CA9"
          intensity={4.5}
          distance={15}
        />

        {/* Soft Top Glow: #D59CC5 */}
        <pointLight
          position={[0, 3.2, 1.5]}
          color="#D59CC5"
          intensity={3.0}
          distance={12}
        />

        {/* Deep Plum Backlight: #4D3A4D */}
        <pointLight
          position={[0, 0, -3.5]}
          color="#4D3A4D"
          intensity={3.8}
          distance={12}
        />

        {/* Atmospheric Floating Pastel Orbs */}
        <AtmosphericPastelOrbs mouseRef={mouseRef} isReducedMotion={isReducedMotion} />

        {/* Subtle Ambient Dust Particles */}
        <AmbientPastelDust count={35} />
      </Canvas>
    </div>
  );
};

export default Hero3DCanvas;
