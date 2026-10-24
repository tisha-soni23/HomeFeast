import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiSearch,
  FiShoppingBag,
  FiClock,
  FiCheck,
  FiMapPin,
  FiShield,
  FiArrowRight,
  FiX,
} from "react-icons/fi";
import {
  useCookOrders,
  setOrderStatus,
  STATUSES,
  mealCount,
  revenue,
} from "./cookOrdersStore";

const TABS = ["All orders", ...STATUSES];
const MAX_DAYS = 14;

const fmt = (n) => n.toLocaleString("en-IN");

const initialsOf = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

const pillStyle = {
  New: "bg-[#F5E3B3] text-[#8A5A14]",
  Preparing: "bg-[#F3D7D2] text-[#A04030]",
  Ready: "bg-[#D9EEDB] text-[#2F6B3A]",
  "Out for delivery": "bg-[#DCE5F5] text-[#34548A]",
  Delivered: "bg-[#EEE6DB] text-[#80634F]",
  Scheduled: "bg-[#E4D5EA] text-[#5A3A6A]",
};

const outline =
  "rounded-full border border-[#E3D3C2] bg-[#FFFCF7] px-5 py-2 text-sm font-bold text-[#32190F] transition-colors hover:bg-[#F5EDE3]";
const dark =
  "flex items-center gap-2 rounded-full bg-[#62200F] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#7D2D12]";
const green =
  "rounded-full bg-[#2F6B3A] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#265830]";

