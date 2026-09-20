import React from 'react';

export const StageTracker = ({
  currentPartId = 1,
  levels = [],
  currentLevelIndex = 0,
  solvedPuzzles = [],
  onSelectLevel,
  onOpenLevelSelect,
}) => {
  return (
    <nav className="stage-tracker" id="stage-tracker" aria-label="Mission levels" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <button
        onClick={onOpenLevelSelect}
        className="btn btn--ghost btn--sm"
        style={{
          border: '1px solid var(--doom-green-dim)',
          color: 'var(--doom-green)',
          fontSize: '11px',
          letterSpacing: '1px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
        title="Open Level Selection"
      >
        <span>SESSION {currentPartId} (LEVELS {currentPartId === 1 ? '1–7' : '8–14'})</span>
        <span style={{ fontSize: '10px' }}>▼</span>
      </button>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {levels.map((lvl, idx) => {
          const isDone = solvedPuzzles.includes(lvl.key);
          const isCurrent = idx === currentLevelIndex;
          const isUnlocked = idx === 0 || solvedPuzzles.includes(levels[idx - 1]?.key);
          
          let pillClass = 'stage-pill';
          if (isDone) pillClass += ' is-done';
          if (isCurrent) pillClass += ' is-current';
          if (!isUnlocked && !isDone) pillClass += ' is-locked';

          return (
            <button
              key={lvl.key || idx}
              type="button"
              className={pillClass}
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onSelectLevel && onSelectLevel(idx)}
              style={{
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.4,
                background: isCurrent ? 'rgba(0,255,102,0.18)' : isDone ? 'rgba(0,255,102,0.1)' : 'rgba(255,255,255,0.03)',
                borderColor: isCurrent ? 'var(--doom-green)' : isDone ? 'rgba(0,255,102,0.4)' : isUnlocked ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                color: isDone ? 'var(--doom-green)' : isCurrent ? '#fff' : isUnlocked ? 'var(--ink)' : 'var(--ink-faint)',
                padding: '5px 12px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease'
              }}
              title={
                isDone
                  ? `Level ${lvl.id} Cleared: ${lvl.name}`
                  : isUnlocked
                  ? `Go to Level ${lvl.id}: ${lvl.name}`
                  : `Level ${lvl.id} is LOCKED — Solve Level ${lvl.id - 1} first`
              }
            >
              LEVEL {lvl.id} {lvl.id === 14 ? '— FINALE' : ''} {isDone ? ' ✓' : isUnlocked ? '' : ' 🔒'}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
