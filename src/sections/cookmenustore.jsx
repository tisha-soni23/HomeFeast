import { useSyncExternalStore } from "react";

// Everything the cook edits on the "Menu & meal plans" page lives here:
//  - menu:  dishes for each day (0 = Mon ... 5 = Sat) and meal ("lunch" | "dinner")
//  - plans: subscription plans
// It is shared with the Cook overview card and saved in the browser (localStorage).
const KEY = "homefeast:cookMenu:v2";
export const DAY_COUNT = 6;

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const dish = (name, desc, price, type = "Veg") => ({
  id: uid(), name, desc, price, type, available: true, image: "",
});

function seedMenu() {
  const menu = {};
  for (let d = 0; d < DAY_COUNT; d++) {
    menu[`${d}-lunch`] = [
      dish("Everyday thali", "Dal tadka, aloo gobi, 4 phulkas, rice & salad", 119),
      dish("Mini tiffin", "Dal, seasonal sabzi, 3 phulkas & salad", 89),
      dish("Rajma chawal bowl", "Slow-cooked rajma, jeera rice & onion salad", 109),
    ];
    menu[`${d}-dinner`] = [
      dish("Light dinner thali", "Dal, sabzi, 2 phulkas & jeera rice", 99),
      dish("Khichdi & kadhi", "Moong dal khichdi with Gujarati kadhi", 89),
    ];
  }
  return menu;
}

const defaults = () => ({
  menu: seedMenu(),
  plans: [
    { id: "weekly", name: "Weekly lunch", tagline: "5 weekday lunches · Pause or skip anytime", meals: 5, price: 547, subscribers: 28, active: true },
    { id: "monthly", name: "Monthly comfort", tagline: "22 lunches · Best value for regulars", meals: 22, price: 2225, subscribers: 18, active: true },
  ],
  cutoff: { lunch: "10:30 AM", dinner: "5:00 PM" },
  updatedAt: Date.now(),
});

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.menu && Array.isArray(saved.plans)) return saved;
  } catch {
    /* ignore and use defaults */
  }
  return defaults();
}

let state = load();
const listeners = new Set();

function commit(patch) {
  state = { ...state, ...patch, updatedAt: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: still works until refresh */
  }
  listeners.forEach((l) => l());
}

const slot = (day, meal) => `${day}-${meal}`;

/* ---------- dishes ---------- */
// days = [0, 2, 3] adds the same dish to several days at once
export function addDish({ days, meal, dish: d }) {
  const menu = { ...state.menu };
  days.forEach((day) => {
    const k = slot(day, meal);
    menu[k] = [...(menu[k] ?? []), { id: uid(), available: true, image: "", ...d }];
  });
  commit({ menu });
}

export function updateDish(day, meal, id, patch) {
  const k = slot(day, meal);
  commit({ menu: { ...state.menu, [k]: state.menu[k].map((x) => (x.id === id ? { ...x, ...patch } : x)) } });
}

export function removeDish(day, meal, id) {
  const k = slot(day, meal);
  commit({ menu: { ...state.menu, [k]: state.menu[k].filter((x) => x.id !== id) } });
}

// Copies (or overwrites, if the same name exists) a dish on every other day
export function copyDishToAllDays(day, meal, id) {
  const src = state.menu[slot(day, meal)]?.find((x) => x.id === id);
  if (!src) return;
  const menu = { ...state.menu };
  for (let d = 0; d < DAY_COUNT; d++) {
    if (d === day) continue;
    const k = slot(d, meal);
    const list = menu[k] ?? [];
    const i = list.findIndex((x) => x.name.trim().toLowerCase() === src.name.trim().toLowerCase());
    menu[k] =
      i >= 0
        ? list.map((x, idx) => (idx === i ? { ...src, id: x.id } : x))
        : [...list, { ...src, id: uid() }];
  }
  commit({ menu });
}

/* ---------- plans ---------- */
export const addPlan = (plan) =>
  commit({ plans: [...state.plans, { id: uid(), subscribers: 0, active: true, ...plan }] });

export const updatePlan = (id, patch) =>
  commit({ plans: state.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)) });

export const removePlan = (id) => commit({ plans: state.plans.filter((p) => p.id !== id) });

/* ---------- reading ---------- */
function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCookMenu() {
  return useSyncExternalStore(subscribe, () => state);
}

// Number of different dishes across the whole week (used on the Cook overview)
export function dishCount(s) {
  const names = new Set();
  Object.values(s.menu).forEach((list) => list.forEach((d) => names.add(d.name.trim().toLowerCase())));
  return names.size;
}

// "Updated today" / "Updated 12 Oct"
export function updatedLabel(ts) {
  const d = new Date(ts);
  if (d.toDateString() === new Date().toDateString()) return "Updated today";
  return "Updated " + d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}