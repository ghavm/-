// Web Audio API pure synthesizer - zero external asset dependencies

export type AmbientTrack = 'warmth' | 'rain' | 'waves' | 'campfire' | 'bowl' | 'forest' | 'chimes';

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOscillators: (OscillatorNode | AudioBufferSourceNode | { stop: () => void; disconnect: () => void })[] = [];
  private intervals: (ReturnType<typeof setInterval> | ReturnType<typeof setTimeout> | number)[] = [];
  public isAmbientPlaying = false;
  public currentSoundtrack: AmbientTrack = 'warmth';
  public volume: number = 0.85; // Default volume: 85% for clear, rich audibility

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.compressor && this.ctx) {
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-8, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);
      this.compressor.connect(this.ctx.destination);
    }
  }

  private getDestination(): AudioNode {
    return this.compressor || (this.ctx ? this.ctx.destination : (null as unknown as AudioNode));
  }

  // Set ambient & sound volume (0.0 to 1.0)
  public setVolume(newVol: number) {
    this.volume = Math.max(0.1, Math.min(1.0, newVol));
    if (this.ambientGain && this.ctx) {
      const targetGain = this.volume * 0.92;
      this.ambientGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.1);
    }
  }

  // Play gentle celebratory chime upon mission completion
  public playSuccessChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major uplifting chord)

      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.1);

        gain.gain.setValueAtTime(0, now + index * 0.1);
        gain.gain.linearRampToValueAtTime(0.48 * this.volume, now + index * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 1.4);

        osc.connect(gain);
        gain.connect(this.getDestination());

        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 1.4);
      });
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  // Play soft subtle bubble/tap feedback
  public playSoftTap() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.08);

      gain.gain.setValueAtTime(0.32 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignored
    }
  }

  // Play heroic retro arcade game start fanfare
  public playGameStart() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Energetic ascending chime sequence (C4, E4, G4, C5, E5, G5, C6)
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.065);

        gain.gain.setValueAtTime(0, now + idx * 0.065);
        gain.gain.linearRampToValueAtTime(0.42 * this.volume, now + idx * 0.065 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.065 + (idx === notes.length - 1 ? 0.9 : 0.22));

        osc.connect(gain);
        gain.connect(this.getDestination());
        osc.start(now + idx * 0.065);
        osc.stop(now + idx * 0.065 + 1.0);
      });
    } catch {
      // Audio context might be blocked
    }
  }

  // Play continuous relaxing nature soundscape (warm calming drone & harmonics)
  public toggleAmbientSoundscape(soundType: AmbientTrack = 'warmth'): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isAmbientPlaying && this.currentSoundtrack === soundType) {
      this.stopAmbient();
      return false;
    }

    this.currentSoundtrack = soundType;
    this.startAmbient(soundType);
    return true;
  }

  public startAmbient(soundType: AmbientTrack) {
    if (!this.ctx) {
      this.initContext();
    }
    if (!this.ctx) return;
    this.stopAmbient();

    this.currentSoundtrack = soundType;
    this.ambientGain = this.ctx.createGain();
    const targetGain = this.volume * 0.92;
    this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.6);
    this.ambientGain.connect(this.getDestination());

    const now = this.ctx.currentTime;

    if (soundType === 'warmth') {
      // Warm Sunlight: Peaceful analog dream pad (C Major 9th) + Lowpass warmth filter
      const warmChord = [130.81, 196.00, 261.63, 329.63, 493.88];
      
      const warmFilter = this.ctx.createBiquadFilter();
      warmFilter.type = 'lowpass';
      warmFilter.frequency.setValueAtTime(620, now);
      warmFilter.connect(this.ambientGain);

      warmChord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const noteVol = (0.55 / warmChord.length) * (idx === 0 ? 1.4 : 1.0);
        noteGain.gain.setValueAtTime(0.01, now);
        noteGain.gain.linearRampToValueAtTime(noteVol, now + 1.2);

        osc.connect(noteGain);
        noteGain.connect(warmFilter);

        osc.start(now);
        this.ambientOscillators.push(osc);
      });

      const playSunDrop = () => {
        if (!this.ctx || !this.ambientGain || !this.isAmbientPlaying || this.currentSoundtrack !== 'warmth') return;
        const sparkleNotes = [523.25, 659.25, 783.99, 1046.5];
        const note = sparkleNotes[Math.floor(Math.random() * sparkleNotes.length)];
        const dropOsc = this.ctx.createOscillator();
        const dropGain = this.ctx.createGain();

        dropOsc.type = 'sine';
        dropOsc.frequency.setValueAtTime(note, this.ctx.currentTime);

        dropGain.gain.setValueAtTime(0, this.ctx.currentTime);
        dropGain.gain.linearRampToValueAtTime(0.24, this.ctx.currentTime + 0.05);
        dropGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);

        dropOsc.connect(dropGain);
        dropGain.connect(this.ambientGain);

        dropOsc.start(this.ctx.currentTime);
        dropOsc.stop(this.ctx.currentTime + 2.5);
      };

      const intervalId = setInterval(() => {
        playSunDrop();
      }, 3400);
      this.intervals.push(intervalId);

    } else if (soundType === 'waves') {
      // Gentle Ocean Waves: Rhythmic tidal swell using filtered pink noise + slow LFO
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.96 * b1 + white * 0.1;
        b2 = 0.86 * b2 + white * 0.25;
        output[i] = (b0 + b1 + b2) * 0.16;
      }

      const waveSource = this.ctx.createBufferSource();
      waveSource.buffer = noiseBuffer;
      waveSource.loop = true;

      const waveFilter = this.ctx.createBiquadFilter();
      waveFilter.type = 'lowpass';
      waveFilter.frequency.setValueAtTime(320, now);

      // Slow 0.08Hz LFO wave swell (approx. 12-second ocean breath)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, now);
      lfoGain.gain.setValueAtTime(240, now); // Modulate filter

      lfo.connect(lfoGain);
      lfoGain.connect(waveFilter.frequency);
      lfo.start(now);

      waveSource.connect(waveFilter);
      waveFilter.connect(this.ambientGain);
      waveSource.start(now);

      this.ambientOscillators.push(waveSource, lfo);

    } else if (soundType === 'campfire') {
      // Authentic Cozy Campfire: Flickering flame breath + organic wood crackles & ember snaps
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.96 * b1 + white * 0.1;
        b2 = 0.86 * b2 + white * 0.25;
        output[i] = (b0 + b1 + b2) * 0.10;
      }

      // 1. Low warm flame roar (부드러운 장작불 저음 공기)
      const fireBed = this.ctx.createBufferSource();
      fireBed.buffer = noiseBuffer;
      fireBed.loop = true;

      const bedFilter = this.ctx.createBiquadFilter();
      bedFilter.type = 'lowpass';
      bedFilter.frequency.setValueAtTime(340, now);

      // Subtle flickering LFO for flame breathing (불꽃의 자연스러운 일렁임)
      const flameLfo = this.ctx.createOscillator();
      const flameLfoGain = this.ctx.createGain();
      flameLfo.frequency.setValueAtTime(0.28, now);
      flameLfoGain.gain.setValueAtTime(0.04, now);

      const bedGain = this.ctx.createGain();
      bedGain.gain.setValueAtTime(0.18, now);
      flameLfo.connect(flameLfoGain);
      flameLfoGain.connect(bedGain.gain);
      flameLfo.start(now);

      fireBed.connect(bedFilter);
      bedFilter.connect(bedGain);
      bedGain.connect(this.ambientGain);
      fireBed.start(now);

      // 2. High sizzle of burning embers (은은한 불꽃 자글거림/시즐)
      const sizzleSource = this.ctx.createBufferSource();
      sizzleSource.buffer = noiseBuffer;
      sizzleSource.loop = true;

      const sizzleFilter = this.ctx.createBiquadFilter();
      sizzleFilter.type = 'highpass';
      sizzleFilter.frequency.setValueAtTime(1700, now);

      const sizzleGain = this.ctx.createGain();
      sizzleGain.gain.setValueAtTime(0.045, now);

      sizzleSource.connect(sizzleFilter);
      sizzleFilter.connect(sizzleGain);
      sizzleGain.connect(this.ambientGain);
      sizzleSource.start(now);

      this.ambientOscillators.push(fireBed, flameLfo, sizzleSource);

      // 3. Realistic organic crackles & sparks (진짜 타닥거리는 장작 튀는 소리 - 톤 비프음 완전 제거)
      const playWoodSnap = (isBigPop = false) => {
        if (!this.ctx || !this.ambientGain || !this.isAmbientPlaying || this.currentSoundtrack !== 'campfire') return;
        const snapTime = this.ctx.currentTime;

        // Micro burst of noise for realistic transient click
        const snapDuration = isBigPop ? 0.035 : 0.01 + Math.random() * 0.015;
        const snapLen = Math.max(64, Math.floor(this.ctx.sampleRate * snapDuration));
        const snapBuffer = this.ctx.createBuffer(1, snapLen, this.ctx.sampleRate);
        const snapData = snapBuffer.getChannelData(0);
        for (let i = 0; i < snapLen; i++) {
          snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (snapLen * 0.28));
        }

        const snapSource = this.ctx.createBufferSource();
        snapSource.buffer = snapBuffer;

        const snapFilter = this.ctx.createBiquadFilter();
        snapFilter.type = 'bandpass';
        // Center frequency for crisp dry wood snap (1800Hz ~ 3800Hz)
        snapFilter.frequency.setValueAtTime(1800 + Math.random() * 2000, snapTime);
        snapFilter.Q.setValueAtTime(2.8 + Math.random() * 2.0, snapTime);

        const snapGain = this.ctx.createGain();
        const volume = isBigPop ? (0.24 + Math.random() * 0.08) : (0.10 + Math.random() * 0.08);
        snapGain.gain.setValueAtTime(volume, snapTime);
        snapGain.gain.exponentialRampToValueAtTime(0.0001, snapTime + snapDuration);

        snapSource.connect(snapFilter);
        snapFilter.connect(snapGain);
        snapGain.connect(this.ambientGain);

        snapSource.start(snapTime);
        snapSource.stop(snapTime + snapDuration);

        // If big pop, add a soft low acoustic "thump" of wood expanding
        if (isBigPop && this.ctx) {
          const thumpOsc = this.ctx.createOscillator();
          const thumpGain = this.ctx.createGain();
          thumpOsc.type = 'sine';
          thumpOsc.frequency.setValueAtTime(110, snapTime);
          thumpOsc.frequency.exponentialRampToValueAtTime(45, snapTime + 0.045);

          thumpGain.gain.setValueAtTime(0.12, snapTime);
          thumpGain.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.045);

          thumpOsc.connect(thumpGain);
          thumpGain.connect(this.ambientGain);
          thumpOsc.start(snapTime);
          thumpOsc.stop(snapTime + 0.05);
        }
      };

      // Random natural campfire timing
      const scheduleNextCrackle = () => {
        if (!this.isAmbientPlaying || this.currentSoundtrack !== 'campfire') return;
        const isBig = Math.random() < 0.16;
        playWoodSnap(isBig);

        // Occasional double or triple spark burst
        if (Math.random() < 0.35) {
          const delay1 = 40 + Math.random() * 80;
          const t1 = window.setTimeout(() => playWoodSnap(false), delay1);
          this.intervals.push(t1);
        }

        const nextDelay = isBig ? (320 + Math.random() * 450) : (130 + Math.random() * 300);
        const nextTimeout = window.setTimeout(scheduleNextCrackle, nextDelay);
        this.intervals.push(nextTimeout);
      };

      const startTimeout = window.setTimeout(scheduleNextCrackle, 180);
      this.intervals.push(startTimeout);

    } else if (soundType === 'bowl') {
      // Tibetan Singing Bowl: 136.1Hz Cosmic Om fundamental + sacred harmonics & tranquil binaural shimmer
      const omFreq = 136.1; // Earth Om frequency
      const harmonics = [
        { freq: omFreq, vol: 0.40 },
        { freq: omFreq * 2, vol: 0.25 },
        { freq: omFreq * 3, vol: 0.15 },
        { freq: omFreq * 4, vol: 0.08 },
      ];

      harmonics.forEach(({ freq, vol }, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Slight detune on pair to create acoustic binaural relaxation beat (~3.5Hz theta waves)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (idx === 1 ? 0.8 : 0), now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(vol, now + 1.8);

        osc.connect(gain);
        if (this.ambientGain) gain.connect(this.ambientGain);
        osc.start(now);
        this.ambientOscillators.push(osc);
      });

      // Periodic singing bowl mallet ring strike (deep peaceful chime every 6.5s)
      const playBowlStrike = () => {
        if (!this.ctx || !this.ambientGain || !this.isAmbientPlaying || this.currentSoundtrack !== 'bowl') return;
        const strikeOsc = this.ctx.createOscillator();
        const strikeGain = this.ctx.createGain();

        strikeOsc.type = 'sine';
        strikeOsc.frequency.setValueAtTime(272.2, this.ctx.currentTime);

        strikeGain.gain.setValueAtTime(0, this.ctx.currentTime);
        strikeGain.gain.linearRampToValueAtTime(0.42, this.ctx.currentTime + 0.04);
        strikeGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 5.5);

        strikeOsc.connect(strikeGain);
        strikeGain.connect(this.ambientGain);

        strikeOsc.start(this.ctx.currentTime);
        strikeOsc.stop(this.ctx.currentTime + 5.5);
      };

      playBowlStrike();
      const intervalId = setInterval(() => {
        playBowlStrike();
      }, 6500);
      this.intervals.push(intervalId);

    } else if (soundType === 'forest') {
      // Whispering Forest Canopy: Soft breeze + gentle distant birdsong
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.96 * b1 + white * 0.1;
        b2 = 0.86 * b2 + white * 0.25;
        output[i] = (b0 + b1 + b2) * 0.12;
      }

      const forestSource = this.ctx.createBufferSource();
      forestSource.buffer = noiseBuffer;
      forestSource.loop = true;

      const forestFilter = this.ctx.createBiquadFilter();
      forestFilter.type = 'bandpass';
      forestFilter.frequency.setValueAtTime(360, now);
      forestFilter.Q.setValueAtTime(0.7, now);

      forestSource.connect(forestFilter);
      forestFilter.connect(this.ambientGain);
      forestSource.start(now);
      this.ambientOscillators.push(forestSource);

      // Gentle melodic bird calls
      const playBirdChirp = () => {
        if (!this.ctx || !this.ambientGain || !this.isAmbientPlaying || this.currentSoundtrack !== 'forest') return;
        const birdBaseFreq = [2000, 2400, 2650][Math.floor(Math.random() * 3)];
        const birdOsc = this.ctx.createOscillator();
        const birdGain = this.ctx.createGain();

        birdOsc.type = 'sine';
        birdOsc.frequency.setValueAtTime(birdBaseFreq, this.ctx.currentTime);
        birdOsc.frequency.exponentialRampToValueAtTime(birdBaseFreq * 1.25, this.ctx.currentTime + 0.08);
        birdOsc.frequency.exponentialRampToValueAtTime(birdBaseFreq * 1.05, this.ctx.currentTime + 0.18);

        birdGain.gain.setValueAtTime(0, this.ctx.currentTime);
        birdGain.gain.linearRampToValueAtTime(0.20, this.ctx.currentTime + 0.02);
        birdGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

        birdOsc.connect(birdGain);
        birdGain.connect(this.ambientGain);

        birdOsc.start(this.ctx.currentTime);
        birdOsc.stop(this.ctx.currentTime + 0.25);
      };

      const intervalId = setInterval(() => {
        playBirdChirp();
        if (Math.random() > 0.5) {
          setTimeout(playBirdChirp, 160);
        }
      }, 4200);
      this.intervals.push(intervalId);

    } else if (soundType === 'rain') {
      // Synthesized soft pink-noise rain with warm resonance
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.28;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);

      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
      whiteNoise.start(now);
      this.ambientOscillators.push(whiteNoise);

    } else if (soundType === 'chimes') {
      // Warm background drone + gentle wind chime bells
      const rootDrone = this.ctx.createOscillator();
      const rootGain = this.ctx.createGain();
      rootDrone.type = 'sine';
      rootDrone.frequency.setValueAtTime(220, now);
      rootGain.gain.setValueAtTime(0.22, now);
      rootDrone.connect(rootGain);
      rootGain.connect(this.ambientGain);
      rootDrone.start(now);
      this.ambientOscillators.push(rootDrone);

      const playSingleBell = () => {
        if (!this.ctx || !this.ambientGain || !this.isAmbientPlaying) return;
        const bellNotes = [523.25, 659.25, 783.99, 880.00, 1046.5, 1318.5];
        const note = bellNotes[Math.floor(Math.random() * bellNotes.length)];
        const bellOsc = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();

        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(note, this.ctx.currentTime);

        bellGain.gain.setValueAtTime(0, this.ctx.currentTime);
        bellGain.gain.linearRampToValueAtTime(0.55, this.ctx.currentTime + 0.03);
        bellGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.8);

        bellOsc.connect(bellGain);
        bellGain.connect(this.ambientGain);

        bellOsc.start(this.ctx.currentTime);
        bellOsc.stop(this.ctx.currentTime + 2.8);
      };

      playSingleBell();
      setTimeout(playSingleBell, 600);

      const intervalId = setInterval(() => {
        playSingleBell();
        if (Math.random() > 0.4) {
          setTimeout(playSingleBell, 350 + Math.random() * 500);
        }
      }, 2200);
      this.intervals.push(intervalId);
    }

    this.isAmbientPlaying = true;
  }

  public stopAmbient() {
    if (this.intervals.length > 0) {
      this.intervals.forEach((id) => {
        clearInterval(id as number);
        clearTimeout(id as number);
      });
      this.intervals = [];
    }
    if (!this.ctx || !this.isAmbientPlaying) return;
    try {
      this.ambientOscillators.forEach((osc) => {
        try {
          if ('stop' in osc) osc.stop();
          osc.disconnect();
        } catch {
          // Ignore
        }
      });
      this.ambientOscillators = [];
      if (this.ambientGain) {
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
    } catch {
      // Ignore
    }
    this.isAmbientPlaying = false;
  }
}

export const soundFx = new SoundEffectsEngine();
