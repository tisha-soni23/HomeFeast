import { useEffect } from "react";
import { FiX, FiCheck } from "react-icons/fi";

// Delivery slot label -> time window shown on the card
const slotWindows = {
  "Lunch · 12:30 PM": "12:30–1:00 PM",
  "Lunch · 1:00 PM": "1:00–1:30 PM",
  "Dinner · 7:30 PM": "7:30–8:00 PM",
  "Dinner · 8:00 PM": "8:00–8:30 PM",
};

// "2026-10-23" -> "Tomorrow" / "Today" / "Fri, 23 Oct"
function friendlyDate(iso) {
  const d = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default function RequestSent({ meal, plan, requestId, startDate, slot, onClose, onTrack }) {
  // Esc closes and the page behind stops scrolling
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

  const firstDelivery = `${friendlyDate(startDate)}, ${slotWindows[slot] ?? slot}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#32190F]/70 p-4 backdrop-blur-md"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[24px] bg-[#FFFCF7] text-[#32190F] shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF8EE] text-xl shadow transition-colors hover:bg-[#F5E6D5]"
        >
          <FiX />
        </button>

        <div className="flex-1 overflow-y-auto px-6 pb-10 pt-12 text-center sm:px-8">
          {/* Green check */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DCEFDD] text-3xl text-[#2F6B3A]">
            <FiCheck />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#C94B16]">
            Request sent
          </p>
          <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            Your table is almost set.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg leading-8 text-[#80634F]">
            {meal.cook} will confirm your {plan.name.toLowerCase()} request
            shortly. We’ll keep you updated.
          </p>

          {/* Request details */}
          <dl className="mt-8 space-y-2 rounded-2xl bg-[#F3E7DA] px-5 py-4 text-left text-sm">
            <div className="flex gap-6">
              <dt className="w-32 shrink-0 text-[#80634F]">Request ID</dt>
              <dd className="font-bold">#{requestId}</dd>
            </div>
            <div className="flex gap-6">
              <dt className="w-32 shrink-0 text-[#80634F]">First delivery</dt>
              <dd className="font-bold">{firstDelivery}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={onTrack}
            className="mt-8 rounded-full bg-[#6D280F] px-8 py-4 font-bold text-white shadow-lg shadow-[#6D280F]/30 transition-colors hover:bg-[#873C1D]"
          >
            Track in my account
          </button>
        </div>
      </div>
    </div>
  );
}