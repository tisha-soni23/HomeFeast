import { useEffect, useState } from "react";
import { GiHotMeal } from "react-icons/gi";
import { FiMenu, FiX } from "react-icons/fi";
import Login from "./login"; // file must be named login.jsx
import Dashboard from "./dashboard";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Why HomeFeast", href: "#why-homefeast" },
  { label: "For cooks", href: "#For-cooks" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState(""); // the name entered when the account was created
  const [showDashboard, setShowDashboard] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu

  // Name shown in the dashboard greeting: the first name from sign up.
  // (Only if we never saw a name, fall back to the start of the email.)
  const greetingName =
    userName.trim().split(" ")[0] ||
    (email.includes("@") ? email.split("@")[0].replace(/^\w/, (c) => c.toUpperCase()) : "there");

  // Stop the page behind from scrolling while the dashboard or mobile menu is open
  useEffect(() => {
    document.body.style.overflow = showDashboard || menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDashboard, menuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu with Esc, or when the screen grows to desktop size
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const openLogin = () => {
    setMenuOpen(false);
    setShowLogin(true);
  };

  const loginLabel = isLoggedIn ? "My account" : "Login";

  return (
    <>
      <nav
        className={`fixed left-0 top-0 z-50 w-full p-4 pt-0 text-white transition-all duration-300 ${
          scrolled || menuOpen
            ? "border-b border-white/10 bg-[#32190F]/90 shadow-lg backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2" aria-label="HomeFeast home">
            <GiHotMeal className="h-10 w-10 sm:h-12 sm:w-12" />
            <span className="mt-4 text-xl font-bold text-white md:text-2xl">
              HomeFeast
            </span>
          </a>

          {/* Desktop navigation links */}
          <div className="mt-3 hidden items-center gap-10 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xl font-semibold text-white transition-colors hover:text-[#FFE0A3]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side: Login / My account + mobile menu button */}
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={openLogin}
              className="rounded-full border border-white/50 bg-white/20 px-4 py-2 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-[#743014] sm:px-6 sm:text-lg"
            >
              {loginLabel}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/20 text-2xl text-white backdrop-blur-md transition-colors hover:bg-white hover:text-[#743014] focus:outline-none focus:ring-2 focus:ring-[#FFE0A3] lg:hidden"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile menu: slides down under the bar */}
        <div
          id="mobile-menu"
          className={`grid transition-all duration-300 ease-out lg:hidden ${
            menuOpen ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="flex flex-col pt-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    tabIndex={menuOpen ? 0 : -1}
                    className="block border-b border-white/10 py-4 text-lg font-semibold text-white transition-colors hover:text-[#FFE0A3]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={openLogin}
              tabIndex={menuOpen ? 0 : -1}
              className="mt-5 w-full rounded-full bg-white px-5 py-3.5 text-base font-bold text-[#6D280F] transition-colors hover:bg-[#FFE0A3]"
            >
              {isLoggedIn ? "Open my account" : "Login or create account"}
            </button>
          </div>
        </div>
      </nav>

      {/* Tap outside the menu to close it (mobile only) */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-[#32190F]/60 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* The ONLY place Login should be rendered, with all five props */}
      {showLogin && (
        <Login
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          email={email}
          setEmail={setEmail}
          setUserName={setUserName}
          onClose={() => setShowLogin(false)}
          onOpenAccount={() => setShowDashboard(true)}
        />
      )}

      {/* Dashboard opens after "Open my account" */}
      {showDashboard && (
        <Dashboard name={greetingName} onClose={() => setShowDashboard(false)} />
      )}
    </>
  );
};

export default Navbar;