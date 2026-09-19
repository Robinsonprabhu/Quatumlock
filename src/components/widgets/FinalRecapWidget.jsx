import React from 'react';
import { STAGES } from '../../data/stages';

export const FinalRecapWidget = ({ fragments }) => {
  return (
    <div>
      <div className="log-block">
        {STAGES.slice(0, 4).map((s, idx) => {
          const val = fragments[s.key];
          return (
            <div key={s.key} className="log-line">
              FRAGMENT {idx + 1} ({s.name}): {val !== undefined ? val : '?'}
            </div>
          );
        })}
        <div className="log-line log-alert">CORE COUNTDOWN: 05:00</div>
      </div>
    </div>
  );
};
