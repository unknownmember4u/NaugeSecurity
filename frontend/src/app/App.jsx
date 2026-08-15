import React, { useRef, useEffect, useState } from 'react';
import bgVideo from '../assets/images/bg.mp4';
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
  const [loading, setLoading] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);
  const [pageRevealed, setPageRevealed] = useState(false);
  const [scrollY, setScrollY] = useState(0);

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
    let videoLoaded = false;
    let fontsLoaded = false;
    let windowLoaded = false;
    let targetProgress = 15;

    const setTarget = (val) => {
      if (val > targetProgress) {
        targetProgress = Math.min(Math.round(val), 100);
      }
    };

    // Calculate real-time network progress using Performance Resource Timing + Video Buffer
    const calculateNetworkProgress = () => {
      let networkPercent = 0;
      if (typeof window !== 'undefined' && window.performance) {
        const resources = performance.getEntriesByType('resource');
        if (resources && resources.length > 0) {
          networkPercent = Math.min((resources.length / (resources.length + 3)) * 60, 60);
        }
      }

      const video = videoRef.current;
      let videoPercent = 0;
      if (video && video.duration > 0 && video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        videoPercent = Math.min((bufferedEnd / video.duration) * 30, 30);
      }

      setTarget(15 + networkPercent + videoPercent);
    };

    // Ticker smoothly advances splashProgress to real-time network targetProgress
    const ticker = setInterval(() => {
      calculateNetworkProgress();

      setSplashProgress((prev) => {
        if (prev < targetProgress) {
          const step = Math.max(Math.ceil((targetProgress - prev) * 0.18), 1);
          const next = Math.min(prev + step, 100);
          if (next >= 100) {
            clearInterval(ticker);
            setPageRevealed(true);
            setTimeout(() => setLoading(false), 400);
          }
          return next;
        }
        return prev;
      });
    }, 35);

    const video = videoRef.current;

    const handleVideoProgress = () => {
      calculateNetworkProgress();
    };

    const handleVideoCanPlay = () => {
      videoLoaded = true;
      setTarget(85);
      checkAllLoaded();
    };

    if (video) {
      video.defaultMuted = true;
      video.muted = true;

      if (video.readyState >= 3) {
        videoLoaded = true;
        setTarget(85);
      } else {
        video.addEventListener('progress', handleVideoProgress);
        video.addEventListener('canplaythrough', handleVideoCanPlay);
        video.addEventListener('canplay', handleVideoCanPlay);
        video.load();
      }

      video.play().catch((err) => {
        console.warn('Autoplay prevented by browser:', err);
      });
    }

    // Monitor Font Asset Loading
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          fontsLoaded = true;
          setTarget(90);
          checkAllLoaded();
        })
        .catch(() => {
          fontsLoaded = true;
          checkAllLoaded();
        });
    } else {
      fontsLoaded = true;
    }

    // Monitor Window Load Event
    if (document.readyState === 'complete') {
      windowLoaded = true;
      setTarget(95);
      checkAllLoaded();
    } else {
      const handleWindowLoad = () => {
        windowLoaded = true;
        setTarget(95);
        checkAllLoaded();
      };
      window.addEventListener('load', handleWindowLoad);
    }

    function checkAllLoaded() {
      if ((videoLoaded || (video && video.readyState >= 2)) && windowLoaded) {
        setTarget(100);
      }
    }

    // Fallback safety timer
    const fallbackTimer = setTimeout(() => {
      setTarget(100);
    }, 4500);

    return () => {
      clearInterval(ticker);
      clearTimeout(fallbackTimer);
      if (video) {
        video.removeEventListener('progress', handleVideoProgress);
        video.removeEventListener('canplaythrough', handleVideoCanPlay);
        video.removeEventListener('canplay', handleVideoCanPlay);
      }
    };
  }, []);

  // Track scroll position for dynamic scroll effects
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY || 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate dynamic scroll metrics over 600px scroll range
  const maxScrollThreshold = typeof window !== 'undefined' ? Math.max(window.innerHeight * 0.75, 450) : 600;
  const scrollProgress = Math.min(Math.max(scrollY / maxScrollThreshold, 0), 1);

  // Hero section dynamic styles
  const heroBlur = scrollProgress * 22; // 0px to 22px blur
  const heroOpacity = Math.max(1 - scrollProgress * 1.35, 0); // 1.0 to 0.0
  const heroScale = 1 - scrollProgress * 0.08; // 1.0 to 0.92
  const heroTranslateY = scrollProgress * -40; // 0px to -40px

  // Background video dynamic styles
  const bgBlur = scrollProgress * 26; // 0px to 26px blur on video
  const bgOpacity = Math.max(1 - scrollProgress * 0.55, 0.45); // 1.0 to 0.45

  // Main enterprise page sheet dynamic styles (No blur effect on this page sheet)
  const sheetBlur = 0; // Removed blur effect from this page sheet
  const sheetOpacity = Math.min(0.35 + scrollProgress * 0.65, 1); // 0.35 opacity -> 1.0 full opacity
  const sheetScale = 0.98 + scrollProgress * 0.02; // 0.98 -> 1.0 focus scale

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
      <header className={`ent-navbar ${scrollY >= 80 ? 'navbar-visible' : ''}`}>
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
        className="bg-video-container"
        style={{
          filter: `blur(${bgBlur}px)`,
          opacity: bgOpacity,
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
        className="glass-overlay"
        style={{
          backdropFilter: `blur(${14 + scrollProgress * 16}px) saturate(120%)`,
          WebkitBackdropFilter: `blur(${14 + scrollProgress * 16}px) saturate(120%)`,
        }}
      />

      {/* Fixed Hero Title Section (Progressively blurs and fades as user scrolls down) */}
      <div
        className={`fixed-hero-container ${pageRevealed ? 'page-revealed' : ''}`}
        style={{
          filter: `blur(${heroBlur}px)`,
          opacity: heroOpacity,
          transform: `translateY(${heroTranslateY}px) scale(${heroScale})`,
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
      <div className={`scroll-content-container ${pageRevealed ? 'page-revealed' : ''}`}>

        {/* Invisible Spacer allowing scrolling past the fixed hero */}
        <div className="hero-scroll-spacer" />

        {/* Enterprise Page Sheet Section (Swipes up & transitions from BLUR -> CLEAR as user scrolls) */}
        <section
          className="enterprise-page-sheet animate-sheet"
          id="enterprise-platform"
          style={{
            filter: 'none',
            opacity: sheetOpacity,
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
                        <span className="ai-pillar-tag">Pillar 01</span>
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
                        <span className="ai-pillar-tag">Pillar 02</span>
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
                        <span className="ai-pillar-tag">Pillar 03</span>
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
                        <span className="ai-pillar-tag">Pillar 04</span>
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
                    <div className="pipeline-node-number">01</div>
                    <h4 className="pipeline-node-title">Evidence</h4>
                    <p className="pipeline-node-desc">Observed signals &amp; raw findings</p>
                  </div>

                  <div className="pipeline-flow-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>

                  <div className="pipeline-flow-node">
                    <div className="pipeline-node-number">02</div>
                    <h4 className="pipeline-node-title">Analysis</h4>
                    <p className="pipeline-node-desc">AI correlation &amp; risk modeling</p>
                  </div>

                  <div className="pipeline-flow-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>

                  <div className="pipeline-flow-node">
                    <div className="pipeline-node-number">03</div>
                    <h4 className="pipeline-node-title">Confidence</h4>
                    <p className="pipeline-node-desc">Impact scoring &amp; verification</p>
                  </div>

                  <div className="pipeline-flow-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>

                  <div className="pipeline-flow-node highlight-node">
                    <div className="pipeline-node-number">04</div>
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
                  <div className="remediation-step-item">
                    <div className="remediation-step-num">01</div>
                    <div className="remediation-step-content">
                      <div className="remediation-step-header">
                        <h4 className="remediation-step-title">Discover</h4>
                        <span className="remediation-step-badge">Stage 01</span>
                      </div>
                      <p className="remediation-step-desc">Map exposed assets &amp; detect vulnerabilities.</p>
                    </div>
                  </div>

                  <div className="remediation-flow-connector">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
                  </div>

                  <div className="remediation-step-item">
                    <div className="remediation-step-num">02</div>
                    <div className="remediation-step-content">
                      <div className="remediation-step-header">
                        <h4 className="remediation-step-title">Investigate</h4>
                        <span className="remediation-step-badge">Stage 02</span>
                      </div>
                      <p className="remediation-step-desc">AI correlates evidence and analyzes severity.</p>
                    </div>
                  </div>

                  <div className="remediation-flow-connector">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
                  </div>

                  <div className="remediation-step-item">
                    <div className="remediation-step-num">03</div>
                    <div className="remediation-step-content">
                      <div className="remediation-step-header">
                        <h4 className="remediation-step-title">Fix</h4>
                        <span className="remediation-step-badge">Stage 03</span>
                      </div>
                      <p className="remediation-step-desc">Apply structured patch &amp; code remediation guidance.</p>
                    </div>
                  </div>

                  <div className="remediation-flow-connector">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
                  </div>

                  <div className="remediation-step-item highlight-remediation">
                    <div className="remediation-step-num num-highlight">04</div>
                    <div className="remediation-step-content">
                      <div className="remediation-step-header">
                        <h4 className="remediation-step-title">Validate</h4>
                        <span className="remediation-step-badge badge-highlight">Stage 04</span>
                      </div>
                      <p className="remediation-step-desc">Re-assess target to verify complete issue resolution.</p>
                    </div>
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

          {/* Core Platform Capabilities Grid */}
          <div className="ent-section" id="features">
            <div className="section-header">
              <span className="section-eyebrow">ENTERPRISE SECURITY CAPABILITIES</span>
              <h3 className="section-title">Autonomous Threat Management Engine</h3>
              <p className="section-subtitle">
                Comprehensive security orchestration designed to discover, validate, and remediate security vulnerabilities across modern distributed architectures.
              </p>
            </div>

            <div className="capabilities-grid">

              <div className="feature-card">
                <div className="feature-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                </div>
                <h4 className="feature-title">Autonomous Surface Discovery</h4>
                <p className="feature-desc">
                  Continuously map shadow IT, exposed API endpoints, misconfigured bucket storage, and unpatched assets across AWS, Azure, GCP, and hybrid environments with zero manual agents.
                </p>
                <ul className="feature-list">
                  <li>Automatic sub-domain & shadow asset enumeration</li>
                  <li>Real-time DNS & SSL certificate monitoring</li>
                  <li>Cloud security posture management (CSPM) integration</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </div>
                <h4 className="feature-title">Sandboxed Exploit Verification</h4>
                <p className="feature-desc">
                  Safely validate vulnerabilities without risking production downtime. NaugeSecurity constructs ephemeral sandbox environments to verify exploitability and compute exact breach impact.
                </p>
                <ul className="feature-list">
                  <li>Non-destructive payload execution engine</li>
                  <li>Proof-of-concept (PoC) validation chains</li>
                  <li>Contextual business risk scoring</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                </div>
                <h4 className="feature-title">Continuous Compliance Evidence</h4>
                <p className="feature-desc">
                  Generate instant, auditor-approved compliance reports and evidence bundles for ISO 27001, SOC 2, NIST CSF, and PCI-DSS automatically.
                </p>
                <ul className="feature-list">
                  <li>One-click auditor export packages</li>
                  <li>Continuous security control validation</li>
                  <li>Executive risk scorecards & timeline tracking</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                </div>
                <h4 className="feature-title">Enterprise SIEM & SOAR Sync</h4>
                <p className="feature-desc">
                  Seamlessly push validated security telemetry into Splunk, Datadog, Microsoft Sentinel, Jira, and Slack with automated remediation playbooks.
                </p>
                <ul className="feature-list">
                  <li>Native Webhook & REST API integrations</li>
                  <li>Bi-directional Jira ticketing & SLA tracking</li>
                  <li>Automated security orchestration playbooks</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Interactive Architecture Specs Section */}
          <div className="ent-section bg-light-alt" id="architecture">
            <div className="section-header">
              <span className="section-eyebrow">ENTERPRISE TECHNICAL ARCHITECTURE</span>
              <h3 className="section-title">Built for High-Security Environments</h3>
              <p className="section-subtitle">
                Explore how NaugeSecurity ensures absolute data privacy, zero-retention architecture, and sub-minute vulnerability verification.
              </p>
            </div>

            <div className="architecture-box">
              <div className="arch-tabs">
                <button
                  className={`arch-tab-btn ${activeTab === 'engine' ? 'active' : ''}`}
                  onClick={() => handleTabClick('engine')}
                >
                  <span className="tab-number">01</span> Autonomous Engine
                </button>
                <button
                  className={`arch-tab-btn ${activeTab === 'sandbox' ? 'active' : ''}`}
                  onClick={() => handleTabClick('sandbox')}
                >
                  <span className="tab-number">02</span> Payload Sandbox
                </button>
                <button
                  className={`arch-tab-btn ${activeTab === 'governance' ? 'active' : ''}`}
                  onClick={() => handleTabClick('governance')}
                >
                  <span className="tab-number">03</span> Data Governance
                </button>
              </div>

              <div className="arch-content-container">
                {isTabLoading && (
                  <div className="arch-loading-overlay">
                    <NewtonsCradle size={48} speed={1.0} color="#f97316" />
                    <span className="arch-loading-text">Loading Spec Telemetry...</span>
                  </div>
                )}
                <div className="arch-content">
                  {activeTab === 'engine' && (
                    <div className="arch-panel">
                      <div className="arch-details">
                        <h4>Distributed Autonomous Attack Graph</h4>
                        <p>
                          Our cloud-native attack engine continuously builds a real-time graph of your enterprise assets, trust boundaries, and credential flows. It evaluates attack paths across external endpoints, API gateways, and Kubernetes nodes.
                        </p>
                        <div className="arch-specs-list">
                          <div className="spec-item">
                            <strong>Scan Rate:</strong> 50,000 requests/sec distributed worker pool
                          </div>
                          <div className="spec-item">
                            <strong>Protocol Support:</strong> HTTP/2, HTTP/3, gRPC, WebSocket, GraphQL, TCP/UDP
                          </div>
                          <div className="spec-item">
                            <strong>Zero-Day Intel:</strong> Daily sync with CVE databases & private exploit research
                          </div>
                        </div>
                      </div>
                      <div className="arch-code-preview">
                        <div className="code-header">
                          <span className="code-dot red"></span>
                          <span className="code-dot yellow"></span>
                          <span className="code-dot green"></span>
                          <span className="code-filename">naugesec-engine-config.json</span>
                        </div>
                        <pre className="code-body">
                          {`{
  "tenant_id": "ent_nauge_88201",
  "isolation_level": "DEDICATED_TENANT",
  "attack_vector_engine": {
    "continuous_scan": true,
    "max_concurrent_workers": 128,
    "safe_payload_sanitization": "STRICT_ENFORCED",
    "zero_day_intel_feed": "REALTIME"
  },
  "siem_export": {
    "target": "DATADOG_HEC",
    "encrypted_transit": "TLS_1_3"
  }
}`}
                        </pre>
                      </div>
                    </div>
                  )}

                  {activeTab === 'sandbox' && (
                    <div className="arch-panel">
                      <div className="arch-details">
                        <h4>Ephemeral Payload Isolation Sandbox</h4>
                        <p>
                          Exploit payloads are never run against raw production databases. NaugeSecurity spins up ephemeral Docker micro-containers that mirror your response signatures to verify vulnerability exploitability safely.
                        </p>
                        <div className="arch-specs-list">
                          <div className="spec-item">
                            <strong>Isolation Mode:</strong> gVisor microVM container boundaries
                          </div>
                          <div className="spec-item">
                            <strong>Production Safety:</strong> Read-only signature inspection with state rollback
                          </div>
                          <div className="spec-item">
                            <strong>Verification SLA:</strong> Under 30 seconds per attack path hypothesis
                          </div>
                        </div>
                      </div>
                      <div className="arch-code-preview">
                        <div className="code-header">
                          <span className="code-dot red"></span>
                          <span className="code-dot yellow"></span>
                          <span className="code-dot green"></span>
                          <span className="code-filename">sandbox-execution-log.sys</span>
                        </div>
                        <pre className="code-body">
                          {`[INFO] Spawning isolated gVisor container sandbox-7749...
[VERIFY] Injecting sanitized PoC payload for CVE-2026-1184...
[RESULT] Vulnerability CONFIRMED: Remote Code Execution vector
[SCORE] CVSS 9.8 (CRITICAL) - Zero production side-effects.
[ACTION] Generated remediation patch & forwarded to Jira #SEC-492`}
                        </pre>
                      </div>
                    </div>
                  )}

                  {activeTab === 'governance' && (
                    <div className="arch-panel">
                      <div className="arch-details">
                        <h4>Enterprise Data Sovereignty & Encryption</h4>
                        <p>
                          All scan telemetry, architectural maps, and vulnerability reports are encrypted using customer-managed keys (KMS). NaugeSecurity enforces strict zero-retention policies for payload data.
                        </p>
                        <div className="arch-specs-list">
                          <div className="spec-item">
                            <strong>Encryption:</strong> AES-256-GCM at rest, TLS 1.3 in transit
                          </div>
                          <div className="spec-item">
                            <strong>Key Management:</strong> AWS KMS / Azure Key Vault / HashiCorp Vault BYOK
                          </div>
                          <div className="spec-item">
                            <strong>Data Residency:</strong> US, EU, UK, or APAC dedicated region isolation
                          </div>
                        </div>
                      </div>
                      <div className="arch-code-preview">
                        <div className="code-header">
                          <span className="code-dot red"></span>
                          <span className="code-dot yellow"></span>
                          <span className="code-dot green"></span>
                          <span className="code-filename">data-sovereignty-policy.yaml</span>
                        </div>
                        <pre className="code-body">
                          {`version: "2.4"
security_policy:
  data_retention_days: 0
  byok_kms_key_arn: "arn:aws:kms:us-east-1:772910:key/sec-nauge-99"
  compliance_regimes:
    - SOC2_TYPE_II
    - ISO_27001_2022
    - GDPR_ARTICLE_32
  audit_logging:
    immutable_log_stream: true`}
                        </pre>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Banner */}
          <div className="ent-cta-banner-container" id="pricing">
            <div className="ent-cta-card">
              <div className="cta-content">
                <h3 className="cta-title">Elevate Your Enterprise Security Posture Today</h3>
                <p className="cta-text">
                  Schedule a 30-minute technical session with our principal security architects and receive a complimentary attack surface assessment.
                </p>
              </div>
              <div className="cta-action">
                <button className="btn-cta-light" onClick={() => setDemoModalOpen(true)}>
                  Request Enterprise Demo
                </button>
              </div>
            </div>
          </div>

          {/* Enterprise Footer */}
          <footer className="ent-footer">
            <div className="footer-container">
              <div className="footer-col main-col">
                <div className="footer-brand">
                  <span className="footer-logo">NaugeSecurity</span>
                </div>
                <p className="footer-desc">
                  Autonomous attack surface management & continuous vulnerability validation engine for global enterprises.
                </p>
                <div className="system-status">
                  <span className="status-dot"></span>
                  <span>All Systems Operational (100% Uptime)</span>
                </div>
              </div>

              <div className="footer-col">
                <h5>Platform</h5>
                <a href="#features">Attack Surface Discovery</a>
                <a href="#features">Exploit Sandbox</a>
                <a href="#architecture">Architecture Specs</a>
                <a href="#compliance">Compliance Center</a>
              </div>

              <div className="footer-col">
                <h5>Solutions</h5>
                <a href="#platform">Multi-Cloud Security</a>
                <a href="#platform">API Vulnerability Management</a>
                <a href="#platform">Shadow IT Enumeration</a>
                <a href="#platform">CISO Executive Reporting</a>
              </div>

              <div className="footer-col">
                <h5>Enterprise</h5>
                <a href="#compliance">SOC 2 Type II Report</a>
                <a href="#compliance">ISO 27001 Certification</a>
                <a href="#architecture">BYOK KMS Encryption</a>
                <a href="#pricing">Contact Sales</a>
              </div>
            </div>

            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} NaugeSecurity Inc. All rights reserved.</p>
              <div className="footer-legal">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#security">Security Statement</a>
              </div>
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
