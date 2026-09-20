import React, { useState, useEffect, useRef } from 'react';

export const LandingScreen = ({
  isActive,
  onEnterProtocol,
  onLoginTeam,
  soundOn,
  onToggleSound,
}) => {
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'login'
  const [teamCallsign, setTeamCallsign] = useState('');
  const [teamPasscode, setTeamPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Cinematic opening sequence stages: 0 to 5
  // 0: Black screen (0.0s)
  // 1: Green sparks/particles (0.5s)
  // 2: Image fade & subtle zoom (1.0s)
  // 3: Light sweep & character visible (2.0s)
  // 4: AIDEX'26 title & subtitle (3.0s)
  // 5: Form, description, CTA ready (4.0s)
  const [introStage, setIntroStage] = useState(0);

  // Mouse Parallax offset
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Live Leaderboard data for preview section
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  // Sector hover state
  const [hoveredSector, setHoveredSector] = useState(null);

  // Canvas particle ref
  const canvasRef = useRef(null);

  // Trigger cinematic opening timeline
  useEffect(() => {
    if (!isActive) return;

    const t1 = setTimeout(() => setIntroStage(1), 500);
    const t2 = setTimeout(() => setIntroStage(2), 1000);
    const t3 = setTimeout(() => setIntroStage(3), 2000);
    const t4 = setTimeout(() => setIntroStage(4), 3000);
    const t5 = setTimeout(() => setIntroStage(5), 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isActive]);

  // Fetch live leaderboard for scroll section
  useEffect(() => {
    if (!isActive) return;
    const fetchTopScores = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (data && data.leaderboard) {
          setLeaderboardData(data.leaderboard.slice(0, 5));
        }
      } catch (err) {
        console.warn('Leaderboard preview fetch failed:', err);
      } finally {
        setLoadingLeaderboard(false);
      }
    };
    fetchTopScores();
  }, [isActive]);

  // Mouse move parallax handler (throttled & disabled on touch)
  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return; // Disable on mobile
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const offsetX = (clientX - centerX) / centerX; // -1 to 1
    const offsetY = (clientY - centerY) / centerY; // -1 to 1

    setMouseOffset({
      x: offsetX * 10, // ±10px
      y: offsetY * 6   // ±6px
    });
  };

  // High-performance particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle count: 35 for desktop, 15 for mobile
    const count = window.innerWidth < 768 ? 15 : 35;
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.6 - 0.2, // Drifting upward like embers/dust
        opacity: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        color: Math.random() > 0.4 ? 'rgba(0, 255, 102, ' : (Math.random() > 0.5 ? 'rgba(0, 229, 255, ' : 'rgba(200, 220, 210, ')
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around screen
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
        const currentOpacity = Math.max(0.1, Math.min(0.85, p.opacity));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentOpacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 255, 102, 0.4)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isActive) return null;

  // Handle Team Login Submit & Cinematic Transition
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!teamCallsign.trim()) {
      setErrorMessage('Please enter your team name.');
      return;
    }
    if (!teamPasscode.trim()) {
      setErrorMessage('Please enter your team password.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const loginFn = onLoginTeam || onEnterProtocol;
    const result = await loginFn(teamCallsign.trim(), teamPasscode.trim());

    if (result && !result.success) {
      setErrorMessage(result.message || 'Authentication failed. Please check team name and password.');
      setIsSubmitting(false);
    } else if (result && result.success) {
      // Trigger cinematic breach transition
      setIsTransitioning(true);
    } else {
      setIsSubmitting(false);
    }
  };

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('input-team-name')?.focus();
  };

  const sectors = [
    { id: '01', title: 'SECTOR 01', subtitle: 'CPU Scheduling Pipeline', category: 'Operating Systems', status: 'CLASSIFIED' },
    { id: '02', title: 'SECTOR 02', subtitle: 'Relational Schema Normalization', category: 'Databases', status: 'CLASSIFIED' },
    { id: '03', title: 'SECTOR 03', subtitle: 'Weighted Traversal Matrix', category: 'Algorithms', status: 'CLASSIFIED' },
    { id: '04', title: 'SECTOR 04', subtitle: 'Sequential Data Containers', category: 'Data Structures', status: 'CLASSIFIED' },
    { id: '05', title: 'SECTOR 05', subtitle: 'Rule Engine Decision Matrix', category: 'Logic & AI', status: 'CLASSIFIED' },
    { id: '06', title: 'SECTOR 06', subtitle: 'Dynamic Ordered Containers', category: 'Data Structures', status: 'CLASSIFIED' },
    { id: '07', title: 'SECTOR 07', subtitle: 'Concurrency Locking Protocols', category: 'Operating Systems', status: 'CLASSIFIED' },
    { id: '08', title: 'SECTOR 08', subtitle: 'Deterministic Finite Automata', category: 'Theory of Computation', status: 'CLASSIFIED' },
    { id: '09', title: 'SECTOR 09', subtitle: 'Bitwise Cryptographic Masking', category: 'Computer Systems', status: 'CLASSIFIED' },
    { id: '10', title: 'SECTOR 10', subtitle: 'Asymptotic Complexity Audit', category: 'Algorithms', status: 'CORE FINALE' }
  ];

  return (
    <div className="landing-root" onMouseMove={handleMouseMove}>
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. CINEMATIC FULL VIEWPORT HERO SECTION (100vw × 100vh)             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="hero-viewport" id="hero-section">
        {/* Background Image Layer with Parallax */}
        <div
          className={`hero-bg-layer ${introStage >= 2 ? 'hero-bg-layer--visible' : ''}`}
          style={{
            backgroundImage: "url('/assets/images/doom-villain.png')",
            transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0) scale(${introStage >= 2 ? 1 : 1.06})`,
          }}
        />

        {/* Doom Atmospheric Layers */}
        <div className="hero-layer hero-layer--color-grade" />
        <div className="hero-layer hero-layer--vignette" />
        <div className="hero-layer hero-layer--scanlines" />
        <div className="hero-layer hero-layer--film-grain" />

        {/* Pulsing Green Ambient Bloom */}
        <div className="hero-layer hero-layer--radial-bloom" />

        {/* Light Sweep Animation at 2.0s */}
        <div className={`hero-light-sweep ${introStage >= 3 ? 'hero-light-sweep--animate' : ''}`} />

        {/* Particle Canvas */}
        <canvas ref={canvasRef} className="hero-particles-canvas" />

        {/* Top Header / Brand Bar */}
        <header className={`hero-header ${introStage >= 4 ? 'hero-header--visible' : ''}`}>
          <div className="hero-brand">
            <span className="hero-brand__icon">⚡</span>
            <span className="hero-brand__text">AIDEX'26 TECHNICAL ESCAPE ROOM // LATVERIA-NET</span>
          </div>

          <div className="hero-header-actions">
            <button
              id="btn-sound-toggle-hero"
              className="hero-header-btn hero-header-btn--sound"
              aria-pressed={soundOn}
              title="Toggle ambient audio"
              onClick={onToggleSound}
            >
              <span className="hero-header-btn__icon">{soundOn ? '🔊' : '🔇'}</span>
              <span className="hero-header-btn__label">{soundOn ? 'SOUND ON' : 'SOUND OFF'}</span>
            </button>
          </div>
        </header>

        {/* Central Hero Content */}
        <div
          className="hero-content-container"
          style={{
            transform: `translate3d(${-mouseOffset.x * 0.2}px, ${-mouseOffset.y * 0.2}px, 0)`
          }}
        >
          {/* Incident Tag */}
          <div className={`hero-incident-chip ${introStage >= 3 ? 'hero-incident-chip--visible' : ''}`}>
            <span className="hero-incident-chip__dot" />
            <span>INCIDENT REPORT // 26-001 · CLASSIFIED ACCESS</span>
          </div>

          {/* Main Titles */}
          <h1 className={`hero-main-title ${introStage >= 4 ? 'hero-main-title--visible' : ''}`}>
            AIDEX'26
          </h1>

          <div className={`hero-subtitle ${introStage >= 4 ? 'hero-subtitle--visible' : ''}`}>
            THE DOOMSDAY PROTOCOL
          </div>

          <p className={`hero-tagline ${introStage >= 5 ? 'hero-tagline--visible' : ''}`}>
            Five rooms. Five challenges. One way out.
          </p>

          {/* Operative Login Form - Access Needed */}
          <div className={`hero-form-card ${introStage >= 5 ? 'hero-form-card--visible' : ''}`}>
            {/* Header: Access Needed */}
            <div className="hero-card-header" style={{ marginBottom: '14px', borderBottom: '1px solid rgba(0, 255, 102, 0.2)', paddingBottom: '10px', textAlign: 'left', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00ff66', fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <span>🔒</span>
                <span>ACCESS NEEDED</span>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#9bb5a7', margin: '6px 0 0', lineHeight: '1.4' }}>
                Enter the team name and password created by your event administrator to launch your mission.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div className="hero-form-grid">
                <div className="hero-input-group">
                  <label className="hero-input-label">
                    TEAM NAME
                  </label>
                  <input
                    type="text"
                    id="input-team-name"
                    placeholder="Enter team name..."
                    value={teamCallsign}
                    onChange={(e) => {
                      setTeamCallsign(e.target.value);
                      setErrorMessage('');
                    }}
                    className="hero-input"
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                </div>

                <div className="hero-input-group">
                  <label className="hero-input-label">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    id="input-team-passcode"
                    placeholder="Enter team password..."
                    value={teamPasscode}
                    onChange={(e) => {
                      setTeamPasscode(e.target.value);
                      setErrorMessage('');
                    }}
                    className="hero-input"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="hero-error-banner">
                  <span className="hero-error-banner__icon">⚠</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="hero-actions-row">
                <button
                  type="submit"
                  id="btn-enter-protocol"
                  className="btn-enter-protocol"
                  disabled={isSubmitting}
                >
                  <span className="btn-enter-protocol__glow" />
                  <span className="btn-enter-protocol__text">
                    {isSubmitting
                      ? 'AUTHENTICATING CLEARANCE...'
                      : '⚡ ACCESS MISSION'}
                  </span>
                  <span className="btn-enter-protocol__arrow">→</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`hero-scroll-hint ${introStage >= 5 ? 'hero-scroll-hint--visible' : ''}`} onClick={() => {
          document.getElementById('incident-section')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          <span className="hero-scroll-hint__text">CLASSIFIED MISSION BRIEFING</span>
          <span className="hero-scroll-hint__arrow">▾</span>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. CLASSIFIED INCIDENT REPORT SECTION                               */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="landing-section landing-section--incident" id="incident-section">
        <div className="landing-container">
          <div className="incident-dossier-card">
            <div className="incident-dossier-card__header">
              <div className="incident-dossier-card__stamp">CLASSIFIED // TOP SECRET</div>
              <div className="incident-dossier-card__meta">
                <span>SYSTEM: LATVERIA-NET</span>
                <span>INCIDENT ID: DOOM-26</span>
                <span>STATUS: ACTIVE BREACH</span>
                <span>THREAT LEVEL: OMEGA</span>
              </div>
            </div>

            <div className="incident-dossier-card__body">
              <div className="incident-terminal-line incident-terminal-line--lead">
                <span className="terminal-prefix">&gt;</span>
                <span className="terminal-text">Something has breached the system.</span>
              </div>
              <div className="incident-terminal-line">
                <span className="terminal-prefix">&gt;</span>
                <span className="terminal-text">Ten encrypted chambers stand between the operative and system recovery.</span>
              </div>
              <div className="incident-terminal-line">
                <span className="terminal-prefix">&gt;</span>
                <span className="terminal-text">Every sector contains an authoritative computer science trial.</span>
              </div>
              <div className="incident-terminal-line">
                <span className="terminal-prefix">&gt;</span>
                <span className="terminal-text">Failure closes the access corridor permanently.</span>
              </div>
              <div className="incident-terminal-line incident-terminal-line--highlight">
                <span className="terminal-prefix">&gt;</span>
                <span className="terminal-text">Find the breach. Break the protocol. Unmask the anomaly.</span>
                <span className="terminal-cursor">█</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. THE PROTOCOL & TWO-SESSION COMPETITION RULES                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="landing-section landing-section--protocol">
        <div className="landing-container">
          <div className="section-head">
            <span className="section-eyebrow">OPERATIONAL BLUEPRINT</span>
            <h2 className="section-title">THE TWO-SESSION BATTLEWORLD PROTOCOL</h2>
            <p className="section-desc">
              A synchronized, admin-governed competition architecture engineered for 50+ concurrent operatives.
            </p>
          </div>

          <div className="protocol-grid">
            <div className="protocol-card">
              <div className="protocol-card__badge">SESSION 01</div>
              <h3 className="protocol-card__title">AVENGERS TOWER CORE</h3>
              <div className="protocol-card__chambers">CHAMBERS 01 — 05</div>
              <p className="protocol-card__text">
                Operatives breach the perimeter. Unlocks only when the Game Master authorizes the signal. Individual countdown timers begin immediately.
              </p>
              <ul className="protocol-card__list">
                <li>✓ Round-robin scheduling & dispatch audits</li>
                <li>✓ Relational schema normalization</li>
                <li>✓ Dijkstra weighted reactor traversal</li>
                <li>✓ Stack & queue sequential container parsing</li>
              </ul>
            </div>

            <div className="protocol-card protocol-card--s2">
              <div className="protocol-card__badge protocol-card__badge--s2">SESSION 02</div>
              <h3 className="protocol-card__title">INNER SANCTUM PROTOCOLS</h3>
              <div className="protocol-card__chambers">CHAMBERS 06 — 10</div>
              <p className="protocol-card__text">
                Locked behind Doctor Doom's secondary barrier until authorized. Remaining 5 assigned questions reveal dynamically.
              </p>
              <ul className="protocol-card__list">
                <li>✓ Coffman deadlock circular-wait mitigation</li>
                <li>✓ Deterministic finite automata decoding</li>
                <li>✓ Bitwise masking & permission registers</li>
                <li>✓ Asymptotic complexity performance audit</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. SECTORS / CHAMBERS SHOWCASE                                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="landing-section landing-section--sectors">
        <div className="landing-container">
          <div className="section-head">
            <span className="section-eyebrow">SURVEILLANCE TELEMETRY</span>
            <h2 className="section-title">10 CLASSIFIED SYSTEM SECTORS</h2>
            <p className="section-desc">
              Hover over any sector to initiate optical telemetry scan. Questions are uniquely randomized per team from our server vault.
            </p>
          </div>

          <div className="sectors-grid">
            {sectors.map((sec) => {
              const isHovered = hoveredSector === sec.id;
              return (
                <div
                  key={sec.id}
                  className={`sector-card ${isHovered ? 'sector-card--active' : ''}`}
                  onMouseEnter={() => setHoveredSector(sec.id)}
                  onMouseLeave={() => setHoveredSector(null)}
                >
                  <div className="sector-card__scan-beam" />
                  <div className="sector-card__top">
                    <span className="sector-card__id">SECTOR {sec.id}</span>
                    <span className="sector-card__status">{sec.status}</span>
                  </div>
                  <h4 className="sector-card__title">{sec.title}</h4>
                  <div className="sector-card__sub">{sec.subtitle}</div>
                  <div className="sector-card__footer">
                    <span className="sector-card__cat">{sec.category}</span>
                    <span className="sector-card__lock">{isHovered ? '⚡ ACCESS LOCKED' : '🔒 ENCRYPTED'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 5. LIVE LEADERBOARD PREVIEW SECTION                                 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="landing-section landing-section--leaderboard">
        <div className="landing-container">
          <div className="section-head">
            <span className="section-eyebrow">SATELLITE TELEMETRY</span>
            <h2 className="section-title">ACTIVE SATELLITE LEADERBOARD</h2>
            <p className="section-desc">
              Real-time authoritative ranking based on Total Score (Highest) → Total Server Time (Lowest).
            </p>
          </div>

          <div className="landing-leaderboard-card">
            {loadingLeaderboard ? (
              <div className="landing-leaderboard-empty">
                <span className="waiting-card__spinner">▌</span> RETRIEVING TELEMETRY DATA...
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="landing-leaderboard-empty">
                NO REGISTERED OPERATIVE SCORES YET. THE BATTLEWORLD PROTOCOL STANDS READY.
              </div>
            ) : (
              <div className="leaderboard-table-wrap">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>RANK</th>
                      <th>TEAM CALLSIGN</th>
                      <th>SESSION 1</th>
                      <th>SESSION 2</th>
                      <th>TOTAL SCORE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((row) => (
                      <tr key={row.participantId} className="leaderboard-row">
                        <td className="leaderboard-cell--rank">
                          {row.rank === 1 ? '🥇 01' : row.rank === 2 ? '🥈 02' : row.rank === 3 ? '🥉 03' : `#${String(row.rank).padStart(2, '0')}`}
                        </td>
                        <td className="leaderboard-cell--team">{row.teamName}</td>
                        <td>{row.session1Score} / 5</td>
                        <td>{row.session2Score} / 5</td>
                        <td className="leaderboard-cell--total-score">{row.totalScore} / 10</td>
                        <td>
                          <span className={`leaderboard-status-tag ${row.isComplete ? 'leaderboard-status-tag--done' : 'leaderboard-status-tag--progress'}`}>
                            {row.isComplete ? '● COMPLETE' : '● IN PROGRESS'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 6. FINAL TERMINAL CALL TO ACTION SECTION                            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="landing-section landing-section--cta">
        <div className="landing-container" style={{ textAlign: 'center' }}>
          <div className="final-cta-card">
            <span className="final-cta-card__glyph">👑</span>
            <h2 className="final-cta-card__title">READY TO BREACH BATTLEWORLD?</h2>
            <p className="final-cta-card__desc">
              Your randomized 10-chamber protocol awaits. Enter your operative callsign and prepare for intrusion.
            </p>
            <button className="btn-enter-protocol btn-enter-protocol--lg" onClick={scrollToHero}>
              <span className="btn-enter-protocol__text">⚡ INITIATE PROTOCOL CLEARANCE</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* CINEMATIC BREACH TRANSITION OVERLAY                                 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {isTransitioning && (
        <div className="cinematic-breach-transition">
          <div className="cinematic-breach-transition__scanline" />
          <div className="cinematic-breach-transition__content">
            <div className="cinematic-breach-transition__spinner">⚡</div>
            <div className="cinematic-breach-transition__title">ACCESSING DOOM PROTOCOL...</div>
            <div className="cinematic-breach-transition__sub">SYNCHRONIZING SERVER TIME & RANDOMIZING SECTORS</div>
          </div>
        </div>
      )}
    </div>
  );
};
