# Prompt Log: Fridge Roulette (15-113 Project 2)

## Tools used
- **Claude (Opus 5.5, claude.ai):** brainstorming, generating the first version of the app, the coquette restyle, and step-by-step instructions for my own features.
- **Kiro (in my editor):** running the app locally, git setup and pushing to GitHub, checking that secrets weren't committed.

## Which tool for which job
TODO (2–3 sentences, your words). Facts to draw on:
- Claude: planning, big-picture ideas, generating the whole first version, explaining code and giving step-by-step instructions.
- Kiro: works inside the actual project folder, runs commands, sees real files, does git operations.
- Why the split: e.g. Claude for thinking/designing, Kiro for anything that touches the real files and terminal.

## One place AI got it wrong
TODO (one short paragraph, your words). Facts to draw on:
- Claude's original `reelFaces` function used `.filter(Boolean)`, which silently dropped any ingredient without an emoji.
- After I added custom ingredients, a recipe using my apple and milk showed 🥛 🥛 🥛 on the reels.
- I traced it to that line and changed it to use ✨ as a fallback instead of dropping the ingredient.
- (Second example if wanted: Spoonacular's API counted "paprika" as my bell pepper and "wonton noodles" as my pasta; I added `checkAgainstFridge` to correct it.)

---

## Prompts to Claude (Opus 5.5, claude.ai)

**1.**
```
help me brainstorm then execute the projedct
```
→ 4 ideas mapped to the requirement categories.

**2.** "Mood-to-playlist or recipe tool"
```
more details
```
→ Full plan for a mood-based recipe/playlist app. Learned Spotify's recommendations API is closed to new apps, so recipes (Spoonacular) were safer.

**3.**
```
recipies; plain js; github
```
→ Claude generated "Moodboard" (pick a mood → recipe cards) with a Vercel serverless function to hide the API key.

**4.**
```
i don't like this at all, let's hit the idea board again, ask me questions specific questions
```
→ Claude asked multiple-choice questions.

**5.** [answers to Claude's multiple-choice questions]
```
What didn't you like? → no i just don't like the website design or lowkey idea at all
Interests? → Games, Art / design, Sports / fitness, Music, i think recipes is a good idea
First reaction? → both fun and i'd use this
Setup? → A little
```

**6.** [answers to Claude's second set of questions]
```
Concept? → frideg roulette or kitchen quest
Design? → Hand-drawn zine
Players? → Solo
```
→ Claude proposed Fridge Roulette combined with a "Kitchen Quest" mode.

**7.**
```
i don't want a quest system
```
→ Scope cut to just the fridge + slot machine.

**8.**
```
i like this idea much much more, but i don't like this style, maybe more coquette
```
→ Claude restyled it: pink gingham, bows, lace edges, pearl trim, script title, cherry lever, music-box sounds.
**9.**
```
1 meaningful change?: have it so that you can add things permenatly to the inventory so that they show up as an icon under what's in there
```
→ Claude explained where in `app.js` this would go; I wrote it.

**10.**
```
acta;lly idk if appliances section makes sense; what i do think makes sense is being able to removefrom pantry like if you mis type before you add
```
→ Instructions for a × button on custom stickers.

**11.** [pasted console error]
```
Uncaught TypeError: Cannot set properties of null (setting 'textContent')
    at app.js:76:45
    at Array.map (<anonymous>)
    at renderSheet (app.js:71:47)
    at app.js:35:1
```
→ Lines in `renderSheet` were in the wrong order after pasting (the label was filled in before it was created). I fixed the order.

**12.**
```
what if i made it so that there are some ingredients tha tmust be included in like another place maybe above the reel and then what ever is in the reel is additional ingredients. before you execute, evaluate whether this is meaningful yk
```
→ Claude evaluated it: useful, but Spoonacular has no "must include" option, so filtering would happen in the browser.


**13.** [screenshot: page broken after a commit]
```
oh no i made commit and this is where we're at
```
→ A syntax error stopped all of `app.js` from loading. Fixed, and learned to test locally before pushing.


## Prompts to Kiro

**Kiro 1**
```
Check that I have Node 18 or newer installed, then run "npm run mock" and tell me what URL to open. Don't modify any files.
```
→ Kiro found Node wasn't installed and stopped instead of guessing. I installed Node LTS from nodejs.org.

**Kiro 2** 
```
Run "npm run mock" and tell me the URL to open. Don't modify any files.
```
→ App running at http://localhost:3000 with mock recipes.

**Kiro 3** 
```
https://github.com/meabhhennSet my git name to "meabhhenn" and email to the one on my GitHub account for this repo. Then show me git status and the list of files that will be pushed, and confirm .env is not in it. Then add this GitHub remote as origin and push the main branch: https://github.com/meabhhenn/fridge-roulette.git/fridge-roulette.git
```
→ My paste got mangled (URL doubled). Kiro caught it, wouldn't guess my email, confirmed `.env` wasn't tracked, and waited for my go-ahead before pushing.

**Kiro 4** 
```
meabhhhennessy@gmail.comgithub.com/meabhhenn/fridge-roulette use meabhhhennessy@gmail.com as the email. The URL https://github.com/meabhhenn/fridge-roulette.git is correct. Use my real name "Meabh Hennessy" for user.name instead of the username. Go ahead and push.
```
→ Kiro noticed my name instruction changed and confirmed it, then pushed to GitHub.

**Kiro 5** 
```
Run "npm run dev". Confirm .env is in .gitignore, but don't open or print .env.
```
→ Kiro confirmed `.env` is ignored using `git check-ignore`, without opening the file, then ran the app with the real API.

---

## What I wrote or changed myself
Following Claude guidance, I typed, tested, debugged, and committed these myself in `js/app.js` and `style.css`:
- **Saved custom ingredients:** typed ingredients are saved to a `pantry` list in localStorage and shown on the sticker sheet (`renderSheet`, the form's submit handler).
- **× to remove custom ingredients:** `forgetIngredient`.
- **Reel fix:** ingredients without an emoji show ✨ instead of being dropped (`reelFaces`).
- **Must-use slot:** drag and drop plus a dropdown for phones (`setMustUse`, `renderMustSlot`, drag events), filtering in `spin`.
- **Fuzzy-match fix:** `checkAgainstFridge` moves Spoonacular's loose matches to "You'd need."
- **Debugging:** the `renderSheet` ordering error and the syntax error after a broken commit.
- **Design decisions:** rejected Moodboard, chose recipes + slot machine, cut the quest system, chose the coquette style, chose the × over an appliances section, limited must-use to one item.