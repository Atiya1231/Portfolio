import React from 'react';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import BackgroundCanvas from './components/BackgroundCanvas';
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
      <BackgroundCanvas />

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
