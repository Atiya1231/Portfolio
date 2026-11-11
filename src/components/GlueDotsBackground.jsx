import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * GlueDotsBackground - Pure React 19 + HTML5 Canvas Liquid Metaball Background
 * 
 * Generates organic, viscous liquid dots that float gracefully, stretch like glue,
 * merge into droplets, and form elastic sticky bridges when approaching each other or the cursor.
 * 
 * Palette: Strictly locked to #EADADA (Blush), #4D3A4D (Plum), #BE5CA9 (Magenta), #D59CC5 (Pink-Lavender).
 * 
 * @param {'fixed' | 'absolute'} mode - 'fixed' for whole-page viewport layer, 'absolute' for section-contained layer.
 * @param {number} count - Target number of dots (scaled on mobile).
 * @param {number} minRadius - Minimum dot radius in px (default: 12).
 * @param {number} maxRadius - Maximum dot radius in px (default: 28).
 * @param {number} maxStretch - Maximum distance multiplier before glue bridge snaps (default: 3.1).
 * @param {number} viscosity - Viscous neck thickness ratio [0.2 - 0.8] (default: 0.56).
 * @param {number} handleRate - Bézier tension curvature rate (default: 2.2).
 * @param {number} speed - Base drift speed (default: 0.65).
 * @param {boolean} interactive - Whether the pointer attracts and stretches dots (default: true).
 * @param {number} cursorRadius - Radius of virtual cursor attractor (default: 24).
 * @param {number} opacity - Overall canvas opacity (default: 0.65).
 * @param {string} className - Additional CSS class names.
 * @param {React.CSSProperties} style - Additional inline styles.
 */
// Locked Editorial Palette Tokens
const PALETTE = [
  'rgba(190, 92, 169, 0.68)', // #BE5CA9 Magenta / Sunset Orchid
  'rgba(213, 156, 197, 0.72)', // #D59CC5 Soft Pink-Lavender
  'rgba(77, 58, 77, 0.50)',   // #4D3A4D Deep Plum
  'rgba(234, 218, 218, 0.58)', // #EADADA Warm Sunset Blush
  'rgba(190, 92, 169, 0.52)'
];

