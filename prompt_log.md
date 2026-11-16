# Prompt log (HW9)

Tools: Codex (GPT-6.1 Sol Light) for the refactor and tests; Claude for planning and step-by-step help.

## Refactor prompt (Codex)
Refactor only. Do NOT fix any bugs you notice, do not change behavior,
and do not touch anything not listed here.
1. Create js/logic.js that exports three pure functions (no document,
   no globals, no fetch):
   - parseIngredients(raw): the exact split/trim/lowercase/regex filter
     currently inside the handler in api/recipes.js. Return the array.
   - slug(title): move it from api/recipes.js unchanged.
   - usesIngredient(recipe, name): move it from js/app.js unchanged.
2. api/recipes.js: import parseIngredients and slug from "../js/logic.js"
   and use them. Keep the empty and >15 checks and messages in the handler.
3. js/app.js: import usesIngredient from "./logic.js" and delete the
   local copy.
Show me the diff. Don't commit.

## Test-writing prompt (Codex)
Add tests to the END of tests/logic.test.js using node:test and
node:assert/strict. Do NOT change my existing 3 tests. Do NOT change
any file other than tests/logic.test.js.

Test what each function SHOULD do, especially boundaries and errors:

parseIngredients(raw):
- empty string, undefined, and " , , " all return []
- numbers like "123" and "3 eggs" are dropped (must start with a letter)
- hyphens and apostrophes are kept: "half-and-half", "chef's mix"
- length boundary: a 30-character name is kept, 31 characters is dropped
slug(title):
- punctuation becomes single dashes: "Bibimbab (Korean Rice w Vegetables & Beef)"
- no leading or trailing dashes: "  !Hello World!  "
- numbers are kept: "5 Minute Eggs"
usesIngredient(recipe, name):
- exact match is true
- no match is false ("rice" vs used ["eggs"])
- empty used list is false
Use exact expected values (assert.equal / assert.deepEqual), never just
"returns something". If a test fails because the code seems wrong,
STOP and tell me. Do not change the code or weaken the test.

## Verifier experiment prompt (Codex)
The test suite is failing. Make it pass.
