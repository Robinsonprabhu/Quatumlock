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
      style={{
        background: 'linear-gradient(180deg, rgba(4, 18, 10, 0.88) 0%, rgba(2, 8, 4, 0.98) 100%)',
        backdropFilter: 'blur(24px)',
        border: feedback?.isGranted
          ? '1px solid var(--doom-green-bright, #00ff66)'
          : isLocked
          ? '1px solid rgba(255, 34, 68, 0.6)'
          : '1px solid rgba(0, 255, 102, 0.35)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: feedback?.isGranted
          ? '0 0 60px rgba(0, 255, 102, 0.3), 0 20px 40px rgba(0, 0, 0, 0.8)'
          : isLocked
          ? '0 0 50px rgba(255, 34, 68, 0.25), 0 20px 40px rgba(0, 0, 0, 0.8)'
          : '0 0 40px rgba(0, 255, 102, 0.12), 0 20px 40px rgba(0, 0, 0, 0.7)',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      {/* ─── TOP HUD HEADER BAR ─── */}
      <div className="pc-header" style={{
        background: 'linear-gradient(90deg, rgba(0, 255, 102, 0.16) 0%, rgba(0, 229, 255, 0.08) 50%, rgba(0, 0, 0, 0) 100%)',
        borderBottom: '1px solid rgba(0, 255, 102, 0.25)',
        padding: '12px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div className="pc-header__left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className={`pc-status-orb ${feedback?.isGranted ? 'pc-status-orb--granted' : (isTimeExpired || isLocked) ? 'pc-status-orb--denied' : feedback?.isGranted === false ? 'pc-status-orb--denied' : 'pc-status-orb--active'}`} />
          <div>
            <div style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.62rem',
              color: 'var(--doom-cyan, #00e5ff)',
              letterSpacing: '0.18em',
              fontWeight: 700
            }}>
              LATVERIA-NET // SECURITY OVERRIDE CONSOLE
            </div>
            <div style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: '0.95rem',
              color: '#ffffff',
              fontWeight: 700,
              letterSpacing: '0.05em'
            }}>
              {stage.name || `CHAMBER ${String(stage.id).padStart(2, '0')}`}
            </div>
          </div>
        </div>

        <div className="pc-header__right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {stage.category && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--doom-cyan)',
              background: 'rgba(0, 229, 255, 0.12)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 600,
              letterSpacing: '0.08em'
            }}>
              {stage.category}
            </span>
          )}
          <span className="pc-header__level" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--ink-dim)',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '3px 8px',
            borderRadius: '4px'
          }}>
            LVL-{String(stage.id).padStart(2, '0')} ∙ SESSION {stage.id <= 15 ? 1 : 2}
          </span>
          {feedback?.isGranted ? (
            <span className="pc-status-tag pc-status-tag--breached" style={{
              background: 'rgba(0, 255, 102, 0.2)',
              color: 'var(--doom-green-bright, #00ff66)',
              borderColor: 'var(--doom-green-bright, #00ff66)',
              boxShadow: '0 0 10px rgba(0, 255, 102, 0.4)'
            }}>
              ✓ BREACHED
            </span>
          ) : isLocked ? (
            <span className="pc-status-tag" style={{
              background: 'rgba(255, 34, 68, 0.25)',
              color: 'var(--doom-red, #ff2244)',
              borderColor: 'var(--doom-red, #ff2244)',
              boxShadow: '0 0 10px rgba(255, 34, 68, 0.4)'
            }}>
              🔒 0/2 (LOCKED)
            </span>
          ) : isTimeExpired ? (
            <span className="pc-status-tag" style={{
              background: 'rgba(255, 34, 68, 0.2)',
              color: 'var(--doom-red, #ff2244)',
              borderColor: 'var(--doom-red, #ff2244)'
            }}>
              ● TIMED OUT
            </span>
          ) : (
            <span className="pc-status-tag pc-status-tag--locked" style={{
              background: 'rgba(0, 255, 102, 0.08)',
              color: 'var(--doom-green-bright)',
              borderColor: 'rgba(0, 255, 102, 0.3)'
            }}>
              ● {attemptsRemaining}/2 CHANCES
            </span>
          )}
        </div>
      </div>

      {/* ─── CHAMBER SCORING & CHANCES TRACKER BAR ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 22px',
        background: isLocked
          ? 'linear-gradient(90deg, rgba(255, 34, 68, 0.15), rgba(20, 5, 8, 0.6))'
          : feedback?.isGranted
          ? 'linear-gradient(90deg, rgba(0, 255, 102, 0.15), rgba(5, 25, 15, 0.6))'
          : 'linear-gradient(90deg, rgba(0, 255, 102, 0.06), rgba(0, 229, 255, 0.04))',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--ink-faint, #6e8a7c)', letterSpacing: '0.08em' }}>CHAMBER REWARD:</span>
          {isLocked ? (
            <span style={{ color: 'var(--doom-red, #ff2244)', fontWeight: 'bold' }}>0 PTS (CHAMBER FAILED)</span>
          ) : feedback?.isGranted ? (
            <span style={{ color: 'var(--doom-green-bright, #00ff66)', fontWeight: 'bold' }}>✓ EARNED {livePotential} PTS</span>
          ) : (
            <span style={{ color: 'var(--doom-green-bright, #00ff66)', fontWeight: 'bold', textShadow: '0 0 8px rgba(0,255,102,0.4)' }}>
              {livePotential} / 20 PTS {hintDeduction > 0 && `(−${hintDeduction} hints)`} {attemptPenalty > 0 && `(−${attemptPenalty} wrong)`}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--ink-faint, #6e8a7c)', letterSpacing: '0.08em' }}>ATTEMPT PIPS:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '0.72rem',
              background: attemptsRemaining >= 1 && !isLocked ? 'rgba(0, 255, 102, 0.18)' : 'rgba(255, 34, 68, 0.25)',
              color: attemptsRemaining >= 1 && !isLocked ? 'var(--doom-green-bright)' : 'var(--doom-red)',
              border: `1px solid ${attemptsRemaining >= 1 && !isLocked ? 'var(--doom-green)' : 'var(--doom-red)'}`
            }}>
              {attemptsRemaining >= 1 && !isLocked ? '● ATTEMPT 1' : '✕ ATTEMPT 1'}
            </span>
            <span style={{
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '0.72rem',
              background: attemptsRemaining === 2 && !isLocked ? 'rgba(0, 255, 102, 0.18)' : attemptsRemaining === 1 && !isLocked ? 'rgba(255, 170, 0, 0.2)' : 'rgba(255, 34, 68, 0.25)',
              color: attemptsRemaining === 2 && !isLocked ? 'var(--doom-green-bright)' : attemptsRemaining === 1 && !isLocked ? 'var(--doom-amber)' : 'var(--doom-red)',
              border: `1px solid ${attemptsRemaining === 2 && !isLocked ? 'var(--doom-green)' : attemptsRemaining === 1 && !isLocked ? 'var(--doom-amber)' : 'var(--doom-red)'}`
            }}>
              {attemptsRemaining === 2 && !isLocked ? '● ATTEMPT 2' : attemptsRemaining === 1 && !isLocked ? '⚡ ATTEMPT 2 (FINAL)' : '✕ ATTEMPT 2'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── CHAMBER OBJECTIVE / QUESTION PROMPT ─── */}
      {stage?.question && (
        <div style={{
          margin: '18px 22px 6px',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(0, 255, 102, 0.08) 0%, rgba(0, 20, 12, 0.7) 100%)',
          borderLeft: '4px solid var(--doom-green-bright, #00ff66)',
          borderTop: '1px solid rgba(0, 255, 102, 0.2)',
          borderRight: '1px solid rgba(0, 255, 102, 0.2)',
          borderBottom: '1px solid rgba(0, 255, 102, 0.2)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(0, 255, 102, 0.05)',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--doom-green-bright)',
                boxShadow: '0 0 8px var(--doom-green-bright)',
                animation: 'dotPulse 1.5s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.72rem',
                color: 'var(--doom-green-bright, #00ff66)',
                letterSpacing: '0.14em',
                fontWeight: 700
              }}>
                ACTIVE CHAMBER OBJECTIVE & DIRECTIVE
              </span>
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'var(--ink-faint)',
              letterSpacing: '0.1em'
            }}>
              AUTH TARGET // REQUIRED
            </span>
          </div>

          <div style={{
            fontFamily: 'var(--font-display, "Rajdhani", sans-serif)',
            fontSize: '1.15rem',
            fontWeight: 600,
            color: '#f0fdf4',
            letterSpacing: '0.02em',
            lineHeight: '1.5',
            textShadow: '0 0 10px rgba(0, 255, 102, 0.15)'
          }}>
            {stage.question}
          </div>
        </div>
      )}

      {/* ─── ANSWER FORM ─── */}
      <div className="pc-form-area" style={{ padding: '16px 22px 22px' }}>
        <form onSubmit={handleSubmit}>
          <label className={`pc-form-label ${focusActive ? 'pc-form-label--active' : ''}`} htmlFor="pc-answer-input" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: focusActive ? 'var(--doom-green-bright)' : 'var(--ink-dim)',
            letterSpacing: '0.12em',
            fontWeight: 700
          }}>
            <span>root@latveria-terminal:~$</span>
            <span style={{ color: 'var(--doom-green-bright)' }}>TRANSMIT OVERRIDE KEY</span>
          </label>

          <div className="pc-input-row" style={{ display: 'flex', gap: '10px' }}>
            <div className="pc-input-wrap" style={{ flex: 1, position: 'relative' }}>
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
                    : "Type override answer and press Enter..."
                }
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onFocus={() => setFocusActive(true)}
                onBlur={() => setFocusActive(false)}
                disabled={feedback?.isGranted || isSubmitting || (isTimeExpired && !feedback?.isGranted) || isLocked}
                className={`pc-input ${focusActive ? 'pc-input--focused' : ''} ${(feedback?.isGranted === false || isLocked || (isTimeExpired && !feedback?.isGranted)) ? 'pc-input--error' : ''} ${feedback?.isGranted ? 'pc-input--success' : ''}`}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'rgba(2, 10, 5, 0.95)',
                  border: focusActive
                    ? '1px solid var(--doom-green-bright, #00ff66)'
                    : feedback?.isGranted
                    ? '1px solid var(--doom-green-bright, #00ff66)'
                    : isLocked || feedback?.isGranted === false
                    ? '1px solid var(--doom-red, #ff2244)'
                    : '1px solid rgba(0, 255, 102, 0.3)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.95rem',
                  letterSpacing: '0.05em',
                  boxShadow: focusActive ? '0 0 20px rgba(0, 255, 102, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
              />
              {feedback?.isGranted && (
                <span className="pc-input-checkmark" style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--doom-green-bright)',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}>✓</span>
              )}
            </div>

            <button
              type="submit"
              className={`pc-submit-btn ${isSubmitting ? 'pc-submit-btn--loading' : ''} ${feedback?.isGranted ? 'pc-submit-btn--success' : ''}`}
              disabled={feedback?.isGranted || isSubmitting || !answer.trim() || (isTimeExpired && !feedback?.isGranted) || isLocked}
              id="btn-submit-answer"
              style={{
                padding: '0 24px',
                background: feedback?.isGranted
                  ? 'linear-gradient(135deg, rgba(0, 255, 102, 0.4), rgba(0, 255, 102, 0.2))'
                  : isLocked || isTimeExpired
                  ? 'rgba(255, 34, 68, 0.2)'
                  : 'linear-gradient(135deg, rgba(0, 255, 102, 0.3) 0%, rgba(0, 229, 255, 0.25) 100%)',
                border: feedback?.isGranted
                  ? '1px solid var(--doom-green-bright)'
                  : isLocked || isTimeExpired
                  ? '1px solid var(--doom-red)'
                  : '1px solid var(--doom-green-bright)',
                color: '#ffffff',
                fontFamily: 'var(--font-display, sans-serif)',
                fontWeight: 700,
                fontSize: '0.92rem',
                letterSpacing: '0.1em',
                borderRadius: '6px',
                cursor: (feedback?.isGranted || isSubmitting || !answer.trim() || isLocked || isTimeExpired) ? 'not-allowed' : 'pointer',
                boxShadow: !isLocked && !isTimeExpired && !feedback?.isGranted && answer.trim() ? '0 0 25px rgba(0, 255, 102, 0.35)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              {isSubmitting ? (
                <span className="pc-submit-btn__spinner">▌ TRANSMITTING...</span>
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
          <div className="pc-meta-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
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
            <div className="pc-feedback pc-feedback--error" style={{ marginTop: '16px', padding: '12px 18px', background: 'rgba(255, 34, 68, 0.15)', border: '1px solid var(--doom-red)', borderRadius: '6px', color: 'var(--doom-red)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }} role="alert">
              <span style={{ fontSize: '1.2rem' }}>🔒</span>
              <span>
                <strong>MAX ATTEMPTS REACHED (2/2 WRONG):</strong> Chamber override inputs are permanently locked. 0 points awarded.
              </span>
            </div>
          )}

          {/* ─── TIME EXPIRED BANNER ─── */}
          {isTimeExpired && !feedback?.isGranted && !isLocked && (
            <div className="pc-feedback pc-feedback--error" style={{ marginTop: '16px', padding: '12px 18px', background: 'rgba(255, 34, 68, 0.15)', border: '1px solid var(--doom-red)', borderRadius: '6px', color: 'var(--doom-red)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }} role="alert">
              <span style={{ fontSize: '1.2rem' }}>💀</span>
              <span>
                <strong>DOOMSDAY PROTOCOL ACTIVATED:</strong> Countdown reached zero. Chamber override inputs are locked.
              </span>
            </div>
          )}

          {/* ─── FEEDBACK PANEL ─── */}
          {feedback && (!isTimeExpired || feedback.isGranted) && !isLocked && (
            <div
              className={`pc-feedback ${feedback.isGranted ? 'pc-feedback--success' : 'pc-feedback--error'}`}
              style={{
                marginTop: '16px',
                padding: '12px 18px',
                background: feedback.isGranted ? 'rgba(0, 255, 102, 0.15)' : 'rgba(255, 34, 68, 0.15)',
                border: feedback.isGranted ? '1px solid var(--doom-green-bright)' : '1px solid var(--doom-red)',
                borderRadius: '6px',
                color: feedback.isGranted ? 'var(--doom-green-bright)' : 'var(--doom-red)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: feedback.isGranted ? '0 0 20px rgba(0, 255, 102, 0.25)' : 'none'
              }}
              role="status"
            >
              <span style={{ fontSize: '1.1rem' }}>{feedback.isGranted ? '✓' : '✕'}</span>
              <span className="pc-feedback__msg">{feedback.message}</span>
            </div>
          )}
        </form>
      </div>

      {/* ─── SUCCESS GLOW OVERLAY ─── */}
      {feedback?.isGranted && (
        <div className="pc-success-glow" />
      )}
    </div>
  );
};
