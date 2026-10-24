import { FiShield, FiCalendar, FiClock } from "react-icons/fi";

function TrustBar() {
  return (
    <section className="w-full bg-[#65280F] px-5 py-7">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-16 gap-y-5">

        {/* Verified Home Kitchens */}
        <div className="flex items-center gap-3 text-base font-semibold text-[#FFF9F0] sm:text-lg">
          <FiShield className="shrink-0 text-xl text-[#F5B942]" />
          <span>Verified home kitchens</span>
        </div>

        {/* Pause or Skip */}
        <div className="flex items-center gap-3 text-base font-semibold text-[#FFF9F0] sm:text-lg">
          <FiCalendar className="shrink-0 text-xl text-[#F5B942]" />
          <span>Pause or skip anytime</span>
        </div>

        {/* Reliable Delivery */}
        <div className="flex items-center gap-3 text-base font-semibold text-[#FFF9F0] sm:text-lg">
          <FiClock className="shrink-0 text-xl text-[#F5B942]" />
          <span>Reliable delivery windows</span>
        </div>

      </div>
    </section>
  );
}

export default TrustBar;