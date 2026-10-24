import { useEffect, useRef, useState } from "react";
import {
  FiPlus,
  FiMoreHorizontal,
  FiClock,
  FiCheck,
  FiCalendar,
  FiArrowRight,
  FiX,
  FiEdit2,
  FiCopy,
  FiTrash2,
} from "react-icons/fi";
import {
  useCookMenu,
  addDish,
  updateDish,
  removeDish,
  copyDishToAllDays,
  addPlan,
  updatePlan,
  removePlan,
  DAY_COUNT,
} from "./cookmenustore";

const DAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MEALS = [
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
];

const fieldClass =
  "w-full rounded-xl border border-[#E6D1BE] bg-white px-4 py-3 text-sm text-[#32190F] outline-none transition focus:border-[#C94B16] focus:ring-2 focus:ring-[#C94B16]/10 sm:text-base";
const labelClass = "mb-2 block text-sm font-semibold text-[#634B3C]";

/* ---------- helpers ---------- */

// Dates for Mon-Sat of the current week
function weekDates() {
  const now = new Date();
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return Array.from({ length: DAY_COUNT }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.getDate();
  });
}

function todayIndex() {
  const i = (new Date().getDay() + 6) % 7; // Mon = 0 ... Sun = 6
  return i < DAY_COUNT ? i : 0;
}

const perMeal = (p) => Math.round(p.price / p.meals);

function fmtK(n) {
  if (n < 1000) return String(n);
  return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
}

