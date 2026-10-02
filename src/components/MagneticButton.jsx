import React, { useRef, useState, useEffect } from 'react';

/**
 * MagneticButton: Premium interactive CTA button with smooth magnetic cursor pull.
 * Automatically disables magnetic translation on touch devices.
 */
const MagneticButton = ({
  children,
  onClick,
  className = '',
  ariaLabel,
  variant = 'primary', // 'primary' | 'secondary'
  id
}) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  }, []);

  const handleMouseMove = (e) => {
    if (isTouchDevice.current || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center with dampened factor (max ~12px)
    const distanceX = (e.clientX - centerX) * 0.28;
    const distanceY = (e.clientY - centerY) * 0.28;

    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice.current) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      id={id}
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-btn magnetic-btn-${variant} ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovered ? 1.03 : 1})`,
        transition: isHovered
          ? 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.25s ease, border-color 0.25s ease'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease'
      }}
      aria-label={ariaLabel}
    >
      <span className="magnetic-btn-glow" aria-hidden="true" />
      <span className="magnetic-btn-content">{children}</span>
    </button>
  );
};

export default MagneticButton;
