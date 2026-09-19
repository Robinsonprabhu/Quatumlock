import React, { useState, useEffect } from 'react';

export const FinalSequence = ({ onFinishSequence, triggerDoomDialogue }) => {
  const [logLines, setLogLines] = useState([]);

  const steps = [
    { text: "DOOMSDAY PROTOCOL ... TERMINATED", cls: "" },
    { text: "AVENGERS NETWORK ... RESTORING", cls: "dim" },
    { text: "RESTORATION: 10%", cls: "dim" },
    { text: "RESTORATION: 34%", cls: "dim" },
    { text: "RESTORATION: 67%", cls: "dim" },
    { text: "RESTORATION: 100%", cls: "" },
    { text: "EARTH STATUS: STABLE", cls: "" },
  ];

  useEffect(() => {
    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogLines((prev) => [...prev, step]);
      }, 500 + i * 500);
    });

    const totalTime = 500 + steps.length * 500 + 400;
    const timer = setTimeout(() => {
      triggerDoomDialogue(
        [
          "You stopped the protocol.",
          "Congratulate yourself. Briefly.",
          "But you still haven't discovered who activated it.",
        ],
        onFinishSequence
      );
    }, totalTime);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="story-block">
      <p className="story-eyebrow" style={{ color: 'var(--doom-red)' }}>
        DOOMSDAY PROTOCOL
      </p>
      <h2 className="story-title" id="final-headline">
        TERMINATED
      </h2>
      <div className="log-block" id="final-log">
        {logLines.map((l, idx) => (
          <div key={idx} className={`log-line ${l.cls}`}>
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
};
