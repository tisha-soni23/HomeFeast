import { useSyncExternalStore } from "react";

// Shared list of new subscription orders (newest first).
// Saved in the browser so it survives a page refresh.
const KEY = "homefeast:orders";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

let orders = load();
const listeners = new Set();

function commit(next) {
  orders = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(orders));
  } catch {
    /* storage unavailable: still works until refresh */
  }
  listeners.forEach((l) => l());
}

// order = { id, cook, kitchen, plan, total, startDate }
export function addOrder(order) {
  if (orders.some((o) => o.id === order.id)) return; // never add the same request twice
  commit([{ ...order, createdAt: Date.now() }, ...orders]);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOrders() {
  return useSyncExternalStore(subscribe, () => orders);
}

// "2026-10-23" -> "Today" / "Tomorrow" / "Fri, 23 Oct"
export function friendlyDate(iso) {
  const d = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}