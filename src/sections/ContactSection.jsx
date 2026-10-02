import React, { useState, useRef, useEffect } from 'react';
import { Send, Mail, MapPin, CheckCircle2, ArrowUpRight, MessageSquare } from 'lucide-react';
import { gsap, ScrollTrigger } from '../animations/gsapUtils';
import MagneticButton from '../components/MagneticButton';
import GithubIcon from '../components/GithubIcon';

/**
 * ContactSection (Phase 3): Dramatic Editorial CTA & Direct Message Interface
 */
const ContactSection = () => {
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.from('.contact-animate-item', {
          y: 40,
          opacity: 0,
          duration: 0.9,
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
  };

  return (
    <section id="contact" ref={sectionRef} className="section-wrapper" aria-label="Contact Atiya Ali">
      <div className="section-container">
        {/* Editorial Section Header */}
        <div className="editorial-section-header">
          <div className="editorial-header-top">
            <span className="editorial-index-badge">06 // 06</span>
            <span className="editorial-tag-chip">
              <MessageSquare size={13} />
              <span>COLLABORATION & CONTACT</span>
            </span>
          </div>
        </div>

        {/* Dramatic 2-Column Editorial Contact Grid */}
        <div className="contact-editorial-grid">
          {/* Left Column: Big Editorial Statement & Channels */}
          <div className="contact-info-left contact-animate-item">
            <div>
              <h2 className="contact-editorial-statement">
                LET'S<br />
                <span className="gradient-text-pink">BUILD</span><br />
                SOMETHING
              </h2>
            </div>

            <p className="contact-supporting-text">
              "Have an idea, project, or opportunity? Let's create something meaningful together."
            </p>

            {/* Contact Channels */}
            <div className="contact-channels-list">
              <a
                href="https://github.com/Atiya1231"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-channel-item interactive"
                aria-label="Visit Atiya Ali GitHub profile"
              >
                <div className="contact-channel-icon">
                  <GithubIcon size={20} />
                </div>
                <div className="contact-channel-details">
                  <span className="contact-channel-label">GITHUB PROFILE</span>
                  <span className="contact-channel-value">github.com/Atiya1231</span>
                </div>
                <ArrowUpRight size={18} style={{ marginLeft: 'auto', color: 'var(--color-secondary)' }} />
              </a>

              <div className="contact-channel-item">
                <div className="contact-channel-icon">
                  <MapPin size={20} />
                </div>
                <div className="contact-channel-details">
                  <span className="contact-channel-label">AVAILABILITY & LOCATION</span>
                  <span className="contact-channel-value">Open for Developer Roles & Remote Projects</span>
                </div>
              </div>

              <div className="contact-channel-item">
                <div className="contact-channel-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-channel-details">
                  <span className="contact-channel-label">PROFESSIONAL FOCUS</span>
                  <span className="contact-channel-value">BCA Student • Frontend Web Developer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Direct Message Form Card */}
          <div className="contact-form-card contact-animate-item">
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <CheckCircle2 size={48} color="var(--color-secondary)" />
                <h3 className="heading-card" style={{ color: 'var(--color-primary)' }}>
                  MESSAGE RECEIVED
                </h3>
                <p className="text-body">
                  Thank you, <strong>{formData.name}</strong>. Your message has been sent successfully. I will get back to you promptly!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="btn-cinematic"
                  style={{ marginTop: '1rem' }}
                >
                  <span>SEND ANOTHER MESSAGE</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="contact-form-group">
                  <label htmlFor="contact-name" className="contact-form-label">
                    YOUR NAME
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={handleChange}
                    className="contact-form-input"
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-email" className="contact-form-label">
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="e.g. alex@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="contact-form-input"
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-message" className="contact-form-label">
                    PROJECT INQUIRY / MESSAGE
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    placeholder="Describe your project, timeline, or opportunity..."
                    value={formData.message}
                    onChange={handleChange}
                    className="contact-form-textarea"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <MagneticButton
                    variant="primary"
                    ariaLabel="Submit Message to Atiya Ali"
                    style={{ flex: 1, minWidth: '180px' }}
                  >
                    <Send size={15} />
                    <span>SEND MESSAGE</span>
                  </MagneticButton>

                  <a
                    href="https://github.com/Atiya1231"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="magnetic-btn magnetic-btn-secondary"
                    style={{ textDecoration: 'none' }}
                  >
                    <GithubIcon size={15} />
                    <span>VIEW GITHUB</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
