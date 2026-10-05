// lib/mock.js
// Fake recipes used when USE_MOCK=true (npm run mock), so you can work on the
// UI without spending Spoonacular's daily quota.
export const MOCK_RECIPES = [
  { id: 1, title: "Egg Fried Rice", image: "", used: ["eggs", "rice"], missing: ["soy sauce", "scallions"], url: "https://example.com" },
  { id: 2, title: "Spinach and Cheese Omelette", image: "", used: ["eggs", "spinach", "cheese"], missing: [], url: "https://example.com" },
  { id: 3, title: "Garlic Butter Pasta", image: "", used: ["pasta", "garlic", "butter"], missing: ["parsley"], url: "https://example.com" },
  { id: 4, title: "Loaded Baked Potato", image: "", used: ["potato", "cheese", "bacon"], missing: ["sour cream", "chives"], url: "https://example.com" },
];
