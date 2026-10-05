// js/app.js — main frontend logic.
// The browser only ever talks to our own /api/recipes endpoint, never to Spoonacular directly.

import { INGREDIENTS, emojiFor } from "./ingredients.js";
import { createReels } from "./slot.js";
import { sfx, isMuted, setMuted } from "./sound.js";

const $ = (id) => document.getElementById(id);
const els = {
  sheet: $("sheet"),
  door: $("door-stickers"),
  doorEmpty: $("door-empty"),
  customForm: $("custom-form"),
  customInput: $("custom-input"),
  clearFridge: $("clear-fridge"),
  lever: $("lever"),
  machine: $("machine"),
  machineNote: $("machine-note"),
  ticketSlot: $("ticket-slot"),
  pins: $("pins"),
  pinsEmpty: $("pins-empty"),
  mute: $("mute"),
};

const reels = createReels($("reels"));
let fridge = load("fr-fridge", []);   // [{ name, emoji }]
let pins = load("fr-pins", []);       // saved recipes
const cache = new Map();              // fridge contents -> recipes (so re-spins don't call the API)
const seen = new Map();               // fridge contents -> ids already shown
let spinning = false;

// ---------- setup ----------

renderSheet();
renderDoor();
renderPins();
updateMute();

els.customForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = els.customInput.value.trim().toLowerCase();
  if (!/^[a-z][a-z \-']{0,29}$/.test(name)) {
    note("Use letters only, like “tofu” or “green beans”.");
    return;
  }
  addIngredient(name);
  els.customInput.value = "";
});

els.clearFridge.addEventListener("click", () => {
  fridge = [];
  saveFridge();
  sfx.peel();
});

els.lever.addEventListener("click", spin);
els.mute.addEventListener("click", () => { setMuted(!isMuted()); updateMute(); });

// ---------- fridge ----------

function renderSheet() {
  const buttons = INGREDIENTS.map((ing) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sheet-sticker";
    btn.dataset.name = ing.name;
    btn.innerHTML = `<span class="emoji" aria-hidden="true">${ing.emoji}</span><span class="label"></span>`;
    btn.querySelector(".label").textContent = ing.name;
    btn.addEventListener("click", () => toggleIngredient(ing.name));
    return btn;
  });
  els.sheet.replaceChildren(...buttons);
  syncSheet();
}

function syncSheet() {
  for (const btn of els.sheet.children) {
    const on = hasIngredient(btn.dataset.name);
    btn.setAttribute("aria-pressed", String(on));
  }
}

function renderDoor() {
  const stickers = fridge.map((ing) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "magnet";
    btn.style.setProperty("--tilt", `${tilt(ing.name)}deg`);
    btn.setAttribute("aria-label", `Take ${ing.name} off the fridge`);
    const face = document.createElement("span");
    face.className = "emoji";
    face.textContent = ing.emoji || ing.name[0].toUpperCase();
    if (!ing.emoji) face.classList.add("letter");
    const label = document.createElement("span");
    label.className = "label";
    label.textContent = ing.name;
    btn.append(face, label);
    btn.addEventListener("click", () => removeIngredient(ing.name));
    return btn;
  });
  els.door.replaceChildren(...stickers);
  els.doorEmpty.hidden = fridge.length > 0;
  els.clearFridge.hidden = fridge.length === 0;
  syncSheet();
}

function hasIngredient(name) {
  return fridge.some((i) => i.name === name);
}

function toggleIngredient(name) {
  hasIngredient(name) ? removeIngredient(name) : addIngredient(name);
}

function addIngredient(name) {
  if (hasIngredient(name)) return;
  if (fridge.length >= 15) {
    note("The fridge is full. Take something off first.");
    return;
  }
  const known = INGREDIENTS.find((i) => i.name === name);
  fridge.push({ name, emoji: known ? known.emoji : emojiFor(name) });
  sfx.stick();
  saveFridge();
}

function removeIngredient(name) {
  fridge = fridge.filter((i) => i.name !== name);
  sfx.peel();
  saveFridge();
}

function saveFridge() {
  save("fr-fridge", fridge);
  renderDoor();
}

// ---------- the spin ----------

async function spin() {
  if (spinning) return;

  if (fridge.length === 0) {
    shake();
    note("Your fridge is empty. Tap a few stickers first.");
    sfx.lose();
    return;
  }

  spinning = true;
  els.machine.classList.add("busy");
  els.lever.classList.add("pulled");
  els.lever.disabled = true;
  sfx.lever();
  note("");
  closeTicket();
  reels.start();

  const key = fridge.map((i) => i.name).sort().join(",");
  let recipe = null;
  let error = null;

  try {
    // Fetch and a minimum spin time run in parallel, so the reels always spin for a moment.
    const [recipes] = await Promise.all([getRecipes(key), wait(900)]);
    recipe = pickUnseen(key, recipes);
  } catch (err) {
    error = err.message;
  }

  const finals = recipe ? reelFaces(recipe) : ["💀", "💀", "💀"];
  await reels.stop(finals);

  if (recipe) {
    sfx.win();
    showTicket(recipe);
  } else {
    sfx.lose();
    showErrorTicket(error || "Nothing uses those ingredients. Take one off and pull again.");
  }

  els.lever.classList.remove("pulled");
  els.lever.disabled = false;
  els.machine.classList.remove("busy");
  spinning = false;
}

