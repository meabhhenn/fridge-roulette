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

test("parseIngredients returns an empty array for blank or missing input", () => {
  assert.deepEqual(parseIngredients(""), []);
  assert.deepEqual(parseIngredients(undefined), []);
  assert.deepEqual(parseIngredients(" , , "), []);
});

test("parseIngredients drops entries that start with a digit", () => {
  assert.deepEqual(parseIngredients("123,3 eggs"), []);
});

test("parseIngredients keeps hyphens and apostrophes", () => {
  assert.deepEqual(parseIngredients("half-and-half,chef's mix"), ["half-and-half", "chef's mix"]);
});

test("parseIngredients keeps 30-character names and drops 31-character names", () => {
  const maxLengthName = "a".repeat(30);
  const tooLongName = "a".repeat(31);
  assert.deepEqual(parseIngredients(`${maxLengthName},${tooLongName}`), [maxLengthName]);
});

test("slug collapses punctuation and spaces into single dashes", () => {
  assert.equal(slug("Bibimbab (Korean Rice w Vegetables & Beef)"), "bibimbab-korean-rice-w-vegetables-beef");
});

test("slug removes leading and trailing dashes", () => {
  assert.equal(slug("  !Hello World!  "), "hello-world");
});

test("slug keeps numbers", () => {
  assert.equal(slug("5 Minute Eggs"), "5-minute-eggs");
});

test("usesIngredient returns true for an exact match", () => {
  assert.equal(usesIngredient({ used: ["eggs"] }, "eggs"), true);
});

test("usesIngredient returns false when the ingredient does not match", () => {
  assert.equal(usesIngredient({ used: ["eggs"] }, "rice"), false);
});

test("usesIngredient returns false when the used list is empty", () => {
  assert.equal(usesIngredient({ used: [] }, "eggs"), false);
});
