import { useSyncExternalStore } from "react";

// Who is signed in right now. One shared place, so the Navbar, the login popup and
// the dashboard always agree. Saved in the browser (demo only, no real accounts yet).
//
//   session  -> { loggedIn, email, name }   kept so a refresh does not sign you out
//   accounts -> { "email": { name } }       the name each person typed at sign up
const SESSION_KEY = "homefeast:session";
const ACCOUNTS_KEY = "homefeast:accounts";

// true  = stay signed in after a page refresh
// false = signed out again after every refresh
const REMEMBER_LOGIN = true;

const emailKey = (email) => email.trim().toLowerCase();

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: still works until refresh */
  }
}

const LOGGED_OUT = { loggedIn: false, email: "", name: "" };

function loadSession() {
  if (!REMEMBER_LOGIN) return LOGGED_OUT;
  const s = read(SESSION_KEY, null);
  if (s && s.loggedIn === true && typeof s.email === "string" && s.email) {
    return { loggedIn: true, email: s.email, name: typeof s.name === "string" ? s.name : "" };
  }
  return LOGGED_OUT;
}

let state = loadSession();
const listeners = new Set();

function setState(next) {
  state = next;
  if (REMEMBER_LOGIN) {
    if (next.loggedIn) write(SESSION_KEY, next);
    else {
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch {
        /* ignore */
      }
    }
  }
  listeners.forEach((l) => l());
}

// New account: remember the name that goes with this email, then sign in
export function signUp(email, name) {
  const cleanName = name.trim();
  write(ACCOUNTS_KEY, { ...read(ACCOUNTS_KEY, {}), [emailKey(email)]: { name: cleanName } });
  setState({ loggedIn: true, email: email.trim(), name: cleanName });
}

// Existing account: look up the name saved at sign up (blank if this browser never saw it)
export function signIn(email) {
  const account = read(ACCOUNTS_KEY, {})[emailKey(email)];
  setState({ loggedIn: true, email: email.trim(), name: account?.name ?? "" });
}

export function signOut() {
  setState(LOGGED_OUT);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// { loggedIn, email, name }
export function useUser() {
  return useSyncExternalStore(subscribe, () => state);
}

// "Aditi Rao" -> "Aditi"
export const firstName = (full = "") => full.trim().split(/\s+/)[0] ?? "";