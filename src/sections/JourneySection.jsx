import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen,
  GraduationCap, 
  Code2, 
  Layers, 
  Trophy, 
  Flame,
  Sparkles, 
  Calendar, 
  Target,
  ArrowRight,
  Award 
} from 'lucide-react';
import { gsap, ScrollTrigger, scrollToSection } from '../animations/gsapUtils';

/**
 * Atiya Ali — Verified 6 Journey Milestones (Faithfully matching user reference screenshots)
 * CARD 01 — EDUCATION: BCA Honours (Adamas University · 2024 – Present)
 * CARD 02 — CERTIFICATION: Introduction to Internet of Things (NPTEL · IIT Kharagpur · JAN – APR 2026)
 * CARD 03 — HACKATHON: HackMatrix (Competitive Engineering Sprint · 2026)
 * CARD 04 — PROJECTS: Full Stack Developer (YatraNova · LinkForge · EcoNexa · Portfolio Website · 2024 – Present)
 * CARD 05 — MILESTONE: SIH 2026 First-Round Clearance (National Level Hackathon · 2026)
 * CARD 06 — FUTURE GOAL: Placement & Graduation Target (Career Milestone · Target Goal · 2028)
 */
const JOURNEY_MILESTONES = [
  {
    id: 'journey-01',
    category: 'EDUCATION',
    title: 'BCA Honours',
    subtitle: 'Adamas University',
    period: '2024 – Present',
    icon: GraduationCap,
    description:
      'Undergraduate study in BCA Honours, building core fundamentals in data structures, algorithms, and computing architecture.'
  },
  {
    id: 'journey-02',
    category: 'CERTIFICATION',
    title: 'Introduction to Internet of Things',
    subtitle: 'NPTEL · IIT Kharagpur',
    period: 'JAN – APR 2026',
    status: 'Successfully Completed',
    icon: Award,
    description:
      'Successfully completed a 12-week certified course in Internet of Things, gaining foundational knowledge of IoT concepts and connected technologies.',
    metrics: [
      { value: '67%', label: 'Consolidated Score' },
      { value: '12 Weeks', label: 'Course Duration' }
    ]
  },
  {
    id: 'journey-03',
    category: 'HACKATHON',
    title: 'HackMatrix',
    subtitle: 'Competitive Engineering Sprint',
    period: '2026',
    icon: Flame,
    description:
      'Engineered and shipped a working product prototype in a fast-paced hackathon sprint, testing rapid architecture, creative problem-solving, and live debugging.'
  },
  {
    id: 'journey-04',
    category: 'PROJECTS',
    title: 'Full Stack Developer',
    subtitle: 'YatraNova · LinkForge · EcoNexa · Portfolio Website',
    period: '2024 – Present',
    icon: Layers,
    description:
      'Architected three production web applications: ERN (food loss reduction marketplace), SAATHI (service booking platform), and Section D Hall of Fame.'
  },
  {
    id: 'journey-05',
    category: 'MILESTONE',
    title: 'SIH 2026 First-Round Clearance',
    subtitle: 'National Level Hackathon',
    period: '2026',
    icon: Target,
    description:
      'Cleared initial competitive selection rounds for SIH 2026 with an evaluated system architecture and validated technical scope.'
  },
  {
    id: 'journey-06',
    category: 'FUTURE GOAL',
    title: 'Placement & Graduation Target',
    subtitle: 'Career Milestone · Target Goal',
    period: '2028',
    icon: Sparkles,
    isFinal: true,
    description:
      'Targeting graduation with academic distinction and stepping into a high-impact software engineering role at a tier-1 product company.'
  }
];

/**
 * Three Verified Academic & Project Snapshot Cards (Matching Reference)
 */
const SNAPSHOT_CARDS = [
  {
    id: 'snap-cgpa',
    icon: BookOpen,
    title: 'CGPA Score',
    subtitle: 'Till 4th Semester',
    metric: '7.62'
  },
  {
    id: 'snap-projects',
    icon: Layers,
    title: 'Major Projects',
    subtitle: 'Travel · Portfolio · Smart Waste',
    metric: '3'
  },
  {
    id: 'snap-activities',
    icon: Trophy,
    title: 'Hackathons & Sprints',
    subtitle: 'SIH & HACKMATRIX',
    metric: '2'
  }
];

/**
 * Three Verified Currently Focused On Cards (Restored in DOM)
 */
const FOCUS_CARDS = [
  {
    id: 'focus-dsa',
    icon: Code2,
    title: 'Data Structures & Algorithms',
    subtitle: 'Logic, Arrays, Trees & Optimization',
    tag: 'DAILY PRACTICE'
  },
  {
    id: 'focus-fullstack',
    icon: Layers,
    title: 'Full-Stack Development',
    subtitle: 'Modern React, APIs & WebGL UI',
    tag: 'ACTIVE BUILDS'
  },
  {
    id: 'focus-system',
    icon: Target,
    title: 'System Design & Placement Preparation',
    subtitle: 'Core CS, DBMS, OOP & Interviews',
    tag: 'PREPARATION'
  }
];

