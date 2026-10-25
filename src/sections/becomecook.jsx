import { FiArrowRight } from "react-icons/fi";
import food1 from "../assets/optimized/food1.webp";
import { useState,useEffect } from "react";
import Dashboard from "./dashboard";
function BecomeCook() {
  const [showDashboard, setShowDashboard] = useState(false);
  useEffect(() => {
  document.body.style.overflow = showDashboard ? "hidden" : "";
  return () => {
    document.body.style.overflow = "";
  };
}, [showDashboard]);
  return (
    <section className="grid min-h-screen grid-cols-1 overflow-hidden bg-[#7D2D12] lg:grid-cols-2" id="For-cooks">

      {/* Left Side - Food Image */}
      <div className="relative min-h-100 lg:min-h-212.5">
        <img
          src={food1}
          alt="Fresh homemade meals"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Right Side - Content */}
      <div className="flex items-center bg-[#7D2D12] px-8 py-16 sm:px-12 lg:px-16 xl:px-20">

        <div className="mx-auto w-full max-w-xl">

          {/* Small Heading */}
          <p className="mb-7 text-sm font-bold uppercase tracking-[0.2em] text-[#F5B942]">
            Made at home. Built to grow.
          </p>

          {/* Main Heading */}
          <h2 className="mb-10 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-[#FFF5E5] sm:text-5xl xl:text-6xl">
            Your cooking deserves a bigger table.
          </h2>

          {/* Description */}
          <p className="mb-14 max-w-lg text-lg leading-[1.8] text-[#F1D5C2] sm:text-xl">
            Manage menus, service areas, subscriptions, delivery slots, and
            earnings from one simple cook dashboard.
          </p>

          {/* Statistics */}
          <div className="mb-14 flex flex-wrap gap-x-12 gap-y-6 sm:gap-x-16">

            <div>
              <h3 className="mb-2  text-3xl font-bold text-[#FFF5E5] sm:text-4xl">
                4.8/5
              </h3>

              <p className="text-sm text-[#F1D5C2] sm:text-base">
                Average cook rating
              </p>
            </div>

            <div>
              <h3 className="mb-2  text-3xl font-bold text-[#FFF5E5] sm:text-4xl">
                ₹32k
              </h3>

              <p className="text-sm text-[#F1D5C2] sm:text-base">
                Average monthly earnings
              </p>
            </div>

          </div>

          {/* Dashboard Button */}
          
          <button
            type="button"
           onClick={() => setShowDashboard(true)}
            className="inline-flex items-center justify-center gap-4 rounded-full bg-[#FFF3DC] px-8 py-5 text-base font-bold text-[#713014] transition-all duration-300 hover:-translate-y-1 hover:bg-white sm:px-9 sm:text-lg"
          >
            Preview cook dashboard

            <FiArrowRight className="text-xl" />
          </button>

        </div>

      </div>
      {showDashboard && (
        <Dashboard name="Aditi" initialRole="Cook" onClose={() => setShowDashboard(false)} />
      )}
    
    </section>
  );
}

export default BecomeCook;