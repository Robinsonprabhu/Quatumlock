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
  const [attemptsRemaining, setAttemptsRemaining] = useState(stage?.attemptsRemaining ?? 2);
  const [isLocked, setIsLocked] = useState(stage?.isLocked ?? false);
  const [potentialPoints, setPotentialPoints] = useState(stage?.potentialPoints ?? (stage?.isLocked ? 0 : 20));
  const inputRef = useRef(null);

  // Clean reset whenever stage/room changes
  useEffect(() => {
    setAnswer(initialInput || '');
    const locked = Boolean(stage?.isLocked);
    setIsLocked(locked);
    const rem = stage?.isSolved ? 0 : (stage?.attemptsRemaining !== undefined ? stage.attemptsRemaining : 2);
    setAttemptsRemaining(rem);
    setPotentialPoints(stage?.potentialPoints !== undefined ? stage.potentialPoints : (locked ? 0 : 20));

    if (stage?.isSolved) {
      setFeedback({ message: 'BREACH CONFIRMED. PROTOCOL OVERRIDDEN.', isGranted: true });
    } else if (locked) {
      setFeedback({ message: 'CHAMBER LOCKED: 2 of 2 wrong attempts used. 0 points awarded.', isGranted: false });
    } else {
      setFeedback(null);
    }
    setIsSubmitting(false);
    setShaking(false);
    setFocusActive(false);
  }, [stage?.key, stage?.id, stage?.isSolved, stage?.attemptsRemaining, stage?.isLocked, stage?.potentialPoints, initialInput]);

  // Focus input when entering an unsolved & unlocked chamber (if time remains)
  useEffect(() => {
    if (!stage?.isSolved && !isTimeExpired && !isLocked && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [stage?.key, stage?.id, stage?.isSolved, isTimeExpired, isLocked]);

  // Reveal animation on mount
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isTimeExpired || !answer.trim() || isSubmitting || feedback?.isGranted || isLocked) return;

    setIsSubmitting(true);
    setFeedback(null);

    const res = await onSubmitAnswer(stage.key, answer);
    setIsSubmitting(false);

    if (res.success) {
      setFeedback({ message: res.successNote || 'BREACH CONFIRMED.', isGranted: true });
      setAttemptsRemaining(0);
      setIsLocked(false);
    } else {
      if (res.attemptsRemaining !== undefined) {
        setAttemptsRemaining(res.attemptsRemaining);
      }
      if (res.isLocked !== undefined) {
        setIsLocked(res.isLocked);
        if (res.isLocked) setPotentialPoints(0);
      }
      const taunt = DOOM_TAUNTS[Math.floor(Math.random() * DOOM_TAUNTS.length)];
      setFeedback({ message: res.message || taunt, isGranted: false });
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const used = hintsUsed[stage.key] || [];
  const totalPenalty = used.reduce((sum, idx) => sum + (stage.hints?.[idx]?.penalty || 0), 0);

  // Dynamic point calculation display based on hints & remaining attempts
  const hintDeduction = used.length >= 3 ? 20 : (used.length === 2 ? 8 : (used.length === 1 ? 3 : 0));
  const attemptPenalty = (2 - attemptsRemaining) * 2;
  const livePotential = isLocked ? 0 : Math.max(0, 20 - hintDeduction - attemptPenalty);

  return (
    <div
      className={`puzzle-card-cinematic ${revealed ? 'puzzle-card-cinematic--revealed' : ''} ${shaking ? 'puzzle-card-cinematic--shake' : ''} ${feedback?.isGranted ? 'puzzle-card-cinematic--success' : ''} ${isTimeExpired && !feedback?.isGranted ? 'puzzle-card-cinematic--expired' : ''}`}
    >
      {/* ─── TOP HEADER BAR ─── */}
      <div className="pc-header">
        <div className="pc-header__left">
          <div className={`pc-status-orb ${feedback?.isGranted ? 'pc-status-orb--granted' : (isTimeExpired || isLocked) ? 'pc-status-orb--denied' : feedback?.isGranted === false ? 'pc-status-orb--denied' : 'pc-status-orb--active'}`} />
          <span className="pc-header__label">OVERRIDE CONSOLE // DOOM-OS</span>
        </div>
        <div className="pc-header__right">
          <span className="pc-header__level">LVL-{String(stage.id).padStart(2, '0')} ∙ SESSION {stage.id <= 15 ? 1 : 2}</span>
          {feedback?.isGranted ? (
            <span className="pc-status-tag pc-status-tag--breached">● BREACHED</span>
          ) : isLocked ? (
            <span className="pc-status-tag" style={{ background: 'rgba(255, 34, 68, 0.25)', color: 'var(--doom-red, #ff2244)', borderColor: 'var(--doom-red, #ff2244)' }}>
              🔒 0/2 CHANCES (LOCKED)
            </span>
          ) : isTimeExpired ? (
            <span className="pc-status-tag" style={{ background: 'rgba(255, 34, 68, 0.2)', color: 'var(--doom-red, #ff2244)', borderColor: 'var(--doom-red, #ff2244)' }}>
              ● TIMED OUT
            </span>
          ) : (
            <span className="pc-status-tag pc-status-tag--locked">
              ● {attemptsRemaining}/2 CHANCES REMAINING
            </span>
          )}
        </div>
      </div>

      {/* ─── CHAMBER SCORING & CHANCES TRACKER BAR ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 18px',
        background: isLocked
          ? 'linear-gradient(90deg, rgba(255, 34, 68, 0.15), rgba(20, 5, 8, 0.6))'
          : feedback?.isGranted
          ? 'linear-gradient(90deg, rgba(0, 255, 102, 0.12), rgba(5, 25, 15, 0.6))'
          : 'linear-gradient(90deg, rgba(0, 255, 102, 0.05), rgba(0, 229, 255, 0.04))',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--ink-faint, #6e8a7c)' }}>REWARD VALUE:</span>
          {isLocked ? (
            <span style={{ color: 'var(--doom-red, #ff2244)', fontWeight: 'bold' }}>0 PTS (CHAMBER FAILED)</span>
          ) : feedback?.isGranted ? (
            <span style={{ color: 'var(--doom-green-bright, #00ff66)', fontWeight: 'bold' }}>✓ EARNED {livePotential} PTS</span>
          ) : (
            <span style={{ color: 'var(--doom-green-bright, #00ff66)', fontWeight: 'bold' }}>
              {livePotential} / 20 PTS {hintDeduction > 0 && `(−${hintDeduction} hints)`} {attemptPenalty > 0 && `(−${attemptPenalty} wrong)`}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: 'var(--ink-faint, #6e8a7c)' }}>SUBMISSION CHANCES:</span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 'bold',
            background: isLocked ? 'rgba(255, 34, 68, 0.2)' : attemptsRemaining === 1 ? 'rgba(255, 170, 0, 0.2)' : 'rgba(0, 255, 102, 0.15)',
            color: isLocked ? 'var(--doom-red, #ff2244)' : attemptsRemaining === 1 ? 'var(--doom-amber, #ffaa00)' : 'var(--doom-green-bright, #00ff66)',
            border: `1px solid ${isLocked ? 'var(--doom-red)' : attemptsRemaining === 1 ? 'var(--doom-amber)' : 'var(--doom-green)'}`
          }}>
            {isLocked ? '0 / 2 (LOCKED)' : feedback?.isGranted ? 'CLEARED' : `${attemptsRemaining} / 2 AVAILABLE`}
          </span>
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
                placeholder={
                  isLocked
                    ? "MAX ATTEMPTS REACHED (2/2 WRONG) — CHAMBER INPUTS PERMANENTLY LOCKED"
                    : isTimeExpired && !feedback?.isGranted
                    ? "COUNTDOWN REACHED ZERO — OVERRIDE TERMINAL LOCKED"
                    : "Enter your calculated answer..."
                }
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onFocus={() => setFocusActive(true)}
                onBlur={() => setFocusActive(false)}
                disabled={feedback?.isGranted || isSubmitting || (isTimeExpired && !feedback?.isGranted) || isLocked}
                className={`pc-input ${focusActive ? 'pc-input--focused' : ''} ${(feedback?.isGranted === false || isLocked || (isTimeExpired && !feedback?.isGranted)) ? 'pc-input--error' : ''} ${feedback?.isGranted ? 'pc-input--success' : ''}`}
              />
              {feedback?.isGranted && (
                <span className="pc-input-checkmark">✓</span>
              )}
            </div>

            <button
              type="submit"
              className={`pc-submit-btn ${isSubmitting ? 'pc-submit-btn--loading' : ''} ${feedback?.isGranted ? 'pc-submit-btn--success' : ''}`}
              disabled={feedback?.isGranted || isSubmitting || !answer.trim() || (isTimeExpired && !feedback?.isGranted) || isLocked}
              id="btn-submit-answer"
            >
              {isSubmitting ? (
                <span className="pc-submit-btn__spinner">▌</span>
              ) : feedback?.isGranted ? (
                '✓ BREACHED'
              ) : isLocked ? (
                '🔒 LOCKED (0/2)'
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
              disabled={feedback?.isGranted || isTimeExpired || isLocked}
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
                cursor: (feedback?.isGranted || isTimeExpired || isLocked) ? 'not-allowed' : 'pointer',
                opacity: (feedback?.isGranted || isTimeExpired || isLocked) ? 0.5 : 1,
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
            {totalPenalty > 0 || hintDeduction > 0 ? (
              <span className="pc-penalty" style={{ color: 'var(--doom-red, #ff2244)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                ⚠ HINT PENALTY ACTIVE: −{totalPenalty}s timer / −{hintDeduction} pts score
              </span>
            ) : (
              <span style={{ color: 'var(--ink-faint, #6e8a7c)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                (Base: 20 pts ∙ Hint 1: −3 pts ∙ Hint 2: −5 pts ∙ Wrong: −2 pts & 1 chance)
              </span>
            )}
          </div>

          {/* ─── LOCKED OUT BANNER ─── */}
          {isLocked && !feedback?.isGranted && (
            <div className="pc-feedback pc-feedback--error" style={{ marginTop: '14px', borderColor: 'var(--doom-red)' }} role="alert">
              <span className="pc-feedback__icon">🔒</span>
              <span className="pc-feedback__msg">
                MAX ATTEMPTS REACHED (2/2 WRONG): Chamber override inputs are permanently locked. 0 points awarded.
              </span>
            </div>
          )}

          {/* ─── TIME EXPIRED BANNER ─── */}
          {isTimeExpired && !feedback?.isGranted && !isLocked && (
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
