import React, { useState, useEffect } from 'react';
import { contentStore } from '../engine/contentStore';

const THREAT_LEVELS = ['MINIMAL', 'LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL', 'EXTREME', 'MAXIMUM', 'CATASTROPHIC', 'DOOMSDAY'];
const THREAT_COLORS = [
  '#00ff66', '#33ff88', '#88ff00', '#ffdd00',
  '#ffaa00', '#ff7700', '#ff4400', '#ff2244',
  '#ff0066', '#ff0088'
];

export const DoomQuestionHeader = ({ currentLevel, currentPartId }) => {
  const [glitch, setGlitch] = useState(false);
  const [systemConfig, setSystemConfig] = useState(() => contentStore.getContent().systemConfig);

  useEffect(() => {
    const unsub = contentStore.subscribe((c) => {
      setSystemConfig(c.systemConfig);
    });
    return unsub;
  }, []);

  const doomQuotes = systemConfig.doomQuotes || [];
  const tickerMessages = systemConfig.tickerMessages || [];
  const levelIdx = (currentLevel.id - 1) % (doomQuotes.length || 1);
  const doomQuote = doomQuotes[levelIdx] || "\"I am watching your every move.\"";
  const tickerText = tickerMessages[0] || "⚠ LATVERIA-NET SECURITY ALERT ∙∙∙ DOOM CORE OPERATIONAL";
  const threatLevel = THREAT_LEVELS[Math.min(currentLevel.id - 1, 9)];
  const threatColor = THREAT_COLORS[Math.min(currentLevel.id - 1, 9)];

  // Periodic glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 300);
    }, 7000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="doom-question-header">
      {/* TICKER */}
      <div className="doom-question-header__ticker">
        <span className="doom-question-header__ticker-inner">
          {tickerText}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {tickerText}
        </span>
      </div>

      {/* MAIN HEADER */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(4,14,8,0.97) 0%, rgba(16,4,24,0.95) 50%, rgba(4,14,8,0.97) 100%)',
        borderBottom: '1px solid rgba(0,255,102,0.2)',
        padding: '12px 1.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.2rem',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
        flexWrap: 'wrap',
      }}>
        {/* LEFT: Doom Avatar + Level Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Animated doom orb */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(168,85,247,0.5) 0%, rgba(10,4,20,0.9) 70%)',
              border: '2px solid rgba(168,85,247,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 0 20px rgba(168,85,247,0.5), 0 0 40px rgba(168,85,247,0.2)',
              animation: 'glowPulse 3s ease-in-out infinite',
            }}>
              👑
            </div>
            {/* Rotating ring */}
            <div style={{
              position: 'absolute', inset: '-5px',
              borderRadius: '50%',
              border: '1px dashed rgba(168,85,247,0.4)',
              animation: 'spin 8s linear infinite',
            }} />
          </div>

          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--doom-purple)',
              letterSpacing: '0.2em',
              fontWeight: 'bold',
              marginBottom: '3px',
            }}>
              LATVERIA-NET SECURITY GATEWAY :: DOOM CORE ACTIVE
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              fontWeight: '700',
              color: glitch ? 'var(--doom-cyan)' : 'var(--ink)',
              textShadow: glitch
                ? '-2px 0 var(--doom-red), 2px 0 var(--doom-cyan)'
                : '0 0 10px rgba(255,255,255,0.2)',
              transition: 'all 0.1s ease',
              letterSpacing: '0.05em',
            }}>
              SESSION {currentPartId} · {currentLevel.name.startsWith('ROOM') ? currentLevel.name : `ROOM ${String(currentLevel.id).padStart(2, '0')}: ${currentLevel.name}`}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'rgba(168,85,247,0.8)',
              marginTop: '3px',
              fontStyle: 'italic',
            }}>
              {doomQuote}
            </div>
          </div>
        </div>

        {/* RIGHT: Threat Level + Level Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          {/* Threat level badge */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>
              THREAT LEVEL
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.72rem',
              fontWeight: '700',
              color: threatColor,
              letterSpacing: '0.15em',
              textShadow: `0 0 10px ${threatColor}`,
              animation: currentLevel.id >= 8 ? 'timerFlash 1.5s ease-in-out infinite' : 'none',
            }}>
              {threatLevel}
            </span>
          </div>

          {/* Threat level bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[...Array(10)].map((_, i) => (
              <div key={i} style={{
                width: '6px',
                height: '4px',
                borderRadius: '1px',
                background: i < currentLevel.id ? threatColor : 'rgba(255,255,255,0.08)',
                boxShadow: i < currentLevel.id ? `0 0 4px ${threatColor}` : 'none',
                transition: 'all 0.3s ease',
              }} />
            )).reverse()}
          </div>

          {/* Level badge */}
          <div style={{
            background: `rgba(${threatColor === '#00ff66' ? '0,255,102' : '255,34,68'},0.12)`,
            border: `1px solid ${threatColor}`,
            borderRadius: '5px',
            padding: '6px 12px',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>
              SECURITY TIER
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: '900',
              color: threatColor,
              textShadow: `0 0 12px ${threatColor}`,
              lineHeight: '1',
            }}>
              {currentLevel.id}/10
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
