export function parseIngredients(raw) {
  return String(raw || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => /^[a-z][a-z \-']{0,29}$/.test(s));
}

export function slug(title) {
  return String(title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Match whole ingredient phrases, allowing simple plural endings.
export function usesIngredient(recipe, name) {
  return recipe.used.some((usedName) =>
    containsIngredient(usedName, name) || containsIngredient(name, usedName)
  );
}

function containsIngredient(text, ingredient) {
  const escaped = ingredient.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Boolean(escaped) && new RegExp(`\\b${escaped}(?:s|es)?\\b`).test(text);
}
