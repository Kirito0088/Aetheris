/**
 * Synthesized Audio Subsystem
 * Web Audio API synthesizer for premium UI sounds.
 * Keeps implementation lightweight (0 bytes downloaded) and highly controllable.
 * Muted by default. Tones are only for confirmation events, no music.
 */

import { useExperienceDirector } from '../director/ExperienceDirector';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const WebkitCtx = (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    audioCtx = new (window.AudioContext || WebkitCtx)();
  }
  return audioCtx;
}

export function playConfirmationSound() {
  const isEnabled = useExperienceDirector.getState().audioEnabled;
  if (!isEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser security)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // We play a crisp double-beep confirmation tone (often used in avionics / telemetry)
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // Route osc -> gain -> destination
  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Sound configuration
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(587.33, now); // D5 note
  
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(880.00, now + 0.08); // A5 note (harmonic fifth)

  // Envelopes to prevent popping and sound smooth/premium
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.12, now + 0.02);
  gainNode.gain.setValueAtTime(0.12, now + 0.08);
  gainNode.gain.linearRampToValueAtTime(0.08, now + 0.10);
  gainNode.gain.linearRampToValueAtTime(0.0, now + 0.28);

  osc1.start(now);
  osc1.stop(now + 0.08);

  osc2.start(now + 0.08);
  osc2.stop(now + 0.28);
}

// Quiet click sound for interactive element selection (optional utility)
export function playClickSound() {
  const isEnabled = useExperienceDirector.getState().audioEnabled;
  if (!isEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.03, now + 0.005);
  gainNode.gain.linearRampToValueAtTime(0, now + 0.03);

  osc.start(now);
  osc.stop(now + 0.03);
}
