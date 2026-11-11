import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { 
  ArrowRight, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  Mail
} from 'lucide-react';
import { gsap, ScrollTrigger } from '../animations/gsapUtils';

// Clean, minimal SVG icons matching the purple/pink aesthetic
const WhatsappIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const InstagramIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubSocialIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    id: 'whatsapp',
    label: 'WHATSAPP',
    tagline: "Let's connect directly",
    url: 'https://wa.me/917439656079',
    icon: <WhatsappIcon size={20} />
  },
  {
    id: 'email',
    label: 'DIRECT INBOX',
    tagline: 'atiyajas2812@gmail.com',
    url: 'mailto:atiyajas2812@gmail.com',
    icon: <Mail size={20} />
  },
  {
    id: 'linkedin',
    label: 'LINKEDIN',
    tagline: 'Connect professionally',
    url: 'https://www.linkedin.com/in/atiya-ali-591a89325/',
    icon: <LinkedinIcon size={20} />
  },
  {
    id: 'github',
    label: 'GITHUB',
    tagline: 'Explore my projects',
    url: 'https://github.com/Atiya1231',
    icon: <GithubSocialIcon size={20} />
  },
  {
    id: 'instagram',
    label: 'INSTAGRAM',
    tagline: 'Follow my creative journey',
    url: 'https://www.instagram.com/atiya__alii/',
    icon: <InstagramIcon size={20} />
  }
];

/**
 * ContactSection: Balanced Two-Column Editorial Contact Showcase
 * Left: "LET'S BUILD SOMETHING" editorial statement + introductory paragraph + direct links
 * Right: Fully Functional Liquid-Glass Contact Us Form integrated with Resend
 */
