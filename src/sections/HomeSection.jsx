import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { gsap, ScrollTrigger, scrollToSection } from '../animations/gsapUtils';
import MagneticButton from '../components/MagneticButton';
import portraitNormal from '../assets/atiya-normal.png';
import portraitFuturistic from '../assets/atiya-futuristic.png';

/**
 * HomeSection: Cinematic Editorial Hero for Atiya Ali Portfolio
 * Final Visual Polish:
 * - Exactly 100dvh viewport height (overflow: hidden, zero extra scrolling)
 * - Large portrait (88-95vh) anchored to bottom + 42px lift
 * - Pure continuous atmospheric sunset gradient (#EADADA -> #D59CC5 -> #BE5CA9 -> #4D3A4D)
 * - Interactive Cursor Spotlight Reveal: Soft circular mask reveals futuristic portrait over normal portrait
 */
const HomeSection = () => {
  const sectionRef = useRef(null);
  const portraitRef = useRef(null);
  const revealImageRef = useRef(null);
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
      gsap.set(portraitRef.current, { opacity: 0, y: 20, filter: 'blur(8px)' });
      gsap.set('.hero-status-pill', { opacity: 0, y: 14 });
      gsap.set(nameAtiyaRef.current, { opacity: 0, y: 30, filter: 'blur(8px)' });
      gsap.set(nameAliRef.current, { opacity: 0, y: 30, filter: 'blur(8px)' });
      gsap.set('.hero-tagline', { opacity: 0, y: 16 });
      gsap.set('.hero-editorial-statement', { opacity: 0, y: 16 });
      gsap.set('.hero-description', { opacity: 0, y: 16 });
      gsap.set('.magnetic-btn', { opacity: 0, y: 14, scale: 0.96 });
      gsap.set('.hero-scroll-indicator', { opacity: 0, y: 10 });

      // Orchestrated Cinematic Entrance Timeline
      const entranceTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.1
      });

      entranceTl
        // 1. Atmospheric glows fade in smoothly
        .to([glowAtmosphereRef.current, glowPinkRef.current, glowPlumRef.current], {
          opacity: 1,
          duration: 1.4,
          ease: 'power2.out'
        })
        // 2. Large authentic portrait reveals cleanly at bottom
        .to(
          portraitRef.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.3,
            ease: 'power3.out',
            clearProps: 'filter'
          },
          '-=1.1'
        )
        // 3. Status Pill & "ATIYA"
        .to(
          '.hero-status-pill',
          {
            opacity: 1,
            y: 0,
            duration: 0.7
          },
          '-=0.9'
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
          '-=0.7'
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
          '-=0.85'
        )
        // 5. Tagline, Quote & Description
        .to(
          ['.hero-tagline', '.hero-editorial-statement', '.hero-description'],
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.75
          },
          '-=0.7'
        )
        // 6. Action buttons
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
          y: -30,
          opacity: 0.65,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        });

        gsap.to(portraitRef.current, {
          y: -15,
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

  // Cinematic Cursor-Following Spotlight Reveal for Futuristic Portrait Layer
  useEffect(() => {
    const section = sectionRef.current;
    const revealEl = revealImageRef.current;
    if (!section || !revealEl) return;

    // Respect reduced-motion and touch device constraints
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || isReducedMotion) {
      revealEl.style.display = 'none';
      return;
    }

    const mouse = { x: -1000, y: -1000 };
    const current = { x: -1000, y: -1000 };
    let currentOpacity = 0;
    let isHovered = false;
    let animationFrameId = null;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const onPointerMove = (e) => {
      isHovered = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onPointerLeave = () => {
      isHovered = false;
    };

    const render = () => {
      const heroRect = section.getBoundingClientRect();
      const isInsideHero =
        isHovered &&
        mouse.x >= heroRect.left &&
        mouse.x <= heroRect.right &&
        mouse.y >= heroRect.top &&
        mouse.y <= heroRect.bottom;

      const targetOpacity = isInsideHero ? 1 : 0;
      currentOpacity = lerp(currentOpacity, targetOpacity, 0.12);

      if (currentOpacity > 0.005) {
        const rect = revealEl.getBoundingClientRect();
        const targetX = mouse.x - rect.left;
        const targetY = mouse.y - rect.top;

        // On first frame, snap smoothly to avoid starting at origin
        if (current.x === -1000) {
          current.x = targetX;
          current.y = targetY;
        } else {
          current.x = lerp(current.x, targetX, 0.14);
          current.y = lerp(current.y, targetY, 0.14);
        }

        const radius = 240;
        const maskGradient = `radial-gradient(circle ${radius}px at ${current.x.toFixed(2)}px ${current.y.toFixed(2)}px, black 0%, black 42%, rgba(0, 0, 0, 0.6) 65%, transparent 100%)`;

        revealEl.style.maskImage = maskGradient;
        revealEl.style.webkitMaskImage = maskGradient;
        revealEl.style.opacity = currentOpacity.toFixed(3);
        revealEl.style.visibility = 'visible';
      } else {
        currentOpacity = 0;
        revealEl.style.opacity = '0';
        revealEl.style.visibility = 'hidden';
        current.x = -1000;
        current.y = -1000;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    section.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('mouseleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('mouseleave', onPointerLeave);
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero-section"
      aria-label="Atiya Ali Portfolio Presentation"
    >
      {/* ==========================================================================
          CONTINUOUS FULL-SCREEN ATMOSPHERIC SUNSET GRADIENTS
          Strictly locked: Light (#EADADA) -> Soft Pink (#D59CC5) -> Magenta (#BE5CA9) -> Deep Plum (#4D3A4D)
          No geometric shapes, no polygons, no boxes
          ========================================================================== */}
      <div ref={glowAtmosphereRef} className="hero-glow-atmosphere" aria-hidden="true" />
      <div ref={glowPinkRef} className="hero-glow-pink" aria-hidden="true" />
      <div ref={glowPlumRef} className="hero-glow-plum" aria-hidden="true" />

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
            RIGHT COLUMN: LARGE BOTTOM-ALIGNED EDITORIAL PORTRAIT (88-95vh)
            Base Normal Portrait + Cursor-Revealed Futuristic Portrait Layer
            ========================================================================== */}
        <div className="hero-visual-right">
          {/* Soft Radial Ambient Glow Behind Portrait */}
          <div className="hero-portrait-ambient-glow" aria-hidden="true" />

          {/* Bottom-Aligned Authentic Portrait Container */}
          <div ref={portraitRef} className="hero-portrait-wrapper">
            {/* Permanent Base Normal Portrait */}
            <img
              src={portraitNormal}
              alt="Atiya Ali — BCA Student & Aspiring Developer"
              className="hero-portrait-image hero-portrait-base"
              loading="eager"
              decoding="async"
            />

            {/* Futuristic Reveal Portrait (Overlaid and revealed via soft circular cursor spotlight) */}
            <img
              ref={revealImageRef}
              src={portraitFuturistic}
              alt=""
              aria-hidden="true"
              className="hero-portrait-image hero-portrait-reveal"
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


