import React, { useState, useEffect } from 'react';
import { TOTAL_TIME_SECONDS } from '../data/stages';

export const ResultsScreen = ({
  remainingTime,
  hintsUsedCount,
  solvedCount,
  totalStages,
  onRestart,
}) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [rating, setRating] = useState('B');

  const formatClock = (totalSeconds) => {
    const s = Math.max(0, Math.round(totalSeconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
  };

  useEffect(() => {
    const computeRating = (timeLeft, hintCount) => {
      if (timeLeft > 15 * 60 && hintCount === 0) return 'S';
      if (timeLeft > 8 * 60 && hintCount <= 2) return 'A';
      if (timeLeft > 2 * 60 && hintCount <= 5) return 'B';
      return 'C';
    };

    const calculatedRating = computeRating(remainingTime, hintsUsedCount);
    setRating(calculatedRating);
    const playerTimeUsed = TOTAL_TIME_SECONDS - remainingTime;

    // Submit score to backend API
    fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'YOU',
        time: playerTimeUsed,
        rating: calculatedRating,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }
      })
      .catch(() => {
        // Fallback fetch GET if POST failed
        fetch('/api/leaderboard')
          .then((r) => r.json())
          .then(setLeaderboard)
          .catch(() => {});
      });
  }, [remainingTime, hintsUsedCount]);

  return (
    <div className="story-block">
      <p className="story-eyebrow">MISSION COMPLETE</p>
      <h2 className="story-title">BUT THE INVESTIGATION IS NOT OVER.</h2>
      <div className="log-block" style={{ marginBottom: '1.6rem' }}>
        <div className="log-line">TIME REMAINING: {formatClock(remainingTime)}</div>
        <div className="log-line">HINTS USED: {hintsUsedCount}</div>
        <div className="log-line">
          PUZZLES SOLVED: {solvedCount}/{totalStages}
        </div>
        <div className="log-line">MISSION RATING: {rating}</div>
      </div>

      <p className="story-eyebrow">TOP AGENTS</p>
      <div className="log-block" id="leaderboard-block">
        {leaderboard.map((row, idx) => (
          <div key={idx} className={`log-line ${row.name === 'YOU' ? 'log-alert' : ''}`}>
            {String(idx + 1).padStart(2, '0')}  {row.name.padEnd(14, ' ')}  {formatClock(row.time)}  [{row.rating}]
          </div>
        ))}
      </div>

      <div className="story-actions">
        <button className="btn btn--primary" id="btn-restart-after-win" onClick={onRestart}>
          START A NEW MISSION
        </button>
      </div>
    </div>
  );
};
