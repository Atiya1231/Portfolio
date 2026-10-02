import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { gsap, ScrollTrigger, scrollToSection } from '../animations/gsapUtils';
import Hero3DCanvas from '../components/Hero3DCanvas';
import MagneticButton from '../components/MagneticButton';
import portraitImg from '../assets/atiya-portrait.jpg';

/**
 * HomeSection (Phase 2): Full-screen Cinematic 3D Hero.
 * Features:
 * - Visually dominant editorial typography (ATIYA ALI)
 * - Authentic cinematic portrait with feathered ambient rim lighting & glow
 * - Real-time interactive 3D WebGL metallic sculpture with Three.js / R3F
 * - 8-step orchestrated GSAP cinematic entrance timeline
 * - Smooth mouse magnetic pull & scroll parallax transitions
 */
const HomeSection = () => {
  const sectionRef = useRef(null);
  const portraitRef = useRef(null);
  const glowCrimsonRef = useRef(null);
  const glowPinkRef = useRef(null);
  const glowLeftRef = useRef(null);
  const nameAtiyaRef = useRef(null);
  const nameAliRef = useRef(null);
  const contentLeftRef = useRef(null);

  // 3D Card tilt effect on portrait mouse hover (desktop only)
  const handlePortraitMouseMove = (e) => {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    const card = portraitRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 6; // max 6 deg
    const rotY = (x / (rect.width / 2)) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale(1.01)`;
  };

  const handlePortraitMouseLeave = () => {
    const card = portraitRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
  };

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (isReducedMotion) {
        // Immediate show for reduced motion preference
        gsap.set(
          [
            glowCrimsonRef.current,
            glowPinkRef.current,
            glowLeftRef.current,
            '.hero-3d-canvas-container',
            portraitRef.current,
            nameAtiyaRef.current,
            nameAliRef.current,
            '.hero-status-pill',
            '.hero-tagline',
            '.hero-description',
            '.magnetic-btn',
            '.hero-scroll-indicator'
          ],
          { opacity: 1, visibility: 'visible', clearProps: 'transform,filter' }
        );
        return;
      }

      // Initial state: dark / hidden
      gsap.set([glowCrimsonRef.current, glowPinkRef.current, glowLeftRef.current], { opacity: 0 });
      gsap.set('.hero-3d-canvas-container', { opacity: 0, scale: 0.88 });
      gsap.set(portraitRef.current, { opacity: 0, y: 35, filter: 'blur(12px)' });
      gsap.set('.hero-status-pill', { opacity: 0, y: 20 });
      gsap.set(nameAtiyaRef.current, { opacity: 0, y: 45, filter: 'blur(10px)' });
      gsap.set(nameAliRef.current, { opacity: 0, y: 45, filter: 'blur(10px)' });
      gsap.set(['.hero-tagline', '.hero-description'], { opacity: 0, y: 25 });
      gsap.set('.magnetic-btn', { opacity: 0, y: 20, scale: 0.96 });
      gsap.set('.hero-scroll-indicator', { opacity: 0, y: 15 });

      // Orchestrated 8-Step GSAP Cinematic Entrance Timeline
      const entranceTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.2
      });

      entranceTl
        // Step 2: Atmospheric ambient glows fade in
        .to([glowCrimsonRef.current, glowPinkRef.current, glowLeftRef.current], {
          opacity: 1,
          duration: 1.4,
          ease: 'power2.out'
        })
        // Step 3: 3D sculpture scales & reveals smoothly
        .to(
          '.hero-3d-canvas-container',
          {
            opacity: 1,
            scale: 1,
            duration: 1.8,
            ease: 'expo.out'
          },
          '-=1.0'
        )
        // Step 4: Authentic portrait smoothly reveals with blur-to-sharp transition
        .to(
          portraitRef.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power3.out',
            clearProps: 'filter'
          },
          '-=1.3'
        )
        // Step 5: Status Pill & "ATIYA" editorial reveal
        .to(
          '.hero-status-pill',
          {
            opacity: 1,
            y: 0,
            duration: 0.8
          },
          '-=1.1'
        )
        .to(
          nameAtiyaRef.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.3,
            ease: 'power3.out',
            clearProps: 'filter'
          },
          '-=0.8'
        )
        // Step 6: "ALI" reveals
        .to(
          nameAliRef.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.3,
            ease: 'power3.out',
            clearProps: 'filter'
          },
          '-=1.0'
        )
        // Step 7: Subtitle & Description slide in
        .to(
          ['.hero-tagline', '.hero-description'],
          {
            opacity: 1,
            y: 0,
            stagger: 0.16,
            duration: 0.9
          },
          '-=0.8'
        )
        // Step 8: Action buttons appear with subtle stagger
        .to(
          '.magnetic-btn',
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.15,
            duration: 0.8
          },
          '-=0.6'
        )
        // Step 9: Scroll indicator gently appears
        .to(
          '.hero-scroll-indicator',
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
          },
          '-=0.4'
        );

      // Parallax Scroll Animation into About section
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.to('.hero-content-left', {
          y: -50,
          opacity: 0.65,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        });

        gsap.to(portraitRef.current, {
          y: -35,
          scale: 0.97,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        });

        gsap.to('.hero-3d-canvas-container', {
          y: -20,
          rotation: 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2
          }
        });

        gsap.to([glowCrimsonRef.current, glowPinkRef.current], {
          y: 40,
          opacity: 0.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
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
    >
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

          {/* Description */}
          <p className="hero-description">
            Building ideas into digital experiences. Crafting immersive web applications with 
            modern engineering, precision aesthetics, and interactive 3D environments.
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
            RIGHT COLUMN / SECTION: AUTHENTIC PORTRAIT + 3D SCULPTURE COMPOSITION
            ========================================================================== */}
        <div className="hero-visual-right">
          {/* 3D WebGL Digital Sculpture Canvas (Passes behind & around portrait) */}
          <Hero3DCanvas />

          {/* Layered Cinematic Portrait Card */}
          <div
            ref={portraitRef}
            className="hero-portrait-wrapper interactive"
            onMouseMove={handlePortraitMouseMove}
            onMouseLeave={handlePortraitMouseLeave}
          >
            <div className="hero-portrait-inner">
              <img
                src={portraitImg}
                alt="Atiya Ali — BCA student and aspiring developer"
                className="hero-portrait-image"
                loading="eager"
                decoding="async"
              />
              {/* Soft Rim Light & Ambient Gradient Overlay */}
              <div className="hero-portrait-lighting-overlay" aria-hidden="true" />

              {/* Status Chip */}
              <div className="hero-portrait-chip" aria-hidden="true">
                <span className="hero-portrait-chip-dot" />
                <span>ATIYA ALI // DEV</span>
              </div>
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
