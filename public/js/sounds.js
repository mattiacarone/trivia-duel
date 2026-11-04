// Web Audio API Synthesizer for Trivia Duel Party Game
// 100% standalone, studio-grade retro-arcade & game-show SFX

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initOnFirstInteraction();
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initOnFirstInteraction() {
    const unlock = () => {
      this.init();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Cheerful pop with warm harmonic bounce
  playPop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, t);
    osc.frequency.exponentialRampToValueAtTime(840, t + 0.08);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Answer lock-in chord chime (Crisp dual-tone synthesizer)
  playLockIn() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [523.25, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.12);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.16);
    });
  }

  // Countdown timer tick (Punchy woodblock with resonant decay)
  playTick(urgent = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = urgent ? 'sawtooth' : 'triangle';
    const freq = urgent ? 987.77 : 659.25; // B5 (urgent) or E5 (normal)
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t + 0.045);

    gain.gain.setValueAtTime(urgent ? 0.28 : 0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Correct answer triumphant major arpeggio with chorus shimmer
  playCorrect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.065;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  // Comical wrong answer "womp womp" buzzer
  playWrong() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [220, 207.65, 196].forEach((baseFreq, idx) => {
      const noteTime = t + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, noteTime);
      osc.frequency.linearRampToValueAtTime(baseFreq * 0.88, noteTime + 0.18);

      gain.gain.setValueAtTime(0.22, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.2);
    });
  }

  // Grand Olympic Fanfare with rich harmonic brass layers
  playFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const chordTimes = [0, 0.14, 0.28, 0.48, 0.68, 0.95];
    const chords = [
      [523.25, 659.25],         // C5, E5
      [523.25, 659.25],
      [523.25, 659.25],
      [659.25, 783.99],         // E5, G5
      [783.99, 987.77],         // G5, B5
      [1046.5, 1318.51, 1567.98] // C6, E6, G6 (Grand triumph)
    ];

    chords.forEach((chord, i) => {
      const t = this.ctx.currentTime + chordTimes[i];
      const duration = (i === chords.length - 1) ? 1.1 : 0.13;

      chord.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = (i === chords.length - 1) ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + duration);
      });
    });
  }

  // Spectrum dial dragging subtle haptic tick sound
  playDialTick(pitchFactor = 1.0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320 * pitchFactor, t);
    osc.frequency.exponentialRampToValueAtTime(480 * pitchFactor, t + 0.025);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.035);
  }

  // High-energy transitional whoosh
  playWhoosh() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.22);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, t);
    filter.frequency.exponentialRampToValueAtTime(1800, t + 0.1);
    filter.frequency.exponentialRampToValueAtTime(250, t + 0.22);
    filter.Q.value = 2.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  // Toggleable Synthesized Upbeat Background Party Groove (BGM)
  toggleBGM() {
    this.bgmPlaying = !this.bgmPlaying;
    if (this.bgmPlaying) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
    return this.bgmPlaying;
  }

  startBGM() {
    this.init();
    if (!this.ctx || this.bgmTimer) return;
    this.bgmStep = 0;
    const bpm = 124;
    const stepTime = (60 / bpm) / 4; // 16th notes

    // Warm disco/synth-pop bassline (C -> Am -> F -> G)
    const bassNotes = [
      130.81, 0, 130.81, 0,  110.00, 0, 110.00, 0,  87.31, 0, 87.31, 0,  98.00, 0, 98.00, 0
    ];

    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.bgmPlaying) return;
      const t = this.ctx.currentTime;
      const note = bassNotes[this.bgmStep % bassNotes.length];

      if (note > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, t);
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      }

      // Soft disco hi-hat on offbeats
      if (this.bgmStep % 2 === 1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(5000, t);
        gain.gain.setValueAtTime(0.012, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.025);
      }

      this.bgmStep++;
    }, stepTime * 1000);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

// Global singleton instance
window.sound = new SoundEngine();
