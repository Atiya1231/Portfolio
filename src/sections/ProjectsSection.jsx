import React, { useRef, useEffect } from 'react';
import { Briefcase, ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import { gsap, ScrollTrigger } from '../animations/gsapUtils';
import GithubIcon from '../components/GithubIcon';

const PROJECTS = [
  {
    id: 'travel-tourism',
    num: '01',
    title: 'Travel & Tourism',
    subtitle: 'Destination Discovery & Tourism Web Platform',
    category: 'WEB APPLICATION / FRONTEND DEVELOPMENT',
    description:
      'An interactive travel and tourism web platform designed to explore travel destinations, view curated tour packages, and streamline travel discovery through clean, responsive layouts and intuitive navigation.',
    features: [
      'Interactive destination showcase and curated tourism packages',
      'Responsive multi-page navigation with modern UI layouts',
      'Destination details, package itineraries, and inquiry forms',
      'Clean modular frontend architecture with cross-device compatibility'
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Responsive Design'],
    mockupType: 'tourism',
    githubUrl: 'https://github.com/Atiya1231'
  },
  {
    id: 'smart-waste',
    num: '02',
    title: 'Smart Waste Management System',
    subtitle: 'Urban Sustainability & Waste Logistics Platform',
    category: 'IOT & DATA SYSTEMS / WEB APPLICATION',
    description:
      'An intelligent urban resource management platform designed to monitor disposal cycles, classify categorized waste streams (organic, recyclable, hazardous), and optimize collection logistics across urban sectors to reduce municipal carbon footprints.',
    features: [
      'Categorical waste sorting analytics and volume throughput metrics',
      'Collection schedule optimization and route efficiency planning',
      'Interactive municipal dashboard with categorical data breakdown',
      'Real-time status tracking for bin capacity thresholds'
    ],
    tech: ['JavaScript', 'Python', 'MySQL', 'CSS Grid', 'Data Visualizers', 'REST API'],
    mockupType: 'analytics',
    githubUrl: 'https://github.com/Atiya1231'
  },
  {
    id: 'portfolio-website',
    num: '03',
    title: 'Portfolio Website',
    subtitle: 'Cinematic WebGL & Editorial Magazine Experience',
    category: 'CREATIVE DEVELOPMENT / 3D WEB',
    description:
      'An immersive personal developer portfolio fusing high-contrast editorial serif typography with real-time 3D WebGL digital ribbon sculpture, GSAP entrance choreography, and the Vibrant Sunset design system. Crafted for peak visual distinction and responsive performance.',
    features: [
      'Interactive 3D WebGL digital ribbon sculpture with Three.js & R3F',
      '8-step orchestrated GSAP entrance choreography & scroll parallax',
      'Bespoke Vibrant Sunset color system with high-contrast readability',
      'Seamless mobile composition and responsive performance optimization'
    ],
    tech: ['React 19', 'Three.js', 'React Three Fiber', 'GSAP', 'Vite', 'Vanilla CSS'],
    mockupType: 'creative',
    githubUrl: 'https://github.com/Atiya1231/Portfolio'
  }
];

/**
 * ProjectsSection (Phase 3): Large Editorial Project Showcase
 * Presents real projects with rich metadata, feature breakdowns, and tech stacks.
 */
const ProjectsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.from('.project-showcase-animate', {
          y: 45,
          opacity: 0,
          duration: 0.95,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section-wrapper" aria-label="Selected Projects">
      <div className="section-container">
        {/* Editorial Section Header */}
        <div className="editorial-section-header">
          <h2 className="editorial-main-title">
            SELECTED <span className="heading-gradient-word">WORK</span>
          </h2>
          <span className="editorial-subtitle">ACADEMIC, WEB APPLICATION & CREATIVE COMPUTING PROJECTS</span>
        </div>

        {/* Large Editorial Projects List */}
        <div className="projects-showcase-list">
          {PROJECTS.map((proj) => (
            <article key={proj.id} className="project-showcase-card project-showcase-animate interactive">
              {/* Left Column: Project Details & Tech Stack */}
              <div className="project-content-left">
                <div className="project-meta-header">
                  <span className="project-num-badge">{proj.num} // 03</span>
                  <span className="project-category-pill">{proj.category}</span>
                </div>

                <div>
                  <h3 className="project-title">{proj.title}</h3>
                  <div className="project-subtitle">{proj.subtitle}</div>
                </div>

                <p className="project-desc">{proj.description}</p>

                {/* Key Feature Highlights */}
                <div className="project-features-list">
                  {proj.features.map((feat, fIdx) => (
                    <div key={fIdx} className="project-feature-item">
                      <CheckCircle2 size={14} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Chips */}
                <div className="project-tech-stack">
                  {proj.tech.map((t, tIdx) => (
                    <span key={tIdx} className="project-tech-chip">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="project-actions-group">
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="magnetic-btn magnetic-btn-primary"
                    style={{ textDecoration: 'none' }}
                    aria-label={`View ${proj.title} on GitHub`}
                  >
                    <span className="magnetic-btn-content">
                      <GithubIcon size={15} />
                      <span>SOURCE CODE</span>
                      <ArrowUpRight size={15} />
                    </span>
                  </a>
                </div>
              </div>

              {/* Right Column: Visual Mockup Showcase Container */}
              <div className="project-visual-right" aria-hidden="true">
                <div className="project-mockup-frame">
                  <div className="mockup-header-bar">
                    <div className="mockup-dots">
                      <span className="mockup-dot" />
                      <span className="mockup-dot" />
                      <span className="mockup-dot" />
                    </div>
                    <span className="mockup-badge">
                      <Sparkles size={11} style={{ display: 'inline', marginRight: '3px' }} />
                      {proj.category.split('/')[0].trim()}
                    </span>
                  </div>

                  <div className="mockup-body-preview">
                    <div className="mockup-body-title">{proj.title}</div>
                    <div className="mockup-body-sub">{proj.subtitle}</div>
                  </div>

                  <div className="mockup-footer-tags">
                    {proj.tech.slice(0, 3).map((techItem, techIdx) => (
                      <span key={techIdx} className="mockup-footer-tag">
                        {techItem}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
