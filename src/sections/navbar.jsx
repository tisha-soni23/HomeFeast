import { useEffect, useState } from "react";
import { GiHotMeal } from "react-icons/gi";
import Login from "./login"; // file must be named login.jsx
import Dashboard from "./dashboard";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState(""); // the name entered when the account was created
  const [showDashboard, setShowDashboard] = useState(false);

  // Name shown in the dashboard greeting: the first name from sign up.
  // (Only if we never saw a name, fall back to the start of the email.)
  const greetingName =
    userName.trim().split(" ")[0] ||
    (email.includes("@") ? email.split("@")[0].replace(/^\w/, (c) => c.toUpperCase()) : "there");

  // Stop the page behind from scrolling while the dashboard is open
  useEffect(() => {
    document.body.style.overflow = showDashboard ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDashboard]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed left-0 top-0 z-50 w-full p-4 pt-0 text-white transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-[#32190F]/85 shadow-lg backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <GiHotMeal className="h-12 w-12" />
            <span className="mt-4 text-xl font-bold text-white md:text-2xl">
              HomeFeast
            </span>
          </div>

          {/* Navigation Links */}
          <div className="mt-3 hidden items-center gap-10 lg:flex">
            <a href="#how-it-works" className="text-xl font-semibold text-white transition-colors hover:text-[#FFE0A3]">
              How it works
            </a>
            <a href="#why-homefeast" className="text-xl font-semibold text-white transition-colors hover:text-[#FFE0A3]">
              Why HomeFeast
            </a>
            <a href="#For-cooks" className="text-xl font-semibold text-white transition-colors hover:text-[#FFE0A3]">
              For cooks
            </a>
            
          </div>

          {/* Login / My account */}
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className="mt-2 rounded-full border border-white/50 bg-white/20 px-6 py-2 text-lg font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-[#743014]"
          >
            {isLoggedIn ? "My account" : "Login"}
          </button>
        </div>
      </nav>

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