import React from 'react';
import SectionPlaceholder from '../components/SectionPlaceholder';

const AboutSection = () => {
  return (
    <SectionPlaceholder
      id="about"
      indexNumber="02 // 06"
      phaseLabel="PHASE 3 MODULE"
      title="ABOUT — PHASE 3"
      subtitle="BIOGRAPHY, CORE PHILOSOPHY & ACADEMIC TRAJECTORY"
      description="In Phase 3, this section will present my developer journey as a BCA student, my core engineering principles, passion for modern web technologies, and a refined interactive presentation."
      blueprintItems={[
        { label: 'DELIVERABLE 01', value: 'Developer Bio & Personal Narrative' },
        { label: 'DELIVERABLE 02', value: 'BCA Academic Specialization' },
        { label: 'DELIVERABLE 03', value: 'Core Values & Design Philosophy' },
        { label: 'DELIVERABLE 04', value: 'Interactive Typography & Scroll Story' }
      ]}
    />
  );
};

export default AboutSection;
