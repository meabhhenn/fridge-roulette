import { test } from "node:test";
import assert from "node:assert/strict";
import { parseIngredients, slug, usesIngredient } from "../js/logic.js";

// YOUR TESTS BELOW
test("slug turns a title into a url-friendly name", () => {
  assert.equal(slug("Egg Fried Rice"), "egg-fried-rice");
});

test("parseIngredients cleans up spaces and capitals", () => {
  assert.deepEqual(parseIngredients("Eggs, Rice "), ["eggs", "rice"]);
});

test("usesIngredient counts egg as eggs", () => {
  assert.equal(usesIngredient({ used: ["eggs"] }, "egg"), true);
});