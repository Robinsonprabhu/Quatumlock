// Web Speech API manager for DOOM's cinematic voice synthesis

class VoiceManager {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isMuted = false;
    this.currentUtterance = null;
    this.selectedVoice = null;
    this.initialized = false;
    this.subscribers = new Set();
    
    if (this.synth) {
      this.initVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Prefer deep, authoritative male voices if available
    const preferredVoices = [
      'Google UK English Male',
      'Microsoft George Online (Natural) - English (United Kingdom)',
      'Microsoft David - English (United States)',
      'Daniel',
      'Oliver',
      'en-GB-Wavenet-B',
      'en-US-Standard-J',
      'Google US English'
    ];

    for (const name of preferredVoices) {
      const found = voices.find(v => v.name.includes(name) || v.voiceURI.includes(name));
      if (found) {
        this.selectedVoice = found;
        break;
      }
    }

    if (!this.selectedVoice) {
      // Fallback to any male or English voice
      this.selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george'))) || voices[0];
    }

    this.initialized = true;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(event, data) {
    this.subscribers.forEach(cb => cb(event, data));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stop();
    }
    this.notify('muteChange', this.isMuted);
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    if (this.isMuted) {
      this.stop();
    }
    this.notify('muteChange', this.isMuted);
  }

  speak(text, { pitch = 0.68, rate = 0.88, volume = 1.0, emotion = 'neutral', onStart, onEnd } = {}) {
    if (this.isMuted || !this.synth || !text) {
      if (onEnd) setTimeout(onEnd, 300);
      return;
    }

    try {
      this.synth.cancel();

      // Clean markdown, tags, or code snippets for cleaner speech
      const cleanText = text
        .replace(/`[^`]*`/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_~#]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) {
        if (onEnd) onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      // Emotional modulations
      switch (emotion) {
        case 'enraged':
        case 'threatening':
          utterance.pitch = Math.max(0.5, pitch - 0.15);
          utterance.rate = rate + 0.08;
          break;
        case 'amused':
        case 'deceptive':
          utterance.pitch = pitch + 0.05;
          utterance.rate = Math.max(0.75, rate - 0.05);
          break;
        case 'glitching':
          utterance.pitch = pitch - 0.2;
          utterance.rate = rate * 1.2;
          break;
        case 'calculating':
          utterance.pitch = pitch;
          utterance.rate = 0.82;
          break;
        default:
          utterance.pitch = pitch;
          utterance.rate = rate;
      }

      utterance.volume = volume;

      utterance.onstart = () => {
        this.notify('speakStart', { text: cleanText, emotion });
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.notify('speakEnd', { text: cleanText });
        if (onEnd) onEnd();
      };

      utterance.onerror = (err) => {
        console.warn('VoiceManager SpeechSynthesis error:', err);
        this.notify('speakEnd', { text: cleanText, error: err });
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('VoiceManager failed to execute speak:', e);
      if (onEnd) onEnd();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.notify('speakEnd', { stopped: true });
  }
}

export const voiceManager = new VoiceManager();
