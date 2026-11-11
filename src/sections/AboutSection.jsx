import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '../animations/gsapUtils';

/**
 * ABOUT ATIYA — TWO-BOX EDITORIAL EXPERIENCE
 * Box 1 = Identity Navigation (01 WHO I AM, 02 ACADEMICS, 03 PASSION, 04 VISION)
 * Box 2 = Current Story / Content
 *
 * Unified color system: Primary Plum (#4D3A4D), Orchid Accent (#BE5CA9),
 * Rose (#D59CC5), Background (#EADADA).
 * No large portraits or third visual boxes.
 */
const ABOUT_DATA = [
  {
    id: 'who-i-am',
    index: '01',
    total: '04',
    title: 'WHO I AM',
    navLabel: 'WHO I AM',
    tag: 'PERSONAL IDENTITY',
    highlight: 'A BCA student driven by curiosity, creativity, and the joy of building interactive digital experiences.',
    narrative: [
      'I am Atiya, a Bachelor of Computer Applications student based in Kolkata. My journey in technology is driven by a deep fascination with how code and creative thinking connect to create intuitive experiences.',
      'I love crafting interfaces that not only solve practical problems but feel natural, responsive, and aesthetically refined for the people who interact with them.'
    ],
    metadata: [
      { label: 'STATUS', value: 'BCA Student & Developer' },
      { label: 'FOCUS', value: 'Technology × Creativity' },
      { label: 'LOCATION', value: 'Kolkata, India' }
    ]
  },
  {
    id: 'academics',
    index: '02',
    total: '04',
    title: 'ACADEMICS',
    navLabel: 'ACADEMICS',
    tag: 'BCA FOUNDATION',
    highlight: 'Rooting creative ideas in strong computational foundations and structured software concepts.',
    narrative: [
      'Through my BCA coursework, I focus on core computer science fundamentals — including Object-Oriented Programming (Java, C/C++), Relational Database Management with MySQL, and Data Structures & Algorithms.',
      'I apply these academic principles directly to web development projects, cultivating disciplined analytical thinking, clean code structure, and solid software architecture.'
    ],
    metadata: [
      { label: 'PROGRAM', value: 'Bachelor of Computer Applications' },
      { label: 'CORE STUDIES', value: 'Data Structures, OOP, DBMS & Web' },
      { label: 'METHOD', value: 'Academic Theory × Real Projects' }
    ]
  },
  {
    id: 'passion',
    index: '03',
    total: '04',
    title: 'PASSION',
    navLabel: 'PASSION',
    tag: 'CREATIVE COMPUTING',
    highlight: 'Constantly experimenting with modern technology to craft visually engaging and responsive interfaces.',
    narrative: [
      'I am passionate about modern web development, creative UI design, and interactive digital experiences. I enjoy experimenting with animation easing curves, subtle glassmorphism, responsive typography, and tactile UI feedback.',
      'For me, development is an open canvas for continuous learning, experimentation, and creating digital products that feel genuinely alive.'
    ],
    metadata: [
      { label: 'INTERESTS', value: 'Web Development & UI/UX' },
      { label: 'EXPLORATION', value: 'Interactive Motion & Glassmorphism' },
      { label: 'TOOLKIT', value: 'React, Modern JavaScript, CSS3 & Vite' }
    ]
  },
  {
    id: 'vision',
    index: '04',
    total: '04',
    title: 'VISION',
    navLabel: 'VISION',
    tag: 'FUTURE TRAJECTORY',
    highlight: 'Aspiring to grow at the vital intersection of technology, creativity, and digital experiences.',
    narrative: [
      'My vision is to continually evolve as a developer and creative builder at the intersection of technology + creativity + digital experiences.',
      'I aim to deepen my full-stack capabilities, build high-impact web software, and craft intuitive digital experiences that make technology accessible, elegant, and enjoyable.'
    ],
    metadata: [
      { label: 'DIRECTION', value: 'Frontend Engineering & Full-Stack Growth' },
      { label: 'INTERSECTION', value: 'Technology + Creativity + Digital Craft' },
      { label: 'MINDSET', value: 'Continuous Learning & Building' }
    ]
  }
];

const AboutSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const isReducedMotionRef = useRef(false);

  const activeData = ABOUT_DATA[activeIndex];

  // Progressive Scroll Reveal Entrance Animation
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isReducedMotionRef.current = isReducedMotion;

    if (isReducedMotion) {
      if (sectionRef.current) {
        const elements = sectionRef.current.querySelectorAll(
          '.about-header-animate, .about-nav-panel-animate, .about-story-panel-animate'
        );
        elements.forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.visibility = 'visible';
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (typeof ScrollTrigger !== 'undefined' && sectionRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            onComplete: () => {
              gsap.set(
                ['.about-header-animate', '.about-nav-panel-animate', '.about-story-panel-animate'],
                { clearProps: 'opacity,transform,visibility' }
              );
            }
          }
        });

        // 1. Editorial Header (About Atiya)
        tl.from('.about-header-animate', {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out'
        })
        // 2. Box 1: Identity Navigation Panel
        .from(
          '.about-nav-panel-animate',
          {
            y: 30,
            opacity: 0,
            duration: 0.75,
            ease: 'power3.out'
          },
          '-=0.45'
        )
        // 3. Box 2: Current Story / Content Panel
        .from(
          '.about-story-panel-animate',
          {
            y: 30,
            opacity: 0,
            duration: 0.75,
            ease: 'power3.out'
          },
          '-=0.55'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handlers for switching tabs
  const handleSelectTab = (index) => {
    setActiveIndex(index);
  };

  const handleNextTab = () => {
    setActiveIndex((prev) => (prev + 1) % ABOUT_DATA.length);
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % ABOUT_DATA.length);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + ABOUT_DATA.length) % ABOUT_DATA.length);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActiveIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setActiveIndex(ABOUT_DATA.length - 1);
      }
    },
    []
  );

  const progressPercent = ((activeIndex + 1) / ABOUT_DATA.length) * 100;

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="section-wrapper about-section-wrapper" 
      aria-label="About Atiya — Personal Story"
    >
      <div className="section-container">
        {/* Section Header: Minimal & Editorial */}
        <div className="about-editorial-header about-header-animate">
          <h2 className="about-header-title">
            ABOUT <span className="heading-gradient-word">ATIYA</span>
          </h2>
          <p className="about-header-tagline">
            A little about the person behind the work.
          </p>
        </div>

        {/* TWO-BOX EDITORIAL EXPERIENCE */}
        <div className="about-two-box-container">
          
          {/* ============================================================
              BOX 1: IDENTITY NAVIGATION (ONE GLASSMORPHISM PANEL)
              01 WHO I AM
              02 ACADEMICS
              03 PASSION
              04 VISION
              ============================================================ */}
          <aside 
            className="about-nav-panel about-nav-panel-animate" 
            aria-label="About Atiya Identity Navigation"
          >
            <div className="about-nav-panel-header">
              <span className="about-nav-panel-label">EXPLORE</span>
              <span className="about-nav-panel-count">
                {activeData.index} / {activeData.total}
              </span>
            </div>

            {/* Semantic Tablist: The 4 Interactive Rows Inside One Panel */}
            <div
              className="about-nav-items-list"
              role="tablist"
              aria-label="About Atiya Sections"
              onKeyDown={handleKeyDown}
            >
              {ABOUT_DATA.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`tab-about-${item.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-about-${item.id}`}
                    tabIndex={isActive ? 0 : -1}
                    className={`about-nav-row ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSelectTab(index)}
                    aria-label={`Select ${item.index} ${item.navLabel}`}
                  >
                    <div className="about-nav-row-left">
                      <span className="about-nav-num">{item.index}</span>
                      <span className="about-nav-title">{item.navLabel}</span>
                    </div>
                    <div className="about-nav-arrow-wrap" aria-hidden="true">
                      <ArrowRight size={14} className="about-nav-arrow" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Nav Panel Bottom Progress Track */}
            <div className="about-nav-panel-footer" aria-hidden="true">
              <div className="about-nav-progress-track">
                <div 
                  className="about-nav-progress-fill" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>
          </aside>

          {/* ============================================================
              BOX 2: CURRENT STORY / CONTENT (ONE GLASSMORPHISM PANEL)
              Transforms between 01/04, 02/04, 03/04, 04/04
              ============================================================ */}
          <article
            id={`panel-about-${activeData.id}`}
            role="tabpanel"
            aria-labelledby={`tab-about-${activeData.id}`}
            className="about-story-panel about-story-panel-animate"
          >
            {/* The SAME panel transforms using key-driven micro-stagger animation */}
            <div key={activeData.id} className="about-story-content-morph">
              
              {/* Top Meta Row */}
              <div className="about-story-top-meta">
                <span className="about-story-index-chip">
                  {activeData.index} / {activeData.total}
                </span>
                <span className="about-story-tag-chip">
                  {activeData.tag}
                </span>
              </div>

              {/* Large Editorial Heading — Single Horizontal Line on Desktop */}
              <h3 className="about-story-heading">
                {activeData.title}
              </h3>

              {/* Lead Highlight Quote */}
              <blockquote className="about-story-highlight">
                "{activeData.highlight}"
              </blockquote>

              {/* Narrative Paragraphs */}
              <div className="about-story-narrative">
                {activeData.narrative.map((para, pIdx) => (
                  <p key={pIdx} className="about-story-paragraph">
                    {para}
                  </p>
                ))}
              </div>

              {/* Editorial Micro Details / Metadata */}
              <div className="about-story-metadata-grid">
                {activeData.metadata.map((meta, mIdx) => (
                  <div key={mIdx} className="about-story-meta-item">
                    <span className="about-story-meta-label">{meta.label}</span>
                    <span className="about-story-meta-value">{meta.value}</span>
                  </div>
                ))}
              </div>

              {/* Story Footer with Next Button and Quick Step Pills */}
              <div className="about-story-footer">
                <button
                  type="button"
                  className="about-story-next-btn"
                  onClick={handleNextTab}
                  aria-label="Advance to next identity story"
                >
                  <span>NEXT STORY</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>

                <div className="about-story-step-pills" role="group" aria-label="Quick jump to story">
                  {ABOUT_DATA.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      className={`about-story-step-dot ${dotIdx === activeIndex ? 'is-active' : ''}`}
                      onClick={() => handleSelectTab(dotIdx)}
                      aria-label={`Jump to story ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </article>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