function dateFor(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

function VegDot({ veg }) {
  const color = veg ? "border-green-700" : "border-red-600";
  const fill = veg ? "bg-green-700" : "bg-red-600";
  return (
    <span className={`mt-1.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border ${color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${fill}`} />
    </span>
  );
}

function StatCard({ tile, icon, label, value, note }) {
  return (
    <div className="flex items-center gap-5 rounded-[28px] border border-[#EBDCC8] bg-[#FFFCF7] px-6 py-6">
      <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl ${tile}`}>
        {icon}
      </span>
      <div>
        <p className="text-sm text-[#80634F]">{label}</p>
        <p className="mt-1 font-serif text-4xl font-bold leading-tight">{value}</p>
        <p className="mt-1 text-xs text-[#80634F]">{note}</p>
      </div>
    </div>
  );
}

/* ---------- popups (rendered straight into <body>) ---------- */
function Popup({ label, onClose, printable, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      data-print-root={printable ? "" : undefined}
      onClick={onClose}
      className="fixed inset-0 z-[300] flex items-center justify-center overflow-y-auto bg-[#32190F]/60 p-4 backdrop-blur-sm"
    >
      {printable && (
        <style>{`@media print {
          body > *:not([data-print-root]) { display: none !important; }
          [data-print-root] { position: static !important; background: #fff !important; padding: 0 !important; display: block !important; backdrop-filter: none !important; }
          [data-print-root] [role="dialog"] { box-shadow: none !important; max-width: none !important; max-height: none !important; overflow: visible !important; }
          .no-print { display: none !important; }
        }`}</style>
      )}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-[24px] bg-[#FFFCF7] p-7 text-[#32190F] shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="no-print absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF8EE] text-xl transition-colors hover:bg-[#F5E6D5]"
        >
          <FiX />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

const FLOW = ["New", "Preparing", "Ready", "Out for delivery", "Delivered"];

function DetailsPopup({ order, onClose, onDelivered }) {
  const step = FLOW.indexOf(order.status);

  return (
    <Popup label={`Order ${order.id}`} onClose={onClose}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B94317]">Order #{order.id}</p>
      <div className="mt-2 flex items-center gap-3 pr-10">
        <h3 className="font-serif text-3xl font-semibold">{order.customer}</h3>
        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${pillStyle[order.status]}`}>{order.status}</span>
      </div>
      <p className="mt-1 text-sm text-[#80634F]">{order.plan}</p>

      <dl className="mt-6 space-y-3 rounded-2xl bg-[#F3E7DA] p-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[#80634F]">Dish</dt>
          <dd className="text-right font-bold">{order.dish} × {order.meals}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#80634F]">Note</dt>
          <dd className="text-right font-bold">{order.note}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#80634F]">{order.pickup ? "Pickup" : "Deliver to"}</dt>
          <dd className="text-right font-bold">{order.area}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#80634F]">Time slot</dt>
          <dd className="text-right font-bold">{order.slot}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-[#E3D3C2] pt-3">
          <dt className="text-[#80634F]">Total</dt>
          <dd className="font-serif text-xl font-bold">₹{fmt(order.price)}</dd>
        </div>
      </dl>

      {step >= 0 && (
        <ol className="mt-6 grid grid-cols-5 gap-1 text-center text-[11px] font-bold">
          {FLOW.map((s, i) => (
            <li key={s} className={i <= step ? "text-[#2F6B3A]" : "text-[#B7A394]"}>
              <span
                className={`mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  i <= step ? "bg-[#2F6B3A] text-white" : "bg-[#EEE6DB]"
                }`}
              >
                {i <= step ? <FiCheck /> : i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      )}

      <div className="mt-6 flex gap-3">
        {order.status === "Out for delivery" && (
          <button type="button" onClick={onDelivered} className={green}>
            Mark delivered
          </button>
        )}
        <button type="button" onClick={onClose} className={outline}>
          Close
        </button>
      </div>
    </Popup>
  );
}

function KitchenListPopup({ orders, dateLabel, onClose }) {
  // Group what still has to be cooked by dish
  const groups = useMemo(() => {
    const map = new Map();
    orders.forEach((x) => {
      const g = map.get(x.dish) ?? { dish: x.dish, veg: x.veg, meals: 0, items: [] };
      g.meals += x.meals;
      g.items.push(x);
      map.set(x.dish, g);
    });
    return [...map.values()].sort((a, b) => b.meals - a.meals);
  }, [orders]);

  return (
    <Popup label="Kitchen list" onClose={onClose} printable>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B94317]">Kitchen list</p>
      <h3 className="mt-2 pr-10 font-serif text-3xl font-semibold">{dateLabel}</h3>
      <p className="mt-1 text-sm text-[#80634F]">
        {groups.length === 0
          ? "Nothing left to prepare."
          : `${mealCount(orders)} meals across ${orders.length} orders`}
      </p>

      <ul className="mt-5 space-y-4">
        {groups.map((g) => (
          <li key={g.dish} className="rounded-2xl border border-[#EBDCC8] p-4">
            <p className="flex items-center gap-2 font-bold">
              <VegDot veg={g.veg} />
              {g.dish}
              <span className="ml-auto rounded-full bg-[#F3E7DA] px-3 py-1 text-sm">× {g.meals}</span>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-[#80634F]">
              {g.items.map((x) => (
                <li key={x.id}>
                  #{x.id} · {x.customer} × {x.meals} · {x.note} · {x.slot}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="no-print mt-6 flex gap-3">
        <button type="button" onClick={() => window.print()} className={dark}>
          Print list
        </button>
        <button type="button" onClick={onClose} className={outline}>
          Close
        </button>
      </div>
    </Popup>
  );
}

/* ---------- the page ---------- */
export default function CookOrders() {
  const [offset, setOffset] = useState(0); // 0 = today
  const [tab, setTab] = useState("All orders");
  const [query, setQuery] = useState("");
  const [live, setLive] = useState(true);
  const [confirmId, setConfirmId] = useState(null); // order waiting for "Confirm?" on Decline
  const [detailsId, setDetailsId] = useState(null);
  const [showKitchen, setShowKitchen] = useState(false);

  const orders = useCookOrders(offset);
  const isToday = offset === 0;

  const count = (s) => (s === "All orders" ? orders.length : orders.filter((x) => x.status === s).length);
  const newCount = count("New");
  const inKitchen = count("Preparing") + count("Ready");
  const goCount = count("Out for delivery");
  const pickups = orders.filter((x) => x.status === "Ready" && x.pickup).length;

  const q = query.toLowerCase().trim().replace(/^#/, "");
  const visible = orders.filter((x) => {
    if (tab !== "All orders" && x.status !== tab) return false;
    if (!q) return true;
    return [x.id, x.customer, x.area, x.dish].some((v) => v.toLowerCase().includes(q));
  });

  const date = dateFor(offset);
  const weekday = date.toLocaleDateString("en-IN", { weekday: "long" });
  const dayMonth = date.toLocaleDateString("en-IN", { day: "numeric", month: "long" });

  const details = orders.find((x) => x.id === detailsId);
  const kitchenOrders = isToday ? orders.filter((x) => ["New", "Preparing", "Ready"].includes(x.status)) : orders;

  const go = (next) => {
    setOffset(Math.max(-MAX_DAYS, Math.min(MAX_DAYS, next)));
    setTab("All orders");
    setConfirmId(null);
  };

  function actions(x) {
    switch (x.status) {
      case "New":
        return (
          <>
            {confirmId === x.id ? (
              <button
                type="button"
                autoFocus
                onClick={() => {
                  setOrderStatus(x.id, "Declined");
                  setConfirmId(null);
                }}
                onBlur={() => setConfirmId(null)}
                className="rounded-full bg-[#B94317] px-5 py-2 text-sm font-bold text-white"
              >
                Confirm?
              </button>
            ) : (
              <button type="button" onClick={() => setConfirmId(x.id)} className={outline}>
                Decline
              </button>
            )}
            <button type="button" onClick={() => setOrderStatus(x.id, "Preparing")} className={green}>
              Accept
            </button>
          </>
        );
      case "Preparing":
        return (
          <button type="button" onClick={() => setOrderStatus(x.id, "Ready")} className={dark}>
            Mark ready <FiArrowRight />
          </button>
        );
      case "Ready":
        return (
          <button type="button" onClick={() => setOrderStatus(x.id, "Out for delivery")} className={dark}>
            Hand off <FiArrowRight />
          </button>
        );
      default:
        return (
          <button type="button" onClick={() => setDetailsId(x.id)} className={outline}>
            View details
          </button>
        );
    }
  }

  return (
    <>
      {/* ---------- Stat cards ---------- */}
      <section className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        <StatCard
          tile="bg-[#F2DFA8] text-[#8A5A14]"
          icon={<FiShoppingBag />}
          label="New orders"
          value={newCount}
          note="Needs your response"
        />
        <StatCard
          tile="bg-[#F1D9D3] text-[#A04030]"
          icon={<FiClock />}
          label="In the kitchen"
          value={inKitchen}
          note="Preparing now"
        />
        <StatCard
          tile="bg-[#DCEFDD] text-[#2F6B3A]"
          icon={<FiCheck />}
          label="Ready to go"
          value={goCount}
          note={`${pickups} ${pickups === 1 ? "pickup" : "pickups"} waiting`}
        />
        <StatCard
          tile="bg-[#E4D9EC] text-[#5A3A7A]"
          icon={<span className="font-bold">₹</span>}
          label={isToday ? "Today’s revenue" : "Revenue"}
          value={`₹${fmt(revenue(orders))}`}
          note={`${orders.length} total orders`}
        />
      </section>

      {/* ---------- Orders list ---------- */}
      <section className="mt-6 rounded-[28px] border border-[#EBDCC8] bg-[#FFFCF7]">
        {/* Date, search, print */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#EBDCC8] px-6 py-6 sm:px-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(offset - 1)}
              disabled={offset <= -MAX_DAYS}
              aria-label="Previous day"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E3D3C2] text-xl transition-colors hover:bg-[#F5EDE3] disabled:opacity-40 disabled:hover:bg-transparent"
            >
              ‹
            </button>
            <div className="min-w-28">
              <p className="text-xs text-[#80634F]">{weekday}</p>
              <p className="font-serif text-xl font-bold">{dayMonth}</p>
            </div>
            <button
              type="button"
              onClick={() => go(offset + 1)}
              disabled={offset >= MAX_DAYS}
              aria-label="Next day"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E3D3C2] text-xl transition-colors hover:bg-[#F5EDE3] disabled:opacity-40 disabled:hover:bg-transparent"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => go(0)}
              className="rounded-full border border-[#E3D3C2] px-5 py-2.5 text-sm font-bold transition-colors hover:bg-[#F5EDE3]"
            >
              Today
            </button>
          </div>

          <label className="flex min-w-[220px] flex-1 items-center gap-3 rounded-full border border-[#E3D3C2] px-5 py-3.5">
            <FiSearch className="shrink-0 text-xl text-[#80634F]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order or customer"
              aria-label="Search order or customer"
              className="w-full bg-transparent text-base outline-none placeholder:text-[#B7A394]"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowKitchen(true)}
            className="rounded-full border border-[#E3D3C2] px-6 py-3 text-center text-sm font-bold leading-tight transition-colors hover:bg-[#F5EDE3]"
          >
            Print <br className="hidden sm:block" />
            kitchen list
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBDCC8] px-4 py-4 sm:px-5">
          <div role="tablist" aria-label="Order status" className="flex flex-wrap items-center gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
                  tab === t ? "bg-[#F3E7D2] text-[#32190F]" : "text-[#634B3C] hover:bg-[#F5EDE3]"
                }`}
              >
                {t}
                <span
                  className={`min-w-6 rounded-full px-2 py-0.5 text-center text-xs ${
                    tab === t ? "bg-[#E4CFB3]" : "bg-[#F1E6DA]"
                  }`}
                >
                  {count(t)}
                </span>
              </button>
            ))}
          </div>

          {isToday && (
            <button
              type="button"
              onClick={() => setLive((v) => !v)}
              aria-pressed={live}
              className={`flex items-center gap-2 px-2 text-sm font-bold ${live ? "text-[#2F6B3A]" : "text-[#80634F]"}`}
            >
              <span className={`h-3 w-3 rounded-full ${live ? "bg-[#2F6B3A]" : "bg-[#B7A394]"}`} />
              Lunch service is {live ? "live" : "paused"}
            </button>
          )}
        </div>

        {/* Orders */}
        {visible.length === 0 ? (
          <p className="px-8 py-14 text-center text-[#80634F]">
            {q ? "No orders match your search." : "No orders in this view."}
          </p>
        ) : (
          <ul>
            {visible.map((x) => (
              <li
                key={x.id}
                className="grid grid-cols-1 gap-x-6 gap-y-3 border-b border-[#EBDCC8] px-6 py-5 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1.1fr)_auto] sm:px-7"
              >
                <div className="flex items-center gap-4 sm:col-start-1 sm:row-start-1">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EFD590] font-bold text-[#6D280F]">
                    {initialsOf(x.customer)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-bold">{x.customer}</p>
                    <p className="text-xs text-[#80634F]">
                      #{x.id} · {x.plan}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:col-start-1 sm:row-start-2">
                  <FiMapPin className="shrink-0 text-2xl text-[#B94317]" />
                  <div className="min-w-0">
                    <p className="truncate font-bold">{x.area}</p>
                    <p className="text-xs text-[#80634F]">
                      {x.pickup ? "Pickup · " : ""}
                      {x.slot}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:col-start-2 sm:row-start-1">
                  <VegDot veg={x.veg} />
                  <div className="min-w-0">
                    <p className="font-bold">{x.dish}</p>
                    <p className="text-xs text-[#80634F]">
                      {x.meals} {x.meals === 1 ? "meal" : "meals"} · {x.note}
                    </p>
                  </div>
                </div>

                <p className="font-serif text-xl font-bold sm:col-start-2 sm:row-start-2 sm:self-center">
                  ₹{fmt(x.price)}
                </p>

                <div className="sm:col-start-3 sm:row-start-1 sm:justify-self-end">
                  <span className={`inline-block rounded-full px-3 py-1.5 text-xs font-bold ${pillStyle[x.status]}`}>
                    {x.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:col-start-3 sm:row-start-2 sm:justify-self-end">
                  {actions(x)}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-[27px] bg-[#F3EADF] px-6 py-5 text-sm sm:px-7">
          <p className="flex items-center gap-2 text-[#80634F]">
            <FiShield />
            {orders.length} orders confirmed · {mealCount(orders)} meals to prepare
          </p>
          <button
            type="button"
            onClick={() => go(isToday ? 1 : 0)}
            className="flex items-center gap-2 font-bold text-[#B94317] transition-colors hover:text-[#713014]"
          >
            {isToday ? "View tomorrow’s orders" : "Back to today’s orders"} <FiArrowRight />
          </button>
        </div>
      </section>

      {details && (
        <DetailsPopup
          order={details}
          onClose={() => setDetailsId(null)}
          onDelivered={() => {
            setOrderStatus(details.id, "Delivered");
            setDetailsId(null);
          }}
        />
      )}

      {showKitchen && (
        <KitchenListPopup
          orders={kitchenOrders}
          dateLabel={`${weekday}, ${dayMonth}`}
          onClose={() => setShowKitchen(false)}
        />
      )}
    </>
  );
}