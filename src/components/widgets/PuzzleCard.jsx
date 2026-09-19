import React, { useState, useEffect, useRef } from 'react';

const DOOM_TAUNTS = [
  "WRONG KEY — Your override attempt has been logged and discarded.",
  "ACCESS DENIED — The Singularity Core rejects that transmission.",
  "AUTHENTICATION FAILED — Recalibrate your calculations and retry.",
  "INCORRECT SIGNAL — Calculation mismatch. Re-verify your systems parameters.",
  "TRANSMISSION REJECTED — Recheck your methodology, not your guesses.",
  "FIREWALL HOLDS — That response failed system validation checks.",
];

export const PuzzleCard = ({ stage, hintsUsed, initialInput, isTimeExpired, onSubmitAnswer, onRequestHint }) => {
  const [answer, setAnswer] = useState(initialInput || '');
  const [feedback, setFeedback] = useState(stage?.isSolved ? { message: 'BREACH CONFIRMED. PROTOCOL OVERRIDDEN.', isGranted: true } : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusActive, setFocusActive] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef(null);

  // Clean reset whenever stage/room changes
  useEffect(() => {
    setAnswer(initialInput || '');
    if (stage?.isSolved) {
      setFeedback({ message: 'BREACH CONFIRMED. PROTOCOL OVERRIDDEN.', isGranted: true });
    } else {
      setFeedback(null);
    }
    setIsSubmitting(false);
    setShaking(false);
    setFocusActive(false);
  }, [stage?.key, stage?.id, stage?.isSolved, initialInput]);

  // Focus input when entering an unsolved chamber (if time remains)
  useEffect(() => {
    if (!stage?.isSolved && !isTimeExpired && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [stage?.key, stage?.id, stage?.isSolved, isTimeExpired]);

  // Reveal animation on mount
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isTimeExpired || !answer.trim() || isSubmitting || feedback?.isGranted) return;

    setIsSubmitting(true);
    setFeedback(null);

    const res = await onSubmitAnswer(stage.key, answer);
    setIsSubmitting(false);

    if (res.success) {
      setFeedback({ message: res.successNote || 'BREACH CONFIRMED.', isGranted: true });
    } else {
      const taunt = DOOM_TAUNTS[Math.floor(Math.random() * DOOM_TAUNTS.length)];
      setFeedback({ message: res.message || taunt, isGranted: false });
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const used = hintsUsed[stage.key] || [];
  const totalPenalty = used.reduce((sum, idx) => sum + (stage.hints?.[idx]?.penalty || 0), 0);

  return (
    <div
      className={`puzzle-card-cinematic ${revealed ? 'puzzle-card-cinematic--revealed' : ''} ${shaking ? 'puzzle-card-cinematic--shake' : ''} ${feedback?.isGranted ? 'puzzle-card-cinematic--success' : ''} ${isTimeExpired && !feedback?.isGranted ? 'puzzle-card-cinematic--expired' : ''}`}
    >
      {/* ─── TOP HEADER BAR ─── */}
      <div className="pc-header">
        <div className="pc-header__left">
          <div className={`pc-status-orb ${feedback?.isGranted ? 'pc-status-orb--granted' : isTimeExpired ? 'pc-status-orb--denied' : feedback?.isGranted === false ? 'pc-status-orb--denied' : 'pc-status-orb--active'}`} />
          <span className="pc-header__label">OVERRIDE CONSOLE // DOOM-OS</span>
        </div>
        <div className="pc-header__right">
          <span className="pc-header__level">LVL-{String(stage.id).padStart(2, '0')} ∙ SESSION {stage.id <= 7 ? 1 : 2}</span>
          {feedback?.isGranted ? (
            <span className="pc-status-tag pc-status-tag--breached">● BREACHED</span>
          ) : isTimeExpired ? (
            <span className="pc-status-tag" style={{ background: 'rgba(255, 34, 68, 0.2)', color: 'var(--doom-red, #ff2244)', borderColor: 'var(--doom-red, #ff2244)' }}>
              ● TIMED OUT
            </span>
          ) : (
            <span className="pc-status-tag pc-status-tag--locked">● AWAITING KEY</span>
          )}
        </div>
      </div>

      {/* ─── ANSWER FORM ─── */}
      <div className="pc-form-area">
        <form onSubmit={handleSubmit}>
          <label className={`pc-form-label ${focusActive ? 'pc-form-label--active' : ''}`} htmlFor="pc-answer-input">
            ▸ TRANSMIT OVERRIDE KEY:
          </label>

          <div className="pc-input-row">
            <div className="pc-input-wrap">
              <input
                id="pc-answer-input"
                ref={inputRef}
                type="text"
                autoComplete="off"
                spellCheck="false"
                placeholder={isTimeExpired && !feedback?.isGranted ? "COUNTDOWN REACHED ZERO — OVERRIDE TERMINAL LOCKED" : "Enter your calculated answer..."}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onFocus={() => setFocusActive(true)}
                onBlur={() => setFocusActive(false)}
                disabled={feedback?.isGranted || isSubmitting || (isTimeExpired && !feedback?.isGranted)}
                className={`pc-input ${focusActive ? 'pc-input--focused' : ''} ${(feedback?.isGranted === false || (isTimeExpired && !feedback?.isGranted)) ? 'pc-input--error' : ''} ${feedback?.isGranted ? 'pc-input--success' : ''}`}
              />
              {feedback?.isGranted && (
                <span className="pc-input-checkmark">✓</span>
              )}
            </div>

            <button
              type="submit"
              className={`pc-submit-btn ${isSubmitting ? 'pc-submit-btn--loading' : ''} ${feedback?.isGranted ? 'pc-submit-btn--success' : ''}`}
              disabled={feedback?.isGranted || isSubmitting || !answer.trim() || (isTimeExpired && !feedback?.isGranted)}
              id="btn-submit-answer"
            >
              {isSubmitting ? (
                <span className="pc-submit-btn__spinner">▌</span>
              ) : feedback?.isGranted ? (
                '✓ BREACHED'
              ) : isTimeExpired ? (
                '🔒 TIME EXPIRED'
              ) : (
                <>⚡ TRANSMIT KEY</>
              )}
            </button>
          </div>

          {/* ─── HINT + PENALTY ROW ─── */}
          <div className="pc-meta-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <button
              type="button"
              className="pc-hint-btn"
              id="btn-request-hint"
              onClick={onRequestHint}
              disabled={feedback?.isGranted || isTimeExpired}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 170, 0, 0.18), rgba(255, 170, 0, 0.06))',
                border: '1px solid var(--doom-amber, #ffaa00)',
                color: 'var(--doom-amber, #ffaa00)',
                borderRadius: '6px',
                padding: '8px 16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 'bold',
                letterSpacing: '0.08em',
                cursor: (feedback?.isGranted || isTimeExpired) ? 'not-allowed' : 'pointer',
                opacity: (feedback?.isGranted || isTimeExpired) ? 0.5 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 15px rgba(255, 170, 0, 0.2)',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '1rem' }}>💡</span>
              <span>REQUEST HINT / INTEL DECRYPTION</span>
            </button>
            {totalPenalty > 0 ? (
              <span className="pc-penalty" style={{ color: 'var(--doom-red, #ff2244)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                ⚠ HINT PENALTY ACTIVE: −{totalPenalty}s / −{totalPenalty} pts
              </span>
            ) : (
              <span style={{ color: 'var(--ink-faint, #6e8a7c)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                (Costs timer countdown & score points)
              </span>
            )}
          </div>

          {/* ─── TIME EXPIRED BANNER ─── */}
          {isTimeExpired && !feedback?.isGranted && (
            <div className="pc-feedback pc-feedback--error" style={{ marginTop: '14px', borderColor: 'var(--doom-red)' }} role="alert">
              <span className="pc-feedback__icon">💀</span>
              <span className="pc-feedback__msg">
                DOOMSDAY PROTOCOL ACTIVATED: Countdown reached zero. Chamber override inputs are locked.
              </span>
            </div>
          )}

          {/* ─── FEEDBACK PANEL ─── */}
          {feedback && (!isTimeExpired || feedback.isGranted) && (
            <div className={`pc-feedback ${feedback.isGranted ? 'pc-feedback--success' : 'pc-feedback--error'}`} role="status">
              <span className="pc-feedback__icon">{feedback.isGranted ? '✓' : '✗'}</span>
              <span className="pc-feedback__msg">{feedback.message}</span>
            </div>
          )}
        </form>
      </div>

      {/* ─── SUCCESS GLOW OVERLAY ─── */}
      {feedback?.isGranted && (
        <div className="pc-success-glow" />
      )}

      {/* ─── CORNER BRACKET DECORATIONS ─── */}
      <div className="pc-bracket pc-bracket--tl" />
      <div className="pc-bracket pc-bracket--tr" />
      <div className="pc-bracket pc-bracket--bl" />
      <div className="pc-bracket pc-bracket--br" />
    </div>
  );
};
