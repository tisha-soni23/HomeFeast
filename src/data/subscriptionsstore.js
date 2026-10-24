import { useSyncExternalStore } from "react";

// Sample platform data for the Admin "Subscriptions" page.
// 3,586 subscriptions are generated the same way every time, so the totals match the design:
//   3,214 active · 186 pending · 94 paused · 92 cancelled.
// Only the admin's changes (pause, approve, cancel...) are saved in the browser.
const KEY = "homefeast:subscriptions:v1";

/* ---------- sample data generator ---------- */
function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["Aditi","Rohan","Sara","Nikhil","Priya","Arjun","Kavya","Imran","Sneha","Vikram","Neha","Karan","Ananya","Aarav","Diya","Rahul","Pooja","Siddharth","Meera","Farhan","Isha","Manish","Tanvi","Yash","Riya","Harsh","Divya","Kabir","Shreya","Varun"];
const LAST = ["Rao","Mehta","Khan","Jain","Nair","Kapoor","Reddy","Sharma","Patel","Iyer","Das","Gupta","Malhotra","Shah","Verma","Singh","Bose","Menon","Joshi","Kulkarni"];
const KITCHENS = ["Anita's Ghar Ka Khana","Meera's South Kitchen","Farah's Dastarkhwan","Rupa's Rasoi","Kavya's Paneer Kitchen","Ayesha's Biryani House","Ritu's Jain Bhojan","Meera's Gujarati Kitchen","Nair's Home Table","Sunita's Tiffin Service","Lakshmi's Andhra Kitchen","Gurpreet's Punjabi Dhaba","Bela's Bengali Rasoi","Zoya's Awadhi Kitchen"];
const PLANS = [
  { name: "Weekly lunch", price: 547, meal: "lunch" },
  { name: "Monthly comfort", price: 2225, meal: "lunch" },
  { name: "Weekly dinner", price: 495, meal: "dinner" },
  { name: "Monthly lunch", price: 2190, meal: "lunch" },
  { name: "Monthly dinner", price: 2050, meal: "dinner" },
];
const SLOTS = { lunch: ["12:30 PM", "1:00 PM", "1:30 PM"], dinner: ["7:30 PM", "8:00 PM"] };

const TOTAL = 3586;
const COUNTS = { Active: 3214, Pending: 186, Paused: 94, Cancelled: 92 };

// The first four rows are fixed so they match the design
const FIXED = [
  { n: 32148, customer: "Aditi Rao", kitchen: "Anita's Ghar Ka Khana", plan: 0, status: "Active", day: 0, slot: "12:30 PM" },
  { n: 32147, customer: "Rohan Mehta", kitchen: "Meera's South Kitchen", plan: 1, status: "Active", day: 1, slot: "1:00 PM" },
  { n: 32139, customer: "Sara Khan", kitchen: "Farah's Dastarkhwan", plan: 2, status: "Active", day: 3, slot: "7:30 PM" },
  { n: 32122, customer: "Nikhil Jain", kitchen: "Rupa's Rasoi", plan: 3, status: "Paused", day: 2, slot: "1:00 PM", pausedOffset: 6 },
];

function generate() {
  const rand = rng(7);
  const pick = (list) => list[Math.floor(rand() * list.length)];

  // exact status counts, shuffled, minus what the fixed rows already use
  const pool = [];
  Object.entries(COUNTS).forEach(([status, n]) => {
    const used = FIXED.filter((f) => f.status === status).length;
    for (let i = 0; i < n - used; i++) pool.push(status);
  });
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const rows = FIXED.map((f) => ({
    id: `HF-${f.n}`,
    customer: f.customer,
    kitchen: f.kitchen,
    plan: PLANS[f.plan].name,
    amount: PLANS[f.plan].price,
    status: f.status,
    day: f.day,
    slot: f.slot,
    pausedOffset: f.pausedOffset ?? 7,
  }));

  let n = FIXED[FIXED.length - 1].n;
  while (rows.length < TOTAL) {
    n -= 1 + Math.floor(rand() * 2);
    const plan = pick(PLANS);
    rows.push({
      id: `HF-${n}`,
      customer: `${pick(FIRST)} ${pick(LAST)}`,
      kitchen: pick(KITCHENS),
      plan: plan.name,
      amount: plan.price,
      status: pool[rows.length - FIXED.length],
      day: Math.floor(rand() * 7),
      slot: pick(SLOTS[plan.meal]),
      pausedOffset: 3 + Math.floor(rand() * 12),
    });
  }
  return rows;
}

const baseRows = generate();

/* ---------- the admin's changes (saved in the browser) ---------- */
function loadOverrides() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}

let overrides = loadOverrides();
let snapshot = build();
const listeners = new Set();

function build() {
  const counts = { All: baseRows.length, Active: 0, Pending: 0, Paused: 0, Cancelled: 0 };
  const rows = baseRows.map((r) => {
    const row = overrides[r.id] ? { ...r, ...overrides[r.id] } : r;
    counts[row.status] += 1;
    return row;
  });
  return { rows, counts };
}

// status: "Active" | "Pending" | "Paused" | "Cancelled"
export function setSubscriptionStatus(id, status) {
  const patch = { status };
  if (status === "Paused") patch.pausedOffset = 7; // pause for a week
  overrides = { ...overrides, [id]: patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(overrides));
  } catch {
    /* storage unavailable: still works until refresh */
  }
  snapshot = build();
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// { rows, counts: { All, Active, Pending, Paused, Cancelled } }
export function useSubscriptions() {
  return useSyncExternalStore(subscribe, () => snapshot);
}

/* ---------- text helpers ---------- */
function dayLabel(offset) {
  if (offset === 0) return "Today";
  if (offset === 1) return "Tomorrow";
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function nextDeliveryText(r) {
  if (r.status === "Cancelled") return "—";
  if (r.status === "Paused") {
    const d = new Date();
    d.setDate(d.getDate() + r.pausedOffset);
    return "Paused until " + d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  if (r.status === "Pending") {
    const d = dayLabel(r.day === 0 ? 1 : r.day);
    const when = d === "Tomorrow" ? "tomorrow" : d;
    return `Starts ${when} · ${r.slot}`;
  }
  return `${dayLabel(r.day)} · ${r.slot}`;
}