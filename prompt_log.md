# Prompt Log: Fridge Roulette (15-113 Project 2)

> Prompts below are **verbatim**. Keep adding to this as you work, and add your own notes after each
> step, especially what you wrote or changed yourself.

## Tools used, and which tool for which job
- TODO (in your words): e.g. "Claude Opus 5.5 in claude.ai for brainstorming and generating the first
  version, because … ; Kiro in my editor for understanding the code, running it, and debugging, because …"

## One place AI got it wrong
- TODO: a **real** example from your own work. Watch for one as you build: wrong API parameter,
  a bug it couldn't find, advice that didn't match the docs, etc.
  (Planning note: many AI tools/tutorials still suggest Spotify's `/recommendations` endpoint, which
  returns 403 for apps created after Nov 27, 2024. That's why the music idea was dropped.)

---

## Session 1: Sun 10/4 – Mon 10/5, ~11:50 PM–12:30 AM: ideas, a scrapped first version, the pivot (Claude Opus 5.5, claude.ai)

**Prompt 1** (pasted the full Project 2 write-up), then:
```
make sure you show the part of the project write up that you are addressing:
```

**Prompt 2**
```
help me brainstorm then execute the projedct
```

**Prompt 3**
```
more ideas
```

**Prompt 4**
```
following project guidelines
```

**Prompt 5** (quoted idea #4, "Mood-to-playlist or recipe tool…")
```
more details
```

**Prompt 6**
```
recipies; plain js; github
```
→ Claude built "Moodboard" (pick a mood → recipe cards).

**Prompt 7**
```
so after i click download what do i do. you are to tell me kiro prompts btw
```
→ Got step-by-step setup with Kiro prompts.

**Kiro prompt 1**
```
Check that I have Node 18 or newer installed, then run "npm run mock" and tell me what URL to open. Don't modify any files.
```
→ Kiro found Node wasn't installed and stopped instead of guessing. Installed Node LTS from nodejs.org.

**Prompt 8**
```
i don't like this at all, let's hit the idea board again, ask me questions specific questions
```
→ Claude asked multiple-choice questions. My answers: didn't like the website design or the idea;
  into games, art/design, sports, music, but still liked recipes; want it to feel "fun" and "I'd use this";
  OK with a little setup. Picked Fridge Roulette / Kitchen Quest, hand-drawn zine style, solo.

**Prompt 9**
```
i don't want a quest system
```

**Prompt 10**
```
yes
```
→ Claude built Fridge Roulette: fridge with ingredient stickers, slot machine with 3 reels and a lever,
  serverless `/api/recipes` calling Spoonacular `findByIngredients`, printed "ticket" result, pinboard,
  Web Audio sound effects, riso-zine styling (later restyled, see Prompt 11). Tested with mock data at desktop and phone widths.

**Prompt 11**
```
i like this idea much much more, but i don't like this style, maybe more coquette
```
→ Claude restyled it: pink gingham, cherry-red bows, lace scallop edges, pearl trim, script title,
  cherry lever knob, and softer music-box sounds. Same features and code structure.

**My notes / why I pivoted:**
- TODO: why Moodboard didn't feel like mine, and what makes this one better.

---

## Session 2: Mon 10/5: TODO
(Get Spoonacular key, run locally, push to GitHub, deploy on Vercel, start your own edits.)
