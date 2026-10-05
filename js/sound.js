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
export const sfx = {
  lever: () => { tone(140, 0.15, "sawtooth", 0.12); tone(90, 0.2, "sawtooth", 0.1, 0.08); },
  tick: () => tone(900 + Math.random() * 300, 0.03, "square", 0.03),
  clunk: () => tone(110, 0.12, "triangle", 0.2),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, "square", 0.07, i * 0.09)),
  lose: () => [392, 330, 262].forEach((f, i) => tone(f, 0.22, "triangle", 0.12, i * 0.14)),
  stick: () => tone(600, 0.06, "sine", 0.1),
  peel: () => tone(300, 0.08, "sine", 0.08),
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
