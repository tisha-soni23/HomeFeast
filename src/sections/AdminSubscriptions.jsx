import { useMemo, useState } from "react";
import { FiSearch, FiCalendar, FiClock, FiHeart } from "react-icons/fi";
import {
  useSubscriptions,
  setSubscriptionStatus,
  nextDeliveryText,
} from "../data/subscriptionsstore";

const PAGE_SIZE = 4;
const FILTERS = ["All", "Active", "Pending", "Paused", "Cancelled"];

const statusStyle = {
  Active: "bg-[#D9EEDB] text-[#2F6B3A]",
  Pending: "bg-[#E4D5EA] text-[#5A3A6A]",
  Paused: "bg-[#FFF0D8] text-[#873C1D]",
  Cancelled: "bg-[#EEE6DB] text-[#80634F]",
};

const fmt = (n) => n.toLocaleString("en-IN");

const initialsOf = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

// 1 2 3 … 897   or   1 … 4 5 6 … 897
function pageList(current, last) {
  const keep = new Set([1, last, current - 1, current, current + 1]);
  if (current <= 2) [2, 3].forEach((p) => keep.add(p));
  if (current >= last - 1) [last - 2, last - 1].forEach((p) => keep.add(p));
  const pages = [...keep].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);
  const out = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

const csvCell = (v) => `"${String(v).replace(/"/g, '""')}"`;

function StatCard({ icon: Icon, tile, label, value, note }) {
  return (
    <div className="flex items-center gap-5 rounded-[28px] border border-[#EBDCC8] bg-[#FFFCF7] p-6">
      <span className={`flex h-17 w-17 shrink-0 items-center justify-center rounded-2xl text-2xl ${tile}`}>
        <Icon />
      </span>
      <div>
        <p className="text-sm text-[#80634F]">{label}</p>
        <p className="mt-1 font-serif text-4xl font-bold leading-tight text-[#32190F]">{value}</p>
        <p className="mt-1 text-xs font-semibold text-[#3D7A4B]">{note}</p>
      </div>
    </div>
  );
}

