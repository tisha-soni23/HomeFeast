import { useSyncExternalStore } from "react";

// The cook's orders for each day.
//  - Today (offset 0): 18 sample orders you can accept, prepare, hand off and deliver.
//    Your status changes are saved in the browser for today and start fresh tomorrow.
//  - Other days: past days show delivered orders, future days show scheduled orders.
//
// Totals for today match the design: 18 orders, 24 meals, ₹4,286.

const pad = (n) => String(n).padStart(2, "0");
const localISO = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const KEY = `homefeast:cookOrders:${localISO()}`;

export const STATUSES = ["New", "Preparing", "Ready", "Out for delivery"];
const L1 = "12:30–1:00 PM";
const L2 = "1:00–1:30 PM";

const o = (n, customer, plan, dish, veg, meals, note, area, slot, price, status, pickup = false) => ({
  id: `HF-${n}`, customer, plan, dish, veg, meals, note, area, slot, price, status, pickup,
});

/* ---------- today's orders ---------- */
const TODAY = [
  o(4018, "Aarav Kapoor", "Weekly lunch", "Everyday thali", true, 2, "Less spicy · No onion", "Koramangala 5th Block", L1, 238, "New"),
  o(4017, "Sneha Rao", "Monthly comfort", "Mini tiffin", true, 1, "Add extra phulka", "Ejipura", L1, 109, "Preparing"),
  o(4016, "Vikram Menon", "One-time order", "Rajma chawal bowl", true, 1, "Regular spice", "Koramangala 1st Block", L2, 129, "Ready"),
  o(4015, "Neha Joshi", "Weekly lunch", "Everyday thali", true, 1, "Ring the bell", "HSR Layout Sector 2", L2, 119, "Out for delivery"),
  o(4014, "Priya Nair", "Weekly lunch", "Rajma chawal bowl", true, 1, "Regular spice", "Koramangala 4th Block", L1, 129, "New"),
  o(4013, "Arjun Reddy", "Monthly comfort", "Dal tadka thali", true, 1, "Extra raita", "HSR Layout Sector 1", L1, 149, "Preparing"),
  o(4012, "Kavya Iyer", "One-time order", "Dal tadka thali", true, 1, "No garlic", "Indiranagar", L2, 149, "New"),
  o(4011, "Imran Sheikh", "Weekly lunch", "Chicken curry meal", false, 1, "Extra spicy", "BTM Layout", L1, 199, "Preparing"),
  o(4010, "Ananya Das", "Monthly comfort", "Rajma chawal bowl", true, 1, "Call on arrival", "Domlur", L1, 129, "Out for delivery"),
  o(4009, "Rahul Verma", "Weekly lunch", "Paneer butter masala combo", true, 1, "Less oil", "Jayanagar 4th Block", L2, 179, "Preparing"),
  o(4008, "Pooja Shah", "Weekly lunch", "Paneer butter masala combo", true, 2, "Pack separately", "Ejipura", L2, 358, "Ready", true),
  o(4007, "Karan Malhotra", "One-time order", "Special Sunday thali", true, 2, "Ring the bell", "Madiwala", L1, 498, "Preparing"),
  o(4006, "Divya Menon", "Weekly lunch", "Special Sunday thali", true, 2, "Leave at the gate", "Bellandur", L2, 498, "Out for delivery"),
  o(4005, "Siddharth Rao", "Monthly comfort", "Special Sunday thali", true, 2, "Extra phulka", "Koramangala 8th Block", L1, 498, "Preparing"),
  o(4004, "Riya Kapoor", "Weekly lunch", "Paneer butter masala combo", true, 1, "No onion", "Richmond Road", L2, 179, "New"),
  o(4003, "Farhan Ali", "One-time order", "Chicken curry meal", false, 2, "Regular spice", "Viveknagar", L1, 398, "Out for delivery"),
  o(4002, "Isha Patel", "Weekly lunch", "Paneer butter masala combo", true, 1, "Add extra phulka", "Ulsoor", L2, 179, "Ready", true),
  o(4001, "Manish Gupta", "Weekly lunch", "Dal tadka thali", true, 1, "Ring the bell", "Koramangala 6th Block", L1, 149, "Out for delivery"),
];

/* ---------- other days (generated the same way every time) ---------- */
function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = ["Aditi Rao","Rohan Mehta","Sara Khan","Nikhil Jain","Tanvi Shah","Yash Patel","Meera Iyer","Harsh Gupta","Shreya Das","Varun Kulkarni","Isha Verma","Kabir Singh","Neel Joshi","Anika Bose"];
const AREAS = ["Koramangala 3rd Block","Koramangala 7th Block","HSR Layout Sector 3","BTM Layout","Indiranagar","Domlur","Jayanagar 3rd Block","Ejipura","Madiwala","Bellandur","Richmond Road","Ulsoor"];
const DISHES = [
  ["Everyday thali", 119, true], ["Mini tiffin", 109, true], ["Rajma chawal bowl", 129, true],
  ["Dal tadka thali", 149, true], ["Paneer butter masala combo", 179, true], ["Chicken curry meal", 199, false],
];
const NOTES = ["Regular spice", "Less spicy", "No onion", "Ring the bell", "Extra raita", "Leave at the gate"];
const PLANS = ["Weekly lunch", "Monthly comfort", "One-time order"];

const dayCache = new Map();
function ordersForDay(offset) {
  if (dayCache.has(offset)) return dayCache.get(offset);
  const rand = rng(1000 + offset * 31);
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const count = 10 + ((Math.abs(offset) * 3) % 7);
  const status = offset < 0 ? "Delivered" : "Scheduled";
  const list = [];
  for (let i = 0; i < count; i++) {
    const [dish, unit, veg] = pick(DISHES);
    const meals = 1 + Math.floor(rand() * 2);
    list.push(
      o(4000 + offset * 20 + (count - i), pick(NAMES), pick(PLANS), dish, veg, meals, pick(NOTES), pick(AREAS), rand() < 0.5 ? L1 : L2, unit * meals, status)
    );
  }
  dayCache.set(offset, list);
  return list;
}

/* ---------- today's live state ---------- */
function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}

let overrides = load(); // { "HF-4018": "Preparing" | "Declined" | ... }
let snapshot = build();
const listeners = new Set();

function build() {
  return TODAY.map((x) => (overrides[x.id] ? { ...x, status: overrides[x.id] } : x)).filter(
    (x) => x.status !== "Declined"
  );
}

// status: "Preparing" | "Ready" | "Out for delivery" | "Delivered" | "Declined"
export function setOrderStatus(id, status) {
  overrides = { ...overrides, [id]: status };
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

// offset: 0 = today, -1 = yesterday, 1 = tomorrow ...
export function useCookOrders(offset = 0) {
  const today = useSyncExternalStore(subscribe, () => snapshot);
  return offset === 0 ? today : ordersForDay(offset);
}

export const mealCount = (orders) => orders.reduce((n, x) => n + x.meals, 0);
export const revenue = (orders) => orders.reduce((n, x) => n + x.price, 0);