import React from 'react';

export const TopNav = ({
  timerString,
  isWarning,
  sessionLabel,
  isPaused,
  isExpired,
  progressPct,
  evidenceCount,
  onOpenEvidence,
  onOpenHint,
  soundOn,
  onToggleSound,
  onOpenLeaderboard,
  onLogout,
  teamName,
}) => {
  return (
    <header className="top-nav">
      <div className="top-nav__brand">
        <span className="brand-mark__glyph">&#9670;</span>
        <span>DOOM-OS // INTRUSION TRACE</span>
        {teamName && (
          <span style={{ marginLeft: '10px', background: 'rgba(0,255,102,0.12)', border: '1px solid var(--doom-green)', padding: '2px 8px', borderRadius: '3px', color: 'var(--doom-green-bright)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
            CALLSIGN: {teamName}
          </span>
        )}
      </div>

      <div className={`top-nav__timer ${isWarning ? 'is-warning' : ''}`} id="topnav-timer">
        {sessionLabel && (
          <span style={{
            fontSize: '0.68rem',
            letterSpacing: '0.12em',
            color: isWarning ? 'var(--doom-red-bright)' : 'var(--doom-green-bright)',
            marginRight: '8px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 'bold',
            opacity: 0.9
          }}>
            {sessionLabel}:
          </span>
        )}
        <span className="top-nav__timer-value" id="game-countdown">
          {isPaused ? `[PAUSED] ${timerString}` : (isExpired ? '00:00 [LOCKED]' : timerString)}
        </span>
      </div>

      <div className="top-nav__progress-bar">
        <div className="top-nav__progress-fill" id="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="top-nav__actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {onOpenHint && (
          <button
            id="btn-open-hints-nav"
            className="btn btn--ghost btn--sm"
            style={{ borderColor: 'rgba(255,170,0,0.45)', color: 'var(--doom-amber, #ffaa00)' }}
            title="Open Decryption Hints"
            onClick={onOpenHint}
          >
            💡 HINTS
          </button>
        )}
        <button id="btn-open-evidence" className="btn btn--ghost btn--sm" title="Open evidence database" onClick={onOpenEvidence}>
          EVIDENCE <span className="badge" id="evidence-count" style={{ marginLeft: '4px', background: 'var(--doom-green-fog)', border: '1px solid var(--doom-green-dim)', padding: '1px 5px', borderRadius: '3px', fontSize: '0.7rem' }}>{evidenceCount}</span>
        </button>
        <button
          id="btn-sound-toggle-2"
          className="btn btn--ghost btn--sm"
          aria-pressed={soundOn}
          title="Toggle sound"
          onClick={onToggleSound}
        >
          {soundOn ? 'SOUND ON' : 'SOUND OFF'}
        </button>
        {onLogout && (
          <button
            id="btn-logout-nav"
            className="btn btn--ghost btn--sm"
            style={{ borderColor: 'rgba(255, 34, 68, 0.4)', color: 'var(--doom-red, #ff2244)' }}
            title="Sign out operative team"
            onClick={onLogout}
          >
            🚪 LOGOUT
          </button>
        )}
      </div>
    </header>
  );
};
