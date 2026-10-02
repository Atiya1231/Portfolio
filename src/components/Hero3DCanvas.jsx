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
 * Translucent 3D Flowing Ribbon Sculpture:
 * Soft organic curves flowing gently behind the portrait with translucent pastel gloss.
 * Palette:
 * - Primary: #4D3A4D (Deep Plum base)
 * - Secondary: #BE5CA9 (Vibrant Sunset Magenta)
 * - Tertiary: #D59CC5 (Soft Sunset Rose)
 */
const TranslucentFlowingRibbon = ({ mouseRef, isReducedMotion }) => {
  const groupRef = useRef(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Main flowing organic ribbon curve
  const primaryRibbonGeometry = useMemo(() => {
    const points = [];
    const numPoints = 120;

    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 2;

      // Asymmetric organic curves that expand softly behind the portrait
      const rX = 1.65 + 0.35 * Math.cos(2 * t) + 0.15 * Math.sin(3 * t);
      const rY = 2.15 + 0.4 * Math.sin(2 * t) - 0.2 * Math.cos(t);

      const x = rX * Math.cos(t);
      const y = rY * Math.sin(t);
      // Gentle depth strictly behind the portrait plane (z: -0.6 to -1.4)
      const z = -0.85 + 0.3 * Math.sin(3 * t) + 0.15 * Math.cos(2 * t);

      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal', 0.5);
    return new THREE.TubeGeometry(curve, 260, 0.13, 32, true);
  }, []);

  // Secondary delicate accent ribbon loop
  const accentRibbonGeometry = useMemo(() => {
    const points = [];
    const numPoints = 80;

    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 2;

      const rX = 1.25 + 0.25 * Math.sin(2 * t);
      const rY = 1.75 + 0.3 * Math.cos(2 * t);

      const x = rX * Math.cos(t + 0.6);
      const y = rY * Math.sin(t + 0.6);
      const z = -1.15 + 0.25 * Math.cos(3 * t);

      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal', 0.5);
    return new THREE.TubeGeometry(curve, 180, 0.075, 24, true);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (!isReducedMotion && groupRef.current) {
      const idleFloatY = Math.sin(time * 0.45) * 0.05;
      const idleFloatX = Math.cos(time * 0.35) * 0.03;

      const mouseX = mouseRef.current ? mouseRef.current.x : 0;
      const mouseY = mouseRef.current ? mouseRef.current.y : 0;

      targetRotation.current.x = mouseY * 0.18;
      targetRotation.current.y = mouseX * 0.24;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x + Math.sin(time * 0.18) * 0.04,
        0.03
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y + time * 0.04,
        0.03
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        Math.cos(time * 0.22) * 0.03,
        0.03
      );

      groupRef.current.position.y = idleFloatY;
      groupRef.current.position.x = idleFloatX;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Primary Translucent Pastel Ribbon */}
      <mesh geometry={primaryRibbonGeometry}>
        <meshPhysicalMaterial
          color="#BE5CA9"
          emissive="#4D3A4D"
          emissiveIntensity={0.25}
          roughness={0.16}
          metalness={0.3}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          transmission={0.42}
          thickness={0.75}
          ior={1.42}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Secondary Soft Rose Ribbon */}
      <mesh geometry={accentRibbonGeometry}>
        <meshPhysicalMaterial
          color="#D59CC5"
          emissive="#6E355E"
          emissiveIntensity={0.2}
          roughness={0.22}
          metalness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.12}
          transmission={0.5}
          thickness={0.6}
          transparent
          opacity={0.82}
        />
      </mesh>
    </group>
  );
};

/**
 * Floating Glossy Pastel Spheres:
 * Multiple subtle glossy 3D spheres floating at varying depths behind the portrait.
 */
