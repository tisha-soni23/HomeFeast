import { useState } from "react";
import { useFavorites, toggleFavorite } from "./favorite";
import { useOrders, friendlyDate } from "./orderstore";
import CookMenuPlans from "./CookMenuPlans";
import AdminSubscriptions from "./AdminSubscriptions";
import { useCookMenu, updatedLabel, dishCount } from "./cookmenustore";
import { useSubscriptions } from "../data/subscriptionsstore";
import CookOrders from "./Cookorders";
import { useCookOrders } from "./Cookordersstore";
import {
  FiShoppingBag,
  FiCalendar,
  FiHeart,
  FiArrowLeft,
  FiX,
  FiHome,
  FiMapPin,
  FiShield,
} from "react-icons/fi";

/* ---------- Sample data*/
const subscription = {
  kitchen: "Anita's Ghar Ka Khana",
  plan: "Weekly lunch",
  nextMeal: "Next meal today, 12:30–1:00 PM",
  delivered: 3,
  total: 5,
};

const customerStats = [
  { label: "Next delivery", value: "Today, 12:30 PM", note: "Dal tadka thali" },
  { label: "This month", value: "14 meals", note: "₹1,542 spent" },
  { label: "Saved kitchens", value: "3", note: "2 new menus today" },
];

const recentOrders = [
  { initials: "AS", name: "Anita's Ghar Ka Khana", meta: "Weekly lunch · Today", status: "Out for delivery", price: 119, avatar: "bg-[#EFC97A] text-[#6D280F]" },
  { initials: "MI", name: "Meera's South Kitchen", meta: "One meal · 12 Apr", status: "Delivered", price: 139, avatar: "bg-[#DCEFDD] text-[#2F6B3A]" },
];

const statusStyle = {
  "Out for delivery": "bg-[#D9EEDB] text-[#2F6B3A]",
  Delivered: "bg-[#EEE6DB] text-[#80634F]",
  Pending: "bg-[#FFF0D8] text-[#873C1D]",
};


const avatarColors = [
  "bg-[#EFC97A] text-[#6D280F]",
  "bg-[#DCEFDD] text-[#2F6B3A]",
  "bg-[#E4D5EA] text-[#5A3A6A]",
];
const initialsOf = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

function toOrderRow(o, i) {
  const d = friendlyDate(o.startDate);
  const when = d === "Today" || d === "Tomorrow" ? d.toLowerCase() : d;
  return {
    key: o.id,
    initials: initialsOf(o.cook),
    name: o.kitchen,
    meta: `${o.plan} · Starts ${when}`,
    status: "Pending",
    price: o.total,
    avatar: avatarColors[i % avatarColors.length],
  };
}

const cookStats = [
  { label: "Today's orders", value: "18", note: "14 accepted · 4 pending" },
  { label: "Active plans", value: "46", note: "+8 this month" },
  { label: "This month's earnings", value: "₹32,480", note: "12% above last month" },
];

const initialRequests = [
  { id: 1, initials: "AK", name: "Aarav Kapoor", meta: "Weekly lunch · Starts tomorrow · Koramangala", price: 547 },
];

const adminStats = [
  { label: "Registered users", value: "12,486", note: "+8.4% this month" },
  { label: "Active subscriptions", value: "3,214", note: "72% retention" },
  { label: "Live home cooks", value: "486", note: "34 pending review" },
  { label: "Order conversion", value: "18.6%", note: "+2.1% this month" },
];

const initialApprovals = [
  { id: 1, initials: "RN", name: "Rekha Nair · Nair's Home Table", meta: "Kerala cuisine · HSR Layout · Documents verified" },
];

// Bar heights (% of the chart) for the 30-day activity chart
const activityBars = [41, 58, 48, 70, 66, 84, 76, 92, 86, 100, 88, 96];

const roles = ["Customer", "Cook", "Admin"];

