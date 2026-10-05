// js/sound.js
// Tiny sound effects made with the Web Audio API (no audio files needed).
// Each sound is just an oscillator (a tone) with a quick volume envelope.

let ctx = null;
let muted = readMuted();

function audio() {
  // Browsers only allow audio after a click/tap, so create the context lazily.
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, duration, type = "square", volume = 0.08, delay = 0) {
  if (muted) return;
  const a = audio();
  const start = a.currentTime + delay;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(a.destination);
  osc.start(start);
  osc.stop(start + duration);
}

// ✏️ YOUR TURN: change the frequencies/waveforms to make the machine sound how you want.
// Soft "music box" sounds: mostly sine waves at high, sweet pitches.
export const sfx = {
  lever: () => { tone(330, 0.25, "triangle", 0.12); tone(220, 0.3, "sine", 0.1, 0.1); },
  tick: () => tone(1800 + Math.random() * 600, 0.05, "sine", 0.025),
  clunk: () => { tone(1568, 0.35, "sine", 0.08); tone(784, 0.3, "triangle", 0.05); },
  win: () => [1047, 1319, 1568, 2093, 1568, 2093].forEach((f, i) => tone(f, 0.45, "sine", 0.07, i * 0.11)),
  lose: () => [784, 659, 523].forEach((f, i) => tone(f, 0.4, "sine", 0.08, i * 0.16)),
  stick: () => tone(1319, 0.15, "sine", 0.08),
  peel: () => tone(880, 0.15, "sine", 0.06),
};

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
  try { localStorage.setItem("fr-muted", value ? "1" : "0"); } catch { /* ignore */ }
}

function readMuted() {
  try { return localStorage.getItem("fr-muted") === "1"; } catch { return false; }
}
