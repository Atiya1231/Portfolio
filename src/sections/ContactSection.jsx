import React, { useRef, useEffect } from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
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
    icon: <WhatsappIcon size={22} />
  },
  {
    id: 'instagram',
    label: 'INSTAGRAM',
    tagline: 'Follow my creative journey',
    url: 'https://www.instagram.com/atiya__alii/',
    icon: <InstagramIcon size={22} />
  },
  {
    id: 'linkedin',
    label: 'LINKEDIN',
    tagline: 'Connect professionally',
    url: 'https://www.linkedin.com/in/atiya-ali-591a89325/',
    icon: <LinkedinIcon size={22} />
  },
  {
    id: 'github',
    label: 'GITHUB',
    tagline: 'Explore my projects',
    url: 'https://github.com/Atiya1231',
    icon: <GithubSocialIcon size={22} />
  }
];

/**
 * ContactSection: Premium Editorial Social Showcase
 */
const ContactSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.from('.contact-animate-item', {
          y: 35,
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
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
    <section id="contact" ref={sectionRef} className="section-wrapper" aria-label="Contact Atiya Ali">
      <div className="section-container">
        {/* Editorial Contact Presentation Container */}
        <div className="contact-editorial-container">
          {/* Main Editorial Statement & Supporting Message */}
          <div className="contact-statement-header contact-animate-item">
            <h2 className="contact-editorial-statement">
              LET'S<br />
              <span className="heading-gradient-word">BUILD</span><br />
              SOMETHING
            </h2>

            <p className="contact-supporting-text">
              Have an idea, project, or opportunity? Let's create something meaningful together.
            </p>
          </div>

          {/* Premium Editorial Horizontal Social Rows */}
          <div className="contact-social-rows-list contact-animate-item" role="list">
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
                <div className="contact-row-left">
                  <span className="contact-row-icon">{item.icon}</span>
                  <span className="contact-row-label">{item.label}</span>
                </div>

                <div className="contact-row-center">
                  <span className="contact-row-tagline">{item.tagline}</span>
                </div>

                <div className="contact-row-right">
                  <span className="contact-row-arrow" aria-hidden="true">
                    <ArrowRight size={20} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
