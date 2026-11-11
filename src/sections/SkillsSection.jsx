import React, { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';
import { gsap, ScrollTrigger } from '../animations/gsapUtils';

/**
 * Atiya's Technical Toolkit Dataset
 * Exactly 5 distinct skill categories in a continuous horizontal strip.
 */
const SKILL_CATEGORIES = [
  {
    id: 'frontend',
    number: '01',
    name: 'FRONTEND',
    techs: [
      { id: 'html', name: 'HTML5' },
      { id: 'css', name: 'CSS3 / VANILLA CSS' },
      { id: 'javascript', name: 'JAVASCRIPT' },
      { id: 'react', name: 'REACT' }
    ]
  },
  {
    id: 'programming',
    number: '02',
    name: 'PROGRAMMING',
    techs: [
      { id: 'java', name: 'JAVA' },
      { id: 'python', name: 'PYTHON' },
      { id: 'cpp', name: 'C / C++' },
      { id: 'dsa', name: 'DATA STRUCTURES' }
    ]
  },
  {
    id: 'backend',
    number: '03',
    name: 'BACKEND & DATABASE',
    techs: [
      { id: 'nodejs', name: 'NODE.JS' },
      { id: 'mysql', name: 'MYSQL' },
      { id: 'rest', name: 'REST APIS' },
      { id: 'crud', name: 'CRUD PIPELINES' }
    ]
  },
  {
    id: 'tools',
    number: '04',
    name: 'TOOLS & WORKFLOW',
    techs: [
      { id: 'git', name: 'GIT' },
      { id: 'github', name: 'GITHUB' },
      { id: 'vscode', name: 'VS CODE' },
      { id: 'vite', name: 'VITE' }
    ]
  },
  {
    id: 'creative',
    number: '05',
    name: 'CREATIVE TECH',
    techs: [
      { id: 'ui-design', name: 'UI / VISUAL DESIGN' },
      { id: 'interactive', name: 'INTERACTIVE UI' },
      { id: 'photoshop', name: 'PHOTOSHOP' },
      { id: 'illustrator', name: 'ILLUSTRATOR' }
    ]
  }
];

/**
 * SkillsSection: "ATIYA'S TOOLKIT"
 * Horizontal Moving Liquid-Glass Skill Strip.
 * All 5 categories travel continuously as one connected unit from Left to Right.
 */
const SkillsSection = () => {
  const sectionRef = useRef(null);
  const [isMotionPaused, setIsMotionPaused] = useState(false);

  const toggleMotion = () => {
    setIsMotionPaused((prev) => !prev);
  };

  // Scroll entrance reveal
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            onComplete: () => {
              gsap.set(['.skill-strip-header-reveal', '.skill-strip-viewport'], {
                clearProps: 'opacity,transform'
              });
            }
          }
        });

        tl.from('.skill-strip-header-reveal', {
          y: 28,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out'
        })
        .from('.skill-strip-viewport', {
          opacity: 0,
          y: 30,
          duration: 0.85,
          ease: 'power3.out'
        }, '-=0.4');
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="skills" 
      ref={sectionRef} 
      className="skill-strip-section" 
      aria-label="Atiya's Technical Toolkit Horizontal Moving Glass Strip"
    >
      <div className="section-container skill-strip-container">
        
        {/* ==================================================================
            1. STATIONARY CENTERED SECTION HEADER
            ================================================================== */}
        <div className="skill-strip-intro skill-strip-header-reveal">
          <div className="skill-strip-mini-badge">
            <span className="skill-strip-badge-label">SKILLS</span>
          </div>

          <h2 className="editorial-main-title skill-strip-main-heading">
            ATIYA'S <span className="heading-gradient-word">TOOLKIT</span>
          </h2>

          <p className="skill-strip-editorial-tagline">
            Tools and technologies I use to build digital experiences.
          </p>

          {/* Centered Stop / Resume Motion Control Button */}
          <div className="skill-strip-control-wrap">
            <button
              type="button"
              className={`skill-strip-toggle-btn interactive ${isMotionPaused ? 'is-paused' : ''}`}
              onClick={toggleMotion}
              aria-label={isMotionPaused ? 'Resume horizontal motion' : 'Stop horizontal motion'}
              aria-pressed={isMotionPaused}
            >
              {isMotionPaused ? (
                <>
                  <Play size={12} className="motion-btn-icon" />
                  <span>RESUME MOTION</span>
                </>
              ) : (
                <>
                  <Pause size={12} className="motion-btn-icon" />
                  <span>STOP MOTION</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ==================================================================
            2. FULL-WIDTH DEDICATED HORIZONTAL MOVING STRIP (LEFT → RIGHT)
            ================================================================== */}
        <div 
          className="skill-strip-viewport" 
          role="region" 
          aria-label="Moving technology categories strip"
        >
          {/* Continuous Track (3 sets for seamless loop + initial full desktop visibility) */}
          <div className={`skill-strip-track ${isMotionPaused ? 'is-paused' : ''}`}>
            {[...SKILL_CATEGORIES, ...SKILL_CATEGORIES, ...SKILL_CATEGORIES].map((cat, idx) => (
              <article
                key={`${cat.id}-${idx}`}
                className="skill-glass-panel"
                aria-label={`${cat.name} category: ${cat.techs.length} technologies`}
              >
                {/* Specular Hairline Highlight */}
                <div className="panel-glass-specular" aria-hidden="true" />

                {/* Panel Top Header: Category Number & Title */}
                <div className="panel-top-header">
                  <span className="panel-category-num">{cat.number}</span>
                  <h3 className="panel-category-title">{cat.name}</h3>
                </div>

                {/* Hairline Divider */}
                <div className="panel-divider-hairline" aria-hidden="true" />

                {/* Technology List (Clean Typographic Rows - No nested mini-cards) */}
                <ul className="panel-techs-list">
                  {cat.techs.map((tech) => (
                    <li key={tech.id} className="panel-tech-row">
                      <span className="tech-row-bullet" aria-hidden="true" />
                      <span className="tech-row-name">{tech.name}</span>
                    </li>
                  ))}
                </ul>

                {/* Panel Bottom Footer: Count Tag */}
                <div className="panel-bottom-footer">
                  <span className="panel-count-tag">{`0${cat.techs.length} TECHNOLOGIES`}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SkillsSection;
