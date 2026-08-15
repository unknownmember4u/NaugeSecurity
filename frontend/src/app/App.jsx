import React, { useRef, useEffect, useState } from 'react';
import bgVideo from '../assets/images/bg-optimized.mp4';
import '../styles/background.css';
import NewtonsCradle from '../components/NewtonsCradle';
import LogoMarquee from '../components/ui/logo-marquee';
import BoxLoader from '../components/ui/box-loader';

export function App() {
  const videoRef = useRef(null);
  const [activeTab, setActiveTab] = useState('engine');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [splashProgress, setSplashProgress] = useState(100);
  const [pageRevealed, setPageRevealed] = useState(true);

  const heroRef = useRef(null);
  const bgVideoContainerRef = useRef(null);
  const glassOverlayRef = useRef(null);
  const sheetRef = useRef(null);
  const navbarRef = useRef(null);

  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditStep, setAuditStep] = useState('');

  const handleTabClick = (tabKey) => {
    if (tabKey !== activeTab) {
      setIsTabLoading(true);
      setActiveTab(tabKey);
      setTimeout(() => {
        setIsTabLoading(false);
      }, 400);
    }
  };

  const handleStartAudit = () => {
    setAuditModalOpen(true);
    setIsAuditing(true);
    setAuditProgress(15);
    setAuditStep('Initializing NaugeSecurity Attack Surface Engine...');

    setTimeout(() => {
      setAuditProgress(45);
      setAuditStep('Mapping Subdomains, DNS & Cloud Endpoints...');
    }, 1100);

    setTimeout(() => {
      setAuditProgress(80);
      setAuditStep('Executing Ephemeral Zero-Day Payload Verification...');
    }, 2300);

    setTimeout(() => {
      setAuditProgress(100);
      setAuditStep('Audit Complete! 0 Critical Production Exploits Found.');
      setTimeout(() => {
        setIsAuditing(false);
      }, 700);
    }, 3600);
  };


  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch((err) => {
        console.warn('Autoplay prevented by browser:', err);
      });
    }
  }, []);

  // Track scroll position for dynamic scroll effects directly via DOM to prevent re-renders
  useEffect(() => {
    let ticking = false;
    const maxScrollThreshold = typeof window !== 'undefined' ? Math.max(window.innerHeight * 0.75, 450) : 600;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || 0;
          const scrollProgress = Math.min(Math.max(scrollY / maxScrollThreshold, 0), 1);

          if (heroRef.current) {
            heroRef.current.style.filter = `blur(${scrollProgress * 22}px)`;
            heroRef.current.style.opacity = Math.max(1 - scrollProgress * 1.35, 0);
            heroRef.current.style.transform = `translateY(${scrollProgress * -40}px) scale(${1 - scrollProgress * 0.08})`;
          }

          if (bgVideoContainerRef.current) {
            bgVideoContainerRef.current.style.filter = `blur(${scrollProgress * 26}px)`;
            bgVideoContainerRef.current.style.opacity = Math.max(1 - scrollProgress * 0.55, 0.45);
          }

          if (glassOverlayRef.current) {
            glassOverlayRef.current.style.backdropFilter = `blur(${14 + scrollProgress * 16}px) saturate(120%)`;
            glassOverlayRef.current.style.WebkitBackdropFilter = `blur(${14 + scrollProgress * 16}px) saturate(120%)`;
          }

          if (sheetRef.current) {
            sheetRef.current.style.opacity = Math.min(0.35 + scrollProgress * 0.65, 1);
          }

          if (navbarRef.current) {
            if (scrollY >= 80) {
              navbarRef.current.classList.add('navbar-visible');
            } else {
              navbarRef.current.classList.remove('navbar-visible');
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    // Initialize initial state immediately
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsDemoSubmitting(true);
      setTimeout(() => {
        setIsDemoSubmitting(false);
        setEmailSubmitted(true);
        setTimeout(() => {
          setEmailSubmitted(false);
          setDemoModalOpen(false);
          setEmail('');
        }, 3000);
      }, 1600);
    }
  };

  return (
    <>
      {/* Loading Splash Screen */}
      {loading && (
        <div className={`splash-screen ${splashProgress === 100 ? 'splash-exit' : ''}`}>
          <div className="splash-content">
            <BoxLoader />
          </div>
        </div>
      )}

      {/* Floating Glassmorphism Notch Navigation Bar (Fixed Top-Center Window Pinned) */}
      <header ref={navbarRef} className={`ent-navbar`}>
        <div className="ent-nav-container">
          <div className="ent-brand">
            <span className="ent-logo-text">NaugeSecurity</span>
          </div>

          <nav className="ent-nav-links">

            <a href="#how-it-works" className="ent-link">How It Works</a>
            <a href="#features" className="ent-link">Capabilities</a>
            <a href="#architecture" className="ent-link">Architecture</a>
            <a href="#compliance" className="ent-link">Compliance</a>
          </nav>

          <div className="ent-nav-actions">
            <button className="btn-secondary-light" onClick={() => setDemoModalOpen(true)}>
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Background Video Layer (Progressively blurs on scroll) */}
      <div
        ref={bgVideoContainerRef}
        className="bg-video-container"
        style={{
          filter: `blur(0px)`,
          opacity: 1,
        }}
      >
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

      {/* Fixed Glassmorphism Overlay (Increases backdrop blur on scroll) */}
      <div
        ref={glassOverlayRef}
        className="glass-overlay"
        style={{
          backdropFilter: `blur(14px) saturate(120%)`,
          WebkitBackdropFilter: `blur(14px) saturate(120%)`,
        }}
      />

      {/* Fixed Hero Title Section (Progressively blurs and fades as user scrolls down) */}
      <div
        ref={heroRef}
        className={`fixed-hero-container page-revealed`}
        style={{
          filter: `blur(0px)`,
          opacity: 1,
          transform: `translateY(0px) scale(1)`,
        }}
      >
        <section className="hero-section">
          <h1 className="hero-title animate-title">NaugeSecurity</h1>

          <div className="scroll-indicator animate-indicator">
            <span className="mouse-icon">
              <span className="mouse-wheel"></span>
            </span>
            <span className="scroll-text">↓ Scroll</span>
          </div>
        </section>
      </div>

      {/* Scrollable Content Container */}
      <div className={`scroll-content-container page-revealed`}>

        {/* Invisible Spacer allowing scrolling past the fixed hero */}
        <div className="hero-scroll-spacer" />

        {/* Enterprise Page Sheet Section (Swipes up & transitions from BLUR -> CLEAR as user scrolls) */}
        <section
          ref={sheetRef}
          className="enterprise-page-sheet animate-sheet"
          id="enterprise-platform"
          style={{
            filter: 'none',
            opacity: 0.35,
          }}
        >

          {/* Enterprise Hero Banner */}
          <div className="ent-hero-container" id="platform">


            <h2 className="ent-main-heading">
              Autonomous Security Intelligence for Web Applications
            </h2>

            <p className="ent-main-subtext">
              NaugeSecurity maps your attack surface, identifies potential vulnerabilities, correlates security signals, and uses AI-assisted investigation to help you understand what matters and what to fix first.
            </p>

            <div className="ent-cta-group">
              <button className="btn-primary-large" onClick={() => setDemoModalOpen(true)}>
                Start Securing Your Website →
              </button>

              <a href="#features" className="btn-outline-large">
                Explore How It Works
              </a>
            </div>

            {/* Enterprise Key Stats Row */}
            <div className="ent-stats-grid">
              <div className="stat-card">
                <div className="stat-number-badge">01</div>
                <div className="stat-value">Verified First</div>
                <div className="stat-label">Authorized Assessment</div>
                <div className="stat-desc">Every target is verified before active security testing.</div>
              </div>

              <div className="stat-card">
                <div className="stat-number-badge">02</div>
                <div className="stat-value">6+ Asset Types</div>
                <div className="stat-label">Attack Surface Discovery</div>
                <div className="stat-desc">Domains, subdomains, endpoints, APIs, technologies, and services.</div>
              </div>

              <div className="stat-card">
                <div className="stat-number-badge">03</div>
                <div className="stat-value">AI-Assisted</div>
                <div className="stat-label">Security Investigation</div>
                <div className="stat-desc">Correlate evidence and findings to understand what actually matters.</div>
              </div>

              <div className="stat-card">
                <div className="stat-number-badge">04</div>
                <div className="stat-value">End-to-End</div>
                <div className="stat-label">Find → Fix → Validate</div>
                <div className="stat-desc">Track findings from discovery through remediation and validation.</div>
              </div>
            </div>
          </div>

          {/* Compliance Logos Bar */}
          <div className="ent-compliance-bar" id="compliance">
            <div className="compliance-label">TRUSTED SECURITY & COMPLIANCE FRAMEWORKS</div>
            <LogoMarquee
              logos={[
                {
                  icon: <svg viewBox="0 0 24 24" className="badge-icon" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
                  alt: 'SOC 2 Type II'
                },
                {
                  icon: <svg viewBox="0 0 24 24" className="badge-icon" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
                  alt: 'ISO 27001'
                },
                {
                  icon: <svg viewBox="0 0 24 24" className="badge-icon" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
                  alt: 'GDPR Verified'
                },
                {
                  icon: <svg viewBox="0 0 24 24" className="badge-icon" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
                  alt: 'HIPAA Compliant'
                },
                {
                  icon: <svg viewBox="0 0 24 24" className="badge-icon" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
                  alt: 'PCI-DSS v4.0'
                }
              ]}
              duration={25}
              durationOnHover={85}
              gap={32}
            />
          </div>

          {/* How It Works Section */}
          <div className="how-it-works-section" id="how-it-works">
            <div className="section-header">
              <span className="section-eyebrow">HOW IT WORKS</span>
              <h3 className="section-title">From Verified Ownership to Actionable Security Insights</h3>
              <p className="section-subtitle">
                A structured security workflow designed to keep assessments authorized, observable, and actionable.
              </p>
            </div>

            <div className="workflow-steps-grid">
              <div className="workflow-step-card">
                <div className="step-card-header">
                  <span className="step-badge">Step 01 — Verify</span>
                  <div className="step-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                  </div>
                </div>
                <h4 className="step-title">Verify Your Website</h4>
                <p className="step-body">
                  Before an assessment begins, NaugeSecurity verifies that you control the target through domain-based verification. This establishes an explicit security boundary before active assessment starts.
                </p>
              </div>

              <div className="workflow-step-card">
                <div className="step-card-header">
                  <span className="step-badge">Step 02 — Discover</span>
                  <div className="step-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                  </div>
                </div>
                <h4 className="step-title">Map Your Attack Surface</h4>
                <p className="step-body">
                  Discover domains, subdomains, endpoints, APIs, technologies, and exposed services associated with your verified target. Build a clearer picture of what is actually exposed.
                </p>
              </div>

              <div className="workflow-step-card">
                <div className="step-card-header">
                  <span className="step-badge">Step 03 — Assess</span>
                  <div className="step-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  </div>
                </div>
                <h4 className="step-title">Identify Security Risks</h4>
                <p className="step-body">
                  Run controlled security assessments against the authorized scope to identify potential vulnerabilities, configuration weaknesses, and other security signals.
                </p>
              </div>

              <div className="workflow-step-card">
                <div className="step-card-header">
                  <span className="step-badge">Step 04 — Investigate</span>
                  <div className="step-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12L2.1 12" /><path d="M12 12l4.3-7.5" /><circle cx="12" cy="12" r="3" /></svg>
                  </div>
                </div>
                <h4 className="step-title">Let AI Investigate the Findings</h4>
                <p className="step-body">
                  NaugeSecurity uses AI-assisted investigation to correlate evidence, analyze related assets and findings, assess confidence, and provide a structured explanation of why a finding matters.
                </p>
              </div>

              <div className="workflow-step-card">
                <div className="step-card-header">
                  <span className="step-badge">Step 05 — Prioritize</span>
                  <div className="step-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                  </div>
                </div>
                <h4 className="step-title">Focus on What Matters</h4>
                <p className="step-body">
                  Not every finding deserves the same attention. NaugeSecurity helps prioritize issues using severity, confidence, affected assets, evidence, and potential impact.
                </p>
              </div>

              <div className="workflow-step-card">
                <div className="step-card-header">
                  <span className="step-badge">Step 06 — Remediate</span>
                  <div className="step-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  </div>
                </div>
                <h4 className="step-title">Fix. Validate. Improve.</h4>
                <p className="step-body">
                  Get actionable remediation guidance, apply the fix, and run validation assessments to determine whether the issue has been resolved.
                </p>
              </div>
            </div>
          </div>

          {/* Ownership Verification Section (Plain White BG) */}
          <div className="ownership-verification-section" id="ownership-verification">
            <div className="ent-section-inner">
              <div className="section-header">
                <span className="section-eyebrow">OWNERSHIP VERIFICATION</span>
                <h3 className="section-title light-theme-title">Security Starts With Verified Ownership</h3>
                <p className="section-subtitle light-theme-subtitle">
                  Know exactly what you are authorized to assess before testing begins.
                </p>
              </div>

              <div className="verification-main-card">
                <p className="verification-body-text">
                  NaugeSecurity does not treat a URL as permission to scan. Domain ownership is verified before active security assessment, creating a clear boundary between authorized targets and everything outside the scope.
                </p>
              </div>

              <div className="verification-points-grid">
                <div className="verification-point-card">
                  <div className="point-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>
                  </div>
                  <h4 className="point-title">DNS-Based Verification</h4>
                  <p className="point-body">Verify control of your domain through a DNS TXT record.</p>
                </div>

                <div className="verification-point-card">
                  <div className="point-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>
                  </div>
                  <h4 className="point-title">Explicit Scope</h4>
                  <p className="point-body">Clearly define which assets are included in an assessment.</p>
                </div>

                <div className="verification-point-card">
                  <div className="point-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                  </div>
                  <h4 className="point-title">Controlled Assessment</h4>
                  <p className="point-body">Security testing remains within the verified scope.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attack Surface Section (Split Side-by-Side Layout) */}
          <div className="attack-surface-section" id="attack-surface">
            <div className="ent-section-inner attack-surface-split">
              {/* Left Column: Heading, Subheading & Body Content */}
              <div className="attack-surface-left-col">
                <span className="section-eyebrow">ATTACK SURFACE</span>
                <h3 className="section-title">See Your Entire Attack Surface</h3>
                <p className="section-subtitle">
                  Turn scattered infrastructure into a structured security map.
                </p>
                <div className="attack-surface-body-card">
                  <p className="attack-surface-body-text">
                    Modern applications are rarely limited to a single domain. NaugeSecurity discovers and organizes the assets that make up your web attack surface, helping you understand the relationship between domains, subdomains, endpoints, APIs, technologies, and exposed services.
                  </p>
                </div>
              </div>

              {/* Right Column: 2x2 Cards Grid */}
              <div className="attack-surface-right-col">
                <div className="attack-surface-grid">
                  <div className="attack-surface-card">
                    <div className="attack-card-header">
                      <span className="attack-card-tag">Asset Type 01</span>
                      <div className="attack-icon-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                      </div>
                    </div>
                    <h4 className="attack-card-title">Domains</h4>
                    <p className="attack-card-body">Understand your registered and discovered domains.</p>
                  </div>

                  <div className="attack-surface-card">
                    <div className="attack-card-header">
                      <span className="attack-card-tag">Asset Type 02</span>
                      <div className="attack-icon-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>
                      </div>
                    </div>
                    <h4 className="attack-card-title">Subdomains</h4>
                    <p className="attack-card-body">Identify additional web-facing infrastructure.</p>
                  </div>

                  <div className="attack-surface-card">
                    <div className="attack-card-header">
                      <span className="attack-card-tag">Asset Type 03</span>
                      <div className="attack-icon-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 17 22 12" /></svg>
                      </div>
                    </div>
                    <h4 className="attack-card-title">Endpoints &amp; APIs</h4>
                    <p className="attack-card-body">Discover application entry points and exposed interfaces.</p>
                  </div>

                  <div className="attack-surface-card">
                    <div className="attack-card-header">
                      <span className="attack-card-tag">Asset Type 04</span>
                      <div className="attack-icon-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>
                      </div>
                    </div>
                    <h4 className="attack-card-title">Technologies</h4>
                    <p className="attack-card-body">Identify technologies and services contributing to your attack surface.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Investigation Section (Flipped Split Layout: Left Pillars Stack, Right Content) */}
          <div className="ai-investigation-section" id="ai-investigation">
            <div className="ent-section-inner ai-investigation-split">
              {/* Left Column: Innovative AI Feature Stack / Pillar Items */}
              <div className="ai-investigation-left-col">
                <div className="ai-pillars-stack">
                  <div className="ai-pillar-item">
                    <div className="ai-pillar-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                    </div>
                    <div className="ai-pillar-content">
                      <div className="ai-pillar-header">
                        <h4 className="ai-pillar-title">Evidence</h4>

                      </div>
                      <p className="ai-pillar-body">Understand the signals behind a finding.</p>
                    </div>
                  </div>

                  <div className="ai-pillar-item">
                    <div className="ai-pillar-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                    </div>
                    <div className="ai-pillar-content">
                      <div className="ai-pillar-header">
                        <h4 className="ai-pillar-title">Correlation</h4>

                      </div>
                      <p className="ai-pillar-body">Connect related assets and security findings.</p>
                    </div>
                  </div>

                  <div className="ai-pillar-item">
                    <div className="ai-pillar-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
                    </div>
                    <div className="ai-pillar-content">
                      <div className="ai-pillar-header">
                        <h4 className="ai-pillar-title">Confidence</h4>

                      </div>
                      <p className="ai-pillar-body">Separate the severity of an issue from confidence in the assessment.</p>
                    </div>
                  </div>

                  <div className="ai-pillar-item">
                    <div className="ai-pillar-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12L2.1 12" /><path d="M12 12l4.3-7.5" /><circle cx="12" cy="12" r="3" /></svg>
                    </div>
                    <div className="ai-pillar-content">
                      <div className="ai-pillar-header">
                        <h4 className="ai-pillar-title">Reasoning</h4>

                      </div>
                      <p className="ai-pillar-body">Understand why the AI reached its assessment.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Heading, Subheading & Body Text */}
              <div className="ai-investigation-right-col">
                <span className="section-eyebrow">AI INVESTIGATION</span>
                <h3 className="section-title light-theme-title">AI That Investigates, Not Just Summarizes</h3>
                <p className="section-subtitle light-theme-subtitle">
                  Turn security signals into evidence-backed investigations.
                </p>
                <div className="ai-investigation-body-card">
                  <p className="ai-investigation-body-text">
                    NaugeSecurity's AI-assisted investigation layer analyzes discovered evidence and related security signals to help determine what a finding means, why it matters, and what should be investigated next.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Findings Section (Split Side-by-Side Layout) */}
          <div className="findings-section" id="findings">
            <div className="ent-section-inner findings-split">
              {/* Left Column: Heading, Subheading & Body Content */}
              <div className="findings-left-col">
                <span className="section-eyebrow">FINDINGS</span>
                <h3 className="section-title">Know Which Vulnerabilities Deserve Attention</h3>
                <p className="section-subtitle">
                  Replace overwhelming vulnerability lists with prioritized security intelligence.
                </p>
                <div className="findings-body-card">
                  <p className="findings-body-text">
                    Every finding is presented with the context needed to investigate it—including severity, confidence, affected assets, evidence, related findings, AI analysis, and recommended remediation.
                  </p>
                </div>
              </div>

              {/* Right Column: Interactive Priority Intelligence Bar Stack */}
              <div className="findings-right-col">
                <div className="severity-intelligence-stack">
                  <div className="severity-row-item critical-row">
                    <div className="severity-row-top">
                      <div className="severity-title-group">
                        <span className="status-dot dot-critical"></span>
                        <span className="severity-row-name">Critical</span>
                        <span className="severity-row-badge badge-critical">P1 — Immediate</span>
                      </div>
                      <span className="severity-impact-val val-critical">Action Required</span>
                    </div>
                    <p className="severity-row-desc">Immediate attention required.</p>
                    <div className="severity-bar-track">
                      <div className="severity-bar-fill fill-critical" style={{ width: '95%' }}></div>
                    </div>
                  </div>

                  <div className="severity-row-item high-row">
                    <div className="severity-row-top">
                      <div className="severity-title-group">
                        <span className="status-dot dot-high"></span>
                        <span className="severity-row-name">High</span>
                        <span className="severity-row-badge badge-high">P2 — Prompt</span>
                      </div>
                      <span className="severity-impact-val val-high">High Priority</span>
                    </div>
                    <p className="severity-row-desc">Significant security risk requiring prompt investigation.</p>
                    <div className="severity-bar-track">
                      <div className="severity-bar-fill fill-high" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div className="severity-row-item medium-row">
                    <div className="severity-row-top">
                      <div className="severity-title-group">
                        <span className="status-dot dot-medium"></span>
                        <span className="severity-row-name">Medium</span>
                        <span className="severity-row-badge badge-medium">P3 — Moderate</span>
                      </div>
                      <span className="severity-impact-val val-medium">Scheduled Fix</span>
                    </div>
                    <p className="severity-row-desc">Security weakness that should be addressed.</p>
                    <div className="severity-bar-track">
                      <div className="severity-bar-fill fill-medium" style={{ width: '50%' }}></div>
                    </div>
                  </div>

                  <div className="severity-row-item low-row">
                    <div className="severity-row-top">
                      <div className="severity-title-group">
                        <span className="status-dot dot-low"></span>
                        <span className="severity-row-name">Low</span>
                        <span className="severity-row-badge badge-low">P4 — Informational</span>
                      </div>
                      <span className="severity-impact-val val-low">Low Impact</span>
                    </div>
                    <p className="severity-row-desc">Lower-impact issue or improvement opportunity.</p>
                    <div className="severity-bar-track">
                      <div className="severity-bar-fill fill-low" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence & Explainability Section (Plain White BG) */}
          <div className="explainability-section" id="explainability">
            <div className="ent-section-inner">
              <div className="section-header">
                <span className="section-eyebrow">EVIDENCE &amp; EXPLAINABILITY</span>
                <h3 className="section-title light-theme-title">Every Finding Should Have a Reason</h3>
                <p className="section-subtitle light-theme-subtitle">
                  Understand the evidence behind the assessment—not just the final verdict.
                </p>
              </div>

              <div className="explainability-main-card">
                <p className="explainability-body-text">
                  NaugeSecurity separates observed evidence from AI interpretation. Security teams can inspect the signals associated with a finding, understand the reasoning behind its assessment, and make their own informed decisions.
                </p>
              </div>

              {/* Supporting Line: Pipeline Flow Visual */}
              <div className="pipeline-flow-wrapper">
                <div className="pipeline-flow-grid">
                  <div className="pipeline-flow-node">

                    <h4 className="pipeline-node-title">Evidence</h4>
                    <p className="pipeline-node-desc">Observed signals &amp; raw findings</p>
                  </div>

                  <div className="pipeline-flow-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>

                  <div className="pipeline-flow-node">

                    <h4 className="pipeline-node-title">Analysis</h4>
                    <p className="pipeline-node-desc">AI correlation &amp; risk modeling</p>
                  </div>

                  <div className="pipeline-flow-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>

                  <div className="pipeline-flow-node">
                    <h4 className="pipeline-node-title">Confidence</h4>
                    <p className="pipeline-node-desc">Impact scoring &amp; verification</p>
                  </div>

                  <div className="pipeline-flow-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>

                  <div className="pipeline-flow-node highlight-node">
                    <h4 className="pipeline-node-title">Recommended Action</h4>
                    <p className="pipeline-node-desc">Targeted remediation guidance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Remediation Section (Flipped Split Layout: Left Flow, Right Content) */}
          <div className="remediation-section" id="remediation">
            <div className="ent-section-inner remediation-split">
              {/* Left Column: Remediation Flow Lifecycle Widget */}
              <div className="remediation-left-col">
                <div className="remediation-flow-stack">
                  <div className="remediation-step-item video-card">
                    <video className="card-bg-video" autoPlay loop muted playsInline src={bgVideo} />
                    <div className="card-video-overlay" />
                    <h4 className="remediation-step-title">Discover</h4>
                  </div>

                  <div className="remediation-flow-connector">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
                  </div>

                  <div className="remediation-step-item video-card">
                    <video className="card-bg-video" autoPlay loop muted playsInline src={bgVideo} />
                    <div className="card-video-overlay" />
                    <h4 className="remediation-step-title">Investigate</h4>
                  </div>

                  <div className="remediation-flow-connector">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
                  </div>

                  <div className="remediation-step-item video-card">
                    <video className="card-bg-video" autoPlay loop muted playsInline src={bgVideo} />
                    <div className="card-video-overlay" />
                    <h4 className="remediation-step-title">Fix</h4>
                  </div>

                  <div className="remediation-flow-connector">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
                  </div>

                  <div className="remediation-step-item video-card highlight-remediation">
                    <video className="card-bg-video" autoPlay loop muted playsInline src={bgVideo} />
                    <div className="card-video-overlay highlight-overlay" />
                    <h4 className="remediation-step-title">Validate</h4>
                  </div>
                </div>
              </div>

              {/* Right Column: Heading, Subheading & Body Text */}
              <div className="remediation-right-col">
                <span className="section-eyebrow">REMEDIATION</span>
                <h3 className="section-title">From Finding to Fix</h3>
                <p className="section-subtitle">
                  Security insights are only useful when they lead to action.
                </p>
                <div className="remediation-body-card">
                  <p className="remediation-body-text">
                    NaugeSecurity provides structured remediation guidance so developers and security teams can understand what needs to change. After remediation, validation assessments can help determine whether the issue has been resolved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Posture Section (Plain White BG) */}
          <div className="posture-section" id="posture">
            <div className="ent-section-inner">
              <div className="section-header">
                <span className="section-eyebrow">SECURITY POSTURE</span>
                <h3 className="section-title light-theme-title">Understand Your Security Posture Over Time</h3>
                <p className="section-subtitle light-theme-subtitle">
                  Track how your application's security changes as you discover, fix, and validate issues.
                </p>
              </div>

              <div className="posture-main-card">
                <p className="posture-body-text">
                  Compare assessments over time to understand changes in vulnerabilities, attack-surface exposure, and overall security posture. Use historical context to measure whether security is actually improving.
                </p>
              </div>

              {/* Historical Context Analytics & Assessment Trend Stack */}
              <div className="posture-metrics-container">
                <div className="posture-stats-row">
                  <div className="posture-stat-card">
                    <div className="posture-stat-top">
                      <span className="posture-stat-label">Security Posture Score</span>
                      <span className="posture-stat-trend trend-positive">+18% vs Last Month</span>
                    </div>
                    <div className="posture-stat-value">94<span className="posture-stat-unit">/100</span></div>
                    <div className="posture-progress-track">
                      <div className="posture-progress-fill" style={{ width: '94%' }}></div>
                    </div>
                  </div>

                  <div className="posture-stat-card">
                    <div className="posture-stat-top">
                      <span className="posture-stat-label">Vulnerability Reduction</span>
                      <span className="posture-stat-trend trend-positive">-87% Resolved</span>
                    </div>
                    <div className="posture-stat-value">3 <span className="posture-stat-unit">Active Findings</span></div>
                    <div className="posture-progress-track">
                      <div className="posture-progress-fill fill-green" style={{ width: '87%' }}></div>
                    </div>
                  </div>

                  <div className="posture-stat-card">
                    <div className="posture-stat-top">
                      <span className="posture-stat-label">Mean Time To Validate</span>
                      <span className="posture-stat-trend trend-neutral">Automated</span>
                    </div>
                    <div className="posture-stat-value">4.2 <span className="posture-stat-unit">Hours</span></div>
                    <div className="posture-progress-track">
                      <div className="posture-progress-fill fill-blue" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Timeline Assessments Stack */}
                <div className="posture-history-grid">
                  <div className="history-node-card">
                    <div className="history-node-header">
                      <span className="history-badge">Assessment #01</span>
                      <span className="history-date">Initial Baseline</span>
                    </div>
                    <h4 className="history-node-title">Attack Surface Discovery</h4>
                    <p className="history-node-desc">Mapped 18 subdomains, 42 APIs, and detected 24 open vulnerabilities.</p>
                    <div className="history-status-tag tag-orange">24 Findings</div>
                  </div>

                  <div className="history-node-card">
                    <div className="history-node-header">
                      <span className="history-badge">Assessment #02</span>
                      <span className="history-date">AI Investigation</span>
                    </div>
                    <h4 className="history-node-title">Evidence &amp; Correlation</h4>
                    <p className="history-node-desc">AI prioritized Critical/High risks; remediation guidance dispatched to engineering.</p>
                    <div className="history-status-tag tag-amber">8 Findings</div>
                  </div>

                  <div className="history-node-card highlight-posture">
                    <div className="history-node-header">
                      <span className="history-badge badge-active">Assessment #03</span>
                      <span className="history-date date-active">Current Verified State</span>
                    </div>
                    <h4 className="history-node-title">Validation &amp; Hardening</h4>
                    <p className="history-node-desc">Automated validation confirmed remediated vulnerabilities and hardened attack surface.</p>
                    <div className="history-status-tag tag-green">3 Low Remaining</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Section (Solid Black BG with Crisp White Cards) */}
          <div className="reports-section" id="reports">
            <div className="ent-section-inner">
              <div className="section-header">
                <span className="section-eyebrow">REPORTS</span>
                <h3 className="section-title">Turn Security Data Into Clear Reports</h3>
                <p className="section-subtitle">
                  Give developers, security teams, and stakeholders the information they need.
                </p>
              </div>

              <div className="reports-main-card">
                <p className="reports-body-text">
                  Generate structured security reports containing your security posture, discovered assets, findings, evidence, risk information, AI investigation results, and remediation recommendations.
                </p>
              </div>

              {/* Report Types Cards (Clean White Cards) */}
              <div className="reports-types-grid">
                <div className="report-type-card">
                  <div className="report-card-top">
                    <span className="report-badge badge-executive">Executive Summary</span>
                    <div className="report-icon-box icon-exec">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                    </div>
                  </div>
                  <h4 className="report-card-title">Executive Report</h4>
                  <p className="report-card-desc">
                    A concise overview of security posture and major risks.
                  </p>
                  <div className="report-card-action">
                    <span>Export PDF Summary</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                </div>

                <div className="report-type-card">
                  <div className="report-card-top">
                    <span className="report-badge badge-technical">Technical Specs</span>
                    <div className="report-icon-box icon-tech">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                    </div>
                  </div>
                  <h4 className="report-card-title">Technical Report</h4>
                  <p className="report-card-desc">
                    Detailed findings, evidence, affected assets, and remediation information.
                  </p>
                  <div className="report-card-action">
                    <span>Export Full Audit Report</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why NaugeSecurity Section (Plain White BG) */}
          <div className="why-naugesecurity-section" id="why-naugesecurity">
            <div className="ent-section-inner">
              <div className="section-header">
                <span className="section-eyebrow">WHY NAUGESECURITY</span>
                <h3 className="section-title light-theme-title">More Than a Vulnerability Scanner</h3>
                <p className="section-subtitle light-theme-subtitle">
                  NaugeSecurity connects the entire security assessment workflow.
                </p>
              </div>

              <div className="why-main-card">
                <p className="why-body-text">
                  Traditional security workflows often require multiple tools for reconnaissance, scanning, analysis, correlation, and reporting. NaugeSecurity brings these stages together into a single workflow, while using AI to help investigate and contextualize the results.
                </p>
              </div>

              {/* Three Key Differentiators Grid (Clean White Cards) */}
              <div className="why-differentiators-grid">
                <div className="differentiator-card">
                  <div className="diff-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
                  </div>
                  <h4 className="diff-card-title">Verified First</h4>
                  <p className="diff-card-desc">
                    Ownership verification establishes the boundary before assessment.
                  </p>
                </div>

                <div className="differentiator-card">
                  <div className="diff-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                  </div>
                  <h4 className="diff-card-title">Context Over Noise</h4>
                  <p className="diff-card-desc">
                    Findings are connected to assets, evidence, and related security signals.
                  </p>
                </div>

                <div className="differentiator-card">
                  <div className="diff-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12L2.5 7.5" /><path d="M12 12v10" /></svg>
                  </div>
                  <h4 className="diff-card-title">AI-Assisted Investigation</h4>
                  <p className="diff-card-desc">
                    AI helps analyze and explain findings instead of simply generating another list of alerts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Built for Security Teams & Developers (Solid Black BG with Clean White Cards) */}
          <div className="built-for-section" id="built-for-teams">
            <div className="ent-section-inner">
              <div className="section-header">
                <span className="section-eyebrow">BUILT FOR TEAMS &amp; DEVELOPERS</span>
                <h3 className="section-title">Built for the People Who Secure Applications</h3>
                <p className="section-subtitle">
                  Technical depth for security engineers. Clear answers for developers.
                </p>
              </div>

              <div className="personas-grid">
                <div className="persona-card">
                  <div className="persona-header">
                    <span className="persona-badge badge-dev">Developer</span>
                    <div className="persona-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                    </div>
                  </div>
                  <h4 className="persona-title">Developer</h4>
                  <h5 className="persona-tagline">Find the issue. Understand the cause. Fix it.</h5>
                  <p className="persona-body">
                    NaugeSecurity provides developers with actionable findings and remediation guidance without requiring them to navigate multiple security tools.
                  </p>
                </div>

                <div className="persona-card">
                  <div className="persona-header">
                    <span className="persona-badge badge-sec">Security Engineer</span>
                    <div className="persona-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    </div>
                  </div>
                  <h4 className="persona-title">Security Engineer</h4>
                  <h5 className="persona-tagline">Investigate deeper. Correlate evidence. Prioritize risk.</h5>
                  <p className="persona-body">
                    Get visibility into attack surface, findings, evidence, relationships, and AI-assisted investigations.
                  </p>
                </div>

                <div className="persona-card">
                  <div className="persona-header">
                    <span className="persona-badge badge-owner">Product / Website Owner</span>
                    <div className="persona-icon-box">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M18 9l-5 5-2-2-4 4" /></svg>
                    </div>
                  </div>
                  <h4 className="persona-title">Product / Website Owner</h4>
                  <h5 className="persona-tagline">Understand your security posture at a glance.</h5>
                  <p className="persona-body">
                    See the risks that matter, track security improvements, and generate clear reports for stakeholders.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final Call To Action Banner */}
          <div className="final-cta-section" id="final-cta">
            <div className="ent-section-inner">
              <div className="final-cta-card">
                <h3 className="final-cta-title">Know What You're Exposing. Know What Matters.</h3>
                <p className="final-cta-subheading">
                  Start with a verified website and turn your attack surface into actionable security intelligence.
                </p>
                <p className="final-cta-body">
                  NaugeSecurity helps you move from discovery to investigation, from investigation to remediation, and from remediation to validated security improvements.
                </p>
                <div className="final-cta-buttons">
                  <button className="btn-primary-large" onClick={() => setAuditModalOpen(true)}>
                    Start Your First Assessment
                  </button>
                  <button className="btn-secondary-large" onClick={() => setDemoModalOpen(true)}>
                    Explore NaugeSecurity
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Site Footer */}
          <footer className="ent-footer">
            <div className="footer-container">
              <div className="footer-col main-col">
                <div className="footer-brand">
                  <span className="footer-logo">NaugeSecurity</span>
                </div>
                <p className="footer-desc">
                  NaugeSecurity — Autonomous Security Intelligence for the Modern Web.
                </p>

              </div>

              <div className="footer-col">
                <h5>Product</h5>
                <a href="#hero">Dashboard</a>
                <a href="#attack-surface">Attack Surface</a>
                <a href="#ownership">Security Assessments</a>
                <a href="#ai-investigation">AI Investigation</a>
                <a href="#findings">Findings</a>
                <a href="#reports">Reports</a>
              </div>

              <div className="footer-col">
                <h5>Resources</h5>
                <a href="#documentation">Documentation</a>
                <a href="#security">Security</a>
                <a href="#api">API</a>
                <a href="#changelog">Changelog</a>
              </div>

              <div className="footer-col">
                <h5>Company</h5>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
                <a href="https://github.com/unknownmember4u/NaugeSecurity" target="_blank" rel="noreferrer">GitHub</a>
              </div>

              <div className="footer-col">
                <h5>Legal</h5>
                <a href="#privacy">Privacy</a>
                <a href="#terms">Terms</a>
                <a href="#disclosure">Responsible Disclosure</a>
              </div>
            </div>

            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} NaugeSecurity Inc. All rights reserved.</p>
              <p className="footer-tagline">NaugeSecurity - Autonomous Security Intelligence for the Modern Web.</p>
            </div>
          </footer>

        </section>

      </div>

      {/* Demo Modal */}
      {demoModalOpen && (
        <div className="modal-backdrop" onClick={() => !isDemoSubmitting && setDemoModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {!isDemoSubmitting && (
              <button className="modal-close" onClick={() => setDemoModalOpen(false)}>×</button>
            )}

            {isDemoSubmitting ? (
              <div className="modal-loading-state">
                <NewtonsCradle size={52} speed={1.1} color="#ea580c" />
                <h3 className="modal-loading-title">Provisioning Environment...</h3>
                <p className="modal-loading-subtext">Initializing dedicated enterprise sandbox node</p>
              </div>
            ) : emailSubmitted ? (
              <div className="modal-success">
                <div className="success-icon">✓</div>
                <h3>Demo Request Received</h3>
                <p>Our security architecture team will contact you shortly to set up your enterprise sandbox environment.</p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="modal-form">
                <h3>Schedule Enterprise Demo</h3>
                <p>Request a personalized technical demo and continuous attack surface audit for your infrastructure.</p>

                <div className="form-group">
                  <label>Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="security@yourcompany.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button type="submit" className="btn-primary-large block-btn">
                  Confirm Demo Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Live Audit Simulation Modal */}
      {auditModalOpen && (
        <div className="modal-backdrop" onClick={() => !isAuditing && setAuditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {!isAuditing && (
              <button className="modal-close" onClick={() => setAuditModalOpen(false)}>×</button>
            )}

            {isAuditing ? (
              <div className="audit-modal-body">
                <NewtonsCradle size={58} speed={1.0} color="#ea580c" />

                <div className="audit-status-step">{auditStep}</div>
                <div className="splash-progress-container" style={{ width: '100%', marginTop: '1.5rem' }}>
                  <div className="splash-progress-bar" style={{ width: `${auditProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="modal-success">
                <div className="success-icon">✓</div>
                <h3 style={{ color: '#09090b' }}>Surface Audit Complete</h3>
                <p style={{ color: '#71717a', margin: '0.5rem 0 1.5rem' }}>
                  NaugeSecurity verified 1,420 attack vectors across zero-day databases with 0 production disruptions.
                </p>
                <button className="btn-primary-large block-btn" onClick={() => setAuditModalOpen(false)}>
                  Close Audit Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
