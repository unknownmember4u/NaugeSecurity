import React, { useRef, useEffect } from 'react';
import bgVideo from '../assets/images/bg.mp4';
import '../styles/background.css';

export function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented by browser:', err);
      });
    }
  }, []);

  return (
    <>
      {/* Fixed Background Video */}
      <div className="bg-video-container">
        <video
          ref={videoRef}
          className="bg-video-element"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Fixed Glassmorphism Overlay */}
      <div className="glass-overlay" />

      {/* Scrollable Content Layers */}
      <div className="scroll-content-container">
        
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">NaugeSecurity</h1>
          <div className="scroll-indicator">↓ Scroll Down</div>
        </section>

        {/* Scrollable Glass Section */}
        <section className="content-section">
          <div className="glass-card">
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '700' }}>
              Autonomous Pentesting Engine
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.8)' }}>
              NaugeSecurity continuously scans, maps, and verifies security vectors across your entire infrastructure in real time with zero-day automated threat analysis.
            </p>
          </div>
        </section>

      </div>
    </>
  );
}

export default App;
