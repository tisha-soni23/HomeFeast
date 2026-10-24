import { useSyncExternalStore } from "react";

// Shared list of hearted meals. Works anywhere in the app (no provider needed)
// and is saved in the browser so it survives a page refresh.
const KEY = "homefeast:favorites";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

let favorites = load();
const listeners = new Set();

function commit(next) {
  favorites = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(favorites));
  } catch {
    /* storage unavailable: still works until refresh */
  }
  listeners.forEach((l) => l());
}

// Keep only what the dashboard needs
const pick = (m) => ({
  id: m.id,
  name: m.name,
  cook: m.cook,
  cuisine: m.cuisine,
  price: m.price,
  image: m.image,
  type: m.type,
  rating: m.rating,
  plan: m.plan,
  prepTime: m.prepTime,
  distance: m.distance,
});

export function toggleFavorite(meal) {
  const exists = favorites.some((f) => f.id === meal.id);
  commit(exists ? favorites.filter((f) => f.id !== meal.id) : [...favorites, pick(meal)]);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// React hook: returns the array of saved meals and re-renders when it changes
export function useFavorites() {
  return useSyncExternalStore(subscribe, () => favorites);
}