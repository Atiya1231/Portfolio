import React from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToSection } from '../animations/gsapUtils';

const CURRENT_YEAR = 2025;

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-copy">
          © {CURRENT_YEAR} ATIYA ALI — ALL RIGHTS RESERVED.
        </div>

        <div className="footer-status">
          <span className="status-dot" />
          <span>PHASE 2 HERO ONLINE</span>
        </div>

        <button
          onClick={() => scrollToSection('home')}
          className="nav-link-item"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none' }}
          aria-label="Scroll back to top"
        >
          <span>BACK TO TOP</span>
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
