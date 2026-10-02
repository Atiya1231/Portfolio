import React from 'react';
import { ArrowDown, Sparkles, Terminal } from 'lucide-react';
import { scrollToSection } from '../animations/gsapUtils';

const HomeSection = () => {
  return (
    <section id="home" className="section-wrapper" aria-label="Home Foundation">
      <div className="section-container">
        <div className="placeholder-card hero-foundation">
          {/* Status Badge */}
          <div className="status-badge">
            <span className="status-dot" />
            <span>PHASE 1 FOUNDATION ONLINE</span>
          </div>

          {/* Large Hero Identity Typography */}
          <div className="hero-title-group">
            <h1 className="heading-hero gradient-text-pink">
              ATIYA ALI
            </h1>
            <div className="hero-subtitle">
              BCA STUDENT & ASPIRING DEVELOPER
            </div>
          </div>

          <p className="hero-intro">
            Welcome to the architectural foundation of my personal portfolio. Designed with a deep cinematic aesthetic, 
            rich burgundy/crimson ambient lighting, and modern interactive engineering.
          </p>

          {/* Phase 2 Coming Next Card */}
          <div
            style={{
              width: '100%',
              padding: '1.5rem',
              borderRadius: '12px',
              background: 'rgba(90, 11, 36, 0.25)',
              border: '1px solid rgba(255, 79, 135, 0.28)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginTop: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="text-label" style={{ color: 'var(--color-neon-pink)' }}>
                NEXT MODULE
              </span>
              <span className="phase-chip">
                <Sparkles size={13} />
                PHASE 2 UPCOMING
              </span>
            </div>
            <h2 className="heading-card gradient-text-crimson">
              HOME — PHASE 2
            </h2>
            <p className="text-body" style={{ fontSize: '0.95rem' }}>
              Phase 2 will unlock the prominent cinematic personal portrait, interactive 3D WebGL element, 
              atmospheric lighting, and dynamic GSAP entrance choreography.
            </p>
          </div>

          {/* Technical Foundation Specs */}
          <div className="blueprint-grid" style={{ width: '100%' }}>
            <div className="blueprint-item">
              <span className="blueprint-label">CORE FRAMEWORK</span>
              <span className="blueprint-value">React 19 + Vite 8</span>
            </div>
            <div className="blueprint-item">
              <span className="blueprint-label">3D ENGINE</span>
              <span className="blueprint-value">Three.js + R3F Ready</span>
            </div>
            <div className="blueprint-item">
              <span className="blueprint-label">ANIMATION</span>
              <span className="blueprint-value">GSAP + ScrollTrigger</span>
            </div>
            <div className="blueprint-item">
              <span className="blueprint-label">DESIGN SYSTEM</span>
              <span className="blueprint-value">Cinematic Dark & Burgundy</span>
            </div>
          </div>

          {/* Action Trigger */}
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => scrollToSection('about')}
              className="btn-cinematic"
              aria-label="Explore Portfolio Architecture"
            >
              <span>EXPLORE ROADMAP</span>
              <ArrowDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
