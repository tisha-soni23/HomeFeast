import { useEffect, useState } from "react";
import { FiX, FiArrowRight } from "react-icons/fi";

const fieldClass =
  "w-full rounded-xl border border-[#E6D1BE] bg-white px-4 py-3 text-sm text-[#32190F] outline-none transition focus:border-[#C94B16] focus:ring-2 focus:ring-[#C94B16]/10 sm:text-base";
const labelClass = "mb-2 block text-sm font-semibold text-[#634B3C]";

const slots = ["Lunch · 12:30 PM", "Lunch · 1:00 PM", "Dinner · 7:30 PM", "Dinner · 8:00 PM"];

// yyyy-mm-dd for tomorrow (used as the earliest start date)
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

export default function ConfirmPlan({ meal, plan, total, onClose, onSubmit }) {
  const [address, setAddress] = useState("");
  const [startDate, setStartDate] = useState(tomorrow());
  const [slot, setSlot] = useState(slots[0]);
  const [note, setNote] = useState("");

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

  function handleSubmit(e) {
    e.preventDefault();
    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }
    onSubmit?.({ meal, plan, total, address, startDate, slot, note });
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#32190F]/70 p-4 backdrop-blur-md"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-140 flex-col overflow-hidden rounded-3xl bg-[#FFFCF7] text-[#32190F] shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF8EE] text-xl shadow transition-colors hover:bg-[#F5E6D5]"
        >
          <FiX />
        </button>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 pb-7 pt-10 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C94B16]">
            Almost there
          </p>
          <h2 className="mt-2 font-serif text-4xl font-bold tracking-tight">
            Confirm your meal plan
          </h2>

          {/* Plan summary */}
          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-[#F3E7DA] px-5 py-4">
            <div>
              <p className="font-bold">
                {plan.name} · {meal.name}
              </p>
              <p className="text-sm text-[#80634F]">{plan.desc}</p>
            </div>
            <p className="font-bold">₹{total}</p>
          </div>

          {/* Delivery address */}
          <label htmlFor="address" className={`${labelClass} mt-6`}>
            Delivery address
          </label>
          <input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House no., street, area, city"
            autoComplete="street-address"
            className={fieldClass}
            required
          />

          {/* Start date + slot */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start-date" className={labelClass}>Start date</label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                min={tomorrow()}
                onChange={(e) => setStartDate(e.target.value)}
                className={fieldClass}
                required
              />
            </div>
            <div>
              <label htmlFor="slot" className={labelClass}>Delivery slot</label>
              <select
                id="slot"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className={fieldClass}
              >
                {slots.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Meal note */}
          <label htmlFor="note" className={`${labelClass} mt-4`}>Meal note</label>
          <textarea
            id="note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Less spicy, no onion, delivery instructions…"
            className={`${fieldClass} resize-y`}
          />

          {/* Price breakdown */}
          <dl className="mt-6 space-y-2 border-t border-[#EBDCC8] pt-5 text-sm text-[#80634F]">
            <div className="flex justify-between">
              <dt>Meal plan</dt>
              <dd className="font-semibold">₹{total}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd className="font-semibold">Included</dd>
            </div>
            <div className="flex items-center justify-between pt-2 text-base text-[#32190F]">
              <dt>Total</dt>
              <dd className=" text-2xl font-bold">₹{total}</dd>
            </div>
          </dl>

          <button
            type="submit"
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-[#6D280F] px-5 py-4 font-bold text-white transition-colors hover:bg-[#873C1D] focus:outline-none focus:ring-2 focus:ring-[#C94B16] focus:ring-offset-2"
          >
            Send subscription request <FiArrowRight />
          </button>

          <p className="mt-4 text-center text-xs text-[#80634F]">
            No payment is collected in this prototype. The cook reviews and accepts each request.
          </p>
        </form>
      </div>
    </div>
  );
}