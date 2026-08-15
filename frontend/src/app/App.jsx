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
