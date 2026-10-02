import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { gsap, ScrollTrigger, scrollToSection } from '../animations/gsapUtils';
import MagneticButton from '../components/MagneticButton';
import portraitNormal from '../assets/atiya-normal.png';

/**
 * HomeSection: Cinematic Editorial Hero for Atiya Ali Portfolio
 * Strict Requirements:
 * - Exactly 100dvh viewport height (no overflow, no extra scroll)
 * - Vertically centered large portrait (85-90vh) positioned center-right
 * - Rich Light (#EADADA) -> Pink (#D59CC5) -> Magenta (#BE5CA9) -> Dark Plum (#4D3A4D) gradient
 * - Typography 100% visible below navbar with balanced editorial spacing
 */
const HomeSection = () => {
  const sectionRef = useRef(null);
  const portraitRef = useRef(null);
  const glowAtmosphereRef = useRef(null);
  const glowPinkRef = useRef(null);
  const glowPlumRef = useRef(null);
  const nameAtiyaRef = useRef(null);
  const nameAliRef = useRef(null);
  const contentLeftRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (isReducedMotion) {
        gsap.set(
          [
            glowAtmosphereRef.current,
            glowPinkRef.current,
            glowPlumRef.current,
            portraitRef.current,
            nameAtiyaRef.current,
            nameAliRef.current,
            '.hero-status-pill',
            '.hero-tagline',
            '.hero-editorial-statement',
            '.hero-description',
            '.magnetic-btn',
            '.hero-scroll-indicator'
          ],
          { opacity: 1, visibility: 'visible', clearProps: 'transform,filter' }
        );
        return;
      }

      // Initial state: hidden / blurred for cinematic entrance
      gsap.set([glowAtmosphereRef.current, glowPinkRef.current, glowPlumRef.current], { opacity: 0 });
      gsap.set('.hero-bg-waves', { opacity: 0, scale: 0.96 });
      gsap.set(portraitRef.current, { opacity: 0, y: 25, scale: 1.03, filter: 'blur(10px)' });
      gsap.set('.hero-status-pill', { opacity: 0, y: 14 });
      gsap.set(nameAtiyaRef.current, { opacity: 0, y: 35, filter: 'blur(8px)' });
      gsap.set(nameAliRef.current, { opacity: 0, y: 35, filter: 'blur(8px)' });
      gsap.set('.hero-tagline', { opacity: 0, y: 18 });
      gsap.set('.hero-editorial-statement', { opacity: 0, y: 18 });
      gsap.set('.hero-description', { opacity: 0, y: 18 });
      gsap.set('.magnetic-btn', { opacity: 0, y: 16, scale: 0.96 });
      gsap.set('.hero-scroll-indicator', { opacity: 0, y: 12 });

      // Orchestrated Cinematic Entrance Timeline
      const entranceTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.1
      });

      entranceTl
        // 1. Atmospheric glows & wave shapes fade in
        .to([glowAtmosphereRef.current, glowPinkRef.current, glowPlumRef.current], {
          opacity: 1,
          duration: 1.4,
          ease: 'power2.out'
        })
        .to(
          '.hero-bg-waves',
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: 'expo.out'
          },
          '-=1.2'
        )
        // 2. Vertically centered authentic portrait reveals
        .to(
          portraitRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.3,
            ease: 'power3.out',
            clearProps: 'filter'
          },
          '-=1.2'
        )
        // 3. Status Pill & "ATIYA"
        .to(
          '.hero-status-pill',
          {
            opacity: 1,
            y: 0,
            duration: 0.7
          },
          '-=1.0'
        )
        .to(
          nameAtiyaRef.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.1,
            ease: 'power3.out',
            clearProps: 'filter'
          },
          '-=0.75'
        )
        // 4. "ALI"
        .to(
          nameAliRef.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.1,
            ease: 'power3.out',
            clearProps: 'filter'
          },
          '-=0.9'
        )
        // 5. Tagline, Quote & Description
        .to(
          ['.hero-tagline', '.hero-editorial-statement', '.hero-description'],
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.8
          },
          '-=0.75'
        )
        // 6. Buttons
        .to(
          '.magnetic-btn',
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.7
          },
          '-=0.55'
        )
        // 7. Scroll indicator
        .to(
          '.hero-scroll-indicator',
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out'
          },
          '-=0.4'
        );

      // Subtle Parallax on scroll
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.to('.hero-content-left', {
          y: -35,
          opacity: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        });

        gsap.to(portraitRef.current, {
          y: -20,
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
      aria-label="Atiya Ali Portfolio Presentation"
    >
      {/* ==========================================================================
          FULL-SCREEN CONTINUOUS SUNSET ATMOSPHERE
          Light (#EADADA) -> Soft Pink (#D59CC5) -> Magenta (#BE5CA9) -> Deep Plum (#4D3A4D)
          ========================================================================== */}
      <div ref={glowAtmosphereRef} className="hero-glow-atmosphere" aria-hidden="true" />
      <div ref={glowPinkRef} className="hero-glow-pink" aria-hidden="true" />
      <div ref={glowPlumRef} className="hero-glow-plum" aria-hidden="true" />

      {/* Atmospheric Fluid Wave Curves */}
      <div className="hero-bg-waves" aria-hidden="true">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="hero-waves-svg"
        >
          <defs>
            <linearGradient id="waveGradDeep" x1="15%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EADADA" stopOpacity="0" />
              <stop offset="30%" stopColor="#D59CC5" stopOpacity="0.35" />
              <stop offset="65%" stopColor="#BE5CA9" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#4D3A4D" stopOpacity="0.75" />
            </linearGradient>

            <linearGradient id="waveGradMid" x1="30%" y1="20%" x2="95%" y2="90%">
              <stop offset="0%" stopColor="#D59CC5" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#BE5CA9" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#4D3A4D" stopOpacity="0.65" />
            </linearGradient>

            <linearGradient id="waveGradHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="55%" stopColor="#D59CC5" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#BE5CA9" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Deep plum backdrop wave */}
          <path
            d="M600 0 C780 140 910 320 1020 540 C1120 740 1260 840 1440 900 L1440 0 Z"
            fill="url(#waveGradDeep)"
            opacity="0.9"
          />

          {/* Mid-tone magenta/plum wave */}
          <path
            d="M640 0 C760 180 870 360 990 520 C1130 700 1270 820 1440 880 L1440 900 L680 900 C620 760 590 580 630 400 Z"
            fill="url(#waveGradMid)"
            opacity="0.85"
          />

          {/* Delicate luminous arc */}
          <path
            d="M520 900 C620 720 780 540 960 400 C1140 260 1300 120 1440 60 L1440 0 C1280 80 1100 220 920 380 C740 520 580 700 480 900 Z"
            fill="url(#waveGradHighlight)"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="hero-layout-grid">
        {/* ==========================================================================
            LEFT COLUMN: EDITORIAL TYPOGRAPHY & INTERACTIVE CTAs
            ========================================================================== */}
        <div ref={contentLeftRef} className="hero-content-left">
          {/* Status Badge */}
          <div className="hero-status-pill">
            <span className="hero-status-dot" />
            <span>AVAILABLE FOR OPPORTUNITIES</span>
          </div>

          {/* Massive Dominant Editorial Typography */}
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
              <ArrowUpRight size={16} />
            </MagneticButton>

            <MagneticButton
              id="hero-btn-contact"
              variant="secondary"
              onClick={() => scrollToSection('contact')}
              ariaLabel="Contact Atiya Ali"
            >
              <span>CONTACT ME</span>
              <MessageCircle size={15} />
            </MagneticButton>
          </div>

          {/* Bottom Scroll Indicator Aligned With Left Editorial Column */}
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
        </div>

        {/* ==========================================================================
            RIGHT COLUMN: LARGE VERTICALLY CENTERED EDITORIAL PORTRAIT (85-90vh)
            Strictly NO square, NO rectangle, NO card, NO frame, NO border
            ========================================================================== */}
        <div className="hero-visual-right">
          {/* Soft Radial Ambient Glow Behind Portrait */}
          <div className="hero-portrait-ambient-glow" aria-hidden="true" />

          {/* Vertically Centered Authentic Portrait Container */}
          <div ref={portraitRef} className="hero-portrait-wrapper">
            <img
              src={portraitNormal}
              alt="Atiya Ali — BCA Student & Aspiring Developer"
              className="hero-portrait-image"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;

