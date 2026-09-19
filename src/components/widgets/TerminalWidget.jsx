import React, { useState, useEffect, useRef } from 'react';

const BOOT_LOG = [
  { text: "[03:14:01] CPU-01 :: PROCESS MONITOR — SINGLE CORE ACTIVE", cls: "" },
  { text: "[03:14:01] CORES 2, 3, 4: DELETED / OFFLINE — SINGLE CORE ROTATION ACTIVE", cls: "err" },
  { text: "[03:14:01] SURVEILLANCE  ... STATE: RUNNING | CPU TIME: 1.0s", cls: "" },
  { text: "[03:14:02] SECURITY      ... STATE: RUNNING | CPU TIME: 1.0s", cls: "" },
  { text: "[03:14:03] DOOR CONTROL  ... STATE: RUNNING | CPU TIME: 1.0s", cls: "" },
  { text: "[03:14:04] LIFE SUPPORT  ... STATE: RUNNING | CPU TIME: 1.0s", cls: "" },
  { text: "[03:14:05] REACTOR       ... STATE: RUNNING | CPU TIME: 1.0s", cls: "err" },
  { text: "[03:14:06] CONTEXT SWITCH -> SAVING TASK STATE -> RESTORING SURVEILLANCE", cls: "dim" },
  { text: "[03:14:06] TIME SLICE ALLOCATION: 1.0 SECOND PER PROCESS", cls: "dim" },
  { text: "TERMINAL READY. TYPE 'processes' OR 'scheduler' FOR DIAGNOSTICS.", cls: "dim" },
];

const COMMANDS = {
  help: () => [
    { text: "AVAILABLE DIAGNOSTIC COMMANDS:", cls: "dim" },
    { text: "  processes — list active processes & CPU time allocation", cls: "" },
    { text: "  scheduler — inspect single-core CPU scheduling behavior", cls: "" },
    { text: "  status    — check processor core health & bottleneck", cls: "" },
    { text: "  logs      — replay CPU context-switching log trace", cls: "" },
    { text: "  clear     — clear console output", cls: "" },
  ],
  status: () => [
    { text: "PROCESSOR ARCHITECTURE : 4-CORE PRIMARY BUS", cls: "dim" },
    { text: "CORE 1 : ONLINE (100% UTILIZATION — ROTATING ACTIVE TASKS)", cls: "err" },
    { text: "CORE 2 : OFFLINE (DAMAGED IN ATTACK)", cls: "err" },
    { text: "CORE 3 : OFFLINE (DAMAGED IN ATTACK)", cls: "err" },
    { text: "CORE 4 : OFFLINE (DAMAGED IN ATTACK)", cls: "err" },
    { text: "SCHEDULER STATUS      : CYCLIC TIME SLICING ACTIVE (1 SEC QUANTUM)", cls: "" },
  ],
  processes: () => [
    { text: "ACTIVE PROCESS QUEUE (1 CPU CORE):", cls: "dim" },
    { text: "  1. SURVEILLANCE     [STATE: READY   | QUANTUM: 1.0s]", cls: "" },
    { text: "  2. SECURITY         [STATE: READY   | QUANTUM: 1.0s]", cls: "" },
    { text: "  3. DOOR CONTROL     [STATE: READY   | QUANTUM: 1.0s]", cls: "" },
    { text: "  4. LIFE SUPPORT     [STATE: READY   | QUANTUM: 1.0s]", cls: "" },
    { text: "  5. REACTOR MONITOR  [STATE: RUNNING | QUANTUM: 1.0s]", cls: "err" },
    { text: "MECHANISM: Each process gets 1 second, saves state, and yields CPU.", cls: "dim" },
  ],
  scheduler: () => [
    { text: "CPU SCHEDULER ANALYSIS:", cls: "dim" },
    { text: "  - Only 1 process executes at any microsecond interval.", cls: "" },
    { text: "  - Preemption occurs after fixed time quantum (1.0s).", cls: "" },
    { text: "  - Waiting processes receive CPU time in equal, cyclic rotation.", cls: "" },
    { text: "  - Task context is saved and restored seamlessly.", cls: "" },
    { text: "ALGORITHM CATEGORY: Time-Sharing / Round Robin Context Switching.", cls: "err" },
  ],
  logs: () => BOOT_LOG,
};

