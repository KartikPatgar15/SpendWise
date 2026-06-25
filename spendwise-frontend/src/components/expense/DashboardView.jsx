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
    <div className={`space-y-5 ${t.text}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button onClick={onBack} className={`text-sm ${t.btn.ghost}`}>← Back</button>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card) => (
          <StatCard key={card.label} tokens={t} {...card} />
        ))}
      </div>

      {/* Top spending category */}
      {stats.topSpend && (
        <div className={`${t.card} ${t.border} border rounded-xl p-4 shadow-sm`}>
          <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${t.muted}`}>
            Top Spending Category
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">{stats.topSpend.category}</span>
            <span className={`text-lg font-semibold ${t.text}`}>
              {formatRupees(stats.topSpend.amount)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
