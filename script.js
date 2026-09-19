/* ==========================================================================
   DOOMSDAY: THE LAST PROTOCOL — GAME ENGINE
   Vanilla JS. No frameworks, no build step.

   PROTOTYPE ONLY: answer validation happens entirely in the browser below.
   For a real competition, move answer validation to a backend so the
   solutions in this file cannot simply be read from view-source.
   ==========================================================================
   TABLE OF CONTENTS
   1. Utilities
   2. Game state (localStorage)
   3. Sound manager
   4. Background canvas fx
   5. Doom dialogue system
   6. Timer system
   7. Evidence system
   8. Puzzle & stage content data
   9. Stage rendering engine
   10. Puzzle card wiring (answers, hints, feedback)
   11. Stage-specific widgets (terminal / signal / network map / code)
   12. Final cinematic sequence + results screen
   13. Landing screen + boot
   ========================================================================== */

(function () {
  "use strict";

  /* ========================================================================
     1. UTILITIES
     ==================================================================== */
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function normalize(str) {
    return String(str || "").trim().toUpperCase().replace(/\s+/g, " ");
  }
  function normalizeTight(str) {
    // strips everything except letters and digits, uppercased
    return String(str || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  }
  function digitsOnly(str) {
    return String(str || "").replace(/[^0-9]/g, "");
  }

  function formatClock(totalSeconds) {
    const s = Math.max(0, Math.round(totalSeconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  }

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  /* ========================================================================
     2. GAME STATE
     ==================================================================== */
  const STORAGE_KEY = "doomsday_protocol_save_v1";
  const LEADERBOARD_KEY = "doomsday_protocol_leaderboard_v1";
  const TOTAL_TIME_SECONDS = 30 * 60;

  function defaultState() {
    return {
      started: false,
      currentStageIndex: 0,      // 0..4 -> stage 1..5
      phase: "story",            // story | investigation | puzzle | consequence | final
      solvedPuzzles: [],         // ["breach","signal",...]
      evidence: [],              // [{id,title,note}]
      hintsUsed: {},             // { breach: [0], signal: [0,1] }
      fragments: {},             // { breach: 7, signal: 42, ... }
      endTimestamp: null,
      soundOn: false,
      completed: false,
      failed: false,
      networkPath: [],           // scratch state for stage 3 widget
    };
  }

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    } catch (e) {
      return defaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* localStorage unavailable — game still works, just won't persist */
    }
  }

  function resetState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    state = defaultState();
  }

  /* ========================================================================
     3. SOUND MANAGER
     Works even if the mp3 files in assets/audio/ do not exist yet.
     ==================================================================== */
  const SoundManager = (function () {
    const files = {
      ambient: "assets/audio/ambient.mp3",
      alert: "assets/audio/alert.mp3",
      success: "assets/audio/success.mp3",
      failure: "assets/audio/failure.mp3",
      click: "assets/audio/click.mp3",
      doomVoice: "assets/audio/doom-voice.mp3",
    };
    const cache = {};

    function get(name) {
      if (!cache[name] && files[name]) {
        const a = new Audio(files[name]);
        a.volume = name === "ambient" ? 0.35 : 0.6;
        cache[name] = a;
      }
      return cache[name];
    }

    function play(name) {
      if (!state.soundOn) return;
      const a = get(name);
      if (!a) return;
      try {
        a.currentTime = 0;
        const p = a.play();
        if (p && p.catch) p.catch(() => { /* file missing or blocked — ignore */ });
      } catch (e) { /* ignore */ }
    }

    function setEnabled(on) {
      state.soundOn = on;
      saveState();
      if (on) {
        const amb = get("ambient");
        if (amb) {
          amb.loop = true;
          const p = amb.play();
          if (p && p.catch) p.catch(() => {});
        }
      } else {
        Object.keys(cache).forEach((k) => cache[k] && cache[k].pause());
      }
      updateSoundUI();
    }

    return { play, setEnabled };
  })();

  function updateSoundUI() {
    const on = state.soundOn;
    qsa("#btn-sound-toggle, #btn-sound-toggle-2").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(on));
      const label = btn.querySelector(".sound-toggle__label");
      if (label) label.textContent = on ? "SOUND ON" : "SOUND OFF";
      if (!label) btn.textContent = on ? "SOUND ON" : "SOUND OFF";
    });
  }

  /* ========================================================================
     4. BACKGROUND CANVAS FX
     Falling data-glyph rain, similar in spirit to a terminal matrix effect.
     Cheap, requestAnimationFrame based, respects reduced-motion.
     ==================================================================== */
  function initBackground() {
    const canvas = qs("#bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w, h, columns, drops;
    const glyphs = "01DOOM01NODE01CORE01".split("");

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      columns = Math.floor(w / 18);
      drops = new Array(columns).fill(0).map(() => Math.random() * -50);
    }
    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) return; // static gradient background only

    function frame() {
      ctx.fillStyle = "rgba(5,7,6,0.14)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = "14px monospace";
      for (let i = 0; i < columns; i++) {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * 18;
        const y = drops[i] * 18;
        const isBright = Math.random() > 0.94;
        ctx.fillStyle = isBright ? "rgba(150,255,205,0.9)" : "rgba(53,224,138,0.28)";
        ctx.fillText(char, x, y);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ========================================================================
     5. DOOM DIALOGUE SYSTEM
     ==================================================================== */
  const Doom = (function () {
    let queue = [];
    let typing = false;

    function say(lines, onDone) {
      queue = queue.concat(Array.isArray(lines) ? lines : [lines]);
      if (typeof onDone === "function") queue.push({ __done: onDone });
      if (!typing) next();
    }

    function next() {
      if (!queue.length) {
        hide();
        return;
      }
      const item = queue.shift();
      if (item && item.__done) {
        item.__done();
        next();
        return;
      }
      show(item);
    }

    function show(text) {
      typing = true;
      const overlay = qs("#doom-overlay");
      const textEl = qs("#doom-text");
      overlay.classList.add("is-active");
      overlay.setAttribute("aria-hidden", "false");
      textEl.textContent = "";
      SoundManager.play("doomVoice");

      let i = 0;
      const cursor = document.createElement("span");
      cursor.className = "cursor";
      cursor.textContent = "\u2588";

      function type() {
        if (i <= text.length) {
          textEl.textContent = text.slice(0, i);
          textEl.appendChild(cursor);
          i += 2;
          setTimeout(type, 18);
        } else {
          textEl.textContent = text;
        }
      }
      type();
    }

    function hide() {
      typing = false;
      const overlay = qs("#doom-overlay");
      overlay.classList.remove("is-active");
      overlay.setAttribute("aria-hidden", "true");
    }

    function bindContinue() {
      qs("#btn-doom-continue").addEventListener("click", () => {
        SoundManager.play("click");
        next();
      });
    }

    return { say, bindContinue };
  })();

  /* ========================================================================
     6. TIMER SYSTEM
     ==================================================================== */
  let timerInterval = null;

  function startTimerIfNeeded() {
    if (!state.endTimestamp) {
      state.endTimestamp = Date.now() + TOTAL_TIME_SECONDS * 1000;
      saveState();
    }
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(tickTimer, 500);
    tickTimer();
  }

  function applyPenalty(seconds) {
    if (!state.endTimestamp) return;
    state.endTimestamp -= seconds * 1000;
    saveState();
    tickTimer();
  }

  function remainingSeconds() {
    if (!state.endTimestamp) return TOTAL_TIME_SECONDS;
    return (state.endTimestamp - Date.now()) / 1000;
  }

  function tickTimer() {
    const remaining = remainingSeconds();
    const label = formatClock(remaining);
    const gameTimerEl = qs("#game-countdown");
    const wrap = qs("#topnav-timer");
    if (gameTimerEl) gameTimerEl.textContent = label;

    const warning = remaining <= 300 && remaining > 0;
    if (wrap) wrap.classList.toggle("is-warning", warning);
    qs("#alert-wash").classList.toggle("is-critical", warning);

    if (remaining <= 0 && !state.completed && !state.failed) {
      state.failed = true;
      saveState();
      clearInterval(timerInterval);
      SoundManager.play("failure");
      qs("#failure-modal").classList.add("is-active");
      qs("#failure-modal").setAttribute("aria-hidden", "false");
    }
  }

  /* ========================================================================
     7. EVIDENCE SYSTEM
     ==================================================================== */
  function addEvidence(id, title, note) {
    if (state.evidence.some((e) => e.id === id)) return;
    state.evidence.push({ id, title, note });
    saveState();
    renderEvidence();
    flashEvidenceBadge();
  }

  function flashEvidenceBadge() {
    const badge = qs("#evidence-count");
    if (!badge) return;
    badge.textContent = String(state.evidence.length);
    badge.style.transform = "scale(1.4)";
    setTimeout(() => (badge.style.transform = "scale(1)"), 220);
  }

  function renderEvidence() {
    const list = qs("#evidence-list");
    const badge = qs("#evidence-count");
    if (badge) badge.textContent = String(state.evidence.length);
    if (!list) return;
    if (!state.evidence.length) {
      list.innerHTML = '<p class="evidence-empty">No evidence acquired yet. Keep investigating.</p>';
      return;
    }
    list.innerHTML = "";
    state.evidence.forEach((ev, idx) => {
      const card = el("div", "evidence-card");
      card.innerHTML =
        '<div class="evidence-card__id">EVIDENCE #' + String(idx + 1).padStart(3, "0") + "</div>" +
        '<h3 class="evidence-card__title">' + ev.title + "</h3>" +
        '<p class="evidence-card__note">' + ev.note + "</p>";
      list.appendChild(card);
    });
  }

  function toggleEvidenceDrawer(open) {
    qs("#evidence-drawer").classList.toggle("is-active", open);
    qs("#evidence-backdrop").classList.toggle("is-active", open);
    qs("#evidence-drawer").setAttribute("aria-hidden", String(!open));
  }

  /* ========================================================================
     8. PUZZLE & STAGE CONTENT DATA
     ==================================================================== */
  const STAGES = [
    // ---------------------------------------------------------------- STAGE 1
    {
      key: "breach",
      name: "THE BREACH",
      story: [
        "03:17 AM.",
        "The Avengers emergency relay has been silent for six minutes. It has never been silent for six minutes.",
        "You are handed a single terminal session and a warning: <strong>whoever is on the other end got past everything.</strong>",
        "The boot log is still scrolling when you sit down."
      ],
      investigationType: "terminal",
      question: "Four subsystems each logged a \u201cstatus byte\u201d before the trace failed \u2014 eight bits apiece. Read all four as ASCII, in order. What four-letter signature do they spell?",
      validate: (raw) => normalizeTight(raw) === "DOOM",
      hints: [
        { text: "Those four bytes are not noise \u2014 one was logged per subsystem, in order. That ordering matters.", penalty: 30 },
        { text: "Split each byte into its 8 bits and convert to decimal, then to the matching ASCII character. Four characters, one signature.", penalty: 60 },
      ],
      fragment: 7,
      successNote: "The four status bytes decode, letter by letter, to a signature that should never appear inside Avengers infrastructure.",
      evidenceTitle: "Binary Signature Log",
      consequence: [
        "ACCESS GRANTED.",
        "The signature resolves on screen, sitting there like a signature always does \u2014 confident, deliberate, unmissable.",
        "Whoever left it wanted it found."
      ],
    },

    // ---------------------------------------------------------------- STAGE 2
    {
      key: "signal",
      name: "THE HIDDEN SIGNAL",
      story: [
        "The breach trace points to a relay tower outside the last known Avengers safehouse.",
        "Before it went dark, the tower caught a single outbound transmission \u2014 badly clipped, but intact enough to capture.",
        "Whoever sent it wanted someone who still had access to hear it. That's you, now."
      ],
      investigationType: "signal",
      signalPayload: "VEhFIENPUkUgSVMgTk9ERS0wNA==",
      signalMeta: [
        { k: "FREQ", v: "417.22 MHz" },
        { k: "SIGNAL", v: "38%" },
        { k: "PACKET LOSS", v: "61%" },
        { k: "ENCODING", v: "UNKNOWN" },
      ],
      question: "The recovered payload is text, but not in plain form. Decode it and enter the node designation it names as Doom's hiding place for the CORE.",
      validate: (raw) => normalizeTight(raw) === "NODE04",
      hints: [
        { text: "The character set is limited to A\u2013Z, a\u2013z, 0\u20139, +, /, and padding with =. That's a strong tell for a common text-to-text encoding, not a cipher.", penalty: 30 },
        { text: "It's Base64. Decode it and you'll get a full sentence naming the node \u2014 answer with just that node's designation.", penalty: 60 },
      ],
      fragment: 42,
      successNote: "Decoded, the transmission reads: THE CORE IS NODE-04. The Avengers knew exactly where Doom was hiding it.",
      evidenceTitle: "Decoded Transmission",
      consequence: [
        "ACCESS GRANTED.",
        "Someone on the inside sent that before the tower died. They knew the network's shape well enough to name its heart.",
        "Now you need to reach it \u2014 without walking into whatever took the rest of the relay down."
      ],
    },

    // ---------------------------------------------------------------- STAGE 3
    {
      key: "network",
      name: "DOOM'S NETWORK",
      story: [
        "The node named in the transmission sits four hops deep inside a network Doom rebuilt from the Avengers' own bones.",
        "A live map resolves on screen: five nodes, some still trustworthy, one openly hostile.",
        "One wrong hop and the trace announces itself to everything downstream."
      ],
      investigationType: "network",
      question: "Trace a path from NODE-01 to CORE that never passes through a compromised node. Enter it as a comma-separated route, e.g. NODE-01,NODE-03,NODE-04,CORE.",
      validate: (raw) => normalizeTight(raw) === "NODE01NODE03NODE04CORE",
      hints: [
        { text: "NODE-02 is flagged COMPROMISED in the inspector \u2014 any route through it burns the trace immediately.", penalty: 30 },
        { text: "From NODE-01 you can reach NODE-02 or NODE-03. Only one of those still has a safe onward path to NODE-04 and then CORE.", penalty: 60 },
      ],
      fragment: 13,
      successNote: "The safe route runs NODE-01 \u2192 NODE-03 \u2192 NODE-04 \u2192 CORE, four hops clean.",
      evidenceTitle: "Verified Network Route",
      consequence: [
        "ACCESS GRANTED.",
        "The trace slides through without tripping a single flag.",
        "Deep inside CORE's directory structure, you find something the Avengers left behind on purpose: an unfinished protocol."
      ],
    },

    // ---------------------------------------------------------------- STAGE 4
    {
      key: "protocol",
      name: "THE AVENGERS PROTOCOL",
      story: [
        "The file is called <strong>unlock.protocol</strong> \u2014 a small function, clearly written in a hurry, clearly written to be finished by someone else.",
        "Whoever wrote it ran out of time before they could fix it.",
        "It still runs. It just doesn't run correctly."
      ],
      investigationType: "code",
      codeLines: [
        "function unlock(code) {",
        "  let sum = 0;",
        "  for (let i = 0; i <= code.length; i++) {",
        "    sum += code[i];",
        "  }",
        "  return sum;",
        "}",
        "",
        "unlock([2, 3, 1, 3]);"
      ],
      buggyLineIndex: 2,
      question: "The loop condition reads past the end of the array, so the real function returns NaN. If you fix that one off-by-one error, what number does unlock([2, 3, 1, 3]) actually return?",
      validate: (raw) => digitsOnly(raw) === "9",
      hints: [
        { text: "The loop uses i <= code.length. An array with 4 elements has valid indexes 0 through 3 \u2014 not 4.", penalty: 30 },
        { text: "Fix the condition to i < code.length, then sum 2 + 3 + 1 + 3 by hand.", penalty: 60 },
      ],
      fragment: 9,
      successNote: "Corrected, the function simply sums the array: 2 + 3 + 1 + 3 = 9.",
      evidenceTitle: "Corrected Protocol Function",
      consequence: [
        "ACCESS GRANTED.",
        "The corrected function returns a single value \u2014 clearly meant to be combined with something else, later.",
        "A countdown you haven't seen before starts on the periphery of the screen. Doom knows you're close."
      ],
    },

    // ---------------------------------------------------------------- STAGE 5
    {
      key: "final",
      name: "THE LAST PROTOCOL",
      story: [
        "05:00.",
        "That's what the Doom Core's own countdown reads the moment you reach it \u2014 not yours. Its.",
        "Every fragment you've recovered so far was never a separate answer. It was one digit of a single key, in the order you found it."
      ],
      investigationType: "final",
      question: "Enter the override sequence: the four fragments you recovered, combined in the order you discovered them.",
      validate: (raw) => digitsOnly(raw) === "742139",
      hints: [
        { text: "You already have all four numbers \u2014 check the evidence database. Nothing needs to be calculated, only assembled.", penalty: 30 },
        { text: "Order matters: Stage 1's fragment first, then Stage 2's, then Stage 3's, then Stage 4's, concatenated into one sequence.", penalty: 60 },
      ],
      fragment: null,
      successNote: "7 \u2014 42 \u2014 13 \u2014 9. Assembled in order, the override sequence is accepted.",
      evidenceTitle: "Override Sequence",
      consequence: [
        "The core stabilizes. For half a second the countdown reads all zeros and simply stays there.",
        "Somewhere behind the noise, a transmission opens on its own."
      ],
    },
  ];

  /* ========================================================================
     9. STAGE RENDERING ENGINE
     ==================================================================== */
  function stageIndexTotal() { return STAGES.length; }

  function renderStageTracker() {
    const nav = qs("#stage-tracker");
    nav.innerHTML = "";
    STAGES.forEach((s, idx) => {
      const done = state.solvedPuzzles.includes(s.key);
      const current = idx === state.currentStageIndex && !done;
      const pill = el("span", "stage-pill" + (done ? " is-done" : "") + (current ? " is-current" : ""));
      pill.textContent = "STAGE " + (idx + 1) + (idx < 4 ? "" : " \u2014 FINAL") + (done ? " \u2713" : current ? "" : " \u{1F512}");
      nav.appendChild(pill);
    });
  }

  function updateProgressBar() {
    const pct = Math.round((state.solvedPuzzles.length / STAGES.length) * 100);
    qs("#progress-fill").style.width = pct + "%";
    qs("#progress-pct").textContent = pct + "%";
  }

  function showGameScreen() {
    qs("#screen-landing").classList.remove("is-active");
    qs("#screen-game").classList.add("is-active");
  }

  function renderStage() {
    renderStageTracker();
    updateProgressBar();
    renderEvidence();

    const stage = STAGES[state.currentStageIndex];
    const viewport = qs("#stage-viewport");
    viewport.innerHTML = "";

    if (state.phase === "story") {
      viewport.appendChild(buildStoryBlock(stage));
    } else if (state.phase === "investigation") {
      viewport.appendChild(buildInvestigationBlock(stage));
    } else if (state.phase === "puzzle") {
      viewport.appendChild(buildInvestigationBlock(stage, true));
      viewport.appendChild(buildPuzzleCard(stage));
    } else if (state.phase === "consequence") {
      viewport.appendChild(buildConsequenceBlock(stage));
    } else if (state.phase === "final-sequence") {
      runFinalSequence(viewport);
    } else if (state.phase === "results") {
      buildResultsScreen(viewport);
    }
  }

  function buildStoryBlock(stage) {
    const wrap = el("div", "story-block");
    wrap.innerHTML =
      '<p class="story-eyebrow">STAGE ' + (STAGES.indexOf(stage) + 1) + " \u00b7 " + stage.name + "</p>" +
      '<h2 class="story-title">' + stage.name + "</h2>" +
      '<div class="story-text">' + stage.story.map((p) => "<p>" + p + "</p>").join("") + "</div>";
    const actions = el("div", "story-actions");
    const btn = el("button", "btn btn--primary", "BEGIN INVESTIGATION");
    btn.addEventListener("click", () => {
      SoundManager.play("click");
      state.phase = "investigation";
      saveState();
      renderStage();
    });
    actions.appendChild(btn);
    wrap.appendChild(actions);
    return wrap;
  }

  function buildInvestigationBlock(stage, compact) {
    const wrap = el("div", "story-block");
    if (!compact) {
      wrap.innerHTML = '<p class="story-eyebrow">INVESTIGATION</p>';
    }
    const widgetHost = el("div");
    wrap.appendChild(widgetHost);

    if (stage.investigationType === "terminal") widgetHost.appendChild(buildTerminal(stage));
    if (stage.investigationType === "signal") widgetHost.appendChild(buildSignalBlock(stage));
    if (stage.investigationType === "network") widgetHost.appendChild(buildNetworkMap(stage));
    if (stage.investigationType === "code") widgetHost.appendChild(buildCodeBlock(stage));
    if (stage.investigationType === "final") widgetHost.appendChild(buildFinalRecap(stage));

    if (!compact) {
      const actions = el("div", "story-actions");
      const btn = el("button", "btn btn--primary", "PROCEED TO PUZZLE");
      btn.addEventListener("click", () => {
        SoundManager.play("click");
        state.phase = "puzzle";
        saveState();
        renderStage();
      });
      actions.appendChild(btn);
      wrap.appendChild(actions);
    }
    return wrap;
  }

  function buildConsequenceBlock(stage) {
    const wrap = el("div", "story-block");
    const isLast = STAGES.indexOf(stage) === STAGES.length - 1;
    wrap.innerHTML =
      '<p class="story-eyebrow" style="color:var(--doom-green)">ACCESS GRANTED</p>' +
      '<h2 class="story-title">' + stage.name + " \u2014 CLEARED</h2>" +
      '<div class="story-text">' + stage.consequence.map((p) => "<p>" + p + "</p>").join("") + "</div>";
    const actions = el("div", "story-actions");
    const btn = el("button", "btn btn--primary", isLast ? "PROCEED" : "CONTINUE");
    btn.addEventListener("click", () => {
      SoundManager.play("click");
      if (isLast) {
        state.phase = "final-sequence";
        saveState();
        renderStage();
        return;
      }
      state.currentStageIndex += 1;
      state.phase = "story";
      saveState();
      renderStage();
      triggerStageIntroDialogue();
    });
    actions.appendChild(btn);
    wrap.appendChild(actions);
    return wrap;
  }

  function triggerStageIntroDialogue() {
    const idx = state.currentStageIndex;
    const lines = {
      1: ["You found the signature. Good. I left it there on purpose.", "Let's see if you can follow a signal as well as you can read a log."],
      2: ["Curiosity. The Avengers had so much of it, right up until they didn't.", "My network doesn't forgive wrong turns."],
      3: ["Clever. Predictable, but clever.", "The next lock isn't mine. It's theirs \u2014 unfinished, the way everything they built always was."],
    };
    if (lines[idx]) Doom.say(lines[idx]);
  }

  /* ========================================================================
     10. PUZZLE CARD WIRING
     ==================================================================== */
  function buildPuzzleCard(stage) {
    const tpl = qs("#tpl-puzzle-card");
    const node = tpl.content.cloneNode(true);
    const card = node.querySelector(".puzzle-card");

    card.querySelector(".puzzle-card__title").textContent = stage.name.toUpperCase();
    card.querySelector(".puzzle-card__clue").textContent = stage.question;

    const input = card.querySelector(".puzzle-card__input");
    const submitBtn = card.querySelector(".puzzle-card__submit");
    const feedback = card.querySelector(".puzzle-feedback");
    const hintBtn = card.querySelector("#btn-request-hint");
    const penaltyEl = card.querySelector("#puzzle-penalty");

    function submit() {
      const val = input.value;
      if (!val.trim()) return;
      if (stage.validate(val)) {
        feedback.textContent = "ACCESS GRANTED \u2014 " + stage.successNote;
        feedback.className = "puzzle-feedback is-granted";
        SoundManager.play("success");
        input.disabled = true;
        submitBtn.disabled = true;
        hintBtn.disabled = true;

        state.solvedPuzzles.push(stage.key);
        if (stage.fragment !== null && stage.fragment !== undefined) {
          state.fragments[stage.key] = stage.fragment;
        }
        addEvidence(stage.key, stage.evidenceTitle, stage.successNote + (stage.fragment ? " FRAGMENT RECOVERED: " + stage.fragment + "." : ""));

        if (stage.key === "final") {
          state.completed = true;
        }
        saveState();
        updateProgressBar();
        renderStageTracker();

        setTimeout(() => {
          state.phase = "consequence";
          saveState();
          renderStage();
        }, 1100);
      } else {
        feedback.textContent = "ACCESS DENIED \u2014 response not recognized.";
        feedback.className = "puzzle-feedback is-denied";
        SoundManager.play("alert");
        void feedback.offsetWidth; // restart shake animation
      }
    }

    submitBtn.addEventListener("click", submit);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });

    hintBtn.addEventListener("click", () => openHintModal(stage, penaltyEl));

    return card;
  }

  function openHintModal(stage, penaltyEl) {
    const used = state.hintsUsed[stage.key] || [];
    const modal = qs("#hint-modal");
    const list = qs("#hint-list");
    list.innerHTML = "";

    stage.hints.forEach((h, idx) => {
      const item = el("div", "hint-item");
      const already = used.includes(idx);
      item.innerHTML =
        '<div class="hint-item__head"><span>HINT ' + (idx + 1) + "</span><span>TIME PENALTY: -" + h.penalty + " SEC</span></div>" +
        (already ? '<p class="hint-item__text">' + h.text + "</p>" : "");
      if (!already) {
        const btn = el("button", "btn btn--ghost btn--sm hint-item__btn", "REVEAL HINT");
        btn.addEventListener("click", () => {
          used.push(idx);
          state.hintsUsed[stage.key] = used;
          applyPenalty(h.penalty);
          saveState();
          if (penaltyEl) {
            const total = used.reduce((sum, i) => sum + stage.hints[i].penalty, 0);
            penaltyEl.textContent = "TIME PENALTY TAKEN: -" + total + " SEC";
          }
          openHintModal(stage, penaltyEl);
        });
        item.appendChild(btn);
      }
      list.appendChild(item);
    });

    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    qs("#hint-backdrop").classList.add("is-active");
  }

  function closeHintModal() {
    qs("#hint-modal").classList.remove("is-active");
    qs("#hint-modal").setAttribute("aria-hidden", "true");
    qs("#hint-backdrop").classList.remove("is-active");
  }

  /* ========================================================================
     11. STAGE-SPECIFIC WIDGETS
     ==================================================================== */

  // ---- 11a. Terminal (Stage 1) ------------------------------------------
  function buildTerminal(stage) {
    const wrap = el("div", "terminal");
    wrap.innerHTML =
      '<div class="terminal__bar"><span class="terminal__dot"></span><span class="terminal__dot"></span><span class="terminal__dot"></span>' +
      '<span class="terminal__title">DOOM-OS v9.4 :: emergency relay session</span></div>' +
      '<div class="terminal__body" id="term-body" role="log" aria-live="polite"></div>' +
      '<div class="terminal__inputrow"><span class="terminal__prompt">&gt;</span>' +
      '<input type="text" id="term-input" class="terminal__input" autocomplete="off" spellcheck="false" placeholder="type help"></div>';

    const body = () => wrap.querySelector("#term-body");
    const input = () => wrap.querySelector("#term-input");

    function printLine(text, cls) {
      const line = el("div", "terminal__line" + (cls ? " " + cls : ""), text);
      body().appendChild(line);
      body().scrollTop = body().scrollHeight;
    }

    const bootLog = [
      ["[02:13:41] SYSTEM BOOT", ""],
      ["[02:13:42] AVENGERS NETWORK OFFLINE", ""],
      ["[02:13:43] UNKNOWN USER DETECTED", "err"],
      ["[02:13:44] ROOT ACCESS GRANTED", "err"],
      ["[02:13:45] DIAG :: SUBSYSTEM-A STATUS BYTE 01000100", ""],
      ["[02:13:45] DIAG :: SUBSYSTEM-B STATUS BYTE 01001111", ""],
      ["[02:13:46] DIAG :: SUBSYSTEM-C STATUS BYTE 01001111", ""],
      ["[02:13:46] DIAG :: SUBSYSTEM-D STATUS BYTE 01001101", ""],
      ["[02:13:47] TRACE INITIATED: NODE-07", "dim"],
      ["[02:13:48] SIGNAL LOST", "dim"],
    ];

    function runCommand(raw) {
      const cmd = raw.trim().toLowerCase();
      printLine("> " + raw, "dim");
      if (!cmd) return;
      switch (cmd) {
        case "help":
          printLine("Available commands: scan, status, logs, evidence, hint, clear");
          break;
        case "status":
          printLine("RELAY STATUS: COMPROMISED  |  ROOT ACCESS: UNKNOWN USER  |  UPLINK: UNSTABLE");
          break;
        case "scan":
          printLine("Scanning...");
          setTimeout(() => {
            printLine("NODE-01 ........ ONLINE");
            printLine("NODE-02 ........ COMPROMISED", "err");
            printLine("NODE-03 ........ ONLINE");
            printLine("NODE-04 ........ UNKNOWN", "dim");
          }, 350);
          break;
        case "logs":
          bootLog.forEach(([text, cls], i) => setTimeout(() => printLine(text, cls), i * 90));
          break;
        case "evidence":
          printLine(state.evidence.length + " item(s) in evidence database. Open the EVIDENCE panel above to review.");
          break;
        case "hint":
          printLine("Use the REQUEST HINT button on the puzzle card once you reach it.", "dim");
          break;
        case "clear":
          body().innerHTML = "";
          break;
        case "trace":
          printLine("TRACE ROUTE: relay -> substation-9 -> ??? -> LATVERIA-NET", "err");
          addEvidence("hidden-trace", "Unlisted Trace Hop", "A command not listed in HELP reveals a partial route into Latveria-Net itself.");
          break;
        case "?":
          printLine("You found a door I didn't lock. That happens more than I'd like.", "err");
          break;
        default:
          printLine("Unrecognized command: " + cmd + ". Type help.", "err");
      }
    }

    setTimeout(() => {
      printLine("DOOM-OS v9.4 \u2014 emergency relay session recovered.", "dim");
      bootLog.forEach(([text, cls], i) => setTimeout(() => printLine(text, cls), 260 + i * 140));
    }, 50);

    setTimeout(() => {
      const inputEl = input();
      if (!inputEl) return;
      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const v = inputEl.value;
          inputEl.value = "";
          runCommand(v);
        }
      });
    }, 0);

    return wrap;
  }

  // ---- 11b. Signal block (Stage 2) --------------------------------------
  function buildSignalBlock(stage) {
    const wrap = el("div", "signal-block");
    const bars = new Array(48).fill(0).map(() => '<span style="animation-delay:' + (Math.random() * 1) + 's"></span>').join("");
    wrap.innerHTML =
      '<div class="signal-meta">' +
      stage.signalMeta.map((m) => "<span><strong>" + m.k + ":</strong> " + m.v + "</span>").join("") +
      "</div>" +
      '<div class="waveform">' + bars + "</div>" +
      '<div class="signal-payload">' + stage.signalPayload + "</div>";
    return wrap;
  }

  // ---- 11c. Code block (Stage 4) -----------------------------------------
  function buildCodeBlock(stage) {
    const wrap = el("div", "code-block");
    wrap.innerHTML = stage.codeLines
      .map((line, idx) => (idx === stage.buggyLineIndex ? '<span class="code-bug">' + escapeHtml(line) + "</span>" : escapeHtml(line)))
      .join("\n");
    return wrap;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  // ---- 11d. Network map (Stage 3) ----------------------------------------
  const NET_NODES = [
    { id: "NODE-01", x: 80, y: 150, status: "online", note: "Entry point. Last confirmed clean relay before Doom's overlay begins." },
    { id: "NODE-02", x: 260, y: 70, status: "compromised", note: "COMPROMISED. Traffic here is mirrored straight back to Latveria-Net." },
    { id: "NODE-03", x: 260, y: 230, status: "online", note: "Online. Quiet, low traffic, no flags raised in six hours." },
    { id: "NODE-04", x: 460, y: 150, status: "online", note: "Online. Sits directly upstream of CORE." },
    { id: "CORE", x: 620, y: 150, status: "core", note: "Target. Everything downstream of this node is Doom's own infrastructure." },
  ];
  const NET_EDGES = [
    ["NODE-01", "NODE-02"], ["NODE-01", "NODE-03"],
    ["NODE-02", "NODE-04"], ["NODE-03", "NODE-04"],
    ["NODE-04", "CORE"],
  ];

  function buildNetworkMap(stage) {
    const wrap = el("div", "network-wrap");
    const path = state.networkPath || [];

    const edgesSvg = NET_EDGES.map(([a, b]) => {
      const na = NET_NODES.find((n) => n.id === a), nb = NET_NODES.find((n) => n.id === b);
      return '<line class="net-edge" x1="' + na.x + '" y1="' + na.y + '" x2="' + nb.x + '" y2="' + nb.y + '"></line>';
    }).join("");

    const nodesSvg = NET_NODES.map((n) => {
      const selected = path.includes(n.id) ? " selected" : "";
      return (
        '<g class="net-node ' + n.status + selected + '" tabindex="0" role="button" aria-label="' + n.id + '" data-id="' + n.id + '">' +
        '<circle cx="' + n.x + '" cy="' + n.y + '" r="26"></circle>' +
        '<text x="' + n.x + '" y="' + (n.y + 42) + '">' + n.id + "</text>" +
        "</g>"
      );
    }).join("");

    wrap.innerHTML =
      '<svg class="network-svg" viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg">' + edgesSvg + nodesSvg + "</svg>" +
      '<div class="net-inspector" id="net-inspector">Click a node to inspect it. NODE-01 is the entry point.</div>' +
      '<div class="net-path-readout" id="net-path-readout"></div>' +
      '<div class="net-controls">' +
      '<button class="btn btn--ghost btn--sm" id="net-reset">RESET PATH</button>' +
      '<button class="btn btn--primary btn--sm" id="net-lock">LOCK PATH</button>' +
      "</div>";

    function updateReadout() {
      qs("#net-path-readout", wrap).textContent = state.networkPath.length ? state.networkPath.join(" \u2192 ") : "";
    }
    updateReadout();

    function selectNode(id) {
      const node = NET_NODES.find((n) => n.id === id);
      qs("#net-inspector", wrap).textContent = id + " :: " + node.status.toUpperCase() + " \u2014 " + node.note;

      const p = state.networkPath;
      const last = p[p.length - 1];
      const isAdjacent = !last || NET_EDGES.some(([a, b]) => (a === last && b === id) || (b === last && a === id));

      if (id === "NODE-01" && p.length === 0) {
        p.push(id);
      } else if (isAdjacent && last && !p.includes(id)) {
        p.push(id);
      } else if (p.includes(id) && p[p.length - 1] === id) {
        p.pop(); // clicking the last selected node again undoes it
      }
      saveState();
      qsa(".net-node", wrap).forEach((g) => g.classList.toggle("selected", state.networkPath.includes(g.dataset.id)));
      updateReadout();
    }

    qsa(".net-node", wrap).forEach((g) => {
      g.addEventListener("click", () => selectNode(g.dataset.id));
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectNode(g.dataset.id); } });
    });

    qs("#net-reset", wrap).addEventListener("click", () => {
      state.networkPath = [];
      saveState();
      qsa(".net-node", wrap).forEach((g) => g.classList.remove("selected"));
      updateReadout();
      qs("#net-inspector", wrap).textContent = "Path cleared. Click a node to inspect it.";
    });

    qs("#net-lock", wrap).addEventListener("click", () => {
      const answerInput = qs(".puzzle-card__input");
      if (answerInput) {
        answerInput.value = state.networkPath.join(",");
        answerInput.focus();
      } else {
        // not yet on puzzle phase — jump there
        state.phase = "puzzle";
        saveState();
        renderStage();
        setTimeout(() => {
          const inp = qs(".puzzle-card__input");
          if (inp) inp.value = state.networkPath.join(",");
        }, 0);
      }
    });

    return wrap;
  }

  // ---- 11e. Final recap (Stage 5 investigation) --------------------------
  function buildFinalRecap(stage) {
    const wrap = el("div");
    const rows = STAGES.slice(0, 4).map((s, idx) => {
      const val = state.fragments[s.key];
      return '<div class="log-line">FRAGMENT ' + (idx + 1) + " (" + s.name + "): " + (val !== undefined ? val : "?") + "</div>";
    }).join("");
    wrap.innerHTML = '<div class="log-block">' + rows + '<div class="log-line log-alert">CORE COUNTDOWN: 05:00</div></div>';
    return wrap;
  }

  /* ========================================================================
     12. FINAL CINEMATIC SEQUENCE + RESULTS
     ==================================================================== */
  function runFinalSequence(viewport) {
    const wrap = el("div", "story-block");
    wrap.innerHTML =
      '<p class="story-eyebrow" style="color:var(--doom-red)">DOOMSDAY PROTOCOL</p>' +
      '<h2 class="story-title" id="final-headline">TERMINATED</h2>' +
      '<div class="log-block" id="final-log"></div>';
    viewport.appendChild(wrap);

    const log = wrap.querySelector("#final-log");
    const steps = [
      ["DOOMSDAY PROTOCOL ... TERMINATED", ""],
      ["AVENGERS NETWORK ... RESTORING", "dim"],
      ["RESTORATION: 10%", "dim"],
      ["RESTORATION: 34%", "dim"],
      ["RESTORATION: 67%", "dim"],
      ["RESTORATION: 100%", ""],
      ["EARTH STATUS: STABLE", ""],
    ];
    steps.forEach(([text, cls], i) => {
      setTimeout(() => {
        const line = el("div", "log-line" + (cls ? " " + cls : ""), text);
        log.appendChild(line);
      }, 500 + i * 500);
    });

    setTimeout(() => {
      Doom.say(
        [
          "You stopped the protocol.",
          "Congratulate yourself. Briefly.",
          "But you still haven't discovered who activated it.",
        ],
        () => {
          state.phase = "results";
          saveState();
          renderStage();
        }
      );
    }, 500 + steps.length * 500 + 400);
  }

  function computeRating(timeLeft, hintCount) {
    if (timeLeft > 15 * 60 && hintCount === 0) return "S";
    if (timeLeft > 8 * 60 && hintCount <= 2) return "A";
    if (timeLeft > 2 * 60 && hintCount <= 5) return "B";
    return "C";
  }

  function buildResultsScreen(viewport) {
    const timeLeft = Math.max(0, remainingSeconds());
    const hintCount = Object.values(state.hintsUsed).reduce((sum, arr) => sum + arr.length, 0);
    const rating = computeRating(timeLeft, hintCount);

    const leaderboard = loadLeaderboard();
    const playerTimeUsed = TOTAL_TIME_SECONDS - timeLeft;
    leaderboard.push({ name: "YOU", time: playerTimeUsed, rating });
    leaderboard.sort((a, b) => a.time - b.time);
    saveLeaderboard(leaderboard.slice(0, 10));

    const wrap = el("div", "story-block");
    wrap.innerHTML =
      '<p class="story-eyebrow">MISSION COMPLETE</p>' +
      '<h2 class="story-title">BUT THE INVESTIGATION IS NOT OVER.</h2>' +
      '<div class="log-block" style="margin-bottom:1.6rem;">' +
      '<div class="log-line">TIME REMAINING: ' + formatClock(timeLeft) + "</div>" +
      '<div class="log-line">HINTS USED: ' + hintCount + "</div>" +
      '<div class="log-line">PUZZLES SOLVED: ' + state.solvedPuzzles.length + "/" + STAGES.length + "</div>" +
      '<div class="log-line">MISSION RATING: ' + rating + "</div>" +
      "</div>" +
      '<p class="story-eyebrow">TOP AGENTS</p>' +
      '<div class="log-block" id="leaderboard-block"></div>' +
      '<div class="story-actions"><button class="btn btn--primary" id="btn-restart-after-win">START A NEW MISSION</button></div>';
    viewport.appendChild(wrap);

    const lbBlock = wrap.querySelector("#leaderboard-block");
    const finalBoard = loadLeaderboard();
    finalBoard.slice(0, 10).forEach((row, idx) => {
      const line = el("div", "log-line" + (row.name === "YOU" ? " log-alert" : ""));
      line.textContent = String(idx + 1).padStart(2, "0") + "  " + row.name.padEnd(14, " ") + "  " + formatClock(row.time) + "  [" + row.rating + "]";
      lbBlock.appendChild(line);
    });

    wrap.querySelector("#btn-restart-after-win").addEventListener("click", () => {
      resetState();
      location.reload();
    });
  }

  function loadLeaderboard() {
    try {
      const raw = localStorage.getItem(LEADERBOARD_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    // seed with a few fictional agents so the board never looks empty
    return [
      { name: "SHADOWBYTE", time: 26 * 60 + 14, rating: "S" },
      { name: "CODEPHANTOM", time: 24 * 60 + 52, rating: "A" },
      { name: "NEXUS", time: 22 * 60 + 31, rating: "A" },
    ];
  }
  function saveLeaderboard(board) {
    try { localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board)); } catch (e) {}
  }

  /* ========================================================================
     13. LANDING SCREEN + BOOT
     ==================================================================== */
  function wireLanding() {
    const hasSave = state.started && !state.completed && !state.failed;
    qs("#btn-enter-protocol").hidden = hasSave;
    qs("#btn-continue-mission").hidden = !hasSave;
    qs("#btn-new-mission").hidden = !hasSave;

    qs("#btn-enter-protocol").addEventListener("click", () => beginTransition(true));
    qs("#btn-continue-mission").addEventListener("click", () => beginTransition(false));
    qs("#btn-new-mission").addEventListener("click", () => {
      resetState();
      beginTransition(true);
    });

    const portrait = qs("#doom-portrait");
    portrait.addEventListener("error", () => {
      portrait.style.display = "none";
      qs("#doom-fallback").style.display = "block";
    });
  }

  function beginTransition(isNew) {
    SoundManager.play("click");
    const overlay = qs("#transition-overlay");
    const textEl = qs("#transition-text");
    const messages = ["ESTABLISHING UPLINK...", "BYPASSING FIREWALL...", "ACCESS: RECRUIT LEVEL"];
    let i = 0;
    overlay.classList.add("is-active");
    textEl.textContent = messages[0];
    const msgInterval = setInterval(() => {
      i++;
      if (messages[i]) textEl.textContent = messages[i];
    }, 420);

    setTimeout(() => {
      clearInterval(msgInterval);
      overlay.classList.remove("is-active");
      if (isNew) {
        state.started = true;
        state.phase = "story";
        state.currentStageIndex = 0;
        saveState();
      }
      showGameScreen();
      startTimerIfNeeded();
      renderStage();
      if (isNew) {
        Doom.say([
          "You believe you can stop me?",
          "Every system has a weakness. I built this one myself, so I know exactly where mine are hidden \u2014 and I am confident you won't find them in time.",
          "I have hidden the answer where only intelligence can find it.",
          "You have thirty minutes. Try not to waste them.",
        ]);
      }
    }, 1450);
  }

  function wireGlobalUI() {
    qs("#btn-sound-toggle").addEventListener("click", () => SoundManager.setEnabled(!state.soundOn));
    qs("#btn-sound-toggle-2").addEventListener("click", () => SoundManager.setEnabled(!state.soundOn));

    qs("#btn-open-evidence").addEventListener("click", () => toggleEvidenceDrawer(true));
    qs("#btn-close-evidence").addEventListener("click", () => toggleEvidenceDrawer(false));
    qs("#evidence-backdrop").addEventListener("click", () => toggleEvidenceDrawer(false));

    qs("#btn-close-hint").addEventListener("click", closeHintModal);
    qs("#hint-backdrop").addEventListener("click", closeHintModal);

    qs("#btn-restart-mission").addEventListener("click", () => {
      resetState();
      location.reload();
    });

    Doom.bindContinue();
    updateSoundUI();
  }

  function boot() {
    initBackground();
    wireLanding();
    wireGlobalUI();

    // If a mission was already in progress on load (e.g. mid-refresh deep in
    // the game rather than on the landing screen), resume straight into it.
    if (state.started && !state.completed && !state.failed) {
      // still show landing first so CONTINUE/NEW choice is explicit — no-op here.
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
