import React, { useRef, useEffect } from 'react';
import { Compass, Sparkles, Terminal, Code2, Database } from 'lucide-react';
import { gsap, ScrollTrigger } from '../animations/gsapUtils';

/**
 * AboutSection (Phase 3): High-Contrast Editorial Magazine Layout
 * Introduces Atiya Ali — BCA student, frontend developer, and creative technologist.
 */
const AboutSection = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.from('.about-animate-item', {
          y: 35,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section-wrapper" aria-label="About Atiya Ali">
      <div className="section-container" ref={contentRef}>
        {/* Editorial Section Header */}
        <div className="editorial-section-header about-animate-item">
          <h2 className="editorial-main-title">
            ABOUT <span className="heading-gradient-word">ME</span>
          </h2>
          <span className="editorial-subtitle">BCA STUDENT • DEVELOPER • CREATIVE TECHNOLOGIST</span>
        </div>

        {/* Editorial 2-Column Magazine Grid */}
        <div className="about-editorial-grid">
          {/* Left Column: Editorial Statement & Engineering Pillars */}
          <div className="about-statement-card about-animate-item">
            <blockquote className="about-quote-large">
              "Fusing algorithmic rigor with refined digital aesthetics to engineer interfaces that feel intuitive, alive, and mathematically precise."
            </blockquote>

            <div className="about-pillars-grid">
              <div className="about-pillar-item">
                <div className="about-pillar-title">
                  <Terminal size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                  <span>01 // ARCHITECTURAL THINKING</span>
                </div>
                <p className="about-pillar-desc">
                  Building software from robust structural foundations — from normalized database schemas in MySQL to modular React component hierarchies.
                </p>
              </div>

              <div className="about-pillar-item">
                <div className="about-pillar-title">
                  <Code2 size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                  <span>02 // MODERN FRONTEND CRAFT</span>
                </div>
                <p className="about-pillar-desc">
                  Mastering the modern JavaScript ecosystem, React component state workflows, semantic CSS layouts, and micro-animations.
                </p>
              </div>

              <div className="about-pillar-item">
                <div className="about-pillar-title">
                  <Database size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                  <span>03 // COMPUTATIONAL ROOTS</span>
                </div>
                <p className="about-pillar-desc">
                  Academic depth in Bachelor of Computer Applications (BCA) covering data structures, OOP principles in Java & C++, and systems design.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Biography & Academic Specifications */}
          <div className="about-narrative-card about-animate-item">
            <p className="about-narrative-lead">
              I am Atiya Ali, an aspiring software developer and BCA student passionate about transforming complex engineering logic into seamless interactive experiences.
            </p>

            <p className="about-narrative-text">
              My path in technology combines structured analytical thinking with an eye for high-end digital design. I love diving into both ends of the web stack: orchestrating clean relational databases and creating fluid, cinematic interfaces powered by modern web technologies.
            </p>

            <p className="about-narrative-text">
              Whether architecting full-scale student management platforms or exploring real-time 3D graphics on the web, I value clarity, precision, and continuous learning.
            </p>

            {/* Quick Facts / Academic Profile Grid */}
            <div className="about-specs-grid">
              <div className="about-spec-box">
                <span className="about-spec-label">DEGREE PROGRAM</span>
                <span className="about-spec-value">Bachelor of Computer Applications (BCA)</span>
              </div>

              <div className="about-spec-box">
                <span className="about-spec-label">PRIMARY FOCUS</span>
                <span className="about-spec-value">Frontend & Web Application Engineering</span>
              </div>

              <div className="about-spec-box">
                <span className="about-spec-label">CORE STACK</span>
                <span className="about-spec-value">React, JavaScript (ES6+), MySQL, CSS3</span>
              </div>

              <div className="about-spec-box">
                <span className="about-spec-label">STATUS</span>
                <span className="about-spec-value" style={{ color: 'var(--color-secondary)' }}>
                  <Sparkles size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                  Available for Developer Roles
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