export const TerminalWidget = ({ evidenceList, onAddEvidence }) => {
  const [lines, setLines] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const bodyRef = useRef(null);

  useEffect(() => {
    const initial = [{ text: "DOOM-OS v10.4 — EMERGENCY RELAY CONSOLE", cls: "dim" }];
    setLines(initial);
    BOOT_LOG.forEach((item, i) => {
      setTimeout(() => {
        setLines((prev) => [...prev, item]);
      }, 150 + i * 100);
    });
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  const execCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    const echoLine = { text: '> ' + raw, cls: 'dim' };

    if (!cmd) {
      setLines((prev) => [...prev, echoLine]);
      return;
    }

    if (cmd === 'clear') {
      setLines([]);
      return;
    }

    const outputLines = COMMANDS[cmd]
      ? COMMANDS[cmd]()
      : [{ text: `Command not found: '${cmd}'. Type 'help' for commands.`, cls: 'err' }];

    setLines((prev) => [...prev, echoLine, ...outputLines]);
  };

  return (
    <div className="terminal-widget" style={{
      background: '#010804',
      border: '1px solid rgba(0,255,102,0.3)',
      borderRadius: '8px',
      overflow: 'hidden',
      fontFamily: 'var(--font-mono)',
      boxShadow: '0 0 30px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.5)',
    }}>
      {/* Header bar */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(0,255,102,0.15), rgba(0,0,0,0.6))',
        borderBottom: '1px solid rgba(0,255,102,0.2)',
        padding: '8px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff3b4e', display: 'block' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffcc00', display: 'block' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00ff66', display: 'block', boxShadow: '0 0 6px #00ff66' }} />
          <span style={{ marginLeft: '8px', fontSize: '0.72rem', color: 'var(--doom-green)', fontWeight: 'bold', letterSpacing: '0.1em' }}>
            DOOM-OS :: LATVERIAN RELAY TERMINAL
          </span>
        </div>
        <span style={{ fontSize: '0.62rem', color: 'var(--ink-faint)', letterSpacing: '0.05em' }}>
          UPLINK: UNSTABLE
        </span>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        id="term-body"
        role="log"
        aria-live="polite"
        style={{
          background: 'transparent',
          height: '240px',
          overflowY: 'auto',
          padding: '10px 14px',
          fontSize: '1.02rem',
          lineHeight: '1.7',
          color: 'var(--doom-green)',
        }}
      >
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              color: l.cls === 'err' ? 'var(--doom-red)' : l.cls === 'dim' ? 'var(--ink-faint)' : 'var(--doom-green)',
              marginBottom: '1px',
            }}
          >
            {l.text}
          </div>
        ))}
      </div>

      {/* Quick commands */}
      <div style={{
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(0,255,102,0.1)',
        padding: '6px 12px',
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
          QUICK:
        </span>
        {['help', 'scan', 'status', 'topology', 'decode', 'logs', 'clear'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => execCommand(cmd)}
            style={{
              background: 'rgba(0,255,102,0.06)',
              border: '1px solid rgba(0,255,102,0.25)',
              color: 'var(--doom-green)',
              borderRadius: '3px',
              padding: '3px 10px',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => { e.target.style.background = 'rgba(0,255,102,0.15)'; e.target.style.borderColor = 'var(--doom-green)'; }}
            onMouseOut={(e) => { e.target.style.background = 'rgba(0,255,102,0.06)'; e.target.style.borderColor = 'rgba(0,255,102,0.25)'; }}
          >
            &gt; {cmd}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div style={{
        background: 'rgba(0,0,0,0.5)',
        borderTop: '1px solid rgba(0,255,102,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
      }}>
        <span style={{ color: 'var(--doom-green)', fontWeight: 'bold', fontFamily: 'var(--font-mono)', fontSize: '0.98rem' }}>
          &gt;
        </span>
        <input
          type="text"
          id="term-input"
          autoComplete="off"
          spellCheck="false"
          placeholder="type command..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const v = inputVal;
              setInputVal('');
              execCommand(v);
            }
          }}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--doom-green-bright)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.98rem',
            letterSpacing: '0.05em',
          }}
        />
        <span className="terminal-cursor" />
      </div>
    </div>
  );
};
