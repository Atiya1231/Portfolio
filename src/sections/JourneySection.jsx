import React from 'react';
import SectionPlaceholder from '../components/SectionPlaceholder';

const JourneySection = () => {
  return (
    <SectionPlaceholder
      id="journey"
      indexNumber="05 // 06"
      phaseLabel="PHASE 6 MODULE"
      title="JOURNEY — PHASE 6"
      subtitle="ACADEMIC MILESTONES & DEVELOPER TIMELINE"
      description="In Phase 6, this section will map out my educational milestones in Bachelor of Computer Applications (BCA), continuous learning path, hackathons, and growth trajectory as a modern developer."
      blueprintItems={[
        { label: 'DELIVERABLE 01', value: 'BCA Degree Curriculum & Achievements' },
        { label: 'DELIVERABLE 02', value: 'Chronological Experience Timeline' },
        { label: 'DELIVERABLE 03', value: 'Continuous Learning Certifications' },
        { label: 'DELIVERABLE 04', value: 'Interactive Progress Flow' }
      ]}
    />
  );
};

export default JourneySection;
