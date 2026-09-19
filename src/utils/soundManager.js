// Sound Manager utility with cinematic Web Audio Synthesizer
const files = {
  ambient: '/assets/audio/ambient.mp3',
  alert: '/assets/audio/alert.mp3',
  success: '/assets/audio/success.mp3',
  failure: '/assets/audio/failure.mp3',
  click: '/assets/audio/click.mp3',
  doomVoice: '/assets/audio/doom-voice.mp3',
};

const cache = {};
let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch (e) {
    // AudioContext blocked or unsupported
  }
  return audioCtx;
}

function getAudio(name) {
  if (typeof window === 'undefined') return null;
  if (!cache[name] && files[name]) {
    const a = new Audio(files[name]);
    a.volume = name === 'ambient' ? 0.35 : 0.6;
    cache[name] = a;
  }
  return cache[name];
}

// Professional synthesized cinematic audio without external file dependency
function synthSound(type) {
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state === 'suspended') return;
    const now = ctx.currentTime;

    if (type === 'breach' || type === 'success') {
      // 1. Warm sub-bass rumble
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(90, now);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.6);
      subGain.gain.setValueAtTime(0.22, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.7);

      // 2. Futuristic rising synth chime
      [330, 440, 660, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.12, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.45);
      });
    } else if (type === 'warp') {
      // Hyperspace dimensional sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.5);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(300, now + 0.5);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'engage' || type === 'chime') {
      // High-tech confirmation bell
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.1, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.4);
      });
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } else if (type === 'alert' || type === 'failure') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(140, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    }
  } catch (e) {
    // Ignore audio context issues gracefully
  }
}

export const SoundManager = {
  play(name, soundOn = false) {
    if (!soundOn) return;
    synthSound(name);
    const a = getAudio(name);
    if (!a) return;
    try {
      a.currentTime = 0;
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
    } catch (e) { /* ignore */ }
  },

  playSynth(type, soundOn = true) {
    if (!soundOn) return;
    synthSound(type);
  },

  setEnabled(on) {
    if (on) {
      getAudioContext();
      const amb = getAudio('ambient');
      if (amb) {
        amb.loop = true;
        const p = amb.play();
        if (p && p.catch) p.catch(() => {});
      }
    } else {
      Object.keys(cache).forEach((k) => cache[k] && cache[k].pause());
    }
  },
};
