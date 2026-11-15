Starting point: my Project 2, Fridge Roulette (branch hw9).

# Testing

## What I pulled out of the page and why
[write: which 3 functions went into js/logic.js, why, and anything awkward]

## What I tested and what I left untested
[write: what you chose and what you skipped on purpose]

I wrote the first three tests by hand (commit 47cc2a4: https://github.com/meabhhenn/fridge-roulette/commit/47cc2a4).
AI-written tests were added in a separate tests-only commit (41793cf: https://github.com/meabhhenn/fridge-roulette/commit/41793cf).

## Break it on purpose
| # | Change in js/logic.js | Test that caught it | Failure message |
|---|---|---|---|
| 1 | Deleted `.toLowerCase()` | parseIngredients cleans up spaces and capitals (hand-written) | `actual: []`, `expected: ['eggs','rice']` |
| 2 | `{0,29}` → `{0,30}` | parseIngredients keeps 30-character names and drops 31-character names | 31-char name was kept |
| 3 | Deleted the leading/trailing dash `.replace` in `slug` | slug removes leading and trailing dashes; slug collapses punctuation | `actual: '-hello-world-'`, `expected: 'hello-world'` |
| 4 | `\|\|` → `&&` in `usesIngredient` | usesIngredient counts egg as eggs (hand-written) | `false !== true` |
| 5 | `.some` → `.every` in `usesIngredient` | usesIngredient returns false when the used list is empty | `true !== false` |

## Fake tests
[write: what you found, honestly]

## CI
- Passing run: https://github.com/meabhhenn/fridge-roulette/actions/runs/43773996845
- Failing run: https://github.com/meabhhenn/fridge-roulette/actions/runs/43774477149

## Verifier experiment
[fill in after Step 8]

## How I used AI
[write: Codex for the refactor and the extra tests; Claude for step-by-step help]