const GlueDotsBackground = ({
  mode = 'fixed',
  count = 26,
  minRadius = 12,
  maxRadius = 28,
  maxStretch = 3.1,
  viscosity = 0.56,
  handleRate = 2.2,
  speed = 0.65,
  interactive = true,
  cursorRadius = 24,
  opacity = 0.62,
  className = '',
  style = {}
}) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef({
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    active: false,
    radius: cursorRadius,
    color: 'rgba(190, 92, 169, 0.75)'
  });

  // Reduced motion preference detection
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  /**
   * Vector distance calculation
   */
  const getDist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

  /**
   * Vector offset from origin along an angle
   */
  const getVector = (p, angle, length) => ({
    x: p.x + Math.cos(angle) * length,
    y: p.y + Math.sin(angle) * length
  });

  /**
   * Exact Geometric Bézier Curve calculation for organic liquid metaballs
   */
  const getMetaballBridge = useCallback(
    (p1, r1, p2, r2) => {
      const d = getDist(p1, p2);
      const maxDist = (r1 + r2) * maxStretch;

      if (r1 <= 0 || r2 <= 0 || d > maxDist || d <= Math.abs(r1 - r2)) {
        return null;
      }

      let u1 = 0;
      let u2 = 0;

      if (d < r1 + r2) {
        // Circles are partially overlapping
        u1 = Math.acos(
          Math.max(-1, Math.min(1, (r1 * r1 + d * d - r2 * r2) / (2 * r1 * d)))
        );
        u2 = Math.acos(
          Math.max(-1, Math.min(1, (r2 * r2 + d * d - r1 * r1) / (2 * r2 * d)))
        );
      }

      const angleBetweenCenters = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const maxSpread = Math.acos(
        Math.max(-1, Math.min(1, (r1 - r2) / d))
      );

      const v = viscosity;
      const angle1 = angleBetweenCenters + u1 + (maxSpread - u1) * v;
      const angle2 = angleBetweenCenters - u1 - (maxSpread - u1) * v;
      const angle3 = angleBetweenCenters + Math.PI - u2 - (Math.PI - u2 - maxSpread) * v;
      const angle4 = angleBetweenCenters - Math.PI + u2 + (Math.PI - u2 - maxSpread) * v;

      const pt1 = getVector(p1, angle1, r1);
      const pt2 = getVector(p1, angle2, r1);
      const pt3 = getVector(p2, angle3, r2);
      const pt4 = getVector(p2, angle4, r2);

      const totalRadius = r1 + r2;
      const d2 = Math.min(v * handleRate, getDist(pt1, pt3) / totalRadius);
      const d3 = Math.min(v * handleRate, getDist(pt2, pt4) / totalRadius);

      const handle1 = getVector(pt1, angle1 - Math.PI / 2, r1 * d2);
      const handle2 = getVector(pt2, angle2 + Math.PI / 2, r1 * d3);
      const handle3 = getVector(pt3, angle3 + Math.PI / 2, r2 * d2);
      const handle4 = getVector(pt4, angle4 - Math.PI / 2, r2 * d3);

      return { pt1, pt2, pt3, pt4, handle1, handle2, handle3, handle4 };
    },
    [handleRate, maxStretch, viscosity]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = mode === 'fixed' ? window.innerWidth : (canvas.parentElement?.clientWidth || window.innerWidth);
    let height = mode === 'fixed' ? window.innerHeight : (canvas.parentElement?.clientHeight || window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (mode === 'fixed') {
        width = window.innerWidth;
        height = window.innerHeight;
      } else {
        const parent = canvas.parentElement;
        width = parent ? parent.clientWidth : window.innerWidth;
        height = parent ? parent.clientHeight : window.innerHeight;
      }
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Scroll detection to pause expensive canvas loop during active scroll
    let isScrolling = false;
    let scrollTimeout = null;
    const handleScroll = () => {
      isScrolling = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        if (!animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(render);
        }
      }, 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Responsive dot density: reduce on mobile devices
    const isMobile = width < 768 || (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);
    const targetCount = isMobile
      ? Math.max(10, Math.min(16, Math.floor((width * height) / 45000)))
      : Math.max(14, Math.min(count, Math.floor((width * height) / 36000)));

    dotsRef.current = Array.from({ length: targetCount }, (_, i) => {
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      return {
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 1.1,
        vy: (Math.random() - 0.5) * speed * 1.1,
        radius,
        baseRadius: radius,
        color: PALETTE[i % PALETTE.length],
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        wobbleSpeed: (Math.random() * 0.007 + 0.003) * (reducedMotion ? 0.2 : 1),
        mass: radius * 0.1
      };
    });

    // Pointer Tracking
    const handlePointerMove = (e) => {
      if (!interactive) return;

      if (mode === 'fixed') {
        mouseRef.current.targetX = e.clientX;
        mouseRef.current.targetY = e.clientY;
      } else {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.targetX = e.clientX - rect.left;
        mouseRef.current.targetY = e.clientY - rect.top;
      }
      mouseRef.current.active = true;
      if (reducedMotion && !animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -9999;
      mouseRef.current.targetY = -9999;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    // Animation Loop
    function render() {
      if (isScrolling) {
        animationFrameRef.current = null;
        return;
      }
      ctx.clearRect(0, 0, width, height);

      // Smooth pointer follower
      const mouse = mouseRef.current;
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.18;
        mouse.y += (mouse.targetY - mouse.y) * 0.18;
      } else {
        mouse.x += (-9999 - mouse.x) * 0.1;
        mouse.y += (-9999 - mouse.y) * 0.1;
      }

      const dots = dotsRef.current;

      // 1. Update positions with liquid harmonic physics
      dots.forEach((dot) => {
        if (!reducedMotion) {
          dot.phaseX += dot.wobbleSpeed;
          dot.phaseY += dot.wobbleSpeed * 0.88;

          const harmonicVx = Math.cos(dot.phaseX) * 0.32 * speed;
          const harmonicVy = Math.sin(dot.phaseY) * 0.32 * speed;

          dot.x += dot.vx + harmonicVx;
          dot.y += dot.vy + harmonicVy;
        }

        // Friction damping
        dot.vx *= 0.985;
        dot.vy *= 0.985;

        // Wrap around viewport with safety margin
        const margin = 40;
        if (dot.x < -margin) dot.x = width + margin;
        if (dot.x > width + margin) dot.x = -margin;
        if (dot.y < -margin) dot.y = height + margin;
        if (dot.y > height + margin) dot.y = -margin;

        // Magnetic viscous attraction towards pointer
        if (interactive && mouse.active) {
          const mdx = mouse.x - dot.x;
          const mdy = mouse.y - dot.y;
          const mdist = Math.hypot(mdx, mdy);
          const maxMouseDist = (dot.radius + mouse.radius) * maxStretch * 1.1;

          if (mdist < maxMouseDist && mdist > 0) {
            const stretch = (maxMouseDist - mdist) / maxMouseDist;
            const pullForce = stretch * stretch * 0.32;
            dot.vx += (mdx / mdist) * pullForce;
            dot.vy += (mdy / mdist) * pullForce;
          }
        }
      });

      // 2. Draw Sticky Liquid Bridges between nearby dots
      for (let i = 0; i < dots.length; i++) {
        const d1 = dots[i];

        for (let j = i + 1; j < dots.length; j++) {
          const d2 = dots[j];
          const bridge = getMetaballBridge(d1, d1.radius, d2, d2.radius);

          if (bridge) {
            const { pt1, pt2, pt3, pt4, handle1, handle2, handle3, handle4 } = bridge;

            // Fluid color blend along bridge
            const grad = ctx.createLinearGradient(d1.x, d1.y, d2.x, d2.y);
            grad.addColorStop(0, d1.color);
            grad.addColorStop(1, d2.color);

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(pt1.x, pt1.y);
            ctx.bezierCurveTo(handle1.x, handle1.y, handle3.x, handle3.y, pt3.x, pt3.y);
            ctx.lineTo(pt4.x, pt4.y);
            ctx.bezierCurveTo(handle4.x, handle4.y, handle2.x, handle2.y, pt2.x, pt2.y);
            ctx.closePath();

            ctx.fillStyle = grad;
            if (!isScrolling) {
              ctx.shadowBlur = 8;
              ctx.shadowColor = 'rgba(190, 92, 169, 0.22)';
            }
            ctx.fill();
            ctx.restore();

            // Mutual gentle elastic spring force
            const dist = getDist(d1, d2);
            const springRatio = 0.0012 * viscosity;
            const fx = ((d2.x - d1.x) / dist) * (dist * springRatio);
            const fy = ((d2.y - d1.y) / dist) * (dist * springRatio);
            d1.vx += fx;
            d1.vy += fy;
            d2.vx -= fx;
            d2.vy -= fy;
          }
        }

        // Bridge to Pointer Attractor
        if (interactive && mouse.active) {
          const mouseBridge = getMetaballBridge(d1, d1.radius, mouse, mouse.radius);
          if (mouseBridge) {
            const { pt1, pt2, pt3, pt4, handle1, handle2, handle3, handle4 } = mouseBridge;

            const grad = ctx.createLinearGradient(d1.x, d1.y, mouse.x, mouse.y);
            grad.addColorStop(0, d1.color);
            grad.addColorStop(1, mouse.color);

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(pt1.x, pt1.y);
            ctx.bezierCurveTo(handle1.x, handle1.y, handle3.x, handle3.y, pt3.x, pt3.y);
            ctx.lineTo(pt4.x, pt4.y);
            ctx.bezierCurveTo(handle4.x, handle4.y, handle2.x, handle2.y, pt2.x, pt2.y);
            ctx.closePath();

            ctx.fillStyle = grad;
            if (!isScrolling) {
              ctx.shadowBlur = 12;
              ctx.shadowColor = 'rgba(190, 92, 169, 0.35)';
            }
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // 3. Draw Liquid Drops with Specular Reflection
      dots.forEach((dot) => {
        ctx.save();

        // 3D Spherical Volume Highlight
        const grad = ctx.createRadialGradient(
          dot.x - dot.radius * 0.28,
          dot.y - dot.radius * 0.28,
          dot.radius * 0.08,
          dot.x,
          dot.y,
          dot.radius
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.52)');
        grad.addColorStop(0.38, dot.color);
        grad.addColorStop(1, dot.color);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        if (!isScrolling) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(190, 92, 169, 0.25)';
        }
        ctx.fill();

        // Subtle specular glint
        ctx.beginPath();
        ctx.arc(
          dot.x - dot.radius * 0.3,
          dot.y - dot.radius * 0.3,
          dot.radius * 0.2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.36)';
        ctx.fill();

        ctx.restore();
      });

      // 4. Draw Cursor Attractor Drop (Subtle, transparent)
      if (interactive && mouse.active) {
        ctx.save();
        const mouseGrad = ctx.createRadialGradient(
          mouse.x - mouse.radius * 0.28,
          mouse.y - mouse.radius * 0.28,
          mouse.radius * 0.1,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        mouseGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
        mouseGrad.addColorStop(0.4, 'rgba(190, 92, 169, 0.7)');
        mouseGrad.addColorStop(1, 'rgba(77, 58, 77, 0.35)');

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fillStyle = mouseGrad;
        if (!isScrolling) {
          ctx.shadowBlur = 14;
          ctx.shadowColor = 'rgba(190, 92, 169, 0.4)';
        }
        ctx.fill();
        ctx.restore();
      }

      if (!reducedMotion || mouse.active) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    count,
    minRadius,
    maxRadius,
    maxStretch,
    viscosity,
    handleRate,
    speed,
    interactive,
    cursorRadius,
    mode,
    reducedMotion,
    getMetaballBridge
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`glue-dots-background ${className}`}
      style={{
        position: mode === 'fixed' ? 'fixed' : 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 'var(--z-canvas, 1)',
        transform: 'translateZ(0)',
        willChange: 'transform',
        opacity,
        ...style
      }}
      aria-hidden="true"
    />
  );
};

export default GlueDotsBackground;
