import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Compass, 
  Layers, 
  BarChart3, 
  Link2 
} from 'lucide-react';
import GithubIcon from '../components/GithubIcon';
import { gsap } from '../animations/gsapUtils';

/**
 * Atiya's Real Technical Projects Dataset
 * Exact 4 verified projects in locked order:
 * 01 — YatraNova
 * 02 — Portfolio Website
 * 03 — EcoNexa
 * 04 — LinkForge
 */
const PROJECTS = [
  {
    id: 'travel-tourism',
    num: '01',
    title: 'YatraNova',
    subtitle: 'Destination Discovery & Tourism Web Platform',
    category: 'WEB APPLICATION / FRONTEND',
    description:
      'A smart travel companion that helps users book trips and plan their entire day. It adapts travel plans based on destination crowds, weather conditions, and nearby experiences.',
    features: [
      'Trip booking and full-day itinerary planning.',
      'Alternative destination suggestions when a place is crowded.',
      'Indoor activity recommendations when rain interrupts outdoor plans.',
      'Local business discovery and nearby place recommendations.'
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Responsive Design'],
    githubUrl: 'https://github.com/Atiya1231/Travel-Tourism',
    icon: Compass,
    image: '/images/project-travel.jpg'
  },
  {
    id: 'portfolio-website',
    num: '02',
    title: 'Portfolio Website',
    subtitle: 'Cinematic WebGL & Editorial Magazine Experience',
    category: 'CREATIVE DEVELOPMENT / 3D WEB',
    description:
      'A creative and interactive personal portfolio showcasing my skills, projects, achievements, and development journey. Designed to present my work through an engaging and modern digital experience.',
    features: [
      'Interactive project showcase.',
      'Skills and experience presentation.',
      'Personal journey and achievements.',
      'Contact and professional connection.'
    ],
    tech: ['React 19', 'Three.js', 'React Three Fiber', 'GSAP', 'Vite', 'Vanilla CSS'],
    githubUrl: 'https://github.com/Atiya1231/Portfolio',
    icon: Layers,
    image: '/images/project-portfolio.jpg'
  },
  {
    id: 'smart-waste',
    num: '03',
    title: 'EcoNexa',
    subtitle: 'Urban Sustainability & Waste Logistics Platform',
    category: 'IOT & DATA SYSTEMS / WEB APPLICATION',
    description:
      'A technology-driven solution designed to improve waste monitoring, collection, and management. It focuses on efficient waste handling and encourages cleaner, more sustainable surroundings.',
    features: [
      'Smart waste monitoring.',
      'Efficient waste collection management.',
      'Better resource utilization.',
      'Sustainable waste management approach.'
    ],
    tech: ['JavaScript', 'Python', 'MySQL', 'CSS Grid', 'Data Visualizers', 'REST API'],
    githubUrl: 'https://github.com/Atiya1231',
    icon: BarChart3,
    image: '/images/project-smart-waste.jpg'
  },
  {
    id: 'linkforge',
    num: '04',
    title: 'LinkForge',
    subtitle: 'Smart URL Shortener & Link Management Platform',
    category: 'FULL-STACK APPLICATION / CLOUD',
    description:
      'A smart URL-shortening platform designed to make link sharing simple, fast, and organized. It transforms long URLs into clean, shareable links and provides customization options for a more personalized link experience.',
    features: [
      'Shorten long URLs into compact, shareable links.',
      'Customize short links using available options.',
      'Easy and organized link management.'
    ],
    tech: ['Next.js', 'React 19', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    githubUrl: 'https://github.com/Atiya1231/linkforge',
    icon: Link2,
    image: '/images/project-linkforge.jpg'
  }
];

/**
 * Infinite Ribbon Slide Deck:
 * 3 full sets of the 4 projects for a completely seamless, buttery-smooth continuous sliding experience.
 * - Set 0: indices 0..3 (left buffer clones)
 * - Set 1: indices 4..7 (primary active set, starting at index 4 = 01 YatraNova)
 * - Set 2: indices 8..11 (right buffer clones)
 */
const SLIDES = [
  ...PROJECTS.map((p, i) => ({ ...p, slideKey: `set0-${p.id}`, projectIndex: i })),
  ...PROJECTS.map((p, i) => ({ ...p, slideKey: `set1-${p.id}`, projectIndex: i })),
  ...PROJECTS.map((p, i) => ({ ...p, slideKey: `set2-${p.id}`, projectIndex: i })),
];
const INITIAL_TRACK_INDEX = 4; // Starts at 01 YatraNova in Set 1

/**
 * ProjectsSection: Silky-Smooth Continuous Horizontal Ribbon Carousel
 * 
 * Architectural Highlights:
 * - Physical flex ribbon track where all cards move in 100% unified lockstep
 * - Center project is mathematically 100% centered in viewport
 * - Equal symmetrical side preview peeks on both left and right edges
 * - Instantaneous 0ms resting normalization ensures endless looping without skips or jerks
 * - Zero CSS transform collisions: track moves via GPU transforms, cards smoothly transition opacity/glow
 * - Clickable side previews immediately glide selected card into center
 */
const ProjectsSection = () => {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0); // 0..3 for pagination
  const [renderTrackIndex, setRenderTrackIndex] = useState(INITIAL_TRACK_INDEX); // 0..11
  const trackIndexRef = useRef(INITIAL_TRACK_INDEX);
  const activeProjIndexRef = useRef(0);

  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const touchStartRef = useRef(null);

  /**
   * Calculate exact distance between consecutive cards (panel width + symmetrical gap)
   */
  const getStepDistance = useCallback(() => {
    if (!trackRef.current || !viewportRef.current) return window.innerWidth * 0.65;
    const firstPanel = trackRef.current.firstElementChild;
    if (!firstPanel) return window.innerWidth * 0.65;
    const panelWidth = firstPanel.offsetWidth;
    const comp = window.getComputedStyle(viewportRef.current);
    const gap = parseFloat(comp.getPropertyValue('--panel-gap')) || 32;
    return panelWidth + gap;
  }, []);

  /**
   * Calculate exact GPU translation needed to center card at `index` in viewport
   */
  const getOffsetForIndex = useCallback((index) => {
    if (!viewportRef.current || !trackRef.current) return 0;
    const viewportWidth = viewportRef.current.clientWidth;
    const firstPanel = trackRef.current.firstElementChild;
    if (!firstPanel) return 0;
    const panelWidth = firstPanel.offsetWidth;
    const comp = window.getComputedStyle(viewportRef.current);
    const gap = parseFloat(comp.getPropertyValue('--panel-gap')) || 32;
    const step = panelWidth + gap;
    return (viewportWidth - panelWidth) / 2 - (index * step);
  }, []);

  /**
   * Animate track smoothly to `targetIndex` using high-performance GSAP
   */
  const animateToTrackIndex = useCallback((targetIndex) => {
    if (!trackRef.current || !viewportRef.current) return;

    // Real project index (0..3) for bottom pagination numbers and active highlights
    const realIndex = ((targetIndex % 4) + 4) % 4;
    activeProjIndexRef.current = realIndex;
    setActiveProjectIndex(realIndex);

    trackIndexRef.current = targetIndex;
    setRenderTrackIndex(targetIndex);

    const targetX = getOffsetForIndex(targetIndex);

    gsap.to(trackRef.current, {
      x: targetX,
      duration: 0.55,
      ease: 'power2.out',
      overwrite: 'auto',
      onComplete: () => {
        // Normalize resting position to stay within Set 1 [4, 7]
        let norm = trackIndexRef.current;
        while (norm >= 8) norm -= 4;
        while (norm < 4) norm += 4;

        if (norm !== trackIndexRef.current) {
          trackIndexRef.current = norm;
          setRenderTrackIndex(norm);
          const normX = getOffsetForIndex(norm);
          gsap.set(trackRef.current, { x: normX });
        }
      }
    });
  }, [getOffsetForIndex]);

  /**
   * Navigate forward (Next project glides from right into center)
   */
  const goToNext = useCallback(() => {
    if (trackIndexRef.current >= 10 && trackRef.current) {
      const step = getStepDistance();
      const currentX = gsap.getProperty(trackRef.current, 'x') || 0;
      trackIndexRef.current -= 4;
      gsap.set(trackRef.current, { x: currentX + 4 * step });
    }
    const nextTrackIndex = trackIndexRef.current + 1;
    animateToTrackIndex(nextTrackIndex);
  }, [animateToTrackIndex, getStepDistance]);

  /**
   * Navigate backward (Previous project glides from left into center)
   */
  const goToPrev = useCallback(() => {
    if (trackIndexRef.current <= 1 && trackRef.current) {
      const step = getStepDistance();
      const currentX = gsap.getProperty(trackRef.current, 'x') || 0;
      trackIndexRef.current += 4;
      gsap.set(trackRef.current, { x: currentX - 4 * step });
    }
    const prevTrackIndex = trackIndexRef.current - 1;
    animateToTrackIndex(prevTrackIndex);
  }, [animateToTrackIndex, getStepDistance]);

  /**
   * Direct navigation to target project from bottom pagination bar
   */
  const goToProject = useCallback((targetProjIdx) => {
    if (targetProjIdx === activeProjIndexRef.current) return;
    const currentProj = activeProjIndexRef.current;
    let diff = targetProjIdx - currentProj;
    // Shortest rotational path around 4 projects
    if (diff > 2) diff -= 4;
    if (diff < -2) diff += 4;

    const newTrackIndex = trackIndexRef.current + diff;
    animateToTrackIndex(newTrackIndex);
  }, [animateToTrackIndex]);

  /**
   * Responsive layout positioning & ResizeObserver
   */
  useEffect(() => {
    const updatePosition = () => {
      if (!trackRef.current || !viewportRef.current) return;
      if (!gsap.isTweening(trackRef.current)) {
        const targetX = getOffsetForIndex(trackIndexRef.current);
        gsap.set(trackRef.current, { x: targetX });
      }
    };

    updatePosition();
    const rafId = requestAnimationFrame(updatePosition);

    const observer = new ResizeObserver(() => {
      updatePosition();
    });

    if (viewportRef.current) {
      observer.observe(viewportRef.current);
    }

    window.addEventListener('resize', updatePosition, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', updatePosition);
    };
  }, [getOffsetForIndex]);

  /**
   * Keyboard navigation (ArrowLeft & ArrowRight)
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  /**
   * Mobile touch gestures (Swipe Left / Swipe Right)
   */
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;

    if (diff > 45) {
      goToNext();
    } else if (diff < -45) {
      goToPrev();
    }
    touchStartRef.current = null;
  };

  return (
    <section 
      id="projects" 
      className="project-archive-section" 
      aria-label="Atiya's Selected Work Archive"
    >
      {/* 1. STATIONARY CENTERED SECTION HEADER */}
      <div className="project-archive-container">
        <div className="project-archive-header">
          <div className="project-archive-badge">
            <span className="project-badge-label">PROJECTS</span>
          </div>

          <h2 className="editorial-main-title project-archive-main-title">
            SELECTED <span className="heading-gradient-word">WORK</span>
          </h2>

          <p className="project-archive-subtitle">
            A curated collection of things I've built.
          </p>
        </div>
      </div>

      {/* 2. DEDICATED FULL-WIDTH OVERFLOW-HIDDEN VIEWPORT */}
      <div 
        ref={viewportRef}
        className="project-slider-viewport"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="project-slider-stage">
          <div ref={trackRef} className="project-slider-track">
            {SLIDES.map((proj, idx) => {
              const isCenter = idx === renderTrackIndex;
              const isLeft = idx === renderTrackIndex - 1;
              const isRight = idx === renderTrackIndex + 1;

              return (
                <article
                  key={proj.slideKey}
                  className={`project-slider-panel ${isCenter ? 'pos-center' : isRight ? 'pos-right' : isLeft ? 'pos-left' : ''}`}
                  onClick={() => {
                    if (idx !== renderTrackIndex) {
                      animateToTrackIndex(idx);
                    }
                  }}
                  aria-label={`${proj.title} project panel`}
                  aria-hidden={!isCenter}
                >
                  {/* Liquid-Glass Specular Reflection Highlight */}
                  <div className="slider-panel-specular" aria-hidden="true" />

                  {/* Side Card Click Hint Overlay (Appears on partially visible side panels) */}
                  {!isCenter && (
                    <div className="slider-side-click-overlay" aria-hidden="true">
                      <div className="slider-click-pill">
                        {idx < renderTrackIndex ? '← CLICK TO VIEW' : 'CLICK TO VIEW →'}
                      </div>
                    </div>
                  )}

                  <div className="slider-panel-inner-grid">
                    
                    {/* Left Column: Project Content & Information */}
                    <div className="slider-panel-content">
                      
                      {/* Top Meta Header */}
                      <div className="slider-panel-meta">
                        <span className="slider-panel-num-badge">{proj.num} // 04</span>
                        <span className="slider-panel-category-pill">{proj.category}</span>
                      </div>

                      {/* Titles */}
                      <div className="slider-panel-titles-wrap">
                        <h3 className="slider-panel-title">{proj.title}</h3>
                        <div className="slider-panel-subtitle">{proj.subtitle}</div>
                      </div>

                      {/* Description */}
                      <p className="slider-panel-desc">{proj.description}</p>

                      {/* Key Features Heading & Points */}
                      <div className="slider-panel-features-wrap">
                        <div className="slider-features-heading">KEY FEATURES</div>
                        <div className="slider-panel-features">
                          {proj.features.map((feat, fIdx) => (
                            <div key={fIdx} className="slider-feature-item">
                              <CheckCircle2 size={13} className="feature-check-icon" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technology Chips */}
                      <div className="slider-panel-tech-stack">
                        {proj.tech.map((t, tIdx) => (
                          <span key={tIdx} className="slider-tech-chip">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Actions Group (View Source Code on GitHub) */}
                      <div className="slider-panel-actions">
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="magnetic-btn magnetic-btn-primary project-action-btn interactive"
                          onClick={(e) => {
                            if (!isCenter) {
                              e.preventDefault();
                              e.stopPropagation();
                              animateToTrackIndex(idx);
                            }
                          }}
                          tabIndex={isCenter ? 0 : -1}
                          aria-label={`View source code for ${proj.title} on GitHub`}
                        >
                          <span className="magnetic-btn-content">
                            <GithubIcon size={14} />
                            <span>SOURCE CODE</span>
                            <ArrowUpRight size={14} />
                          </span>
                        </a>
                      </div>
                    </div>

                    {/* Right Column: Large Landscape 16:9 Project Image Showcase */}
                    <div className="slider-panel-visual">
                      <div className="slider-image-frame">
                        {/* Top Specular Hairline Highlight */}
                        <div className="slider-image-specular" aria-hidden="true" />
                        
                        <img 
                          src={proj.image} 
                          alt={`${proj.title} Preview`}
                          className="slider-project-img"
                          loading={isCenter ? "eager" : "lazy"}
                          decoding="async"
                        />

                        {/* Subtle Ambient Liquid Glass Reflection & Vignette */}
                        <div className="slider-image-vignette" aria-hidden="true" />

                        {/* Floating Category Tag on Image */}
                        <div className="slider-image-chip" aria-hidden="true">
                          <Sparkles size={11} className="image-chip-icon" />
                          <span>{proj.category.split('/')[0].trim()}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. INTEGRATED BOTTOM NAVIGATION BAR ( ← | 01 02 03 04 | → ) */}
      <div className="project-archive-container">
        <nav className="project-archive-pagination" aria-label="Project Archive Navigation">
          <div className="archive-pagination-track">
            
            {/* Previous Arrow Button */}
            <button
              type="button"
              className="archive-nav-arrow-btn interactive"
              onClick={goToPrev}
              aria-label="Previous Project"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Project Numbers */}
            <div className="archive-page-numbers-group">
              {PROJECTS.map((proj, idx) => {
                const isCurrent = idx === activeProjectIndex;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    className={`archive-page-btn interactive ${isCurrent ? 'is-active' : ''}`}
                    onClick={() => goToProject(idx)}
                    aria-label={`Select Project ${proj.num}: ${proj.title}`}
                    aria-current={isCurrent ? 'true' : 'false'}
                  >
                    <span className="page-btn-num">{proj.num}</span>
                    <span className="page-btn-title">{proj.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Next Arrow Button */}
            <button
              type="button"
              className="archive-nav-arrow-btn interactive"
              onClick={goToNext}
              aria-label="Next Project"
            >
              <ChevronRight size={16} />
            </button>

          </div>
        </nav>
      </div>
    </section>
  );
};

export default ProjectsSection;
