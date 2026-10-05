# Fridge Roulette

> ⚠️ **TEMPLATE: rewrite every section in your own words before submitting.**
> The assignment requires the README to be "written yourself, in your own words."
> The bullets are reminders of what each section must cover. Delete this box when done.

**Live app:** TODO (your Vercel URL)
**Demo video:** TODO

## What it does
- TODO: 1–2 sentences. (Stick ingredients on a little pink fridge, pull a slot-machine lever, get a real recipe that uses them.)

## How to use it
- TODO: tap stickers / type your own → pull the lever → open, pin, or spin again. Tap a sticker on the door to take it off.
- Works on phones (say you tested it).

## Features I'm most proud of
- TODO: pick 2–3. Ideas: the slot machine (reels land on emojis of the recipe's ingredients), re-spins
  reuse cached results so they don't cost API calls, the coquette design (bows, lace, gingham), sounds made with Web Audio (no audio files).

## How it works
- TODO, in your words: browser → `/api/recipes` (Vercel serverless function) → Spoonacular `findByIngredients` → trimmed JSON back.
- Key files: `js/app.js` (fridge, spin flow, ticket, pins), `js/slot.js` (reels), `js/sound.js` (sounds),
  `js/ingredients.js` (sticker list), `api/recipes.js` (backend), `style.css` (coquette look).

## Running it locally
1. Install Node 18+ (nodejs.org, LTS).
2. `cp .env.example .env` and paste your Spoonacular key into `.env`.
3. `npm run dev` → open http://localhost:3000
4. `npm run mock` uses fake recipes so you don't burn API quota while working on the UI.

## How secrets are handled
- TODO, in your words: key lives in `.env` locally (gitignored) and in Vercel Environment Variables in production;
  only the serverless function reads it, so it never reaches the browser or GitHub.

## Changes I made myself
- TODO: e.g. rewrote the ingredient list, changed the ink colors, tuned the sounds, drew my own stickers.

## How I used AI
- TODO: short summary + citations, e.g. "Brainstorming and initial scaffold with Claude (Opus 5.5, claude.ai);
  understanding/debugging/edits with Kiro. See prompt_log.md."
- Recipe data: Spoonacular API. Fonts: Pinyon Script and Cormorant Garamond (Google Fonts).