async function getRecipes(key) {
  if (cache.has(key)) return cache.get(key);
  let res;
  try {
    res = await fetch(`/api/recipes?${new URLSearchParams({ ingredients: key })}`);
  } catch {
    throw new Error("You seem to be offline. Check your connection and pull again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something jammed. Pull again.");
  cache.set(key, data.recipes);
  return data.recipes;
}

// Pick a random recipe we haven't shown yet for this fridge. Reset once all have been seen.
function pickUnseen(key, recipes) {
  if (!recipes.length) return null;
  const shown = seen.get(key) || new Set();
  let options = recipes.filter((r) => !shown.has(r.id));
  if (!options.length) {
    shown.clear();
    options = recipes;
  }
  const choice = options[Math.floor(Math.random() * options.length)];
  shown.add(choice.id);
  seen.set(key, shown);
  return choice;
}

// The reels land on emojis for ingredients the recipe uses.
function reelFaces(recipe) {
  const faces = [...new Set(recipe.used.map(emojiFor).filter(Boolean))];
  while (faces.length < 3) faces.push(faces[0] || "🍴");
  return faces.slice(0, 3);
}

// ---------- the ticket that prints out ----------

function showTicket(recipe) {
  const t = document.getElementById("ticket-template").content.firstElementChild.cloneNode(true);
  const photo = t.querySelector(".photo");
  const img = photo.querySelector("img");
  if (recipe.image) {
    img.src = recipe.image;
    img.alt = recipe.title;
    img.addEventListener("error", () => photo.remove(), { once: true });
  } else {
    photo.remove();
  }
  t.querySelector("h3").textContent = recipe.title;
  t.querySelector(".have").textContent = recipe.used.length ? recipe.used.join(", ") : "nothing yet";
  t.querySelector(".need").textContent = recipe.missing.length ? recipe.missing.join(", ") : "nothing. You're set!";
  t.querySelector(".open").href = recipe.url;

  const pinBtn = t.querySelector(".pin");
  const syncPin = () => {
    const on = isPinned(recipe.id);
    pinBtn.textContent = on ? "Pinned" : "Pin it";
    pinBtn.setAttribute("aria-pressed", String(on));
  };
  syncPin();
  pinBtn.addEventListener("click", () => { togglePin(recipe); syncPin(); });
  t.querySelector(".again").addEventListener("click", spin);

  els.ticketSlot.replaceChildren(t);
}

function showErrorTicket(message) {
  const t = document.createElement("div");
  t.className = "ticket error";
  const p = document.createElement("p");
  p.textContent = message;
  t.append(p);
  els.ticketSlot.replaceChildren(t);
}

function closeTicket() {
  els.ticketSlot.replaceChildren();
}

// ---------- pinboard ----------

function isPinned(id) {
  return pins.some((p) => p.id === id);
}

function togglePin(recipe) {
  pins = isPinned(recipe.id) ? pins.filter((p) => p.id !== recipe.id) : [recipe, ...pins];
  save("fr-pins", pins);
  sfx.stick();
  renderPins();
}

function renderPins() {
  const cards = pins.map((r) => {
    const card = document.createElement("article");
    card.className = "pin-card";
    card.style.setProperty("--tilt", `${tilt(r.title)}deg`);
    const link = document.createElement("a");
    link.href = r.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = r.title;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "unpin";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Unpin ${r.title}`);
    remove.addEventListener("click", () => togglePin(r));
    card.append(link, remove);
    return card;
  });
  els.pins.replaceChildren(...cards);
  els.pinsEmpty.hidden = pins.length > 0;
}

// ---------- little helpers ----------

function note(text) {
  els.machineNote.textContent = text;
}

function shake() {
  els.machine.classList.remove("shake");
  els.machine.offsetWidth; // restart the animation
  els.machine.classList.add("shake");
}

function updateMute() {
  els.mute.textContent = isMuted() ? "Sound off" : "Sound on";
  els.mute.setAttribute("aria-pressed", String(!isMuted()));
}

// Same name always gets the same tilt, so stickers don't jump around on re-render.
function tilt(text) {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return (Math.abs(h) % 13) - 6;
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode: just won't persist */ }
}
