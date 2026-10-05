// api/recipes.js
// Serverless function: GET /api/recipes?ingredients=eggs,rice,spinach
//
// The browser calls THIS endpoint. Only this server code knows the Spoonacular
// API key, so the key never shows up in the browser or on GitHub.
// On Vercel, every file in /api becomes an endpoint automatically.

import { MOCK_RECIPES } from "../lib/mock.js";

const SPOONACULAR_URL = "https://api.spoonacular.com/recipes/findByIngredients";
const MAX_INGREDIENTS = 15;
const RESULT_COUNT = 12; // the frontend picks randomly from these, so re-spins are free

export default async function handler(req, res) {
  // 1. Validate input. Never trust what the browser sends.
  const ingredients = String(req.query?.ingredients || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => /^[a-z][a-z \-']{0,29}$/.test(s));

  if (ingredients.length === 0) {
    return res.status(400).json({ error: "Your fridge is empty. Add an ingredient first." });
  }
  if (ingredients.length > MAX_INGREDIENTS) {
    return res.status(400).json({ error: `That's a full fridge. Use ${MAX_INGREDIENTS} ingredients or fewer.` });
  }

  // 2. Offline mode: fake recipes so you can work on the UI without using API quota.
  if (process.env.USE_MOCK === "true") {
    return res.status(200).json({ recipes: MOCK_RECIPES });
  }

  // 3. The secret comes from an environment variable, never from the code.
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    console.error("SPOONACULAR_API_KEY is not set");
    return res.status(500).json({ error: "The recipe server isn't set up yet." });
  }

  const params = new URLSearchParams({
    ingredients: ingredients.join(","),
    number: String(RESULT_COUNT),
    ranking: "1",        // 1 = use as many of your ingredients as possible
    ignorePantry: "true", // assume you have salt, water, flour, etc.
  });

  try {
    const response = await fetch(`${SPOONACULAR_URL}?${params}`, {
      headers: { "x-api-key": apiKey }, // key in a header, not in the URL
    });

    if (response.status === 402) {
      return res.status(503).json({ error: "The machine is out of spins for today. Come back tomorrow." });
    }
    if (!response.ok) {
      console.error("Spoonacular error", response.status, await response.text());
      return res.status(502).json({ error: "The recipe service didn't answer. Pull again in a minute." });
    }

    const data = await response.json();

    // 4. Send back only the fields the frontend uses.
    const recipes = data.map((r) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      used: (r.usedIngredients || []).map((i) => i.name),
      missing: (r.missedIngredients || []).map((i) => i.name),
      url: `https://spoonacular.com/recipes/${slug(r.title)}-${r.id}`,
    }));

    // Let Vercel cache the same fridge for an hour to save quota.
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({ recipes });
  } catch (err) {
    console.error("Request to Spoonacular failed", err);
    return res.status(502).json({ error: "Couldn't reach the recipe service. Check your connection." });
  }
}

function slug(title) {
  return String(title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