/* ---------- small pieces ---------- */

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[#2F6B3A]" : "bg-[#D9C3AC]"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function TypeDot({ type }) {
  const c = type === "Veg" ? "border-green-700 bg-green-700" : "border-red-600 bg-red-600";
  const ring = type === "Veg" ? "border-green-700" : "border-red-600";
  return (
    <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border ${ring}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.split(" ")[1]}`} />
    </span>
  );
}

function DishThumb({ dish }) {
  if (dish.image) {
    return <img src={dish.image} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />;
  }
  return (
    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#F4C95D] to-[#E9A23B] font-serif text-2xl font-bold text-[#6D280F]">
      {dish.name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

// Price box: type freely, saves every valid number, resets if left empty
function PriceInput({ value, onCommit, label }) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);

  return (
    <label className="flex w-28 items-center gap-1 rounded-xl border border-[#E6D1BE] bg-white px-3 py-2.5 focus-within:border-[#C94B16] focus-within:ring-2 focus-within:ring-[#C94B16]/10">
      <span className="text-sm text-[#80634F]">₹</span>
      <input
        aria-label={label}
        inputMode="numeric"
        value={text}
        onChange={(e) => {
          const t = e.target.value.replace(/\D/g, "").slice(0, 5);
          setText(t);
          const n = Number(t);
          if (n > 0) onCommit(n);
        }}
        onBlur={() => setText(String(value))}
        className="w-full bg-transparent text-sm font-bold text-[#32190F] outline-none"
      />
    </label>
  );
}

// The "..." menu on each dish
function RowMenu({ dishName, onEdit, onCopyAll, onDelete }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
        setConfirm(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const item =
    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-[#F5EDE3]";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`More options for ${dishName}`}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-[#80634F] transition-colors hover:bg-[#F5EDE3]"
      >
        <FiMoreHorizontal />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-2xl border border-[#EBDCC8] bg-white shadow-xl">
          <button type="button" className={item} onClick={() => { setOpen(false); onEdit(); }}>
            <FiEdit2 /> Edit dish
          </button>
          <button type="button" className={item} onClick={() => { setOpen(false); onCopyAll(); }}>
            <FiCopy /> Copy to all days
          </button>
          <button
            type="button"
            className={`${item} text-[#B94317]`}
            onClick={() => {
              if (confirm) {
                setOpen(false);
                setConfirm(false);
                onDelete();
              } else setConfirm(true);
            }}
          >
            <FiTrash2 /> {confirm ? "Click again to delete" : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-300 flex items-center justify-center bg-[#32190F]/60 p-4 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-130 overflow-y-auto rounded-3xl bg-[#FFFCF7] p-7 text-[#32190F] shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF8EE] text-xl transition-colors hover:bg-[#F5E6D5]"
        >
          <FiX />
        </button>
        <h3 className="pr-10 font-serif text-3xl font-semibold">{title}</h3>
        {children}
      </div>
    </div>
  );
}

const chip = (on) =>
  `rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
    on
      ? "border-[#F28A3C] bg-[#FFF0D8] text-[#873C1D]"
      : "border-[#EBDCC8] bg-white text-[#32190F] hover:bg-[#FFF3E2]"
  }`;

/* ---------- Add / edit dish ---------- */
function DishModal({ mode, initial, dates, defaultDay, defaultMeal, onClose, onSave }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [desc, setDesc] = useState(initial?.desc ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [type, setType] = useState(initial?.type ?? "Veg");
  const [image, setImage] = useState(initial?.image ?? "");
  const [meal, setMeal] = useState(defaultMeal);
  const [days, setDays] = useState([defaultDay]);
  const [error, setError] = useState("");

  const toggleDay = (i) =>
    setDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i].sort()));

  function submit(e) {
    e.preventDefault();
    const p = Number(price);
    if (!name.trim()) return setError("Please enter a dish name.");
    if (!Number.isFinite(p) || p <= 0) return setError("Enter a price greater than 0.");
    if (mode === "add" && days.length === 0) return setError("Pick at least one day.");
    onSave({
      fields: { name: name.trim(), desc: desc.trim(), price: Math.round(p), type, image: image.trim() },
      meal,
      days,
    });
  }

  return (
    <Modal title={mode === "edit" ? "Edit dish" : "New menu item"} onClose={onClose}>
      <form onSubmit={submit} noValidate className="mt-5">
        <label htmlFor="dish-name" className={labelClass}>Dish name</label>
        <input id="dish-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Everyday thali" className={fieldClass} />

        <label htmlFor="dish-desc" className={`${labelClass} mt-4`}>What's included</label>
        <input id="dish-desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Dal, sabzi, 4 phulkas, rice & salad" className={fieldClass} />

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="dish-price" className={labelClass}>Price per meal (₹)</label>
            <input id="dish-price" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="119" className={fieldClass} />
          </div>
          <div>
            <span className={labelClass}>Type</span>
            <div className="flex gap-2">
              {["Veg", "Non-Veg"].map((t) => (
                <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={chip(type === t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <label htmlFor="dish-image" className={`${labelClass} mt-4`}>Photo link (optional)</label>
        <input id="dish-image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className={fieldClass} />

        {mode === "add" && (
          <>
            <span className={`${labelClass} mt-4`}>Meal</span>
            <div className="flex gap-2">
              {MEALS.map((m) => (
                <button key={m.id} type="button" aria-pressed={meal === m.id} onClick={() => setMeal(m.id)} className={chip(meal === m.id)}>
                  {m.label}
                </button>
              ))}
            </div>

            <span className={`${labelClass} mt-4`}>Add to days</span>
            <div className="flex flex-wrap gap-2">
              {DAY_NAMES.map((d, i) => (
                <button key={d} type="button" aria-pressed={days.includes(i)} onClick={() => toggleDay(i)} className={chip(days.includes(i))}>
                  {d[0] + d.slice(1).toLowerCase()} {dates[i]}
                </button>
              ))}
            </div>
          </>
        )}

        {error && <p role="alert" className="mt-4 text-sm font-semibold text-[#B94317]">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button type="submit" className="rounded-full bg-[#6D280F] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#873C1D]">
            {mode === "edit" ? "Save changes" : "Add to menu"}
          </button>
          <button type="button" onClick={onClose} className="rounded-full border border-[#E3D3C2] px-6 py-3 text-sm font-bold transition-colors hover:bg-white">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------- Add / edit plan ---------- */
function PlanModal({ mode, initial, onClose, onSave, onDelete }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [meals, setMeals] = useState(initial ? String(initial.meals) : "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const m = Number(meals);
  const p = Number(price);
  const hint = m >= 1 && p > 0 ? `₹${Math.round(p / m)} per meal` : "";

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter a plan name.");
    if (!Number.isInteger(m) || m < 1) return setError("Meals must be a whole number, 1 or more.");
    if (!Number.isFinite(p) || p <= 0) return setError("Enter a price greater than 0.");
    onSave({ name: name.trim(), tagline: tagline.trim(), meals: m, price: Math.round(p), active });
  }

  return (
    <Modal title={mode === "edit" ? "Edit plan" : "New plan"} onClose={onClose}>
      <form onSubmit={submit} noValidate className="mt-5">
        <label htmlFor="plan-name" className={labelClass}>Plan name</label>
        <input id="plan-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Weekly lunch" className={fieldClass} />

        <label htmlFor="plan-tagline" className={`${labelClass} mt-4`}>Short description</label>
        <input id="plan-tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="5 weekday lunches · Pause or skip anytime" className={fieldClass} />

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="plan-meals" className={labelClass}>Number of meals</label>
            <input id="plan-meals" type="number" min="1" value={meals} onChange={(e) => setMeals(e.target.value)} placeholder="5" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="plan-price" className={labelClass}>Plan price (₹)</label>
            <input id="plan-price" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="547" className={fieldClass} />
          </div>
        </div>
        {hint && <p className="mt-2 text-sm text-[#80634F]">{hint}</p>}

        <div className="mt-5 flex items-center gap-3">
          <Switch checked={active} onChange={setActive} label="Plan is active" />
          <span className="text-sm font-semibold">{active ? "Active: customers can subscribe" : "Paused: hidden from customers"}</span>
        </div>

        {error && <p role="alert" className="mt-4 text-sm font-semibold text-[#B94317]">{error}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className="rounded-full bg-[#6D280F] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#873C1D]">
            {mode === "edit" ? "Save changes" : "Create plan"}
          </button>
          <button type="button" onClick={onClose} className="rounded-full border border-[#E3D3C2] px-6 py-3 text-sm font-bold transition-colors hover:bg-white">
            Cancel
          </button>
          {mode === "edit" && (
            <button
              type="button"
              onClick={() => (confirmDelete ? onDelete() : setConfirmDelete(true))}
              className="ml-auto rounded-full px-4 py-3 text-sm font-bold text-[#B94317] transition-colors hover:bg-[#F5EDE3]"
            >
              {confirmDelete ? "Click again to delete" : "Delete plan"}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

/* ---------- The page ---------- */
export default function CookMenuPlans() {
  const state = useCookMenu();
  const { menu, plans, cutoff, updatedAt } = state;

  const dates = weekDates();
  const [dayIdx, setDayIdx] = useState(todayIndex);
  const [meal, setMeal] = useState("lunch");
  const [dishForm, setDishForm] = useState(null); // { mode, dish? }
  const [planForm, setPlanForm] = useState(null); // { mode, plan? }
  const [saving, setSaving] = useState(false);

  // "Saving…" flashes briefly after every change, then "All changes saved"
  const prevStamp = useRef(updatedAt);
  useEffect(() => {
    if (prevStamp.current === updatedAt) return;
    prevStamp.current = updatedAt;
    setSaving(true);
    const t = setTimeout(() => setSaving(false), 700);
    return () => clearTimeout(t);
  }, [updatedAt]);

  const dishes = menu[`${dayIdx}-${meal}`] ?? [];
  const mealLabel = meal === "lunch" ? "lunch" : "dinner";

  // The plan with the most subscribers gets the highlight
  const popular = [...plans]
    .filter((p) => p.active && p.subscribers > 0)
    .sort((a, b) => b.subscribers - a.subscribers)[0];

  function saveDish({ fields, meal: m, days }) {
    if (dishForm.mode === "edit") {
      updateDish(dayIdx, meal, dishForm.dish.id, fields);
    } else {
      addDish({ days, meal: m, dish: fields });
      setMeal(m);
      if (!days.includes(dayIdx)) setDayIdx(days[0]);
    }
    setDishForm(null);
  }

  return (
    <>
      {/* Intro + add button */}
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-lg text-[#80634F]">
            Build your weekly menu and bundle dishes into flexible subscription plans.
          </p>
          <p
            role="status"
            className={`mt-3 flex items-center gap-2 text-sm font-bold ${
              saving ? "text-[#873C1D]" : "text-[#2F6B3A]"
            }`}
          >
            {saving ? (
              "Saving…"
            ) : (
              <>
                <FiCheck /> All changes saved
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDishForm({ mode: "add" })}
          className="flex items-center gap-2 rounded-full bg-[#62200F] px-7 py-4 font-bold text-white transition-colors hover:bg-[#7D2D12]"
        >
          <FiPlus /> Add menu item
        </button>
      </div>

      {/* ---------- Daily menu ---------- */}
      <section className="mt-8 rounded-[28px] border border-[#EBDCC8] bg-[#FFFCF7]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EBDCC8] px-8 py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B94317]">This week</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">Daily menu</h2>
          </div>

          <div role="tablist" aria-label="Meal" className="flex rounded-full bg-[#F0E4D8] p-1.5">
            {MEALS.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={meal === m.id}
                onClick={() => setMeal(m.id)}
                className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  meal === m.id ? "bg-white text-[#32190F] shadow" : "text-[#80634F] hover:text-[#32190F]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Day tabs */}
        <div role="tablist" aria-label="Day" className="grid grid-cols-3 gap-3 border-b border-[#EBDCC8] px-8 py-5 sm:grid-cols-6">
          {DAY_NAMES.map((d, i) => (
            <button
              key={d}
              type="button"
              role="tab"
              aria-selected={dayIdx === i}
              onClick={() => setDayIdx(i)}
              className={`rounded-2xl border py-4 text-center transition-colors ${
                dayIdx === i
                  ? "border-[#E9B96E] bg-[#FDEBD0]"
                  : "border-transparent bg-[#F5EAE0] hover:bg-[#F0E2D4]"
              }`}
            >
              <span className="block text-xs font-bold tracking-wide text-[#80634F]">{d}</span>
              <span className="mt-1 block font-serif text-2xl font-bold">{dates[i]}</span>
            </button>
          ))}
        </div>

        {/* Dishes */}
        <ul>
          {dishes.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-4 border-b border-[#EBDCC8] px-8 py-5 last:border-b-0">
              <DishThumb dish={d} />

              <div className={`min-w-0 flex-1 basis-48 ${d.available ? "" : "opacity-60"}`}>
                <p className="flex items-center gap-2 font-bold">
                  <TypeDot type={d.type} />
                  {d.name}
                </p>
                {d.desc && <p className="mt-1 text-sm text-[#80634F]">{d.desc}</p>}
              </div>

              <PriceInput
                value={d.price}
                label={`Price of ${d.name}`}
                onCommit={(n) => updateDish(dayIdx, meal, d.id, { price: n })}
              />

              <div className="flex w-28 items-center gap-2">
                <Switch
                  checked={d.available}
                  onChange={(v) => updateDish(dayIdx, meal, d.id, { available: v })}
                  label={`${d.name} available`}
                />
                <span className={`text-xs font-bold ${d.available ? "text-[#2F6B3A]" : "text-[#80634F]"}`}>
                  {d.available ? "Available" : "Sold out"}
                </span>
              </div>

              <RowMenu
                dishName={d.name}
                onEdit={() => setDishForm({ mode: "edit", dish: d })}
                onCopyAll={() => copyDishToAllDays(dayIdx, meal, d.id)}
                onDelete={() => removeDish(dayIdx, meal, d.id)}
              />
            </li>
          ))}
        </ul>

        {/* New dish row */}
        <div className="px-8 pb-6 pt-2">
          <button
            type="button"
            onClick={() => setDishForm({ mode: "add" })}
            className="flex w-full items-center gap-4 rounded-2xl border border-dashed border-[#D9C3AC] px-5 py-4 text-left transition-colors hover:bg-[#FFF8EE]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3E1CF] text-[#B94317]">
              <FiPlus />
            </span>
            <span>
              <span className="block font-bold">New dish</span>
              <span className="block text-sm text-[#80634F]">Add another {mealLabel} option</span>
            </span>
          </button>
        </div>

        <p className="flex items-center gap-3 rounded-b-[27px] bg-[#F3EADF] px-8 py-4 text-sm text-[#80634F]">
          <FiClock />
          Order cut-off is {cutoff.lunch} for lunch and {cutoff.dinner} for dinner.
        </p>
      </section>

      {/* ---------- Meal plans ---------- */}
      <section className="mt-6 rounded-[28px] border border-[#EBDCC8] bg-[#FFFCF7]">
        <div className="flex items-center justify-between border-b border-[#EBDCC8] px-8 py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B94317]">Recurring revenue</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">Meal plans</h2>
          </div>
          <button
            type="button"
            onClick={() => setPlanForm({ mode: "add" })}
            className="flex items-center gap-1 text-sm font-bold text-[#B94317] transition-colors hover:text-[#713014]"
          >
            <FiPlus /> New plan
          </button>
        </div>

        <div className="space-y-5 p-6">
          {plans.length === 0 && (
            <p className="px-2 py-6 text-center text-[#80634F]">
              No plans yet. Tap “New plan” to create your first one.
            </p>
          )}

          {plans.map((p) => {
            const isPopular = popular?.id === p.id;
            const badge = isPopular ? "Most popular" : p.active ? "Active" : "Paused";
            const badgeClass = isPopular
              ? "bg-[#D9EEDB] text-[#2F6B3A]"
              : p.active
              ? "bg-[#EEE6DB] text-[#80634F]"
              : "bg-[#FFF0D8] text-[#873C1D]";

            return (
              <article
                key={p.id}
                className={`rounded-3xl border p-6 ${
                  isPopular ? "border-[#E4B96B] bg-[#FFF4E2]" : "border-[#EBDCC8] bg-[#FFFCF7]"
                } ${p.active ? "" : "opacity-70"}`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-[#6D280F] ${
                      isPopular ? "bg-[#F2CE77]" : "bg-[#EADFD3]"
                    }`}
                  >
                    <FiCalendar />
                  </span>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${badgeClass}`}>{badge}</span>
                </div>

                <h3 className="mt-6 font-serif text-2xl font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-[#80634F]">{p.tagline}</p>

                <p className="mt-5 flex items-baseline gap-3">
                  <span className="font-serif text-4xl font-bold">₹{p.price.toLocaleString("en-IN")}</span>
                  <span className="text-sm text-[#80634F]">₹{perMeal(p)} / meal</span>
                </p>

                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#EBDCC8] pt-4">
                  <div>
                    <p className="font-bold">{p.subscribers}</p>
                    <p className="text-sm text-[#80634F]">subscribers</p>
                  </div>
                  <div>
                    <p className="font-bold">₹{fmtK(p.subscribers * p.price)}</p>
                    <p className="text-sm text-[#80634F]">monthly value</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPlanForm({ mode: "edit", plan: p })}
                  className="mt-4 flex w-full items-center justify-between border-t border-[#EBDCC8] pt-4 text-left font-bold text-[#B94317] transition-colors hover:text-[#713014]"
                >
                  Edit plan <FiArrowRight />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* ---------- Popups ---------- */}
      {dishForm && (
        <DishModal
          mode={dishForm.mode}
          initial={dishForm.dish}
          dates={dates}
          defaultDay={dayIdx}
          defaultMeal={meal}
          onClose={() => setDishForm(null)}
          onSave={saveDish}
        />
      )}

      {planForm && (
        <PlanModal
          mode={planForm.mode}
          initial={planForm.plan}
          onClose={() => setPlanForm(null)}
          onSave={(fields) => {
            if (planForm.mode === "edit") updatePlan(planForm.plan.id, fields);
            else addPlan(fields);
            setPlanForm(null);
          }}
          onDelete={() => {
            removePlan(planForm.plan.id);
            setPlanForm(null);
          }}
        />
      )}
    </>
  );
}