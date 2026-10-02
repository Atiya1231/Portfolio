import React, { useEffect, useRef } from 'react';

/**
 * BackgroundCanvas: Generates subtle, cinematic atmospheric dust particles
 * with burgundy and soft pink tones floating across the dark background.
 */
const BackgroundCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palette for subtle particles
    const particleColors = [
      'rgba(177, 18, 69, 0.45)',  // Crimson
      'rgba(255, 79, 135, 0.35)', // Neon Pink
      'rgba(90, 11, 36, 0.55)',   // Burgundy
      'rgba(255, 157, 186, 0.25)' // Soft Pink
    ];

    const particleCount = Math.min(Math.floor((width * height) / 25000), 55);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.6,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25 - 0.1, // Slight upward drift
      alpha: Math.random() * 0.7 + 0.3,
      alphaChange: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1)
    }));

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Subtle alpha breathing
        p.alpha += p.alphaChange;
        if (p.alpha > 0.85 || p.alpha < 0.15) {
          p.alphaChange = -p.alphaChange;
        }

        // Wrap around bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse proximity interaction (very gentle push)
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 0.6;
          p.y += (dy / dist) * force * 0.6;
        }

        // Draw particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 79, 135, 0.4)';
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-canvas)',
        pointerEvents: 'none',
        opacity: 0.85
      }}
      aria-hidden="true"
    />
  );
};

export default BackgroundCanvas;
