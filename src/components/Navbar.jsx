import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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
    const handleScroll = () => {
      // Toggle navbar background
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section on scroll
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
          {/* Brand Logo */}
          <a
            href="#home"
            className="brand-logo"
            onClick={(e) => handleNavClick(e, 'home')}
            aria-label="Atiya Ali Homepage"
          >
            <span className="brand-dot" />
            <span>ATIYA ALI</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="nav-links-desktop" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-expanded={isMobileOpen}
            aria-label="Toggle mobile menu"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
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
          <div>ATIYA ALI // PORTFOLIO</div>
          <div>BCA STUDENT & ASPIRING DEVELOPER</div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
