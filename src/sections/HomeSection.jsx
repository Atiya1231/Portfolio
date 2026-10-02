import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { scrollToSection } from '../animations/gsapUtils';

const SPOTLIGHT_R = 260;

/**
 * RevealLayer: Renders a dynamic canvas radial gradient mask
 * that smoothly reveals the second image inside a soft glowing spotlight.
 */
const RevealLayer = ({ image, cursorX, cursorY, radius = SPOTLIGHT_R }) => {
  const canvasRef = useRef(null);
  const revealDivRef = useRef(null);

  useEffect(() => {
    const updateMask = () => {
      const canvas = canvasRef.current;
      const revealDiv = revealDivRef.current;
      if (!canvas || !revealDiv) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, w, h);

      // Only draw when cursor is on screen
      if (cursorX > -500 && cursorY > -500) {
        const grad = ctx.createRadialGradient(
          cursorX,
          cursorY,
          0,
          cursorX,
          cursorY,
          radius
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.4, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)');
        grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
        grad.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, radius, 0, Math.PI * 2);
        ctx.fill();

        try {
          const dataUrl = canvas.toDataURL();
          revealDiv.style.maskImage = `url(${dataUrl})`;
          revealDiv.style.webkitMaskImage = `url(${dataUrl})`;
          revealDiv.style.maskSize = '100% 100%';
          revealDiv.style.webkitMaskSize = '100% 100%';
          revealDiv.style.maskRepeat = 'no-repeat';
          revealDiv.style.webkitMaskRepeat = 'no-repeat';
        } catch {
          // Fallback CSS radial-gradient if canvas export fails
          const maskVal = `radial-gradient(circle ${radius}px at ${cursorX}px ${cursorY}px, black 0%, black 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, transparent 100%)`;
          revealDiv.style.maskImage = maskVal;
          revealDiv.style.webkitMaskImage = maskVal;
        }
      } else {
        revealDiv.style.maskImage = 'none';
        revealDiv.style.webkitMaskImage = 'none';
      }
    };

    updateMask();
  }, [cursorX, cursorY, radius]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />
      <div
        ref={revealDivRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
        }}
      />
    </>
  );
};

/**
 * HomeSection: Full-screen, dark-themed hero section with cursor-following spotlight reveal.
 */
const HomeSection = () => {
  const mouseRef = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Continuous requestAnimationFrame lerp loop
    const animate = () => {
      const mouse = mouseRef.current;
      const smooth = smoothRef.current;

      if (mouse.x === -999 && mouse.y === -999) {
        smooth.x = -999;
        smooth.y = -999;
      } else {
        if (smooth.x === -999) {
          smooth.x = mouse.x;
          smooth.y = mouse.y;
        } else {
          smooth.x += (mouse.x - smooth.x) * 0.1;
          smooth.y += (mouse.y - smooth.y) * 0.1;
        }
      }

      setCursorPos({ x: smooth.x, y: smooth.y });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-white tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Navigation (Fixed, over hero) */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        {/* Left: SVG Logo + Wordmark */}
        <div className="flex items-center gap-2.5 z-10">
          <svg
            className="w-[26px] h-[26px]"
            viewBox="0 0 256 256"
            fill="#ffffff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="text-white font-medium text-base tracking-tight select-none">
            Nasha.co
          </span>
        </div>

        {/* Center Pill Navigation */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1 z-10">
          <button
            type="button"
            onClick={() => scrollToSection('about')}
            className="text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-white/20"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('projects')}
            className="text-white/80 hover:bg-white/20 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="text-white/80 hover:bg-white/20 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Right: Desktop CTA Button */}
        <div className="hidden md:block z-10">
          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
          >
            Let's talk
          </button>
        </div>

        {/* Right: Mobile Hamburger */}
        <button
          type="button"
          onClick={() => scrollToSection('contact')}
          className="md:hidden text-white p-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 z-10"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </nav>

      {/* Main Full-Screen Hero Section */}
      <section
        id="home"
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: '100dvh' }}
      >
        {/* Layer 1: Base Image (z-10) with slow Ken Burns zoom */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom pointer-events-none"
          style={{
            backgroundImage: "url('./images/Base_image.png')",
          }}
        />

        {/* Layer 2: Reveal Layer (z-30) showing Reveal_image through cursor mask */}
        <RevealLayer
          image="./images/Reveal_image.png"
          cursorX={cursorPos.x}
          cursorY={cursorPos.y}
          radius={SPOTLIGHT_R}
        />

        {/* Layer 3: Heading (z-50) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 flex flex-col items-start text-left px-5 pointer-events-none z-50"
          style={{ left: '80px' }}
        >
          <h1 className="text-white leading-[0.95]">
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
            >
              I'm
            </span>
            <span
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
              style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
            >
              NASHA
            </span>
            <span
              className="block font-playfair italic text-white/90 text-base sm:text-lg md:text-xl mt-3 sm:mt-4 hero-anim hero-reveal"
              style={{ letterSpacing: '-0.02em', animationDelay: '0.58s' }}
            >
              UXUI Designer
            </span>
          </h1>
        </div>

        {/* Layer 4: Bottom-Left Paragraph (z-50) */}
        <div
          className="hidden sm:block absolute bottom-14 max-w-[260px] hero-anim hero-fade z-50 pointer-events-none"
          style={{ left: '100px', animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/80 leading-relaxed">
            I design with curiosity and build with code. Obsessed with AI tools, live coding, and finding new ways to make digital experiences feel alive.
          </p>
        </div>

        {/* Layer 5: Bottom-Right Block (z-50) */}
        <div
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade pointer-events-none"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            UX/UI designer who codes. I use AI to design faster, build smarter, and create digital experiences that actually work.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomeSection;