/**
 * JourneySection: Faithful Recreation of Reference Design
 * - Left Column: Section indicator, unified bold uppercase heading, concise description,
 *   Academic & Project Snapshot (3 cards), and Currently Focused On (3 cards)
 * - Center: Continuous vertical gradient timeline line with glowing circular milestone nodes
 * - Right Column: Exactly 6 Large Liquid-Glass Milestone Cards faithfully matching reference
 * - Bottom: Final milestone statement and CTA button to Contact
 */
const JourneySection = () => {
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [bridgePath, setBridgePath] = useState('');
  const sectionRef = useRef(null);
  const layoutRef = useRef(null);
  const timelineTrackRef = useRef(null);
  const verticalLineRef = useRef(null);
  const progressBarRef = useRef(null);
  const centeredNodeRef = useRef(null);
  const milestoneRefs = useRef([]);

  const timelineMilestones = JOURNEY_MILESTONES.slice(0, 5);
  const finalMilestone = JOURNEY_MILESTONES[5];

  // Direct, gap-free physical connector between existing timeline and Future Goal node
  useEffect(() => {
    const updateBridge = () => {
      if (!layoutRef.current || !verticalLineRef.current || !centeredNodeRef.current) return;
      const layoutRect = layoutRef.current.getBoundingClientRect();
      const lineRect = verticalLineRef.current.getBoundingClientRect();
      const nodeRect = centeredNodeRef.current.getBoundingClientRect();

      const startX = lineRect.left - layoutRect.left + lineRect.width / 2;
      const startY = lineRect.bottom - layoutRect.top;
      const endX = nodeRect.left - layoutRect.left + nodeRect.width / 2;
      const endY = nodeRect.top - layoutRect.top;

      let path = '';
      if (Math.abs(startX - endX) < 4) {
        path = `M ${endX} ${startY} L ${endX} ${endY}`;
      } else {
        const midY = (startY + endY) / 2;
        path = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
      }
      setBridgePath(path);
    };

    updateBridge();
    const t1 = setTimeout(updateBridge, 60);
    const t2 = setTimeout(updateBridge, 300);

    // ResizeObserver tracks actual layout changes without needing expensive scroll listeners
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && layoutRef.current) {
      resizeObserver = new ResizeObserver(updateBridge);
      resizeObserver.observe(layoutRef.current);
    }
    window.addEventListener('resize', updateBridge, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateBridge);
    };
  }, []);

  // GSAP ScrollTrigger for Timeline Line Scrub, Card Reveals, and Node Activations
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      if (progressBarRef.current) progressBarRef.current.style.height = '100%';
      return;
    }

    const ctx = gsap.context(() => {
      if (typeof ScrollTrigger !== 'undefined' && timelineTrackRef.current) {
        // 1. Continuous Butter-Smooth Vertical Timeline Line Progress Scrub
        ScrollTrigger.create({
          trigger: timelineTrackRef.current,
          start: 'top 68%',
          end: 'bottom 45%',
          scrub: 0.35,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.height = `${(self.progress * 100).toFixed(1)}%`;
            }
          }
        });

        // 2. Timeline Card Reveals & Milestone Node Activations
        milestoneRefs.current.forEach((el, idx) => {
          if (!el) return;

          // Card entrance reveal with safety clearProps
          gsap.fromTo(
            el,
            { opacity: 0, y: 26 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
              },
              onComplete: () => {
                gsap.set(el, { clearProps: 'opacity,transform' });
              }
            }
          );

          // Milestone Node Activation Trigger (zero layout calculation on scroll)
          ScrollTrigger.create({
            trigger: el,
            start: 'top 65%',
            end: 'bottom 65%',
            onEnter: () => setActiveMilestone(idx),
            onEnterBack: () => setActiveMilestone(idx)
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="journey" 
      ref={sectionRef} 
      className="journey-editorial-section" 
      aria-label="Atiya's Academic & Developer Journey"
    >
      <div className="journey-editorial-container">
        <div className="journey-editorial-layout" ref={layoutRef}>
          
          {/* Physical Gap-Free Straight Connector between Timeline Line & Node */}
          {bridgePath && (
            <svg 
              className="journey-bridge-overlay" 
              width="100%" 
              height="100%"
              aria-hidden="true"
            >
              <path 
                d={bridgePath}
                fill="none" 
                stroke="#BE5CA9" 
                strokeWidth="2.2" 
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 0 6px rgba(190, 92, 169, 0.55))' }}
              />
            </svg>
          )}
          
          {/* ============================================================
              LEFT COLUMN — INTRODUCTION, SNAPSHOT & CURRENTLY FOCUSED ON
              ============================================================ */}
          <aside className="journey-left-col" aria-label="Journey Overview & Academic Snapshot">
            <div className="journey-left-col-inner">
              
              {/* Section Indicator (Directly aligned with timeline start) */}
              <div className="journey-section-indicator">
                <span className="journey-indicator-num">05</span>
                <span className="journey-indicator-sep">/</span>
                <span className="journey-indicator-label">MY JOURNEY</span>
              </div>

              {/* Editorial Heading: Consistent Bold Uppercase Typography */}
              <h2 className="journey-editorial-heading">
                <span className="journey-heading-line">ACADEMIC &amp;</span>
                <span className="journey-heading-line">DEVELOPING JOURNEY</span>
              </h2>

              {/* Short Descriptive Paragraph */}
              <p className="journey-editorial-desc">
                A chronological timeline of milestones, competitive hackathons, technical training, and software development — charting from foundational computer applications to applied web systems and future goals.
              </p>

              {/* PANEL 1: ACADEMIC & PROJECT SNAPSHOT */}
              <div className="journey-panel-block">
                <div className="journey-snapshot-label">
                  ACADEMIC &amp; PROJECT SNAPSHOT
                </div>

                <div className="journey-snapshot-stack">
                  {SNAPSHOT_CARDS.map((snap) => {
                    const IconComp = snap.icon;
                    return (
                      <div key={snap.id} className="journey-snapshot-card">
                        <div className="snapshot-card-glass-specular" aria-hidden="true" />
                        <div className="snapshot-card-left">
                          <div className="snapshot-icon-squircle" aria-hidden="true">
                            <IconComp size={18} className="snapshot-icon" />
                          </div>
                          <div className="snapshot-text-block">
                            <div className="snapshot-title">{snap.title}</div>
                            <div className="snapshot-subtitle">{snap.subtitle}</div>
                          </div>
                        </div>
                        <div className="snapshot-metric-wrap">
                          <span className="snapshot-metric-val">
                            {snap.metric.includes('.') ? (
                              <>
                                <span>{snap.metric.split('.')[0]}</span>
                                <span className="metric-decimal-dot">.</span>
                                <span>{snap.metric.split('.')[1]}</span>
                              </>
                            ) : (
                              snap.metric
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PANEL 2: CURRENTLY FOCUSED ON (3 Cards Restored in DOM) */}
              <div className="journey-panel-block journey-focus-block">
                <div className="journey-snapshot-label">
                  CURRENTLY FOCUSED ON
                </div>

                <div className="journey-snapshot-stack">
                  {FOCUS_CARDS.map((focus) => {
                    const IconComp = focus.icon;
                    return (
                      <div key={focus.id} className="journey-snapshot-card journey-focus-card">
                        <div className="snapshot-card-glass-specular" aria-hidden="true" />
                        <div className="snapshot-card-left">
                          <div className="snapshot-icon-squircle squircle-focus" aria-hidden="true">
                            <IconComp size={18} className="snapshot-icon" />
                          </div>
                          <div className="snapshot-text-block">
                            <div className="snapshot-title">{focus.title}</div>
                            <div className="snapshot-subtitle">{focus.subtitle}</div>
                          </div>
                        </div>
                        <div className="snapshot-tag-wrap">
                          <span className="snapshot-tag-pill">{focus.tag}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </aside>

          {/* ============================================================
              RIGHT COLUMN — EXACTLY 6 LARGE GLASS MILESTONE CARDS
              ============================================================ */}
          <div className="journey-timeline-col" aria-label="Journey Milestones Timeline">
            <div className="journey-timeline-track" ref={timelineTrackRef}>
              
              {/* Continuous Center-Left Vertical Timeline Line */}
              <div 
                ref={verticalLineRef}
                className="journey-vertical-line" 
                aria-hidden="true"
              >
                <div 
                  ref={progressBarRef}
                  className="journey-vertical-progress" 
                />
              </div>

              {/* Exact 5 Milestone Rows in Right Sequence */}
              {timelineMilestones.map((item, idx) => {
                const IconComponent = item.icon;
                const isActive = activeMilestone === idx;
                const isPassed = activeMilestone > idx;

                return (
                  <div 
                    key={item.id}
                    id={item.id}
                    data-milestone-index={idx}
                    ref={(el) => (milestoneRefs.current[idx] = el)}
                    className={`journey-timeline-row ${isActive ? 'is-active' : ''} ${isPassed ? 'is-passed' : ''}`}
                    onMouseEnter={() => setActiveMilestone(idx)}
                  >
                    {/* Connected Circular Milestone Node */}
                    <div 
                      className={`journey-milestone-node ${isActive ? 'node-active' : ''} ${isPassed ? 'node-passed' : ''}`} 
                      aria-hidden="true"
                    >
                      <IconComponent size={20} className="milestone-node-icon" />
                    </div>

                    {/* Wide Liquid-Glass Milestone Card */}
                    <article className={`journey-milestone-card ${item.metrics ? 'milestone-card-cert' : ''}`}>
                      {/* Top Specular Hairline Highlight */}
                      <div className="milestone-card-specular" aria-hidden="true" />
                      
                      {/* Subtle Ambient Liquid Glass Reflection */}
                      <div className="milestone-card-reflection" aria-hidden="true" />

                      {/* Header Row: Category Pill, Status Badge & Date/Year */}
                      <div className="milestone-card-header">
                        <div className="milestone-header-left" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span className={`milestone-category-pill ${item.metrics ? 'pill-cert' : ''}`}>
                            {item.metrics && (
                              <Award size={13} className="cert-pill-icon" aria-hidden="true" />
                            )}
                            <span>{item.category}</span>
                          </span>

                          {item.status && (
                            <span className="cert-status-pill">
                              <span className="cert-status-dot" aria-hidden="true" />
                              <span>{item.status}</span>
                            </span>
                          )}
                        </div>

                        {item.period && (
                          <div className="milestone-date-chip">
                            <Calendar size={13} className="milestone-calendar-icon" aria-hidden="true" />
                            <span>{item.period}</span>
                          </div>
                        )}
                      </div>

                      {/* Milestone Title & Subtitle */}
                      <h3 className="milestone-card-title">{item.title}</h3>
                      {item.subtitle && (
                        <div className={`milestone-card-subtitle ${item.metrics ? 'cert-institution' : ''}`}>
                          {item.subtitle}
                        </div>
                      )}

                      {/* Narrative Description */}
                      <p className="milestone-card-desc">{item.description}</p>

                      {/* Two Neat Minimal Information Blocks for Achievement */}
                      {item.metrics && (
                        <div className="cert-blocks-grid">
                          {item.metrics.map((m, mIdx) => (
                            <div key={mIdx} className="cert-info-block">
                              <div className="cert-info-val">{m.value}</div>
                              <div className="cert-info-lbl">{m.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  </div>
                );
              })}

            </div>
          </div>

          {/* ============================================================
              FULL-WIDTH CENTERED ROW — FINAL FUTURE GOAL CARD
              Spans both columns, connected seamlessly to timeline, compact size
              ============================================================ */}
          {finalMilestone && (
            <div className="journey-final-centered-row">
              <div 
                id={finalMilestone.id}
                data-milestone-index={5}
                ref={(el) => (milestoneRefs.current[5] = el)}
                className="journey-final-centered-card-wrap"
              >
                {/* Timeline Connection Node sitting exactly ON the card's top border */}
                <div 
                  ref={centeredNodeRef}
                  className="journey-final-connection-node" 
                  aria-hidden="true"
                >
                  <Sparkles size={16} className="final-node-icon" />
                </div>

                <article className="journey-milestone-card card-final-milestone journey-centered-milestone-card">
                  {/* Top Specular Hairline Highlight */}
                  <div className="milestone-card-specular" aria-hidden="true" />
                  
                  {/* Subtle Ambient Liquid Glass Reflection */}
                  <div className="milestone-card-reflection" aria-hidden="true" />

                  {/* Header Row: Category Pill & Date/Year */}
                  <div className="milestone-card-header">
                    <div className="milestone-header-left">
                      <span className="milestone-category-pill">{finalMilestone.category}</span>
                    </div>
                    {finalMilestone.period && (
                      <div className="milestone-date-chip">
                        <Calendar size={13} className="milestone-calendar-icon" aria-hidden="true" />
                        <span>{finalMilestone.period}</span>
                      </div>
                    )}
                  </div>

                  {/* Milestone Title & Subtitle */}
                  <h3 className="milestone-card-title">{finalMilestone.title}</h3>
                  {finalMilestone.subtitle && (
                    <div className="milestone-card-subtitle">{finalMilestone.subtitle}</div>
                  )}

                  {/* Narrative Description */}
                  <p className="milestone-card-desc">{finalMilestone.description}</p>

                  {/* Final Milestone (06 - Future Goal) Closing Statement & CTA */}
                  <div className="journey-final-action-wrap">
                    <div className="journey-final-statement">
                      “THE STORY IS STILL BEING WRITTEN.”
                    </div>
                    <a
                      href="#contact"
                      className="magnetic-btn magnetic-btn-primary journey-next-chapter-btn interactive"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('contact');
                      }}
                      aria-label="Navigate to Contact section"
                    >
                      <span className="magnetic-btn-content">
                        <span>NEXT CHAPTER</span>
                        <ArrowRight size={16} />
                      </span>
                    </a>
                  </div>
                </article>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default JourneySection;
