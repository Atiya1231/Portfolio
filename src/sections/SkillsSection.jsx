import React from 'react';
import SectionPlaceholder from '../components/SectionPlaceholder';

const SkillsSection = () => {
  return (
    <SectionPlaceholder
      id="skills"
      indexNumber="03 // 06"
      phaseLabel="PHASE 4 MODULE"
      title="SKILLS — PHASE 4"
      subtitle="INTERACTIVE TECH STACK & COMPETENCY MATRIX"
      description="In Phase 4, this section will showcase an interactive matrix of my technical skills across Frontend development, JavaScript ecosystem, UI/UX aesthetics, and computer application fundamentals."
      blueprintItems={[
        { label: 'DELIVERABLE 01', value: 'Frontend Core (HTML, CSS, JS, React)' },
        { label: 'DELIVERABLE 02', value: '3D & Motion (Three.js, GSAP)' },
        { label: 'DELIVERABLE 03', value: 'Tooling & Ecosystem (Vite, Git, Figma)' },
        { label: 'DELIVERABLE 04', value: 'Interactive Skill Grid & Filtering' }
      ]}
    />
  );
};

export default SkillsSection;
