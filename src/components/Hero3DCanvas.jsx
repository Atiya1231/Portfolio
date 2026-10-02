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
 * 3D Metallic Sculpture: Fluid twisted knot with rich dark metallic & burgundy/crimson material,
 * glossy glass-like highlights, and subtle mouse tilt.
 */
const SculpturalCore = ({ mouseRef, isReducedMotion }) => {
  const meshRef = useRef(null);
  const outerRingRef = useRef(null);
  const innerRingRef = useRef(null);

  // Smooth mouse target references
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (!isReducedMotion) {
      // Idle slow organic rotation & subtle float
      const idleSpeed = 0.45;
      const floatY = Math.sin(time * 0.8) * 0.09;
      const floatX = Math.cos(time * 0.6) * 0.05;

      // Mouse influence
      const mouseX = mouseRef.current ? mouseRef.current.x : 0;
      const mouseY = mouseRef.current ? mouseRef.current.y : 0;

      targetRotation.current.x = mouseY * 0.4;
      targetRotation.current.y = mouseX * 0.55;

      if (meshRef.current) {
        // Smooth lerp rotation towards mouse + continuous idle rotation
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
          meshRef.current.rotation.x,
          targetRotation.current.x + time * 0.12 * idleSpeed,
          0.045
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          targetRotation.current.y + time * 0.18 * idleSpeed,
          0.045
        );
        meshRef.current.rotation.z = THREE.MathUtils.lerp(
          meshRef.current.rotation.z,
          Math.sin(time * 0.4) * 0.15,
          0.045
        );

        meshRef.current.position.y = floatY;
        meshRef.current.position.x = floatX;
      }

      // Delicate counter-rotating resonant rings for multi-layered depth
      if (outerRingRef.current) {
        outerRingRef.current.rotation.x = -time * 0.1;
        outerRingRef.current.rotation.y = time * 0.14;
        outerRingRef.current.rotation.z = Math.cos(time * 0.3) * 0.2;
        outerRingRef.current.position.y = -floatY * 0.5;
      }

      if (innerRingRef.current) {
        innerRingRef.current.rotation.x = time * 0.15;
        innerRingRef.current.rotation.y = -time * 0.09;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Primary Abstract Metallic Sculpture */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1.22, 0.34, 160, 42, 2, 3]} />
        <meshPhysicalMaterial
          color="#16030c"
          emissive="#3a0617"
          emissiveIntensity={0.42}
          roughness={0.16}
          metalness={0.94}
          clearcoat={0.92}
          clearcoatRoughness={0.08}
          reflectivity={0.95}
        />
      </mesh>

      {/* Orbiting Thin Delicate Neon-Pink Accent Halo Ring */}
      <mesh ref={outerRingRef} scale={1.82}>
        <torusGeometry args={[1.05, 0.014, 16, 100]} />
        <meshStandardMaterial
          color="#ff4f87"
          emissive="#ff4f87"
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.8}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Orbiting Thin Crimson Ambient Ring */}
      <mesh ref={innerRingRef} scale={1.45}>
        <torusGeometry args={[1.15, 0.009, 16, 100]} />
        <meshStandardMaterial
          color="#b11245"
          emissive="#b11245"
          emissiveIntensity={0.6}
          roughness={0.4}
          metalness={0.9}
          transparent
          opacity={0.45}
        />
      </mesh>
    </group>
  );
};

/**
 * 3D Ambient Dust Particles in Burgundy / Crimson / Neon Pink
 */
const Ambient3DParticles = ({ count = 50 }) => {
  const pointsRef = useRef(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color('#b11245'), // Crimson
      new THREE.Color('#ff4f87'), // Neon pink
      new THREE.Color('#5a0b24'), // Burgundy
      new THREE.Color('#ff9dba')  // Soft pink
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
      pos[i * 3 + 2] = radius * Math.cos(phi) * 0.8;

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
      pointsRef.current.rotation.y = time * 0.04;
      pointsRef.current.rotation.x = Math.sin(time * 0.03) * 0.1;
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
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/**
 * Hero3DCanvas: Container component rendering the interactive 3D WebGL digital sculpture.
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
      // Normalize mouse coordinates: -1 to 1
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
        camera={{ position: [0, 0, 4.6], fov: 45 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        {/* Cinematic Ambient & Specular Lighting (Burgundy / Crimson / Neon Pink only - NO blue) */}
        <ambientLight color="#400818" intensity={1.2} />
        
        {/* Main Crimson Key Light */}
        <directionalLight
          position={[4, 3, 4]}
          color="#b11245"
          intensity={4.2}
        />

        {/* Neon Pink Rim Light */}
        <pointLight
          position={[-3.8, -2.2, 3]}
          color="#ff4f87"
          intensity={6.0}
          distance={14}
        />

        {/* Top Soft Pink Specular Highlight */}
        <pointLight
          position={[0.5, 3.5, 2.5]}
          color="#ff9dba"
          intensity={3.2}
          distance={10}
        />

        {/* Deep Burgundy Backlight */}
        <pointLight
          position={[0, 0, -3.5]}
          color="#5a0b24"
          intensity={7.0}
          distance={12}
        />

        {/* Sculptural 3D Mesh and Halos */}
        <SculpturalCore mouseRef={mouseRef} isReducedMotion={isReducedMotion} />

        {/* Floating 3D Ambient Dust Particles */}
        <Ambient3DParticles count={50} />
      </Canvas>
    </div>
  );
};

export default Hero3DCanvas;
