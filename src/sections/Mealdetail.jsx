import { useEffect, useState } from "react";
import { FiX, FiClock, FiMapPin, FiCalendar, FiArrowRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import ConfirmPlan from "./confirmPlan";
import RequestSent from "./RequestSent";
import { addOrder } from "./orderstore";

const plans = [
  { id: "one", name: "One meal", desc: "Try a fresh meal today", meals: 1, save: 0 },
  { id: "weekly", name: "Weekly", desc: "5 meals, Monday to Friday", meals: 5, save: 8 },
  { id: "monthly", name: "Monthly", desc: "22 meals with pause anytime", meals: 22, save: 15 },
];

export default function MealDetail({ meal, onClose, onTrack }) {
  const [planId, setPlanId] = useState("weekly");
  const [step, setStep] = useState("detail"); // "detail" | "confirm" | "sent"
  const [request, setRequest] = useState(null);

  // Esc closes the popup (page scroll is locked/unlocked in ExploreMeals.jsx)
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Uses meal.menu if you add one, otherwise shows the meal itself
  const menu = meal.menu ?? [
    { name: meal.name, desc: meal.description, price: meal.price },
  ];

  const plan = plans.find((p) => p.id === planId);
  const total = Math.round(menu[0].price * plan.meals * (1 - plan.save / 100));

  // Send subscription request was clicked: show the "Request sent" card
  if(step === "sent") {
    return (
      <RequestSent
        meal={meal}
        plan={plan}
        requestId={request.id}
        startDate={request.startDate}
        slot={request.slot}
        onClose={onClose}
        onTrack={() => {
          // add this request to "Recent orders" in the dashboard
          addOrder({
            id: request.id,
            cook: meal.cook,
            kitchen: meal.name,
            plan: plan.name,
            total,
            startDate: request.startDate,
          });
          onClose();
          onTrack?.(); // opens the dashboard
        }}
      />
    );
  }

  // Continue was clicked: show the confirm card
  if (step === "confirm") {
    return (
      <ConfirmPlan
        meal={meal}
        plan={plan}
        total={total}
        onClose={onClose}
        onSubmit={({ startDate, slot }) => {
          setRequest({
            id: "HF" + Math.floor(10000 + Math.random() * 90000),
            startDate,
            slot,
          });
          setStep("sent");
        }}
      />
    );
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
        className="relative flex max-h-[92vh] w-full max-w-160 flex-col overflow-hidden rounded-3xl bg-[#FFFCF7] text-[#32190F] shadow-2xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF8EE] text-xl shadow transition-colors hover:bg-[#F5E6D5]"
        >
          <FiX />
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <img
            src={meal.image}
            alt={meal.name}
            className="h-32 w-full bg-[#F3E7DA] object-cover sm:h-40"
          />

          <div className="px-6 pb-8 pt-8 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C94B16]">
              {meal.cuisine} · {meal.distance}
            </p>

            <div className="mt-2 flex items-start justify-between gap-4">
              <h2 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
                {meal.name}
              </h2>
              <span className="mt-2 flex shrink-0 items-center gap-1.5 font-semibold">
                <FaStar className="text-[#D58A28]" />
                {Number(meal.rating).toFixed(1)}
              </span>
            </div>

            <p className="mt-3 text-[#80634F]">by {meal.cook}</p>
            <p className="mt-6 text-lg leading-8 text-[#634B3C]">{meal.description}</p>

            {/* Info row */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-y border-[#EBDCC8] py-4 text-sm text-[#634B3C]">
              <span className="flex items-center gap-2">
                <FiClock /> {meal.prepTime}
              </span>
              <span className="flex items-center gap-2">
                <FiMapPin /> {meal.delivers ?? "Delivers within 4 km"}
              </span>
              <span className="flex items-center gap-2">
                <FiCalendar /> {meal.days ?? "Mon–Sat"}
              </span>
            </div>

            {/* Today's menu */}
            <h3 className="mt-8 font-serif text-2xl font-bold">Today's menu</h3>
            <ul className="mt-3">
              {menu.map((m) => (
                <li
                  key={m.name}
                  className="flex items-start gap-3 border-b border-[#EBDCC8] py-4 last:border-0"
                >
                  <span className="mt-1.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border border-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-700" />
                  </span>
                  <div className="flex-1">
                    <p className="font-bold">{m.name}</p>
                    <p className="text-sm text-[#80634F]">{m.desc}</p>
                  </div>
                  <p className="font-bold">₹{m.price}</p>
                </li>
              ))}
            </ul>

            {/* Choose your rhythm */}
            <h3 className="mt-8 font-serif text-2xl font-bold">Choose your rhythm</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {plans.map((p) => {
                const active = p.id === planId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlanId(p.id)}
                    aria-pressed={active}
                    className={`rounded-2xl border-2 p-4 text-left transition-colors ${
                      active
                        ? "border-[#C94B16] bg-[#FFF1DC]"
                        : "border-[#EBDCC8] bg-white hover:border-[#E6D1BE]"
                    }`}
                  >
                    <span className="block font-bold">{p.name}</span>
                    <span className="mt-1 block text-sm text-[#80634F]">{p.desc}</span>
                    {p.save > 0 && (
                      <span className="mt-3 inline-block rounded-full bg-[#DCEFDD] px-3 py-1 text-xs font-bold text-[#2F6B3A]">
                        Save {p.save}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="flex items-center justify-between gap-4 border-t border-[#EBDCC8] bg-[#F3E7DA] px-6 py-4 sm:px-8">
          <div>
            <p className="text-xs text-[#80634F]">Estimated total</p>
            <p className="font-serif text-3xl font-bold">₹{total}</p>
          </div>
          <button
            type="button"
            onClick={() => setStep("confirm")}
            className="flex items-center gap-3 rounded-full bg-[#6D280F] px-8 py-4 font-bold text-white transition-colors hover:bg-[#873C1D]"
          >
            Continue <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}