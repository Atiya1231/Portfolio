import React from 'react';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import GlueDotsBackground from './components/GlueDotsBackground';
import Footer from './components/Footer';

// Sections
import HomeSection from './sections/HomeSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import JourneySection from './sections/JourneySection';
import ContactSection from './sections/ContactSection';

function App() {
  return (
    <div className="app-container">
      {/* Cinematic Background Atmosphere */}
      <div className="cinematic-bg-glow" aria-hidden="true" />
      <div className="film-grain-overlay" aria-hidden="true" />
      
      {/* Interactive Liquid Glue Dots Background Layer */}
      <GlueDotsBackground
        mode="fixed"
        count={28}
        minRadius={12}
        maxRadius={28}
        maxStretch={3.1}
        viscosity={0.56}
        handleRate={2.2}
        speed={0.65}
        interactive={true}
        cursorRadius={24}
        opacity={0.62}
      />

      {/* Smooth Minimal Follower Cursor */}
      <CustomCursor />

      {/* Fixed Navigation Bar */}
      <Navbar />

      {/* Page Sections */}
      <main className="main-content">
        <HomeSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <JourneySection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
