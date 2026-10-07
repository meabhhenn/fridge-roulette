# Fridge Roulette

> ⚠️ **TEMPLATE: rewrite every section in your own words before submitting.**
> The assignment requires the README to be "written yourself, in your own words."
> The bullets are reminders of what each section must cover. Delete this box when done.

**Live app:** https://fridge-roulette-eight.vercel.app/
**Demo video:** TODO

## What it does
- Allows user to select ingredients available to them to be enetered as slot-machine
options. When slot-machine is reeled, one to three ingredients are selected and a 
real recipe using the selected ingredients is output. User may also select one of 
the ingredients to be 'must-use' in the recipe. The app finds a real recipe that
uses your ingredients and shows what you already have and what you'd still need to
buy. You can also pick one ingredient that every recipe must use, for something 
that's about to go bad.

## How to use it
- Click or tap on the stickers that you want to put on your fridge (contenders for
the slot machine reel). You may also enter your own stickers/ingredients. Click or
tap on the slot machine lever to selected ingredients that will show up in the recipe
that is output. Any ingredient chosen from the drop down (with the choices being 
from your fridge ingredients) above the reel will be included in the recipe, with 
buttons to open the full recipe, pin it for later, or spin again.. 
- Clicking or tapping depends on whether you are using phone or computer.

## Features I'm most proud of
-The must-use slot, because it makes the app useful for a real problem (using up food before it spoils). The dropdown feature was chosen because drag and drop doesn't work with touch. Spoonacular's ingredient matching was misleading, like counting paprika as bell pepper and wonton noodles as pasta. So, instead I re-check each ingredient against what's actually on the fridge, so the "You've got" list is more accurate to what user inputs.

## How it works
- When you pull the lever, the browser sends your fridge ingredients to my own endpoint, /api/recipes, which is a serverless function on Vercel. That function adds the secret API key and asks Spoonacular's findByIngredients for matching recipes, then sends back only the fields the page needs. The browser keeps those results, so spinning again doesn't make a new API call. Before picking a recipe, my code checks which ingredients really match the fridge, moves the fake matches to "You'd need," and applies the must-use filter. Then the reels land on emojis of ingredients the chosen recipe uses.

## Running it locally
1. Install Node 18+ (nodejs.org, LTS).
2. `cp .env.example .env` and paste your Spoonacular key into `.env`.
3. `npm run dev` → open http://localhost:3000
4. `npm run mock` uses fake recipes so you don't burn API quota while working on the UI.

## How secrets are handled
- The Spoonacular key is never in the code. Locally it lives in .env, which is listed in .gitignore so Git never uploads it. On the live site it's stored in Vercel's Environment Variables.

## Changes I made myself
- I added saved custom ingredients: anything typed in is stored in a pantry list in localStorage and shown on the sticker sheet (renderSheet and the form's submit handler). I added the × to remove custom ingredients (forgetIngredient). I fixed the reels showing the same emoji three times when a recipe used an ingredient without an emoji (reelFaces). I built the must-use slot with drag and drop plus a dropdown (setMustUse, renderMustSlot). I added checkAgainstFridge to correct Spoonacular's fuzzy matches.

## How I used AI
- I used Claude (Opus 5.5) to brainstorm ideas, generate the first version of the app, 
and restyle it from a zine look to the coquette design. I used Kiro inside my editor 
to run the app, push to GitHub, and debug. For my own features, I typed and tested the code myself, using Claude's guidance to fix bugs.
- Recipe data: Spoonacular API. Fonts: Pinyon Script and Cormorant Garamond (Google Fonts).
