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
 * Single Coherent 3D Flowing Ribbon Sculpture:
 * A continuous, elegant organic 3D loop that wraps smoothly behind and around the portrait.
 * Palette:
 * - Base: #4D3A4D
 * - Highlights: #BE5CA9
 * - Soft Reflections: #D59CC5
 */
const FlowingRibbonSculpture = ({ mouseRef, isReducedMotion }) => {
  const groupRef = useRef(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Generate a continuous, smooth 3D spline curve framing the portrait
  const ribbonGeometry = useMemo(() => {
    const points = [];
    const numPoints = 80;

    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 2;

      // Smooth flowing ribbon path that frames the portrait perimeter
      // Upper curve -> Right sweep -> Lower sweep -> Left return
      const rX = 1.38 + 0.18 * Math.cos(2 * t);
      const rY = 1.82 + 0.24 * Math.sin(2 * t);

      const x = rX * Math.cos(t);
      const y = rY * Math.sin(t);
      // Soft Z depth variation that remains behind the portrait plane (z: -0.35 to -0.85)
      const z = -0.58 + 0.24 * Math.sin(3 * t) + 0.08 * Math.cos(t);

      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal', 0.5);
    return new THREE.TubeGeometry(curve, 220, 0.092, 28, true);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (!isReducedMotion && groupRef.current) {
      // Extremely gentle idle floating & very slow organic rotation as ONE connected piece
      const idleFloatY = Math.sin(time * 0.6) * 0.05;
      const idleFloatX = Math.cos(time * 0.45) * 0.03;

      const mouseX = mouseRef.current ? mouseRef.current.x : 0;
      const mouseY = mouseRef.current ? mouseRef.current.y : 0;

      // Subtle, controlled mouse parallax
      targetRotation.current.x = mouseY * 0.22;
      targetRotation.current.y = mouseX * 0.32;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x + Math.sin(time * 0.25) * 0.06,
        0.04
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y + time * 0.06,
        0.04
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        Math.cos(time * 0.3) * 0.04,
        0.04
      );

      groupRef.current.position.y = idleFloatY;
      groupRef.current.position.x = idleFloatX;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Single Continuous 3D Flowing Ribbon Sculpture */}
      <mesh geometry={ribbonGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#4D3A4D"
          emissive="#6B325F"
          emissiveIntensity={0.28}
          roughness={0.22}
          metalness={0.84}
          clearcoat={0.88}
          clearcoatRoughness={0.14}
          reflectivity={0.88}
        />
      </mesh>
    </group>
  );
};

/**
 * Faint Floating 3D Dust Particles in Vibrant Sunset Palette
 */
const Ambient3DParticles = ({ count = 35 }) => {
  const pointsRef = useRef(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color('#BE5CA9'), // Secondary Vibrant Sunset Orchid
      new THREE.Color('#D59CC5'), // Tertiary Soft Sunset Rose
      new THREE.Color('#4D3A4D')  // Primary Deep Plum
    ];

    for (let i = 0; i < count; i++) {
      const r1 = pseudoRandom(i * 1.37 + 1);
      const r2 = pseudoRandom(i * 2.71 + 3);
      const r3 = pseudoRandom(i * 3.14 + 7);
      const r4 = pseudoRandom(i * 4.92 + 11);

      const radius = 1.8 + r1 * 1.8;
      const theta = r2 * Math.PI * 2;
      const phi = Math.acos(2 * r3 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi) * 0.6 - 0.4;

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
      pointsRef.current.rotation.y = time * 0.025;
      pointsRef.current.rotation.x = Math.sin(time * 0.02) * 0.05;
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
        size={0.038}
        vertexColors
        transparent
        opacity={0.55}
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
};

/**
 * Hero3DCanvas: Renders the single coherent 3D flowing sculpture
 * positioned behind and wrapping gracefully around the portrait.
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
        camera={{ position: [0, 0, 4.8], fov: 42 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        {/* Soft Ambient Fill: #EADADA */}
        <ambientLight color="#EADADA" intensity={1.6} />
        
        {/* Key Directional Light: #D59CC5 (Soft sunset illumination) */}
        <directionalLight
          position={[3.5, 3.0, 3.0]}
          color="#D59CC5"
          intensity={4.2}
        />

        {/* Accent Point Light: #BE5CA9 (Warm orchid rim light matching portrait) */}
        <pointLight
          position={[-3.0, -1.5, 2.0]}
          color="#BE5CA9"
          intensity={4.8}
          distance={14}
        />

        {/* Specular Highlight: #D59CC5 */}
        <pointLight
          position={[0.2, 3.2, 1.8]}
          color="#D59CC5"
          intensity={2.6}
          distance={10}
        />

        {/* Depth Shadow Light: #4D3A4D */}
        <pointLight
          position={[0, 0, -3.0]}
          color="#4D3A4D"
          intensity={3.8}
          distance={10}
        />

        {/* Single Coherent 3D Flowing Ribbon Sculpture */}
        <FlowingRibbonSculpture mouseRef={mouseRef} isReducedMotion={isReducedMotion} />

        {/* Subtle Ambient Dust Particles */}
        <Ambient3DParticles count={35} />
      </Canvas>
    </div>
  );
};

export default Hero3DCanvas;
