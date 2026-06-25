// src/pages/AnalyticsPage.jsx
// New analytics page. Completely standalone — does not modify any existing file.
// Route: /analytics

import { useEffect } from "react";
import { useExpenses } from "../hooks/useExpenses";
import { useTheme } from "../hooks/useTheme";
import { useAnalytics } from "../hooks/useAnalytics";
import { useDateRange } from "../hooks/useDateRange";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import MonthlyTrendChart from "../components/charts/MonthlyTrendChart";
import WeeklyTrendChart from "../components/charts/WeeklyTrendChart";
import DateRangePicker from "../components/ui/DateRangePicker";
import StatCard from "../components/ui/StatCard";
import EmptyState from "../components/ui/EmptyState";
import { formatRupees } from "../utils/expenseHelpers";
import { totalAmount, categorySummary } from "../utils/analytics";
import { CATEGORY_COLORS } from "../config/themeConfig";

export default function AnalyticsPage() {
  const { tokens, theme } = useTheme();
  const { expenses, fetchHistory, loading } = useExpenses();
  const { from, to, setFrom, setTo, clearRange, filteredExpenses, hasRange } =
    useDateRange(expenses);
  const { pieData, monthlyData, weeklyData } = useAnalytics(filteredExpenses);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const catSummary = categorySummary(filteredExpenses);
  const total = totalAmount(filteredExpenses);

  return (
    <div className={`min-h-screen ${tokens.bg} ${tokens.text} p-4 pb-24 space-y-6`}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className={`text-sm mt-0.5 ${tokens.muted}`}>
          {hasRange ? "Filtered range" : "All time"} · {filteredExpenses.length} transactions
        </p>
      </div>

      {/* Date range filter */}
      <div className={`${tokens.card} ${tokens.border} border rounded-xl p-4`}>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${tokens.muted}`}>
          Date range
        </p>
        <DateRangePicker
          from={from}
          to={to}
          setFrom={setFrom}
          setTo={setTo}
          onClear={clearRange}
          tokens={tokens}
        />
      </div>

      {loading && (
        <div className={`text-center py-12 ${tokens.muted}`}>Loading...</div>
      )}

      {!loading && filteredExpenses.length === 0 && (
        <EmptyState
          icon="📊"
          message="No expenses found for this range"
          tokens={tokens}
        />
      )}

      {!loading && filteredExpenses.length > 0 && (
        <>
          {/* Summary stat cards */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Total spent"
              value={formatRupees(total)}
              icon="💸"
              tokens={tokens}
              accent
            />
            <StatCard
              label="Transactions"
              value={filteredExpenses.length}
              icon="🧾"
              tokens={tokens}
            />
          </div>

          {/* Category summary cards */}
          <div>
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${tokens.muted}`}>
              By Category
            </h2>
            <div className="space-y-2">
              {Object.entries(catSummary)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amount]) => {
                  const pct = total > 0 ? (amount / total) * 100 : 0;
                  const color = CATEGORY_COLORS[cat] || "#6b7280";
                  return (
                    <div
                      key={cat}
                      className={`${tokens.card} ${tokens.border} border rounded-xl p-3`}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-semibold">{cat}</span>
                        <span className="text-sm font-bold">{formatRupees(amount)}</span>
                      </div>
                      <div className={`h-1.5 rounded-full overflow-hidden ${tokens.border} bg-current/10`}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                      <p className={`text-xs mt-1 ${tokens.muted}`}>{pct.toFixed(1)}% of total</p>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Pie chart */}
          <div className={`${tokens.card} ${tokens.border} border rounded-xl p-4`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${tokens.muted}`}>
              Spending distribution
            </h2>
            <CategoryPieChart data={pieData} />
          </div>

          {/* Monthly trend */}
          <div className={`${tokens.card} ${tokens.border} border rounded-xl p-4`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${tokens.muted}`}>
              Monthly trend (last 6 months)
            </h2>
            <MonthlyTrendChart data={monthlyData} />
          </div>

          {/* Weekly trend */}
          <div className={`${tokens.card} ${tokens.border} border rounded-xl p-4`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${tokens.muted}`}>
              Daily spending (last 7 days)
            </h2>
            <WeeklyTrendChart data={weeklyData} />
          </div>
        </>
      )}
    </div>
  );
}
