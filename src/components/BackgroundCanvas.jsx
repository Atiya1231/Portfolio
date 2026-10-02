import React, { useEffect, useRef } from 'react';

/**
 * BackgroundCanvas: Generates subtle, elegant atmospheric floating dust/light particles
 * with vibrant sunset tones (#BE5CA9 and #D59CC5) with low opacity on the warm background.
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

    // Subtle Vibrant Sunset floating particles: #BE5CA9 and #D59CC5
    const particleColors = [
      'rgba(190, 92, 169, 0.4)', // Secondary Vibrant Sunset Orchid
      'rgba(213, 156, 197, 0.45)', // Tertiary Soft Sunset Rose
      'rgba(77, 58, 77, 0.25)',  // Primary Plum low-opacity dust
      'rgba(213, 156, 197, 0.3)'
    ];

    const particleCount = Math.min(Math.floor((width * height) / 28000), 45);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.6,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2 - 0.08, // Very gentle upward drift
      alpha: Math.random() * 0.5 + 0.2,
      alphaChange: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1)
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
        if (p.alpha > 0.65 || p.alpha < 0.12) {
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
        if (dist < 110) {
          const force = (110 - dist) / 110;
          p.x += (dx / dist) * force * 0.5;
          p.y += (dy / dist) * force * 0.5;
        }

        // Draw particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(190, 92, 169, 0.3)';
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
        opacity: 0.75
      }}
      aria-hidden="true"
    />
  );
};

export default BackgroundCanvas;
