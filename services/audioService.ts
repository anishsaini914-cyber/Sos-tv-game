// A simple synthesizer for sound effects and ambient drone to avoid external asset dependencies
class AudioController {
  private ctx: AudioContext | null = null;
  private musicNodes: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;

  public get muted() {
    return this.isMuted;
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
      this.gainNode.gain.value = this.isMuted ? 0 : 0.1; // Master volume
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(mute: boolean) {
    this.isMuted = mute;
    if (this.gainNode && this.ctx) {
        const now = this.ctx.currentTime;
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.1, now + 0.1);
    }
    return this.isMuted;
  }

  public toggleMute() {
    return this.setMute(!this.isMuted);
  }

  public playMusic() {
    if (this.isMusicPlaying) return;
    this.initCtx();
    if (!this.ctx || !this.gainNode) return;

    // Create a sci-fi ambient drone
    const freqs = [110, 164.8, 196, 220]; // A major 7th chordish low pad
    freqs.forEach(f => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const oscGain = this.ctx!.createGain();
      oscGain.gain.value = 0.05;
      osc.connect(oscGain);
      oscGain.connect(this.gainNode!);
      osc.start();
      this.musicNodes.push(osc);
    });
    this.isMusicPlaying = true;
  }

  public stopMusic() {
    this.musicNodes.forEach(n => n.stop());
    this.musicNodes = [];
    this.isMusicPlaying = false;
  }

  public playSfx(type: 'move' | 'score' | 'win') {
    // Even if muted, we run logic to ensure context is ready, but sound won't play due to gainNode being 0
    this.initCtx();
    if (!this.ctx || !this.gainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.gainNode);

    const now = this.ctx.currentTime;

    if (type === 'move') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'score') {
      // Victory/Point sound
      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'win') {
      // Big Win Sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(880, now + 1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0, now + 1.5);
      osc.start(now);
      osc.stop(now + 1.5);
    }
  }
}

export const audio = new AudioController();