export default function AdminSubscriptions() {
  const { rows, counts } = useSubscriptions();

  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null); // row waiting for "Confirm?"
  const [exportMsg, setExportMsg] = useState("");

  const q = query.toLowerCase().trim().replace(/^#/, "");

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (filter !== "All" && r.status !== filter) return false;
        if (!q) return true;
        return (
          r.customer.toLowerCase().includes(q) ||
          r.kitchen.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        );
      }),
    [rows, filter, q]
  );

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  function exportReport() {
    const header = ["Subscription", "Customer", "Kitchen", "Plan", "Next delivery", "Status", "Amount (INR)"];
    const lines = filtered.map((r) =>
      [r.id, r.customer, r.kitchen, r.plan, nextDeliveryText(r), r.status, r.amount].map(csvCell).join(",")
    );
    const csv = [header.map(csvCell).join(","), ...lines].join("\n");

    try {
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `homefeast-subscriptions-${filter.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setExportMsg(`Exported ${fmt(total)} ${total === 1 ? "row" : "rows"}`);
    } catch {
      setExportMsg("Export isn't supported in this browser");
    }
    setTimeout(() => setExportMsg(""), 3000);
  }

  const act =
    "rounded-full border border-[#E3D3C2] px-4 py-2 text-xs font-bold transition-colors hover:bg-[#F5EDE3]";
  const actGreen =
    "rounded-full bg-[#2F6B3A] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#265830]";
  const actDanger =
    "rounded-full px-3 py-2 text-xs font-bold text-[#B94317] transition-colors hover:bg-[#F5EDE3]";

  return (
    <>
      {/* ---------- Stat cards ---------- */}
      <section className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard
          icon={FiCalendar}
          tile="bg-[#DCEFDD] text-[#2F6B3A]"
          label="Active subscriptions"
          value={fmt(counts.Active)}
          note="+8.2% this month"
        />
        <StatCard
          icon={FiClock}
          tile="bg-[#F5E0A8] text-[#8A5A14]"
          label="Pending approval"
          value={fmt(counts.Pending)}
          note="42 added today"
        />
        <StatCard
          icon={FiHeart}
          tile="bg-[#F1DAD7] text-[#9A3B2E]"
          label="Monthly retention"
          value="72.4%"
          note="+2.1% vs last month"
        />
      </section>

      {/* ---------- All subscriptions ---------- */}
      <section className="mt-6 rounded-[28px] border border-[#EBDCC8] bg-[#FFFCF7]">
        <div className="px-8 pt-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl font-semibold">All subscriptions</h2>
              <p className="mt-2 text-sm text-[#80634F]">
                Monitor plan health, payments, and fulfillment across every kitchen.
              </p>
            </div>

            <label className="flex w-full items-center gap-3 rounded-full border border-[#E3D3C2] bg-[#FFFCF7] px-5 py-3.5 sm:w-[372px]">
              <FiSearch className="shrink-0 text-xl text-[#80634F]" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search customer or cook"
                aria-label="Search customer or cook"
                className="w-full bg-transparent text-base text-[#32190F] outline-none placeholder:text-[#B7A394]"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pb-6">
            <div role="tablist" aria-label="Subscription status" className="flex flex-wrap items-center gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => {
                    setFilter(f);
                    setPage(1);
                    setConfirmId(null);
                  }}
                  className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors ${
                    filter === f
                      ? "border-[#E9B96E] bg-[#FFF1DC] text-[#32190F]"
                      : "border-transparent text-[#634B3C] hover:bg-[#F5EDE3]"
                  }`}
                >
                  {f}
                  {f === "Pending" && counts.Pending > 0 && (
                    <span
                      aria-label={`${counts.Pending} pending`}
                      className="rounded-full bg-[#E9B96E] px-2 py-0.5 text-[11px] font-bold text-[#6D280F]"
                    >
                      {counts.Pending}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {exportMsg && (
                <span role="status" className="text-sm font-semibold text-[#2F6B3A]">
                  {exportMsg}
                </span>
              )}
              <button
                type="button"
                onClick={exportReport}
                className="rounded-full border border-[#E3D3C2] bg-[#FFFCF7] px-6 py-3 text-sm font-bold transition-colors hover:bg-[#F5EDE3]"
              >
                Export report
              </button>
            </div>
          </div>
        </div>

        {/* Table (scrolls sideways on small screens) */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left">
            <thead>
              <tr className="bg-[#F7EEE4] text-xs font-bold uppercase tracking-wide text-[#80634F]">
                <th scope="col" className="px-8 py-4">Subscription</th>
                <th scope="col" className="px-4 py-4">Customer</th>
                <th scope="col" className="px-4 py-4">Plan</th>
                <th scope="col" className="px-4 py-4">Next delivery</th>
                <th scope="col" className="px-4 py-4">Status</th>
                <th scope="col" className="px-4 py-4">Amount</th>
                <th scope="col" className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-14 text-center text-[#80634F]">
                    No subscriptions match your search.
                  </td>
                </tr>
              ) : (
                visible.map((r) => (
                  <tr key={r.id} className="border-t border-[#EBDCC8]">
                    <td className="px-8 py-5 font-bold text-[#B94317]">#{r.id}</td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EFD590] text-sm font-bold text-[#6D280F]">
                          {initialsOf(r.customer)}
                        </span>
                        <div>
                          <p className="font-bold">{r.customer}</p>
                          <p className="text-xs text-[#80634F]">{r.kitchen}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-sm">{r.plan}</td>
                    <td className="px-4 py-5 text-sm">{nextDeliveryText(r)}</td>
                    <td className="px-4 py-5">
                      <span className={`inline-block rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-sm font-bold">₹{fmt(r.amount)}</td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2">
                        {r.status === "Active" && (
                          <button type="button" className={act} onClick={() => setSubscriptionStatus(r.id, "Paused")}>
                            Pause
                          </button>
                        )}
                        {r.status === "Paused" && (
                          <button type="button" className={actGreen} onClick={() => setSubscriptionStatus(r.id, "Active")}>
                            Resume
                          </button>
                        )}
                        {r.status === "Pending" && (
                          <button type="button" className={actGreen} onClick={() => setSubscriptionStatus(r.id, "Active")}>
                            Approve
                          </button>
                        )}

                        {r.status !== "Cancelled" &&
                          (confirmId === r.id ? (
                            <button
                              type="button"
                              autoFocus
                              onClick={() => {
                                setSubscriptionStatus(r.id, "Cancelled");
                                setConfirmId(null);
                              }}
                              onBlur={() => setConfirmId(null)}
                              className="rounded-full bg-[#B94317] px-4 py-2 text-xs font-bold text-white"
                            >
                              Confirm?
                            </button>
                          ) : (
                            <button type="button" className={actDanger} onClick={() => setConfirmId(r.id)}>
                              {r.status === "Pending" ? "Reject" : "Cancel"}
                            </button>
                          ))}

                        {r.status === "Cancelled" && <span className="text-sm text-[#B7A394]">—</span>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: count + pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#EBDCC8] px-8 py-6">
          <p className="text-sm text-[#80634F]">
            {total === 0
              ? "Showing 0 subscriptions"
              : `Showing ${fmt(start + 1)}–${fmt(Math.min(start + PAGE_SIZE, total))} of ${fmt(total)} subscriptions`}
          </p>

          <nav aria-label="Pagination" className="flex items-center gap-2">
            <button
              type="button"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
              className="rounded-lg border border-[#E3D3C2] px-4 py-2 text-sm font-semibold text-[#634B3C] transition-colors hover:bg-[#F5EDE3] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Previous
            </button>

            {pageList(current, pages).map((p, i) =>
              p === "…" ? (
                <span key={`gap-${i}`} className="px-1 text-[#80634F]" aria-hidden="true">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  aria-current={p === current ? "page" : undefined}
                  aria-label={`Page ${p}`}
                  onClick={() => setPage(p)}
                  className={`min-w-9 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                    p === current
                      ? "bg-[#62200F] text-white"
                      : "border border-[#E3D3C2] text-[#634B3C] hover:bg-[#F5EDE3]"
                  }`}
                >
                  {fmt(p)}
                </button>
              )
            )}

            <button
              type="button"
              disabled={current === pages}
              onClick={() => setPage(current + 1)}
              className="rounded-lg border border-[#E3D3C2] px-4 py-2 text-sm font-semibold text-[#634B3C] transition-colors hover:bg-[#F5EDE3] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Next
            </button>
          </nav>
        </div>
      </section>
    </>
  );
}