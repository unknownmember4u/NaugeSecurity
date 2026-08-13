import React, { useRef, useEffect, useState } from 'react';
import bgVideo from '../assets/images/bg.mp4';
import '../styles/background.css';

export function App() {
  const videoRef = useRef(null);
  const [activeTab, setActiveTab] = useState('engine');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);
  const [pageRevealed, setPageRevealed] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Autoplay background video
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented by browser:', err);
      });
    }

    // Splash screen progress simulation
    const interval = setInterval(() => {
      setSplashProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            setTimeout(() => setPageRevealed(true), 80);
          }, 350);
          return 100;
        }
        const diff = Math.floor(Math.random() * 18) + 12;
        return Math.min(prev + diff, 100);
      });
    }, 110);

    return () => clearInterval(interval);
  }, []);

  // Track scroll position for dynamic blur effect
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

  // Calculate dynamic scroll blur & fade metrics (0 to 1 progress over 600px scroll range)
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

  // Main enterprise page sheet dynamic styles (Transitions from BLUR -> CLEAR as user scrolls)
  const sheetBlur = (1 - scrollProgress) * 18; // 18px blur at top -> 0px clear when scrolled
  const sheetOpacity = Math.min(0.35 + scrollProgress * 0.65, 1); // 0.35 opacity -> 1.0 full opacity
  const sheetScale = 0.98 + scrollProgress * 0.02; // 0.98 -> 1.0 focus scale

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setEmailSubmitted(true);
      setTimeout(() => {
        setEmailSubmitted(false);
        setDemoModalOpen(false);
        setEmail('');
      }, 2500);
    }
  };

  return (
    <>
      {/* Loading Splash Screen */}
      {loading && (
        <div className={`splash-screen ${splashProgress === 100 ? 'splash-exit' : ''}`}>
          <div className="splash-content">

            <div className="splash-progress-container">
              <div className="splash-progress-bar" style={{ width: `${splashProgress}%` }} />
            </div>
            <div className="splash-percentage">{splashProgress}%</div>
          </div>
        </div>
      )}

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
            filter: `blur(${sheetBlur}px)`,
            opacity: sheetOpacity,
            transform: `scale(${sheetScale})`,
          }}
        >

          {/* Enterprise Header / Sticky Navigation Bar */}
          <header className="ent-navbar">
            <div className="ent-nav-container">
              <div className="ent-brand">
                <span className="ent-logo-text">NaugeSecurity</span>
                <span className="ent-badge">ENTERPRISE</span>
              </div>

              <nav className="ent-nav-links">
                <a href="#platform" className="ent-link">Platform</a>
                <a href="#features" className="ent-link">Capabilities</a>
                <a href="#architecture" className="ent-link">Architecture</a>
                <a href="#compliance" className="ent-link">Compliance</a>
                <a href="#pricing" className="ent-link">Enterprise</a>
              </nav>

              <div className="ent-nav-actions">
                <button className="btn-secondary-light" onClick={() => setDemoModalOpen(true)}>
                  Sign In
                </button>
                <button className="btn-primary-dark" onClick={() => setDemoModalOpen(true)}>
                  Request Demo
                </button>
              </div>
            </div>
          </header>

          {/* Enterprise Hero Banner */}
          <div className="ent-hero-container" id="platform">
            <div className="ent-pill-tag">
              <span className="pulse-dot"></span>
              SOC 2 Type II & ISO 27001 Certified Autonomous Security Engine
            </div>

            <h2 className="ent-main-heading">
              Continuous Threat Exposure Management Built for Enterprise Scale
            </h2>

            <p className="ent-main-subtext">
              Replace legacy point-in-time penetration testing with autonomous AI attack surface simulation, real-time zero-day exploit verification, and instant compliance evidence generation across multi-cloud and on-premise infrastructure.
            </p>

            <div className="ent-cta-group">
              <button className="btn-primary-large" onClick={() => setDemoModalOpen(true)}>
                Schedule Live Enterprise Demo →
              </button>
              <a href="#architecture" className="btn-outline-large">
                Explore Architecture Specs
              </a>
            </div>

            {/* Enterprise Key Stats Row */}
            <div className="ent-stats-grid">
              <div className="stat-card">
                <div className="stat-value">99.98%</div>
                <div className="stat-label">Signal Precision</div>
                <div className="stat-desc">Zero false positives via isolated sandbox execution</div>
              </div>

              <div className="stat-card">
                <div className="stat-value">&lt; 15 min</div>
                <div className="stat-label">Mean Time to Validate</div>
                <div className="stat-desc">From new CVE disclosure to verified impact proof</div>
              </div>

              <div className="stat-card">
                <div className="stat-value">10M+</div>
                <div className="stat-label">Daily Vector Simulations</div>
                <div className="stat-desc">Continuous multi-cloud perimeter scanning</div>
              </div>

              <div className="stat-card">
                <div className="stat-value">0</div>
                <div className="stat-label">Production Impact</div>
                <div className="stat-desc">Non-disruptive, safe exploit payload testing</div>
              </div>
            </div>
          </div>

          {/* Compliance Logos Bar */}
          <div className="ent-compliance-bar" id="compliance">
            <div className="compliance-label">TRUSTED SECURITY & COMPLIANCE FRAMEWORKS</div>
            <div className="compliance-badges">
              <div className="badge-item">
                <svg viewBox="0 0 24 24" className="badge-icon" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <span>SOC 2 Type II</span>
              </div>
              <div className="badge-item">
                <svg viewBox="0 0 24 24" className="badge-icon" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                <span>ISO 27001</span>
              </div>
              <div className="badge-item">
                <svg viewBox="0 0 24 24" className="badge-icon" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <span>GDPR Verified</span>
              </div>
              <div className="badge-item">
                <svg viewBox="0 0 24 24" className="badge-icon" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <span>HIPAA Compliant</span>
              </div>
              <div className="badge-item">
                <svg viewBox="0 0 24 24" className="badge-icon" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                <span>PCI-DSS v4.0</span>
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
                  onClick={() => setActiveTab('engine')}
                >
                  <span className="tab-number">01</span> Autonomous Engine
                </button>
                <button
                  className={`arch-tab-btn ${activeTab === 'sandbox' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sandbox')}
                >
                  <span className="tab-number">02</span> Payload Sandbox
                </button>
                <button
                  className={`arch-tab-btn ${activeTab === 'governance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('governance')}
                >
                  <span className="tab-number">03</span> Data Governance
                </button>
              </div>

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
        <div className="modal-backdrop" onClick={() => setDemoModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDemoModalOpen(false)}>×</button>

            {emailSubmitted ? (
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
    </>
  );
}

export default App;
