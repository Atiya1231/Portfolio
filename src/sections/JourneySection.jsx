import React, { useRef, useEffect } from 'react';
import { Milestone, GraduationCap, Code, Globe, Database, Sparkles, Rocket } from 'lucide-react';
import { gsap, ScrollTrigger } from '../animations/gsapUtils';

const JOURNEY_MILESTONES = [
  {
    phase: 'PHASE 01',
    period: 'BCA SPECIALIZATION',
    title: 'Bachelor of Computer Applications',
    icon: GraduationCap,
    category: 'ACADEMIC FOUNDATION',
    narrative:
      'Pursuing formal university degree in Computer Applications. Immersed in core computational subjects: Data Structures, Algorithms, Computer Organization, Software Engineering principles, and Relational Database Systems.'
  },
  {
    phase: 'PHASE 02',
    period: 'LOGIC & PROGRAMMING',
    title: 'Core Language Fundamentals: Java, C/C++ & Python',
    icon: Code,
    category: 'COMPUTATIONAL THINKING',
    narrative:
      'Built a solid algorithmic foundation by writing clean, object-oriented code. Solved algorithmic problems, implemented data structure operations, and developed strong analytical problem-solving intuition.'
  },
  {
    phase: 'PHASE 03',
    period: 'FRONTEND MASTERY',
    title: 'Modern Web Engineering & React Ecosystem',
    icon: Globe,
    category: 'WEB DEVELOPMENT',
    narrative:
      'Transitioned to frontend software engineering. Mastered semantic HTML5, modern CSS architectures, ES6+ JavaScript, modular React component trees, responsive layouts, and modern Vite build tooling.'
  },
  {
    phase: 'PHASE 04',
    period: 'FULL STACK SYSTEMS',
    title: 'Database Architecture & Web Application Delivery',
    icon: Database,
    category: 'APPLIED ENGINEERING',
    narrative:
      'Engineered real-world software applications: developed the Travel & Tourism platform and the Smart Waste Management system, managing relational databases, responsive web layouts, and frontend-backend data flows.'
  },
  {
    phase: 'PHASE 05',
    period: 'CREATIVE TECHNOLOGY',
    title: 'Interactive 3D WebGL & Motion Choreography',
    icon: Sparkles,
    category: 'CREATIVE COMPUTING',
    narrative:
      'Expanded into cinematic web experiences using Three.js, React Three Fiber, and GSAP. Focused on building fluid, responsive WebGL sculptures and editorial magazine typography systems.'
  },
  {
    phase: 'PHASE 06',
    period: 'CURRENT & FUTURE',
    title: 'Continuous Growth & Professional Readiness',
    icon: Rocket,
    category: 'INDUSTRY TRAJECTORY',
    narrative:
      'Actively building production-quality web platforms, refining UI/UX craft, adhering to software design best practices, and preparing for high-impact software engineering roles.'
  }
];

/**
 * JourneySection (Phase 3): Editorial Timeline Experience
 * Visualizes Atiya's real academic, programming, and web development trajectory.
 */
const JourneySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.from('.journey-timeline-item-animate', {
          y: 40,
          opacity: 0,
          duration: 0.85,
          stagger: 0.15,
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
    <section id="journey" ref={sectionRef} className="section-wrapper" aria-label="Developer Journey">
      <div className="section-container">
        {/* Editorial Section Header */}
        <div className="editorial-section-header">
          <div className="editorial-header-top">
            <span className="editorial-index-badge">05 // 06</span>
            <span className="editorial-tag-chip">
              <Milestone size={13} />
              <span>TIMELINE & MILESTONES</span>
            </span>
          </div>
          <h2 className="editorial-main-title">
            MY <span className="heading-gradient-word">JOURNEY</span>
          </h2>
          <span className="editorial-subtitle">ACADEMIC GROWTH, TECHNICAL FOUNDATIONS & PROJECT MILESTONES</span>
        </div>

        {/* Editorial Timeline */}
        <div className="journey-timeline-container">
          <div className="journey-timeline-line" aria-hidden="true" />

          {JOURNEY_MILESTONES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="journey-timeline-item journey-timeline-item-animate interactive">
                <div className="journey-node-dot" aria-hidden="true">
                  <Icon size={20} />
                </div>

                <div className="journey-card-content">
                  <div className="journey-card-header">
                    <span className="journey-period-badge">{item.period}</span>
                    <span className="journey-milestone-tag">{item.phase} // {item.category}</span>
                  </div>

                  <h3 className="journey-item-title">{item.title}</h3>
                  <p className="journey-item-desc">{item.narrative}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
