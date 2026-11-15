export function parseIngredients(raw) {
  return String(raw || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => /^[a-z][a-z \-']{0,29}$/.test(s));
}

export function slug(title) {
  return String(title).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Does this recipe use the ingredient? Loose match so "egg" counts for "eggs".
export function usesIngredient(recipe, name) {
  return recipe.used.some((u) => u.includes(name) || name.includes(u));
}
