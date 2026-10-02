import React, { useRef, useEffect } from 'react';

/**
 * EditorialVisor: High-Fashion Translucent Futuristic Visor / Glasses
 * Placed precisely over Atiya's eyes with realistic perspective (-19.3deg tilt),
 * optical refraction, tinted glass gradient (#4D3A4D, #BE5CA9, #D59CC5),
 * titanium brow bar, and interactive cursor-driven specular light sweep.
 */
const EditorialVisor = ({ mousePos = { x: 0, y: 0 } }) => {
  const glareRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!glareRef.current) return;
    // Interactive specular reflection shifts subtly across the lens with mouse parallax
    const moveX = mousePos.x * 24;
    const moveY = mousePos.y * 14;
    glareRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }, [mousePos]);

  return (
    <div
      ref={containerRef}
      className="editorial-visor-container"
      aria-hidden="true"
    >
      {/* Optical Refraction Backdrop Layer */}
      <div className="visor-backdrop-refraction" />

      {/* High-Precision Fashion Editorial Visor Vector Shield */}
      <svg
        className="visor-svg-shield"
        viewBox="0 0 320 95"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Main Translucent Glass Tint Gradient */}
          <linearGradient id="visorGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4D3A4D" stopOpacity="0.55" />
            <stop offset="35%" stopColor="#7E386F" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#BE5CA9" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#D59CC5" stopOpacity="0.5" />
          </linearGradient>

          {/* Titanium Metallic Brow Bar Gradient */}
          <linearGradient id="visorMetalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4D3A4D" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#D59CC5" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="75%" stopColor="#BE5CA9" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4D3A4D" stopOpacity="0.9" />
          </linearGradient>

          {/* Aerodynamic Lens Rim Stroke Gradient */}
          <linearGradient id="visorRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#BE5CA9" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4D3A4D" stopOpacity="0.7" />
          </linearGradient>

          {/* Specular Glare Gradient */}
          <linearGradient id="glareSheenGrad" x1="0%" y1="0%" x2="100%" y2="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="65%" stopColor="#D59CC5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#BE5CA9" stopOpacity="0" />
          </linearGradient>

          {/* Clip path matching exact lens curvature */}
          <clipPath id="visorLensClip">
            <path d="M 12,18 C 50,14 110,12 160,12 C 210,12 270,14 308,18 C 316,28 318,48 300,74 C 280,86 220,90 185,78 C 172,74 167,58 160,58 C 153,58 148,74 135,78 C 100,90 40,86 20,74 C 2,48 4,28 12,18 Z" />
          </clipPath>
        </defs>

        {/* 1. Translucent Tinted Visor Lens Body */}
        <path
          className="visor-lens-path"
          d="M 12,18 C 50,14 110,12 160,12 C 210,12 270,14 308,18 C 316,28 318,48 300,74 C 280,86 220,90 185,78 C 172,74 167,58 160,58 C 153,58 148,74 135,78 C 100,90 40,86 20,74 C 2,48 4,28 12,18 Z"
          fill="url(#visorGlassGrad)"
          stroke="url(#visorRimGrad)"
          strokeWidth="1.2"
        />

        {/* 2. Dynamic Specular Light Glare Streak (Clipped to Lens) */}
        <g clipPath="url(#visorLensClip)">
          <g ref={glareRef} className="visor-glare-group">
            {/* Primary High-Gloss Glare Beam */}
            <polygon
              points="60,-20 120,-20 180,120 120,120"
              fill="url(#glareSheenGrad)"
            />
            {/* Secondary Accent Reflection */}
            <polygon
              points="190,-20 220,-20 250,120 220,120"
              fill="url(#glareSheenGrad)"
              opacity="0.6"
            />
            {/* Top Rim Horizon Catchlight */}
            <path
              d="M 20,16 Q 160,10 300,16"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeOpacity="0.75"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* 3. Ultra-Slim Titanium Top Brow Rail */}
        <path
          className="visor-brow-bar"
          d="M 10,16 C 50,12 110,10 160,10 C 210,10 270,12 310,16"
          stroke="url(#visorMetalGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* 4. Luxury Micro-Hardware Accents (Temples & Bridge) */}
        {/* Left Temple Fixture */}
        <circle cx="12" cy="17" r="2.2" fill="#D59CC5" stroke="#4D3A4D" strokeWidth="0.8" />
        <circle cx="12" cy="17" r="0.9" fill="#FFFFFF" />

        {/* Right Temple Fixture */}
        <circle cx="308" cy="17" r="2.2" fill="#D59CC5" stroke="#4D3A4D" strokeWidth="0.8" />
        <circle cx="308" cy="17" r="0.9" fill="#FFFFFF" />

        {/* Center Minimal Geometric Bridge Accent */}
        <path
          d="M 157,11 L 163,11 L 161,16 L 159,16 Z"
          fill="#FFFFFF"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};

export default EditorialVisor;
