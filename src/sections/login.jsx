import { useEffect, useState } from "react";
import { FiX, FiArrowRight } from "react-icons/fi";

const inputClass =
  "mb-4 w-full rounded-xl border border-[#E6D1BE] bg-white px-4 py-3.5 text-sm text-[#32190F] outline-none transition focus:border-[#C94B16] focus:ring-2 focus:ring-[#C94B16]/10 sm:text-base";
const labelClass = "mb-2 block text-sm font-semibold text-[#634B3C] sm:text-base";
const primaryBtn =
  "flex w-full items-center justify-center gap-3 rounded-full bg-[#6D280F] px-5 py-4 text-base font-bold text-white transition-colors hover:bg-[#873C1D] focus:outline-none focus:ring-2 focus:ring-[#C94B16] focus:ring-offset-2";

// Remembers the name each person entered when creating their account (demo, saved in this browser)
const ACCOUNTS_KEY = "homefeast:accounts";
const emailKey = (email) => email.trim().toLowerCase();

function readAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveAccount(email, name) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify({ ...readAccounts(), [emailKey(email)]: { name } }));
  } catch {
    /* storage unavailable: the name still works until refresh */
  }
}

const findAccount = (email) => readAccounts()[emailKey(email)];

export default function Login({
  isLoggedIn,
  setIsLoggedIn,
  email,
  setEmail,
  setUserName,
  onClose,
  onOpenAccount,
}) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Esc closes the popup and the page behind stops scrolling
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Safety check: Login must be rendered with all five props (see Navbar.jsx)
  const missingProps = !onClose || !setEmail || !setIsLoggedIn || email === undefined;
  if (missingProps) {
    console.error(
      "Login was rendered WITHOUT props. Search your project for '<Login' and make sure only Navbar renders it, with isLoggedIn, setIsLoggedIn, email, setEmail and onClose."
    );
    return null;
  }

  function resetFields() {
    setName("");
    setPassword("");
    setConfirmPassword("");
  }

  function handleLogin(event) {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }
    // Demo login only — no real authentication yet.
    setUserName?.(findAccount(email)?.name ?? ""); // the name used when this account was created
    setIsLoggedIn(true);
    resetFields();
  }

  function handleSignup(event) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all the fields.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // Demo sign up only — connect this to your backend later.
    saveAccount(email, name.trim());
    setUserName?.(name.trim());
    setIsLoggedIn(true);
    setMode("login");
    resetFields();
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-9999 flex items-center justify-center overflow-y-auto bg-[#32190F]/85 p-4 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-155 rounded-3xl bg-[#FFFCF7] px-6 py-8 text-center text-[#32190F] sm:px-10 sm:py-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF8EE] text-xl transition-colors hover:bg-[#F5E6D5]"
        >
          <FiX />
        </button>

        <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF5E5] font-serif text-2xl font-bold text-[#B94317]">
          H
        </div>

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#C94B16] sm:text-sm">
          Welcome to HomeFeast
        </p>

        {isLoggedIn ? (
          <>
            <h1 className="mb-4 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Your account is ready.
            </h1>
            <p className="mx-auto mb-5 max-w-lg text-base leading-7 text-[#856D5E] sm:text-lg">
              You're signed in as {email}. View your active plan, deliveries, and saved kitchens.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAccount?.(); // opens the dashboard
              }}
              className={primaryBtn}
            >
              Open my account <FiArrowRight />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoggedIn(false);
                setEmail("");
                setUserName?.("");
                resetFields();
                setMode("login");
                onClose();
              }}
              className="mt-4 text-base font-semibold text-[#B94317] transition-colors hover:text-[#713014]"
            >
              Sign out
            </button>
          </>
        ) : mode === "signup" ? (
          <>
            <h1 className="mb-4 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Create your account.
            </h1>
            <p className="mb-6 text-base leading-7 text-[#856D5E] sm:text-lg">
              Join HomeFeast to order fresh tiffins from local home cooks.
            </p>

            <form onSubmit={handleSignup} className="text-left">
              <label htmlFor="name" className={labelClass}>Full name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your full name" autoComplete="name" className={inputClass} required />

              <label htmlFor="signup-email" className={labelClass}>Email or mobile number</label>
              <input id="signup-email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="username" className={inputClass} required />

              <label htmlFor="signup-password" className={labelClass}>Password</label>
              <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters" autoComplete="new-password" className={inputClass} required />

              <label htmlFor="confirm-password" className={labelClass}>Confirm password</label>
              <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password" autoComplete="new-password" className={inputClass} required />

              <button type="submit" className={primaryBtn}>
                Create account <FiArrowRight />
              </button>
            </form>

            <p className="mt-5 text-sm text-[#856D5E] sm:text-base">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { resetFields(); setMode("login"); }}
                className="font-bold text-[#B94317] transition-colors hover:text-[#713014]"
              >
                Log in
              </button>
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-4 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Come home to better food.
            </h1>
            <p className="mb-6 text-base leading-7 text-[#856D5E] sm:text-lg">
              Sign in to subscribe, save cooks, and manage your deliveries.
            </p>

            <form onSubmit={handleLogin} className="text-left">
              <label htmlFor="email" className={labelClass}>Email or mobile number</label>
              <input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="username" className={inputClass} required />

              <label htmlFor="password" className={labelClass}>Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" autoComplete="current-password" className={inputClass} required />

              <button type="submit" className={primaryBtn}>
                Continue <FiArrowRight />
              </button>
            </form>

            <p className="mt-5 text-sm text-[#856D5E] sm:text-base">
              New to HomeFeast?{" "}
              <button
                type="button"
                onClick={() => { resetFields(); setMode("signup"); }}
                className="font-bold text-[#B94317] transition-colors hover:text-[#713014]"
              >
                Create an account
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}