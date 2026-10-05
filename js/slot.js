// js/slot.js
// The three spinning reels.
// Each reel is a small window (overflow: hidden) with a tall "strip" of emojis inside.
// Spinning = moving the strip upward with a CSS transform.

import { REEL_FILLER } from "./ingredients.js";
import { sfx } from "./sound.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const random = (list) => list[Math.floor(Math.random() * list.length)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function createReels(container, count = 3) {
  const reels = [];
  for (let i = 0; i < count; i++) {
    const reel = document.createElement("div");
    reel.className = "reel";
    const strip = document.createElement("div");
    strip.className = "strip";
    strip.append(cell("❔"));
    reel.append(strip);
    container.append(reel);
    reels.push(strip);
  }

  let tickTimer = null;

  // Start all reels looping fast. Runs until stop() is called.
  function start() {
    for (const strip of reels) {
      strip.style.transition = "none";
      strip.style.transform = "translateY(0)";
      // Two identical halves so the looping animation is seamless.
      const half = Array.from({ length: 10 }, () => random(REEL_FILLER));
      strip.replaceChildren(...[...half, ...half].map(cell));
      strip.classList.add("looping");
    }
    if (!reduceMotion) tickTimer = setInterval(sfx.tick, 70);
  }

  // Stop the reels one at a time, left to right, landing on `finals`.
  async function stop(finals) {
    for (let i = 0; i < reels.length; i++) {
      const strip = reels[i];
      const landing = Array.from({ length: 8 }, () => random(REEL_FILLER));
      landing.push(finals[i]);
      strip.classList.remove("looping");
      strip.replaceChildren(...landing.map(cell));

      const cellHeight = strip.firstElementChild.offsetHeight;
      const end = -(landing.length - 1) * cellHeight;

      if (reduceMotion) {
        strip.style.transition = "none";
        strip.style.transform = `translateY(${end}px)`;
      } else {
        strip.style.transition = "none";
        strip.style.transform = "translateY(0)";
        strip.offsetHeight; // force the browser to apply the reset before animating
        strip.style.transition = "transform 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.25)"; // slight bounce
        strip.style.transform = `translateY(${end}px)`;
        await wait(450);
      }
      sfx.clunk();
    }
    clearInterval(tickTimer);
    await wait(reduceMotion ? 0 : 300);
  }

  return { start, stop };
}

function cell(emoji) {
  const div = document.createElement("div");
  div.className = "cell";
  div.textContent = emoji;
  div.setAttribute("aria-hidden", "true");
  return div;
}