const navByRole = {
  Customer: [
    { id: "overview", label: "Overview", icon: FiShoppingBag },

    { id: "saved", label: "Saved cooks", icon: FiHeart },
  ],
  Cook: [
    { id: "overview", label: "Overview", icon: FiHome },
    { id: "orders", label: "Orders", icon: FiCalendar },
    { id: "menu", label: "Menu & plans", icon: FiHeart },
  ],
  Admin: [
    { id: "overview", label: "Overview", icon: FiShield },
    { id: "subscriptions", label: "Subscriptions", icon: FiCalendar },
   
  ],
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* Small reusable pieces */
function StatCard({ label, value, note }) {
  return (
    <div className="flex flex-col justify-center rounded-3xl border border-[#EBDCC8] bg-[#FFFCF7] p-7">
      <p className="text-[#80634F]">{label}</p>
      <p className="mt-3 font-serif text-4xl font-bold leading-tight">{value}</p>
      <p className="mt-2 text-sm text-[#80634F]">{note}</p>
    </div>
  );
}

/* ---------------- Customer overview ---------------- */
function CustomerOverview() {
  const newOrders = useOrders();
  const orders = [
    ...newOrders.map(toOrderRow),
    ...recentOrders.map((o) => ({ ...o, key: o.name })),
  ];
  const saved = useFavorites();
  const stats = customerStats.map((s) =>
    s.label === "Saved kitchens"
      ? { ...s, value: String(saved.length), note: "Tap the heart to save more" }
      : s
  );
  const progress = Math.round((subscription.delivered / subscription.total) * 100);

  return (
    <>
      <section className="mt-10 rounded-[28px] bg-[#62200F] p-8 text-white shadow-[0_25px_60px_-20px_rgba(98,32,15,0.55)]">
        <span className="inline-block rounded-full bg-[#D9EEDB] px-4 py-1.5 text-xs font-bold text-[#2F6B3A]">
          Active subscription
        </span>
        <h2 className="mt-5 font-serif text-3xl font-semibold">{subscription.kitchen}</h2>
        <p className="mt-2 text-[#E8D2BE]">
          {subscription.plan} · {subscription.nextMeal}
        </p>

        <p className="mt-10 text-sm text-[#E8D2BE]">
          {subscription.delivered} of {subscription.total} meals delivered
        </p>
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-3 h-2 overflow-hidden rounded-full bg-white/20"
        >
          <div className="h-full rounded-full bg-[#EFC15E]" style={{ width: `${progress}%` }} />
        </div>

        
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </section>

      <section className="mt-8 overflow-hidden rounded-[28px] border border-[#EBDCC8] bg-[#FFFCF7]">
        <div className="flex items-center justify-between px-8 py-7">
          <h2 className="font-serif text-3xl font-semibold">Recent orders</h2>
          
        </div>
        <ul>
          {orders.map((o) => (
            <li key={o.key} className="flex flex-wrap items-center gap-4 border-t border-[#EBDCC8] px-8 py-6">
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold ${o.avatar}`}>
                {o.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{o.name}</p>
                <p className="text-sm text-[#80634F]">{o.meta}</p>
              </div>
              <span className={`rounded-full px-4 py-2 text-sm font-bold ${statusStyle[o.status]}`}>
                {o.status}
              </span>
              <span className="w-16 text-right font-bold">₹{o.price}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/* ---------------- Cook overview ---------------- */
function CookOverview({ onEditMenu }) {
  const menuState = useCookMenu();
  const todayOrders = useCookOrders(0);
  const waiting = todayOrders.filter((x) => x.status === "New").length;
  const cookStatsLive = cookStats.map((c) =>
    c.label === "Today's orders"
      ? { ...c, value: String(todayOrders.length), note: `${todayOrders.length - waiting} accepted · ${waiting} pending` }
      : c
  );
  // status: "pending" | "accepted". Declined requests are removed.
  const [requests, setRequests] = useState(
    initialRequests.map((r) => ({ ...r, status: "pending" }))
  );

  const accept = (id) =>
    setRequests((list) => list.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)));
  const decline = (id) => setRequests((list) => list.filter((r) => r.id !== id));

  return (
    <>
      <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {cookStatsLive.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </section>

      {/* New subscription requests */}
      <section className="mt-6 overflow-hidden rounded-[28px] border border-[#EBDCC8] bg-[#FFFCF7]">
        <div className="flex items-center justify-between px-8 py-7">
          <h2 className="font-serif text-3xl font-semibold">New subscription requests</h2>
          
        </div>

        {requests.length === 0 ? (
          <p className="border-t border-[#EBDCC8] px-8 py-8 text-[#80634F]">
            No new requests right now.
          </p>
        ) : (
          <ul>
            {requests.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-4 border-t border-[#EBDCC8] px-8 py-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFC97A] text-sm font-bold text-[#6D280F]">
                  {r.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{r.name}</p>
                  <p className="text-sm text-[#80634F]">{r.meta}</p>
                </div>
                <span className="font-bold">₹{r.price}</span>

                {r.status === "accepted" ? (
                  <span className="rounded-full bg-[#D9EEDB] px-5 py-3 text-sm font-bold text-[#2F6B3A]">
                    Accepted
                  </span>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => decline(r.id)}
                      className="rounded-full border border-[#E3D3C2] px-6 py-3 text-sm font-bold transition-colors hover:bg-[#F5EDE3]"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => accept(r.id)}
                      className="rounded-full bg-[#2F6B3A] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#265830]"
                    >
                      Accept
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Menu & pricing + Service area */}
      <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-center gap-5 rounded-3xl border border-[#EBDCC8] bg-[#FFFCF7] p-7">
          <FiShoppingBag className="text-2xl text-[#B94317]" />
          <div className="flex-1">
            <p className="font-bold">Menu & pricing</p>
            <p className="mt-1 text-sm text-[#80634F]">
              {dishCount(menuState)} dishes · {updatedLabel(menuState.updatedAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onEditMenu}
            className="font-bold text-[#B94317] transition-colors hover:text-[#713014]"
          >
            Edit
          </button>
        </div>

        <div className="flex items-center gap-5 rounded-3xl border border-[#EBDCC8] bg-[#FFFCF7] p-7">
          <FiMapPin className="text-2xl text-[#B94317]" />
          <div className="flex-1">
            <p className="font-bold">Service area</p>
            <p className="mt-1 text-sm text-[#80634F]">4 km · 2 delivery slots</p>
          </div>
          <button type="button" className="font-bold text-[#B94317] transition-colors hover:text-[#713014]">
            Edit
          </button>
        </div>
      </section>
    </>
  );
}

/* ---------------- Admin overview ---------------- */
function AdminOverview() {
  const { counts } = useSubscriptions();
  const stats = adminStats.map((s) =>
    s.label === "Active subscriptions" ? { ...s, value: counts.Active.toLocaleString("en-IN") } : s
  );

  // status: "pending" | "approved"
  const [cooks, setCooks] = useState(
    initialApprovals.map((c) => ({ ...c, status: "pending" }))
  );

  const approve = (id) =>
    setCooks((list) => list.map((c) => (c.id === id ? { ...c, status: "approved" } : c)));

  return (
    <>
      <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </section>

      {/* Cook approvals */}
      <section className="mt-6 overflow-hidden rounded-[28px] border border-[#EBDCC8] bg-[#FFFCF7]">
        <div className="flex items-center justify-between px-8 py-7">
          <h2 className="font-serif text-3xl font-semibold">Cook approvals</h2>
          <button type="button" className="font-bold text-[#B94317] transition-colors hover:text-[#713014]">
            Review all 34
          </button>
        </div>

        {cooks.length === 0 ? (
          <p className="border-t border-[#EBDCC8] px-8 py-8 text-[#80634F]">
            No cooks waiting for approval.
          </p>
        ) : (
          <ul>
            {cooks.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-4 border-t border-[#EBDCC8] px-8 py-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E4D5EA] text-sm font-bold text-[#5A3A6A]">
                  {c.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{c.name}</p>
                  <p className="text-sm text-[#80634F]">{c.meta}</p>
                </div>

                {c.status === "approved" ? (
                  <span className="rounded-full bg-[#D9EEDB] px-5 py-3 text-sm font-bold text-[#2F6B3A]">
                    Approved
                  </span>
                ) : (
                  <>
                    <span className="flex items-center gap-2 font-bold text-[#6D4A14]">
                      <FiShield className="text-lg text-[#D58A28]" />
                      Ready
                    </span>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="rounded-full border border-[#E3D3C2] px-6 py-3 text-sm font-bold transition-colors hover:bg-[#F5EDE3]"
                      >
                        Review
                      </button>
                      <button
                        type="button"
                        onClick={() => approve(c.id)}
                        className="rounded-full bg-[#2F6B3A] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#265830]"
                      >
                        Approve
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 30-day activity */}
      <section className="mt-6 flex flex-col gap-8 rounded-[28px] border border-[#EBDCC8] bg-[#FFFCF7] p-8 sm:flex-row sm:items-end sm:gap-12 sm:p-10">
        <div className="sm:w-48 sm:shrink-0 sm:pb-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B94317]">
            30-day activity
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight">
            Orders &amp; subscriptions
          </h2>
        </div>

        <div className="flex h-52 flex-1 items-end gap-3 sm:gap-4" role="img" aria-label="Bar chart of orders and subscriptions over the last 30 days">
          {activityBars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-lg bg-linear-to-b from-[#DDA32A] to-[#A3411A]"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </section>
    </>
  );
}

/* ---------------- Saved (hearted) meals ---------------- */
function SavedList({ title }) {
  const saved = useFavorites();

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-3xl font-semibold">{title}</h2>
        <p className="text-[#80634F]">{saved.length} saved</p>
      </div>

      {saved.length === 0 ? (
        <div className="mt-6 rounded-[28px] border border-dashed border-[#D9C3AC] bg-[#FFFCF7] px-8 py-16 text-center text-[#80634F]">
          <FiHeart className="mx-auto text-3xl text-[#B94317]" />
          <p className="mt-4 font-serif text-2xl font-semibold text-[#32190F]">Nothing saved yet</p>
          <p className="mt-2">Tap the heart on a meal in Explore meals and it will appear here.</p>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {saved.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-3xl border border-[#EBDCC8] bg-[#FFFCF7]">
              <div className="relative h-40 bg-[#F3E7DA]">
                <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => toggleFavorite(m)}
                  aria-label={`Remove ${m.name} from saved`}
                  className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#C94B16] text-white shadow transition-transform hover:scale-110"
                >
                  <FiHeart className="fill-current" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-xl font-bold leading-snug">{m.name}</h3>
                  {m.rating != null && (
                    <span className="shrink-0 font-semibold text-[#873C1D]">★ {Number(m.rating).toFixed(1)}</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-[#A58B77]">by {m.cook}</p>
                <p className="mt-3 text-sm text-[#80634F]">
                  {[m.cuisine, m.prepTime, m.distance].filter(Boolean).join(" · ")}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#EBDCC8] pt-4">
                  <p className="text-[#80634F]">
                    From <span className="text-xl font-bold text-[#32190F]">₹{m.price}</span>
                    <span className="ml-1 text-xs">/ meal</span>
                  </p>
                  {m.plan && (
                    <span className="rounded-full bg-[#FFF0D8] px-3 py-1.5 text-xs font-bold text-[#873C1D]">
                      {m.plan}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ---------------- Main dashboard ---------------- */
export default function Dashboard({  initialRole = "Customer", onClose }) {
  const [role, setRole] = useState(initialRole);
  const [tab, setTab] = useState("overview");

  const navItems = navByRole[role];

  function switchRole(r) {
    setRole(r);
    setTab("overview");
  }

  const heading =
    role === "Cook"
      ? tab === "menu"
        ? "Menu & meal plans"
        : tab === "orders"
        ? "Today’s orders"
        : "Your kitchen at a glance"
      : role === "Admin"
      ? tab === "subscriptions"
        ? "Subscriptions"
        : "Platform overview"
      : `${greeting()} `;

  let content;
  if (tab === "overview" && role === "Customer") content = <CustomerOverview />;
  else if (tab === "overview" && role === "Cook") content = <CookOverview onEditMenu={() => setTab("menu")} />;
  else if (tab === "overview" && role === "Admin") content = <AdminOverview />;
  else if (tab === "menu" && role === "Cook") content = <CookMenuPlans />;
  else if (tab === "orders" && role === "Cook") content = <CookOrders />;
  else if (tab === "saved" && role === "Customer") content = <SavedList title="Saved cooks" />;
  else if (tab === "subscriptions" && role === "Admin") content = <AdminSubscriptions />;
  else
    content = (
      <div className="mt-10 rounded-[28px] border border-dashed border-[#D9C3AC] bg-[#FFFCF7] px-8 py-16 text-center text-[#80634F]">
        <p className="font-serif text-2xl font-semibold text-[#32190F]">Coming soon</p>
        <p className="mt-2">This section isn't built yet.</p>
      </div>
    );

  return (
    <div className="fixed inset-0 z-200 flex bg-[#F5EDE3] text-[#32190F]">
      {/* ---------- Sidebar ---------- */}
      <aside className="hidden w-74.25 shrink-0 flex-col bg-[#2F170E] px-8 py-10 text-[#F3DFCB] lg:flex">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF5E5] font-serif text-3xl font-bold text-[#B94317]">
            H
          </span>
          <span className="text-2xl font-bold text-white">HomeFeast</span>
        </div>

        {/* Role switcher */}
        <div className="mt-10 grid grid-cols-3 gap-1 rounded-2xl bg-white/10 p-1.5 text-sm font-bold">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => switchRole(r)}
              aria-pressed={role === r}
              className={`rounded-xl px-2 py-3 transition-colors ${
                role === r ? "bg-[#EFC15E] text-[#32190F]" : "text-[#E8D2BE] hover:bg-white/10"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Navigation (changes with the role) */}
        <nav className="mt-8 space-y-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id ? "page" : undefined}
              className={`flex w-full items-center gap-4 rounded-2xl px-5 py-5 text-left text-lg transition-colors ${
                tab === id ? "bg-white/10 text-white" : "text-[#E8D2BE] hover:bg-white/5"
              }`}
            >
              <Icon className="text-xl" />
              {label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={onClose}
          className="mt-auto flex items-center gap-4 px-5 py-3 text-left text-lg text-[#E8D2BE] transition-colors hover:text-white"
        >
          <FiArrowLeft className="text-xl" />
          Back to website
        </button>
      </aside>

      {/* ---------- Main ---------- */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile top bar (the sidebar is hidden on small screens) */}
        <div className="sticky top-0 z-30 bg-[#2F170E] text-white lg:hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <div className="flex gap-1 rounded-xl bg-white/10 p-1 text-xs font-bold">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchRole(r)}
                  aria-pressed={role === r}
                  className={`rounded-lg px-3 py-2 ${role === r ? "bg-[#EFC15E] text-[#32190F]" : "text-[#E8D2BE]"}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button type="button" onClick={onClose} className="text-sm font-semibold text-[#EFC15E]">
              Back
            </button>
          </div>

          {/* Section tabs: the same menu as the sidebar, for the selected role */}
          <nav aria-label="Sections" className="flex gap-2 overflow-x-auto px-5 pb-4">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={tab === id ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
                  tab === id ? "bg-[#EFC15E] text-[#32190F]" : "bg-white/10 text-[#E8D2BE]"
                }`}
              >
                <Icon />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mx-auto max-w-250 px-5 py-10 sm:px-8 lg:px-14 lg:py-14">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B94317]">
                {role} workspace
              </p>
              <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                {heading}
              </h1>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dashboard"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#E3D3C2] text-2xl transition-colors hover:bg-white"
            >
              <FiX />
            </button>
          </div>

          {content}
        </div>
      </main>
    </div>
  );
}