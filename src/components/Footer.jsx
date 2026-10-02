import React from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToSection } from '../animations/gsapUtils';
import GithubIcon from './GithubIcon';

const CURRENT_YEAR = 2025;

const NAV_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'journey', label: 'JOURNEY' },
  { id: 'contact', label: 'CONTACT' },
];

/**
 * Footer (Phase 3): Minimal Premium Editorial Footer
 */
const Footer = () => {
  return (
    <footer className="site-footer" aria-label="Site Footer">
      <div className="footer-inner" style={{ flexDirection: 'column', gap: '2rem', alignItems: 'stretch' }}>
        {/* Top Footer Tier */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(77, 58, 77, 0.12)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
              ATIYA ALI
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.16em', color: 'var(--color-secondary)', marginTop: '0.2rem' }}>
              BCA STUDENT • DEVELOPER
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }} aria-label="Footer Navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="nav-link-item"
                style={{ background: 'none', cursor: 'pointer', padding: '0.2rem' }}
              >
                {item.label}
              </button>
            ))}
            <a
              href="https://github.com/Atiya1231"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link-item"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              aria-label="Atiya Ali GitHub"
            >
              <GithubIcon size={14} />
              <span>GITHUB</span>
            </a>
          </nav>
        </div>

        {/* Bottom Footer Tier */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="footer-copy">
            © {CURRENT_YEAR} ATIYA ALI — CRAFTED WITH CREATIVE CODE & REACT.
          </div>

          <div className="footer-status">
            <span className="status-dot" />
            <span>PORTFOLIO ONLINE</span>
          </div>

          <button
            onClick={() => scrollToSection('home')}
            className="nav-link-item"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', cursor: 'pointer' }}
            aria-label="Scroll back to top"
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
