// src/pages/AnalyticsPage.jsx
// Analytics & trends dashboard with Lucide icons.

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
import { TrendingUp, Wallet, Receipt, Tag, Calculator, ArrowLeft, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AnalyticsPage() {
  const { tokens, theme } = useTheme();
  const navigate = useNavigate();
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
    <div className={`min-h-screen ${tokens.bg} ${tokens.text} px-4 sm:px-6 lg:px-8 pt-6 pb-28 max-w-6xl mx-auto w-full space-y-5 animate-fade-slide-up transition-colors`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className={`p-2 rounded-xl ${tokens.btn.ghost} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`} title="Go back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <TrendingUp size={22} className="text-blue-500" />
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Analytics & Trends</h1>
            </div>
            <p className={`text-xs font-medium ${tokens.muted}`}>
              {hasRange ? "Filtered range" : "All time history"} · <strong className={tokens.text}>{filteredExpenses.length} transactions</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Date range filter */}
      <div className={`${tokens.card} ${tokens.border} border rounded-2xl p-4 sm:p-5 shadow-xs`}>
        <p className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${tokens.muted}`}>
          Filter by Date Range
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
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className={`text-xs font-bold uppercase tracking-wider ${tokens.muted}`}>Loading analytics…</p>
        </div>
      )}

      {!loading && filteredExpenses.length === 0 && (
        <EmptyState
          icon="📊"
          message="No expenses found for this date range"
          tokens={tokens}
        />
      )}

      {!loading && filteredExpenses.length > 0 && (
        <>
          {/* Summary stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              label="Total spent"
              value={formatRupees(total)}
              icon={Wallet}
              tokens={tokens}
              accent
            />
            <StatCard
              label="Transactions"
              value={filteredExpenses.length}
              icon={Receipt}
              tokens={tokens}
            />
            <StatCard
              label="Categories"
              value={Object.keys(catSummary).length}
              icon={Tag}
              tokens={tokens}
            />
            <StatCard
              label="Avg / Entry"
              value={formatRupees(filteredExpenses.length > 0 ? total / filteredExpenses.length : 0)}
              icon={Calculator}
              tokens={tokens}
            />
          </div>

          {/* Grid Row 1: Category Summary + Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            {/* Category summary cards */}
            <div className={`${tokens.card} ${tokens.border} border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between`}>
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-wider mb-3.5 ${tokens.muted}`}>
                  Spending by Category
                </p>
                <div className="space-y-3">
                  {Object.entries(catSummary)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, amount]) => {
                      const pct = total > 0 ? (amount / total) * 100 : 0;
                      const color = CATEGORY_COLORS[cat] || "#6b7280";
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between items-center text-xs tabular-nums">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                              <span className="font-bold truncate">{cat}</span>
                            </div>
                            <span className="font-bold shrink-0">
                              {formatRupees(amount)} <span className={`font-medium ${tokens.muted}`}>({pct.toFixed(1)}%)</span>
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Pie chart */}
            <div className={`${tokens.card} ${tokens.border} border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between`}>
              <p className={`text-[11px] font-bold uppercase tracking-wider mb-3.5 ${tokens.muted}`}>
                Spending distribution
              </p>
              <div className="flex-1 flex items-center justify-center min-h-[220px]">
                <CategoryPieChart data={pieData} />
              </div>
            </div>
          </div>

          {/* Grid Row 2: Monthly trend + Weekly trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Monthly trend */}
            <div className={`${tokens.card} ${tokens.border} border rounded-2xl p-4 sm:p-5 shadow-xs`}>
              <p className={`text-[11px] font-bold uppercase tracking-wider mb-3.5 ${tokens.muted}`}>
                Monthly trend (last 6 months)
              </p>
              <MonthlyTrendChart data={monthlyData} />
            </div>

            {/* Weekly trend */}
            <div className={`${tokens.card} ${tokens.border} border rounded-2xl p-4 sm:p-5 shadow-xs`}>
              <p className={`text-[11px] font-bold uppercase tracking-wider mb-3.5 ${tokens.muted}`}>
                Daily spending (last 7 days)
              </p>
              <WeeklyTrendChart data={weeklyData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