const ContactSection = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  // Form State Management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  // Field Validation
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full Name is required.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return null;
      case 'email':
        if (!value.trim()) return 'Email Address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address.';
        }
        return null;
      case 'message':
        if (!value.trim()) return 'Message cannot be empty.';
        if (value.trim().length < 5) return 'Message must be at least 5 characters.';
        return null;
      default:
        return null;
    }
  };

  const validateAll = () => {
    const newErrors = {};
    const nameErr = validateField('name', formData.name);
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateField('email', formData.email);
    if (emailErr) newErrors.email = emailErr;

    const msgErr = validateField('message', formData.message);
    if (msgErr) newErrors.message = msgErr;

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time clearance of field errors once corrected
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err || undefined }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    if (err) {
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });

    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim()
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus({
          type: 'success',
          message: data.message || 'Your message has been delivered to my personal inbox! I will get back to you shortly.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        setTouched({});
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to deliver message. Please verify your configuration or reach out directly.'
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Network error: could not connect to contact server. Please verify your connection or try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            onComplete: () => {
              gsap.set(
                ['.contact-header-animate', '.contact-form-glass-card', '.contact-social-row'],
                { clearProps: 'opacity,transform' }
              );
            }
          }
        });

        tl.from('.contact-header-animate', {
          y: 28,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        })
        .from(
          '.contact-form-glass-card',
          {
            y: 32,
            opacity: 0,
            duration: 0.85,
            ease: 'power3.out'
          },
          '-=0.5'
        )
        .from(
          '.contact-social-row',
          {
            y: 18,
            opacity: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: 'power2.out'
          },
          '-=0.4'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Precise vertical alignment: Top edge aligns with "LET'S BUILD SOMETHING" heading,
  // bottom edge aligns with Instagram row, and box height matches the exact vertical distance between them.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getOffsetTop = (el, root) => {
      let top = 0;
      let curr = el;
      while (curr && curr !== root) {
        top += curr.offsetTop;
        curr = curr.offsetParent;
      }
      return top;
    };

    const updateFormAlignment = () => {
      if (window.innerWidth <= 960) {
        container.style.removeProperty('--contact-form-offset');
        container.style.removeProperty('--contact-form-height');
        return;
      }

      const leftCol = container.querySelector('.contact-left-col');
      const heading = container.querySelector('.contact-editorial-statement');
      const instagramRow = container.querySelector('.contact-social-row:last-child');

      if (!leftCol || !heading || !instagramRow) return;

      const headingTop = getOffsetTop(heading, container);
      const leftColTop = getOffsetTop(leftCol, container);
      const instagramBottom = getOffsetTop(instagramRow, container) + instagramRow.offsetHeight;

      const topOffset = Math.max(0, headingTop - leftColTop);
      const targetHeight = Math.max(0, instagramBottom - headingTop);

      if (topOffset > 0 && targetHeight > 0) {
        container.style.setProperty('--contact-form-offset', `${topOffset}px`);
        container.style.setProperty('--contact-form-height', `${targetHeight}px`);
      }
    };

    updateFormAlignment();

    const resizeObserver = new ResizeObserver(() => {
      updateFormAlignment();
    });

    const leftCol = container.querySelector('.contact-left-col');
    if (leftCol) {
      resizeObserver.observe(leftCol);
    }
    window.addEventListener('resize', updateFormAlignment);

    if (document.fonts) {
      document.fonts.ready.then(updateFormAlignment);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateFormAlignment);
    };
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="section-wrapper" aria-label="Contact Atiya Ali">
      <div className="section-container">
        {/* Editorial Two-Column Contact Presentation */}
        <div ref={containerRef} className="contact-editorial-container">
          
          {/* ============================================================
              LEFT SIDE — EDITORIAL STATEMENT, PARAGRAPH & DIRECT CHANNELS
              ============================================================ */}
          <div className="contact-left-col">
            <div className="contact-statement-header">
              
              {/* Section Indicator */}
              <div className="contact-section-indicator contact-header-animate">
                <span className="contact-indicator-num">06</span>
                <span className="contact-indicator-sep">/</span>
                <span className="contact-indicator-label">LET'S CONNECT</span>
              </div>

              {/* Main Statement */}
              <h2 className="contact-editorial-statement contact-header-animate">
                LET'S<br />
                <span className="heading-gradient-word">BUILD</span><br />
                SOMETHING
              </h2>

              {/* Existing Introductory Paragraph */}
              <p className="contact-supporting-text contact-header-animate">
                Have an idea, project, or opportunity? Let's create something meaningful together.
              </p>
            </div>

            {/* Direct Connect & Social Links: [ICON] [TITLE] [DESCRIPTION] [ARROW] */}
            <div className="contact-social-rows-list" role="list">
              <div className="contact-direct-label">OR CONNECT DIRECTLY:</div>
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-row interactive"
                  aria-label={`${item.label} — ${item.tagline}`}
                  role="listitem"
                >
                  <span className="contact-row-icon">{item.icon}</span>
                  <span className="contact-row-label">{item.label}</span>
                  <span className="contact-row-tagline">{item.tagline}</span>
                  <span className="contact-row-arrow" aria-hidden="true">
                    <ArrowRight size={18} />
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ============================================================
              RIGHT SIDE — FULLY FUNCTIONAL LIQUID-GLASS CONTACT FORM
              ============================================================ */}
          <div className="contact-right-col">
            <div className="contact-form-glass-card">
              {/* Specular Hairline Highlight */}
              <div className="contact-form-specular" aria-hidden="true" />
              
              {/* Ambient Liquid Glass Reflection */}
              <div className="contact-form-reflection" aria-hidden="true" />

              {/* Card Header */}
              <div className="contact-form-header">
                <div className="contact-form-badge">
                  <Sparkles size={12} className="badge-sparkle-icon" />
                  <span>DIRECT INQUIRY</span>
                </div>
                <h3 className="contact-form-title">Send a Message</h3>
                <p className="contact-form-subtitle">
                  Fill in your details below and your message will be forwarded directly to my personal inbox.
                </p>
              </div>

              {/* Status Alerts */}
              {status.type === 'success' && (
                <div className="contact-status-banner banner-success" role="alert">
                  <CheckCircle2 size={18} className="status-icon" />
                  <span>{status.message}</span>
                </div>
              )}

              {status.type === 'error' && (
                <div className="contact-status-banner banner-error" role="alert">
                  <AlertCircle size={18} className="status-icon" />
                  <span>{status.message}</span>
                </div>
              )}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="contact-form-element" noValidate>
                <div className="contact-form-fields">
                  
                  {/* Field 1: Full Name (Required) */}
                  <div className="contact-field-group">
                    <label htmlFor="contact-name" className="contact-field-label">
                      <span>Full Name</span>
                      <span className="contact-required-asterisk">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`contact-input ${errors.name && touched.name ? 'input-error' : ''}`}
                      disabled={isSubmitting}
                      autoComplete="name"
                    />
                    {errors.name && touched.name && (
                      <span className="contact-field-error" role="alert">
                        <AlertCircle size={12} />
                        <span>{errors.name}</span>
                      </span>
                    )}
                  </div>

                  {/* Field 2: Email Address (Required) */}
                  <div className="contact-field-group">
                    <label htmlFor="contact-email" className="contact-field-label">
                      <span>Email Address</span>
                      <span className="contact-required-asterisk">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`contact-input ${errors.email && touched.email ? 'input-error' : ''}`}
                      disabled={isSubmitting}
                      autoComplete="email"
                    />
                    {errors.email && touched.email && (
                      <span className="contact-field-error" role="alert">
                        <AlertCircle size={12} />
                        <span>{errors.email}</span>
                      </span>
                    )}
                  </div>

                  {/* Field 3: Subject (Optional) */}
                  <div className="contact-field-group">
                    <label htmlFor="contact-subject" className="contact-field-label">
                      <span>Subject</span>
                      <span className="contact-optional-tag">(Optional)</span>
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      placeholder="e.g. Project Inquiry / Opportunity"
                      value={formData.subject}
                      onChange={handleChange}
                      className="contact-input"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Field 4: Message (Required) */}
                  <div className="contact-field-group contact-field-group-message">
                    <label htmlFor="contact-message" className="contact-field-label">
                      <span>Message</span>
                      <span className="contact-required-asterisk">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={3}
                      placeholder="Tell me about your idea, project scope, or opportunity..."
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`contact-textarea ${errors.message && touched.message ? 'input-error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.message && touched.message && (
                      <span className="contact-field-error" role="alert">
                        <AlertCircle size={12} />
                        <span>{errors.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="contact-submit-wrap">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="magnetic-btn magnetic-btn-primary contact-submit-btn interactive"
                      aria-label="Send Message"
                    >
                      <span className="magnetic-btn-content">
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="contact-spin-loader" />
                            <span>SENDING MESSAGE...</span>
                          </>
                        ) : (
                          <>
                            <Send size={15} />
                            <span>SEND MESSAGE</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                </div>
              </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
