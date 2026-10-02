import React from 'react';
import { Layers } from 'lucide-react';

/**
 * SectionPlaceholder: Reusable cinematic placeholder component for portfolio architecture
 */
const SectionPlaceholder = ({
  id,
  indexNumber,
  phaseLabel,
  title,
  subtitle,
  description,
  blueprintItems = [],
  children
}) => {
  return (
    <section id={id} className="section-wrapper" aria-label={title}>
      <div className="section-container">
        <div className="placeholder-card">
          {/* Header Metadata */}
          <div className="card-header-meta">
            <span className="section-index-num">{indexNumber}</span>
            <span className="phase-chip">
              <Layers size={14} />
              {phaseLabel}
            </span>
          </div>

          {/* Section Main Titles */}
          <h2 className="heading-section card-title gradient-text-pink">{title}</h2>
          {subtitle && <div className="card-subtitle">{subtitle}</div>}

          {/* Section Description */}
          {description && <p className="card-description">{description}</p>}

          {/* Custom Content Slot */}
          {children}

          {/* Blueprint Specs Grid */}
          {blueprintItems.length > 0 && (
            <div className="blueprint-grid">
              {blueprintItems.map((item, idx) => (
                <div key={idx} className="blueprint-item">
                  <span className="blueprint-label">{item.label}</span>
                  <span className="blueprint-value">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SectionPlaceholder;
