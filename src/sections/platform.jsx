import { FiUsers, FiShoppingBag, FiShield, FiArrowRight } from "react-icons/fi";
import { useState,useEffect } from "react";
import Dashboard from "./dashboard";
export default function PlatformSection() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
    useEffect(() => {
    document.body.style.overflow = showDashboard ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDashboard]);
  return (
    <section className="bg-[#F7EFE2] px-6 py-24 sm:px-10 lg:px-16 lg:py-32" >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">

        {/* Left Content */}
        <div>
          <p className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-[#C94B16]">
            One platform, every need
          </p>

          <h2 className="max-w-xl font-serif text-4xl font-semibold leading-tight tracking-tight text-[#32190F] sm:text-5xl lg:text-6xl">
            Simple for
            <br />
            customers.
            <br />
            Powerful for cooks.
          </h2>
        </div>

        {/* Right Content */}
        <div className="flex flex-col">
          {/* Customer Account */}
          <a
            href="#customer-account"
            className="group flex items-center gap-6 border-t border-[#DDCBB5] py-8 transition-colors hover:bg-[#F2E5D3] sm:px-4"
          >
            <FiUsers className="shrink-0 text-2xl text-[#C94B16]" />

            <div className="flex-1"  onClick={() => {setSelectedRole("Customer");setShowDashboard(true);}} >
              <h3 className="font-serif text-xl font-semibold text-[#32190F] sm:text-2xl">
                Customer account
              </h3>

              <p className="mt-1 text-base text-[#80634F] sm:text-lg">
                Track meals and subscriptions
              </p>
            </div>

            <FiArrowRight className="shrink-0 text-2xl text-[#32190F] transition-transform group-hover:translate-x-2" />
          </a>

          {/* Cook Dashboard */}
          <a
            href="#cook-dashboard"
            className="group flex items-center gap-6 border-t border-[#DDCBB5] py-8 transition-colors hover:bg-[#F2E5D3] sm:px-4"
          >
            <FiShoppingBag className="shrink-0 text-2xl text-[#C94B16]" />

            <div className="flex-1" onClick={() => {setSelectedRole("Cook");setShowDashboard(true);}}>
              <h3 className="font-serif text-xl font-semibold text-[#32190F] sm:text-2xl">
                Cook dashboard
              </h3>

              <p className="mt-1 text-base text-[#80634F] sm:text-lg">
                Manage menus, orders, and earnings
              </p>
            </div>

            <FiArrowRight className="shrink-0 text-2xl text-[#32190F] transition-transform group-hover:translate-x-2" />
          </a>

          {/* Admin Controls */}
          <a
            href="#admin-controls"
            className="group flex items-center gap-6 border-y border-[#DDCBB5] py-8 transition-colors hover:bg-[#F2E5D3] sm:px-4"
          >
            <FiShield className="shrink-0 text-2xl text-[#C94B16]" />

            <div className="flex-1" onClick={() => {setSelectedRole("Admin");setShowDashboard(true);}}>
              <h3 className="font-serif text-xl font-semibold text-[#32190F] sm:text-2xl">
                Admin controls
              </h3>

              <p className="mt-1 text-base text-[#80634F] sm:text-lg">
                Review cooks and platform activity
              </p>
            </div>

            <FiArrowRight className="shrink-0 text-2xl text-[#32190F] transition-transform group-hover:translate-x-2" />
          </a>
        </div>
      </div>
      {showDashboard && (
              <Dashboard name="Aditi" initialRole={selectedRole}onClose={() => setShowDashboard(false)} />
            )}
            
    </section>
  );
}