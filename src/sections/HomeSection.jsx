import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, ScrollTrigger, scrollToSection } from '../animations/gsapUtils';
import portraitImg from '../assets/atiya-anime-portrait.png';

/**
 * EDITORIAL PORTFOLIO HERO SECTION
 * Matches reference composition and visual hierarchy:
 * - Centered, prominent portrait as the main visual focus
 * - Oversized, tall, narrow, condensed fashion-editorial "PORTFOLIO" headline sitting behind/above the portrait
 * - Portrait sits in front of / slightly overlaps the typography
 * - Secondary identity on lower-left: "ATIYA ALI", "SOFTWARE ENGINEER · DEVELOPER", description, and CTA
 * - Strictly NO browser frame, NO card, NO box, NO "My First Design"
 * - Palette strictly: #EADADA, #4D3A4D, #BE5CA9, #D59CC5
 */
const HomeSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const portraitRef = useRef(null);
  const identityRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (isReducedMotion) {
        gsap.set(
          [
            '.hero-bg-gradient',
            titleRef.current,
            portraitRef.current,
            identityRef.current,
            badgeRef.current
          ],
          { opacity: 1, visibility: 'visible', clearProps: 'transform,filter' }
        );
        return;
      }

      // Initial States
      gsap.set('.hero-bg-gradient', { opacity: 0 });
      gsap.set(titleRef.current, { opacity: 0, y: 22 });
      gsap.set(portraitRef.current, { opacity: 0, y: 30 });
      gsap.set(identityRef.current, { opacity: 0, y: 18 });
      gsap.set(badgeRef.current, { opacity: 0, y: 18 });

      // Orchestrated Entrance: title -> portrait -> identity + badge
      const tl = gsap.timeline({
        defaults: { ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      });

      tl
        .to('.hero-bg-gradient', { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0)
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.85 }, 0.15)
        .to(portraitRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.3)
        .to(identityRef.current, { opacity: 1, y: 0, duration: 0.75 }, 0.48)
        .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.75 }, 0.52);

      // Subtle editorial depth parallax on scroll
      if (typeof ScrollTrigger !== 'undefined' && titleRef.current && portraitRef.current) {
        gsap.to(titleRef.current, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5
          }
        });

        gsap.to(portraitRef.current, {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5
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
      className="hero-editorial-section"
      aria-label="Atiya Ali — Portfolio Cover"
    >
      {/* Smooth continuous background gradient within palette */}
      <div className="hero-bg-gradient" aria-hidden="true">
        <div className="hero-bg-subtle-glow" />
      </div>

      <div className="hero-container">
        {/* UPPER TITLE: OVERSIZED TALL CONDENSED EDITORIAL "PORTFOLIO" */}
        <div className="hero-title-container">
          <h1 ref={titleRef} className="hero-editorial-title" aria-label="PORTFOLIO">
            <span className="hero-char char-p">P</span>
            <span className="hero-char char-o">O</span>
            <span className="hero-char char-r">R</span>
            <span className="hero-char char-t">T</span>
            <span className="hero-char char-f">F</span>
            <span className="hero-char char-o2">O</span>
            <span className="hero-char char-l">L</span>
            <span className="hero-char char-i">I</span>
            <span className="hero-char char-o3">O</span>
          </h1>
        </div>

        {/* YEAR BADGE IN UPPER RIGHT (matching reference watermark) */}
        <div className="hero-year-watermark" aria-hidden="true">
          '26
        </div>

        {/* CENTERED PROMINENT PORTRAIT SITTING IN FRONT OF / OVERLAPPING TYPOGRAPHY */}
        <div ref={portraitRef} className="hero-portrait-center">
          <div className="hero-portrait-glow" aria-hidden="true" />
          <img
            src={portraitImg}
            alt="Atiya Ali — Character Portrait"
            className="hero-portrait-img"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* SECONDARY IDENTITY: LOWER-LEFT COLUMN AROUND CENTERED PORTRAIT */}
        <div ref={identityRef} className="hero-identity-left">
          <h2 className="hero-canvas-name">
            ATIYA ALI
          </h2>

          <p className="hero-canvas-role">
            SOFTWARE ENGINEER <span className="hero-role-separator">·</span> DEVELOPER
          </p>

          <p className="hero-canvas-desc">
            Building digital experiences where technology meets creativity.
          </p>

          <button
            type="button"
            className="hero-canvas-cta"
            onClick={() => scrollToSection('projects')}
            aria-label="Explore Projects"
          >
            <span>EXPLORE WORK</span>
            <ArrowUpRight size={15} className="hero-cta-icon" />
          </button>
        </div>

        {/* OPEN TO OPPORTUNITIES BADGE: LOWER-RIGHT AREA */}
        <div ref={badgeRef} className="hero-badge-lower-right">
          <div className="hero-badge-pill">
            <span className="hero-badge-dot" />
            <span>OPEN TO OPPORTUNITIES</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
