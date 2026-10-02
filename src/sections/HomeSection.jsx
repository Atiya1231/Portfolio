import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { gsap, ScrollTrigger, scrollToSection } from '../animations/gsapUtils';
import Hero3DCanvas from '../components/Hero3DCanvas';
import MagneticButton from '../components/MagneticButton';
import portraitBase from '../assets/atiya-base.png';
import portraitFuturistic from '../assets/atiya-futuristic.png';

/**
 * HomeSection: Full-screen Cinematic Hero with Two-Layer Cursor Reveal.
 *
 * Concepts:
 * - Base Layer: Authentic portrait with natural styling (pink dress, chic glasses).
 * - Reveal Layer: Futuristic portrait with chrome visor and metallic silver outfit.
 * - Interaction: Smooth, fluid cursor-driven circular mask reveal with smooth lerp easing.
 * - Aesthetics: High-fashion editorial serif typography (ATIYA ALI), vibrant sunset palette (#4D3A4D, #BE5CA9, #D59CC5, #EADADA).
 * - Zero decorative 3D clutter (no spheres, rings, orbits, boxes, or cards).
 */
const HomeSection = () => {
  const sectionRef = useRef(null);
  const visualRightRef = useRef(null);
  const portraitWrapperRef = useRef(null);
  const futuristicLayerRef = useRef(null);
  const glowCrimsonRef = useRef(null);
  const glowPinkRef = useRef(null);
  const glowLeftRef = useRef(null);
  const nameAtiyaRef = useRef(null);
  const nameAliRef = useRef(null);
  const contentLeftRef = useRef(null);

  // Smooth lerp coordinates for the circular cursor reveal
  const targetReveal = useRef({ x: 230, y: 220, radius: 0, active: false });
  const currentReveal = useRef({ x: 230, y: 220, radius: 0 });
  const rafRef = useRef(null);

  // Parallax subtle tilt offsets
  const [, setMouseOffset] = useState({ x: 0, y: 0 });

  // Update reveal target based on pointer position relative to portrait
  const updateRevealPosition = useCallback((clientX, clientY) => {
    if (!portraitWrapperRef.current) return;
    const rect = portraitWrapperRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Check if cursor is reasonably near or over the portrait
    const isInside =
      x >= -50 && x <= rect.width + 50 && y >= -50 && y <= rect.height + 50;

    targetReveal.current.x = x;
    targetReveal.current.y = y;
    targetReveal.current.radius = isInside ? 165 : 0;
    targetReveal.current.active = isInside;

    // Subtle 3D portrait parallax shift (max 8px)
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;
    setMouseOffset({ x: normX, y: normY });

    if (portraitWrapperRef.current) {
      const rotX = -normY * 3.5;
      const rotY = normX * 3.5;
      portraitWrapperRef.current.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${normX * 4}px, ${normY * 4}px, 0)`;
    }
  }, []);

  const handlePointerMove = (e) => {
    updateRevealPosition(e.clientX, e.clientY);
  };

  const handlePointerLeave = () => {
    targetReveal.current.radius = 0;
    targetReveal.current.active = false;
    if (portraitWrapperRef.current) {
      portraitWrapperRef.current.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
    }
  };

  // Touch support for mobile & tablet
  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updateRevealPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    targetReveal.current.radius = 0;
    targetReveal.current.active = false;
  };

  // Continuous Fluid RequestAnimationFrame Lerp Loop
  useEffect(() => {
    const isReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (isReducedMotion) return;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animateReveal = () => {
      const target = targetReveal.current;
      const current = currentReveal.current;

      current.x = lerp(current.x, target.x, 0.12);
      current.y = lerp(current.y, target.y, 0.12);
      current.radius = lerp(current.radius, target.radius, 0.1);

      if (futuristicLayerRef.current) {
        futuristicLayerRef.current.style.setProperty('--reveal-x', `${current.x.toFixed(1)}px`);
        futuristicLayerRef.current.style.setProperty('--reveal-y', `${current.y.toFixed(1)}px`);
        futuristicLayerRef.current.style.setProperty('--reveal-r', `${current.radius.toFixed(1)}px`);
      }

      rafRef.current = requestAnimationFrame(animateReveal);
    };

    rafRef.current = requestAnimationFrame(animateReveal);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Global mousemove for hero depth tracking
  useEffect(() => {
    const onGlobalMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          updateRevealPosition(e.clientX, e.clientY);
        }
      }
    };

    window.addEventListener('mousemove', onGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onGlobalMouseMove);
  }, [updateRevealPosition]);

  // GSAP Cinematic Entrance Timeline
  useEffect(() => {
    const isReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (isReducedMotion) {
        gsap.set(
          [
            glowCrimsonRef.current,
            glowPinkRef.current,
            glowLeftRef.current,
            '.hero-3d-canvas-container',
            portraitWrapperRef.current,
            nameAtiyaRef.current,
            nameAliRef.current,
            '.hero-status-pill',
            '.hero-tagline',
            '.hero-description',
            '.hero-editorial-statement',
            '.magnetic-btn',
            '.hero-scroll-indicator'
          ],
          { opacity: 1, visibility: 'visible', clearProps: 'transform,filter' }
        );
        return;
      }

      // Initial clean state
      gsap.set([glowCrimsonRef.current, glowPinkRef.current, glowLeftRef.current], { opacity: 0 });
      gsap.set('.hero-3d-canvas-container', { opacity: 0, scale: 0.9 });
      gsap.set(portraitWrapperRef.current, { opacity: 0, y: 40, scale: 1.05, filter: 'blur(10px)' });
      gsap.set('.hero-status-pill', { opacity: 0, y: 15 });
      gsap.set(nameAtiyaRef.current, { opacity: 0, y: 40, filter: 'blur(8px)' });
      gsap.set(nameAliRef.current, { opacity: 0, y: 40, filter: 'blur(8px)' });
      gsap.set(['.hero-tagline', '.hero-editorial-statement', '.hero-description'], { opacity: 0, y: 20 });
      gsap.set('.magnetic-btn', { opacity: 0, y: 18, scale: 0.96 });
      gsap.set('.hero-scroll-indicator', { opacity: 0, y: 12 });

      // Orchestrated Cinematic Timeline (< 1.4s total entrance)
      const entranceTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.15
      });

      entranceTl
        // 1. Atmospheric ambient light glows appear
        .to([glowCrimsonRef.current, glowPinkRef.current, glowLeftRef.current], {
          opacity: 1,
          duration: 1.1,
          ease: 'power2.out'
        })
        // 2. 3D ambient depth canvas scales in softly
        .to(
          '.hero-3d-canvas-container',
          {
            opacity: 1,
            scale: 1,
            duration: 1.3,
            ease: 'expo.out'
          },
          '-=0.8'
        )
        // 3. Portrait reveals smoothly with subtle settling scale (1.05 -> 1.0)
        .to(
          portraitWrapperRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1.0,
            filter: 'blur(0px)',
            duration: 1.3,
            ease: 'power3.out',
            clearProps: 'filter'
          },
          '-=1.0'
        )
        // 4. Status Pill & Editorial Typography reveal
        .to(
          '.hero-status-pill',
          {
            opacity: 1,
            y: 0,
            duration: 0.6
          },
          '-=0.9'
        )
        .to(
          nameAtiyaRef.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.0,
            ease: 'power3.out',
            clearProps: 'filter'
          },
          '-=0.7'
        )
        .to(
          nameAliRef.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.0,
            ease: 'power3.out',
            clearProps: 'filter'
          },
          '-=0.8'
        )
        // 5. Subtitle & Description slide up
        .to(
          ['.hero-tagline', '.hero-editorial-statement', '.hero-description'],
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.75
          },
          '-=0.7'
        )
        // 6. Action buttons fade in
        .to(
          '.magnetic-btn',
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.12,
            duration: 0.7
          },
          '-=0.5'
        )
        // 7. Scroll indicator gently appears
        .to(
          '.hero-scroll-indicator',
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
          },
          '-=0.4'
        );

      // Parallax Scroll Animation into About section
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.to('.hero-content-left', {
          y: -40,
          opacity: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        });

        gsap.to(portraitWrapperRef.current, {
          y: -30,
          scale: 0.98,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero-section"
      aria-label="Atiya Ali Hero Presentation"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      {/* Subtle Noise / Film-Grain Texture Layer */}
      <div className="hero-grain-overlay" aria-hidden="true" />

      {/* Atmospheric Ambient Lighting Glows (Vibrant Sunset Palette: #4D3A4D, #BE5CA9, #D59CC5, #EADADA) */}
      <div ref={glowCrimsonRef} className="hero-glow-crimson" aria-hidden="true" />
      <div ref={glowPinkRef} className="hero-glow-pink" aria-hidden="true" />
      <div ref={glowLeftRef} className="hero-glow-left" aria-hidden="true" />

      {/* Main Responsive Grid Layout */}
      <div className="hero-layout-grid">
        {/* ==========================================================================
            LEFT COLUMN / SECTION: EDITORIAL TYPOGRAPHY & INTERACTIVE CTAs
            ========================================================================== */}
        <div ref={contentLeftRef} className="hero-content-left">
          {/* Status Badge */}
          <div className="hero-status-pill">
            <span className="hero-status-dot" />
            <span>AVAILABLE FOR OPPORTUNITIES</span>
          </div>

          {/* Large Dominant Editorial Typography */}
          <div className="hero-name-container">
            <h1 className="hero-name-line name-atiya" ref={nameAtiyaRef}>
              ATIYA
            </h1>
            <span className="hero-name-line name-ali" ref={nameAliRef}>
              ALI
            </span>
          </div>

          {/* Tagline Subtitle */}
          <div className="hero-tagline">
            <span>BCA STUDENT</span>
            <span className="hero-tagline-bullet">•</span>
            <span>DEVELOPER</span>
          </div>

          {/* Supporting Statement & Description */}
          <p className="hero-editorial-statement">
            "Building digital experiences where technology meets creativity."
          </p>

          <p className="hero-description">
            Crafting immersive web applications with modern engineering, precision aesthetics, and interactive 3D environments.
          </p>

          {/* Magnetic CTA Buttons */}
          <div className="hero-cta-group">
            <MagneticButton
              id="hero-btn-explore"
              variant="primary"
              onClick={() => scrollToSection('projects')}
              ariaLabel="Explore my projects and work"
            >
              <span>EXPLORE MY WORK</span>
              <ArrowUpRight size={17} />
            </MagneticButton>

            <MagneticButton
              id="hero-btn-contact"
              variant="secondary"
              onClick={() => scrollToSection('contact')}
              ariaLabel="Contact Atiya Ali"
            >
              <span>CONTACT ME</span>
              <MessageCircle size={16} />
            </MagneticButton>
          </div>
        </div>

        {/* ==========================================================================
            RIGHT COLUMN / SECTION: TWO-LAYER CURSOR REVEAL PORTRAIT
            ========================================================================== */}
        <div ref={visualRightRef} className="hero-visual-right">
          {/* Atmospheric Pastel Glow Backdrop (#D59CC5 / #BE5CA9) */}
          <div className="hero-portrait-glow-backdrop" aria-hidden="true" />

          {/* 3D WebGL Ambient Lighting & Depth Canvas (Pure volumetric atmosphere) */}
          <Hero3DCanvas />

          {/* Two-Layer Stacked Portrait Container */}
          <div
            ref={portraitWrapperRef}
            className="hero-portrait-wrapper interactive"
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="hero-portrait-inner">
              {/* LAYER 1: BASE AUTHENTIC PORTRAIT (Natural styling, pink dress) */}
              <img
                src={portraitBase}
                alt="Atiya Ali — Developer & BCA Student"
                className="hero-portrait-image hero-portrait-base"
                loading="eager"
                decoding="async"
              />

              {/* LAYER 2: FUTURISTIC PORTRAIT (Chrome visor, silver outfit — revealed via cursor mask) */}
              <div
                ref={futuristicLayerRef}
                className="hero-portrait-futuristic-layer"
                aria-hidden="true"
              >
                <img
                  src={portraitFuturistic}
                  alt=""
                  className="hero-portrait-image hero-portrait-futuristic-img"
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Soft Ambient Light Catch & Bottom Gradient Blend */}
              <div className="hero-portrait-blend-overlay" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          BOTTOM SCROLL INDICATOR
          ========================================================================== */}
      <button
        type="button"
        className="hero-scroll-indicator interactive"
        onClick={() => scrollToSection('about')}
        aria-label="Scroll to About section"
      >
        <span className="hero-scroll-text">SCROLL TO EXPLORE</span>
        <div className="hero-scroll-line-container">
          <div className="hero-scroll-line" />
        </div>
      </button>
    </section>
  );
};

export default HomeSection;

