import React from 'react';
import SectionPlaceholder from '../components/SectionPlaceholder';

const ProjectsSection = () => {
  return (
    <SectionPlaceholder
      id="projects"
      indexNumber="04 // 06"
      phaseLabel="PHASE 5 MODULE"
      title="PROJECTS — PHASE 5"
      subtitle="FEATURED CASE STUDIES & LIVE DEPLOYMENTS"
      description="In Phase 5, this section will highlight selected projects, applications, and web experiences with interactive preview cards, live deployment links, GitHub repositories, and tech breakdowns."
      blueprintItems={[
        { label: 'DELIVERABLE 01', value: 'Interactive Project Showcase Cards' },
        { label: 'DELIVERABLE 02', value: 'Live Demo & Repository Links' },
        { label: 'DELIVERABLE 03', value: 'Architecture & Tech Stack Badges' },
        { label: 'DELIVERABLE 04', value: 'Hover Previews & Motion Transitions' }
      ]}
    />
  );
};

export default ProjectsSection;
