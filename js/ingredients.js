// js/ingredients.js
// The sticker sheet: ingredients you can tap onto the fridge.
//
// ✏️ YOUR TURN: change this list to what's actually in YOUR fridge.
// Stretch: draw your own stickers, save them as PNGs in /stickers,
// and add  img: "stickers/egg.png"  to an ingredient to use your drawing instead of the emoji.

export const INGREDIENTS = [
  { name: "eggs", emoji: "🥚" },
  { name: "rice", emoji: "🍚" },
  { name: "pasta", emoji: "🍝" },
  { name: "bread", emoji: "🍞" },
  { name: "cheese", emoji: "🧀" },
  { name: "chicken", emoji: "🍗" },
  { name: "beef", emoji: "🥩" },
  { name: "bacon", emoji: "🥓" },
  { name: "shrimp", emoji: "🍤" },
  { name: "tomato", emoji: "🍅" },
  { name: "potato", emoji: "🥔" },
  { name: "onion", emoji: "🧅" },
  { name: "garlic", emoji: "🧄" },
  { name: "carrot", emoji: "🥕" },
  { name: "broccoli", emoji: "🥦" },
  { name: "spinach", emoji: "🥬" },
  { name: "mushroom", emoji: "🍄" },
  { name: "bell pepper", emoji: "🫑" },
  { name: "corn", emoji: "🌽" },
  { name: "avocado", emoji: "🥑" },
  { name: "lemon", emoji: "🍋" },
  { name: "banana", emoji: "🍌" },
  { name: "milk", emoji: "🥛" },
  { name: "butter", emoji: "🧈" },
];

// Emojis the reels flash through while spinning.
export const REEL_FILLER = ["🥚", "🍅", "🧀", "🥕", "🍗", "🥦", "🍝", "🌽", "🥑", "🍄", "🧄", "🍋"];

// Find an emoji for an ingredient name Spoonacular sends back,
// e.g. "large eggs" -> 🥚, "cheddar cheese" -> 🧀. Returns null if nothing matches.
export function emojiFor(name) {
  const lower = name.toLowerCase();
  const hit = INGREDIENTS.find((i) => {
    const base = i.name.replace(/s$/, ""); // "eggs" -> "egg"
    return lower.includes(base);
  });
  return hit ? hit.emoji : null;
}
