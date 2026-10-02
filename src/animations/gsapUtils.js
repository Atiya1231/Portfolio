import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Smooth scroll helper targeting elements with offset
 * @param {string} targetId - ID of element without '#'
 */
export const scrollToSection = (targetId) => {
  const targetElement = document.getElementById(targetId);
  if (!targetElement) return;

  const navHeight = 80;
  const elementPosition = targetElement.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - navHeight;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

/**
 * Utility for future 3D and ScrollTrigger transitions
 */
export { gsap, ScrollTrigger };
