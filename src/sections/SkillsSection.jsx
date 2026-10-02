import React, { useRef, useEffect } from 'react';
import { Layers, Layout, Terminal, Database, Wrench, Palette } from 'lucide-react';
import { gsap, ScrollTrigger } from '../animations/gsapUtils';

const SKILL_CATEGORIES = [
  {
    id: 'frontend',
    title: 'FRONTEND ENGINEERING',
    icon: Layout,
    skills: [
      { name: 'HTML5', highlight: true },
      { name: 'CSS3 / Vanilla CSS', highlight: true },
      { name: 'JavaScript (ES6+)', highlight: true },
      { name: 'React.js', highlight: true },
      { name: 'Responsive Web Design', highlight: false },
      { name: 'CSS Grid & Flexbox', highlight: false },
      { name: 'DOM Manipulation', highlight: false },
      { name: 'Component Architecture', highlight: false }
    ]
  },
  {
    id: 'programming',
    title: 'PROGRAMMING & LOGIC',
    icon: Terminal,
    skills: [
      { name: 'Java', highlight: true },
      { name: 'Python', highlight: true },
      { name: 'C / C++', highlight: true },
      { name: 'Object-Oriented Programming (OOP)', highlight: false },
      { name: 'Data Structures & Algorithms', highlight: false },
      { name: 'Computational Problem Solving', highlight: false }
    ]
  },
  {
    id: 'database',
    title: 'DATABASE & BACKEND',
    icon: Database,
    skills: [
      { name: 'MySQL', highlight: true },
      { name: 'Relational Database Design', highlight: true },
      { name: 'SQL Query Optimization', highlight: false },
      { name: 'CRUD Architectures', highlight: false },
      { name: 'RESTful API Integration', highlight: false }
    ]
  },
  {
    id: 'tools',
    title: 'TOOLS & WORKFLOW',
    icon: Wrench,
    skills: [
      { name: 'Git', highlight: true },
      { name: 'GitHub', highlight: true },
      { name: 'VS Code', highlight: true },
      { name: 'Vite', highlight: false },
      { name: 'PowerShell / Terminal', highlight: false },
      { name: 'Chrome Developer Tools', highlight: false }
    ]
  },
  {
    id: 'design',
    title: 'DESIGN & CREATIVE TECH',
    icon: Palette,
    skills: [
      { name: 'UI / UX Design Principles', highlight: true },
      { name: 'Figma', highlight: true },
      { name: 'Adobe Photoshop', highlight: true },
      { name: 'Adobe Illustrator', highlight: true },
      { name: 'Three.js / WebGL Basics', highlight: false },
      { name: 'GSAP Animation', highlight: false }
    ]
  }
];

/**
 * SkillsSection (Phase 3): Interactive Editorial Skill Showcase
 * Displays real technical competencies categorized clearly without generic percentage bars.
 */
const SkillsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.from('.skills-card-animate', {
          y: 35,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
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
    <section id="skills" ref={sectionRef} className="section-wrapper" aria-label="Technical Skills">
      <div className="section-container">
        {/* Editorial Section Header */}
        <div className="editorial-section-header">
          <div className="editorial-header-top">
            <span className="editorial-index-badge">03 // 06</span>
            <span className="editorial-tag-chip">
              <Layers size={13} />
              <span>TECHNICAL CAPABILITIES</span>
            </span>
          </div>
          <h2 className="editorial-main-title">
            MY <span className="heading-gradient-word">SKILLS</span>
          </h2>
          <span className="editorial-subtitle">LANGUAGES, FRAMEWORKS, DATABASES & DESIGN TOOLS</span>
        </div>

        {/* Editorial Category Grid */}
        <div className="skills-editorial-container">
          <div className="skills-category-grid">
            {SKILL_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="skills-category-card skills-card-animate interactive">
                  <div className="skills-category-header">
                    <div className="skills-category-title">
                      <Icon size={18} color="var(--color-secondary)" />
                      <span>{cat.title}</span>
                    </div>
                    <span className="skills-category-count">{cat.skills.length} TECHNOLOGIES</span>
                  </div>

                  <div className="skills-tags-list">
                    {cat.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className={`skill-tag-item ${skill.highlight ? 'highlight' : ''}`}
                      >
                        <span className="skill-tag-dot" />
                        <span>{skill.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
