import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { scrollToSection } from '../animations/gsapUtils';

const NAV_ITEMS = [
  { id: 'home', label: 'HOME', index: '01' },
  { id: 'about', label: 'ABOUT', index: '02' },
  { id: 'skills', label: 'SKILLS', index: '03' },
  { id: 'projects', label: 'PROJECTS', index: '04' },
  { id: 'journey', label: 'JOURNEY', index: '05' },
  { id: 'contact', label: 'CONTACT', index: '06' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    let prevScrolled = false;
    const handleScroll = () => {
      const scrolled = window.scrollY > 30;
      if (scrolled !== prevScrolled) {
        prevScrolled = scrolled;
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Native IntersectionObserver for active section tracking (zero forced synchronous layout)
    let observer = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          rootMargin: '-25% 0px -65% 0px',
          threshold: 0
        }
      );

      NAV_ITEMS.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    scrollToSection(id);
    setActiveSection(id);
    setIsMobileOpen(false);
  };

  // Close mobile drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Brand Logo - LEFT: ATIYA */}
          <a
            href="#home"
            className="brand-logo"
            onClick={(e) => handleNavClick(e, 'home')}
            aria-label="Atiya Ali Homepage"
          >
            <span className="brand-dot" />
            <span className="brand-text">ATIYA</span>
          </a>

          {/* Center Navigation - Floating Liquid-Glass Pill */}
          <nav className="nav-pill-desktop" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-pill-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action - Dark-Plum LET'S TALK Button */}
          <div className="navbar-right-actions">
            <a
              href="#contact"
              className="nav-cta-talk"
              onClick={(e) => handleNavClick(e, 'contact')}
              aria-label="Contact Atiya - Let's Talk"
            >
              <span>LET'S TALK</span>
              <ArrowUpRight size={14} className="nav-cta-icon" />
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-expanded={isMobileOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`mobile-drawer-backdrop ${isMobileOpen ? 'open' : ''}`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <aside className={`mobile-drawer ${isMobileOpen ? 'open' : ''}`} aria-hidden={!isMobileOpen}>
        <div className="mobile-drawer-header">
          <div className="mobile-brand">ATIYA</div>
          <button 
            className="mobile-close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mobile-nav-links">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`mobile-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, item.id)}
            >
              <span>{item.label}</span>
              <span className="index">{item.index}</span>
            </a>
          ))}
        </div>

        <div className="mobile-drawer-footer">
          <a
            href="#contact"
            className="mobile-drawer-cta"
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            LET'S TALK
          </a>
          <div className="mobile-subtitle">BCA STUDENT & DEVELOPER</div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