const FloatingPastelSpheres = ({ mouseRef, isReducedMotion }) => {
  const spheresGroupRef = useRef(null);

  const sphereData = useMemo(() => [
    { pos: [-1.8, 1.4, -0.9], radius: 0.24, color: '#D59CC5', emissive: '#4D3A4D', speed: 0.7, phase: 0 },
    { pos: [1.9, 1.2, -1.2], radius: 0.28, color: '#BE5CA9', emissive: '#4D3A4D', speed: 0.55, phase: 1.8 },
    { pos: [-1.9, -1.3, -1.0], radius: 0.22, color: '#BE5CA9', emissive: '#4D3A4D', speed: 0.8, phase: 3.2 },
    { pos: [1.8, -1.4, -0.8], radius: 0.26, color: '#D59CC5', emissive: '#4D3A4D', speed: 0.65, phase: 4.5 },
    { pos: [0.3, 2.2, -1.4], radius: 0.18, color: '#EADADA', emissive: '#BE5CA9', speed: 0.5, phase: 2.1 },
    { pos: [-0.4, -2.2, -1.3], radius: 0.2, color: '#4D3A4D', emissive: '#BE5CA9', speed: 0.6, phase: 5.4 },
    { pos: [2.3, 0.2, -1.5], radius: 0.16, color: '#D59CC5', emissive: '#4D3A4D', speed: 0.75, phase: 0.9 },
    { pos: [-2.2, 0.1, -1.3], radius: 0.15, color: '#BE5CA9', emissive: '#4D3A4D', speed: 0.85, phase: 2.7 }
  ], []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (!isReducedMotion && spheresGroupRef.current) {
      const mouseX = mouseRef.current ? mouseRef.current.x : 0;
      const mouseY = mouseRef.current ? mouseRef.current.y : 0;

      spheresGroupRef.current.children.forEach((mesh, idx) => {
        const item = sphereData[idx];
        if (!item) return;

        // Subtle organic floating bobbing
        mesh.position.y = item.pos[1] + Math.sin(time * item.speed + item.phase) * 0.12;
        mesh.position.x = item.pos[0] + Math.cos(time * item.speed * 0.8 + item.phase) * 0.08 + mouseX * 0.06;
        mesh.position.z = item.pos[2] + Math.sin(time * item.speed * 0.5 + item.phase) * 0.06 + mouseY * 0.06;
      });
    }
  });

  return (
    <group ref={spheresGroupRef}>
      {sphereData.map((item, idx) => (
        <mesh key={idx} position={item.pos}>
          <sphereGeometry args={[item.radius, 32, 32]} />
          <meshPhysicalMaterial
            color={item.color}
            emissive={item.emissive}
            emissiveIntensity={0.25}
            roughness={0.12}
            metalness={0.25}
            clearcoat={1.0}
            clearcoatRoughness={0.06}
            reflectivity={0.9}
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Soft Ambient Particles in Vibrant Sunset Palette
 */
const AmbientPastelParticles = ({ count = 40 }) => {
  const pointsRef = useRef(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color('#D59CC5'), // Soft Sunset Rose
      new THREE.Color('#BE5CA9'), // Vibrant Sunset Magenta
      new THREE.Color('#4D3A4D')  // Deep Plum
    ];

    for (let i = 0; i < count; i++) {
      const r1 = pseudoRandom(i * 1.37 + 1);
      const r2 = pseudoRandom(i * 2.71 + 3);
      const r3 = pseudoRandom(i * 3.14 + 7);
      const r4 = pseudoRandom(i * 4.92 + 11);

      const radius = 1.6 + r1 * 2.2;
      const theta = r2 * Math.PI * 2;
      const phi = Math.acos(2 * r3 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi) * 0.6 - 0.9;

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
      pointsRef.current.rotation.x = Math.sin(time * 0.015) * 0.03;
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
        size={0.042}
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
 * Hero3DCanvas: Renders the 3D pastel environment behind the authentic portrait.
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
        camera={{ position: [0, 0, 5.2], fov: 44 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        {/* Soft Ambient Fill: #EADADA */}
        <ambientLight color="#EADADA" intensity={2.2} />
        
        {/* Key Directional Light: #D59CC5 (Soft sunset illumination) */}
        <directionalLight
          position={[3.5, 3.2, 3.2]}
          color="#D59CC5"
          intensity={4.5}
        />

        {/* Accent Point Light: #BE5CA9 (Warm magenta orchid rim) */}
        <pointLight
          position={[-3.5, -1.2, 2.5]}
          color="#BE5CA9"
          intensity={5.2}
          distance={16}
        />

        {/* Soft Top Glow: #D59CC5 */}
        <pointLight
          position={[0, 3.5, 1.8]}
          color="#D59CC5"
          intensity={3.2}
          distance={12}
        />

        {/* Deep Plum Depth Light: #4D3A4D */}
        <pointLight
          position={[0, 0, -3.5]}
          color="#4D3A4D"
          intensity={4.0}
          distance={12}
        />

        {/* Translucent 3D Flowing Ribbons */}
        <TranslucentFlowingRibbon mouseRef={mouseRef} isReducedMotion={isReducedMotion} />

        {/* Floating Glossy Pastel Spheres */}
        <FloatingPastelSpheres mouseRef={mouseRef} isReducedMotion={isReducedMotion} />

        {/* Ambient Pastel Dust Particles */}
        <AmbientPastelParticles count={40} />
      </Canvas>
    </div>
  );
};

export default Hero3DCanvas;
