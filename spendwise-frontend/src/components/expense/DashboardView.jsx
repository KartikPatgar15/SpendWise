// src/components/expense/DashboardView.jsx
// Full replacement of the stub. Uses StatCard + useDashboard.
// Props interface is EXTENDED — onBack is still supported.

import StatCard from "../ui/StatCard";
import EmptyState from "../ui/EmptyState";
import { useDashboard } from "../../hooks/useDashboard";
import { formatRupees } from "../../utils/expenseHelpers";

export default function DashboardView({ data, onBack, tokens }) {
  const expenses = Array.isArray(data) ? data : [];
  const { stats } = useDashboard(expenses);

  // tokens fallback for when called from Tracker without theme context
  const t = tokens || {
    text: "text-gray-900",
    muted: "text-gray-500",
    card: "bg-white",
    border: "border-gray-200",
    btn: { ghost: "text-blue-600" },
  };

  if (!stats) {
    return (
      <div className={`space-y-4 ${t.text}`}>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <EmptyState message="No expenses yet — add one to get started" tokens={t} />
        <button onClick={onBack} className={`text-sm ${t.btn.ghost}`}>← Back</button>
      </div>
    );
  }

  const statCards = [
    {
      label: "All Time Total",
      value: formatRupees(stats.totalAll),
      icon: "💰",
      accent: false,
    },
    {
      label: "This Month",
      value: formatRupees(stats.totalThisMonth),
      icon: "📅",
      accent: true,
    },
    {
      label: "This Week",
      value: formatRupees(stats.totalThisWeek),
      icon: "📆",
      accent: false,
    },
    {
      label: "Transactions",
      value: stats.transactionCount,
      icon: "🧾",
      accent: false,
    },
  ];

  return (
    <div className={`space-y-5 ${t.text} animate-fade-slide-up`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className={`px-2.5 py-1 rounded-lg text-xs font-bold ${t.btn.ghost} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}>
            ← Back
          </button>
          <h2 className="text-xl font-black tracking-tight">Overview Dashboard</h2>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} tokens={t} {...card} />
        ))}
      </div>

      {/* Top spending category */}
      {stats.topSpend && (
        <div className={`${t.card} ${t.border} border rounded-2xl p-5 shadow-xs transition-all duration-200 hover:shadow-md`}>
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${t.muted}`}>
            Top Spending Category
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.badge?.[stats.topSpend.category] || "bg-blue-500/10 text-blue-500"}`}>
                {stats.topSpend.category}
              </span>
            </div>
            <span className={`text-xl font-black tabular-nums ${t.text}`}>
              {formatRupees(stats.topSpend.amount)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
