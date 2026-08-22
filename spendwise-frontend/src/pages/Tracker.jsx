// src/pages/Tracker.jsx — Full UI/UX polish pass
// Animations: page mount, stat cards stagger, modal slide-up, budget bar grow
// Typography: tighter hierarchy, consistent scale
// Spacing: more breathable, consistent padding
// Logic: 100% unchanged

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useExpenses } from "../hooks/useExpenses";
import { useBudget } from "../hooks/useBudget";
import { useAI } from "../hooks/useAI";
import WeeklyView from "../components/expense/WeeklyView";
import HistoryView from "../components/expense/HistoryView";
import MonthlyView from "../components/expense/MonthlyView";
import DashboardView from "../components/expense/DashboardView";
import ThemeSelector from "../components/ui/ThemeSelector";
import { EXPENSE_CATEGORIES } from "../config/themeConfig";
import { filterCurrentMonth, filterCurrentWeek, formatRupees } from "../utils/expenseHelpers";
import { totalAmount } from "../utils/analytics";

const CATEGORY_ICONS = {
  FOOD: "🍔",
  TRAVEL: "✈️",
  MOBILE: "📱",
  LENT: "🤝",
  ENTERTAINMENT: "🎬",
  OTHER: "📦",
};

export default function Tracker() {
  const { theme, setTheme, tokens: t } = useTheme();
  const { user, logout } = useAuth();
  const navigateTo = useNavigate();

  const {
    expenses, weeklyData, monthlyData,
    addExpense, deleteExpense, updateExpense,
    fetchHistory, fetchWeekly, fetchMonthly,
  } = useExpenses();

  const { budget, setBudget, computeRemaining, computeProgress } = useBudget();
  const { insights } = useAI();

  const [view, setView]                   = useState("form");
  const [loading, setLoading]             = useState(false);
  const [successMsg, setSuccessMsg]       = useState("");
  const [expense, setExpense]             = useState({ date: "", amount: "", type: "FOOD", description: "" });
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm]           = useState({ date: "", amount: "", type: "FOOD", description: "" });
  const [displayMode, setDisplayMode]     = useState(() => localStorage.getItem("displayMode") || "table");
  const [budgetInput, setBudgetInput]     = useState("");
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);

  useEffect(() => { fetchHistory(); }, []);

  const changeDisplayMode = (mode) => {
    setDisplayMode(mode);
    localStorage.setItem("displayMode", mode);
  };

  const quickStats = useMemo(() => {
    if (!expenses.length) return null;
    const todayStr = new Date().toISOString().split("T")[0];
    return {
      today: totalAmount(expenses.filter((e) => e.date === todayStr)),
      week:  totalAmount(filterCurrentWeek(expenses)),
      month: totalAmount(filterCurrentMonth(expenses)),
    };
  }, [expenses]);

  const monthSpent      = quickStats?.month ?? 0;
  const budgetRemaining = computeRemaining(monthSpent);
  const budgetProgress  = computeProgress(monthSpent);
  const isOverBudget    = budgetRemaining !== null && budgetRemaining < 0;
  const barColor        = budgetProgress < 70 ? "bg-[#35D07F]" : budgetProgress < 90 ? "bg-[#F5B942]" : "bg-[#FF5C5C]";

  // ── Derived Dashboard Metrics ───────────────────────────────────────────────
  const topCategory = useMemo(() => {
    const monthExpenses = filterCurrentMonth(expenses);
    if (!monthExpenses.length) return null;
    const totals = {};
    monthExpenses.forEach((e) => {
      totals[e.type] = (totals[e.type] || 0) + Number(e.amount);
    });
    let maxCat = null;
    let maxAmt = 0;
    Object.entries(totals).forEach(([cat, amt]) => {
      if (amt > maxAmt) {
        maxAmt = amt;
        maxCat = cat;
      }
    });
    return maxCat ? { category: maxCat, amount: maxAmt } : null;
  }, [expenses]);

  const recent7DaysTrend = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });
      const dayTotal = totalAmount(expenses.filter((e) => e.date === dateStr));
      days.push({ day: dayName, date: dateStr, total: dayTotal });
    }
    return days;
  }, [expenses]);

  const has7DaySpending = useMemo(() => {
    return recent7DaysTrend.some((d) => d.total > 0);
  }, [recent7DaysTrend]);

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id)
      .slice(0, 4);
  }, [expenses]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const handleAdd = async () => {
    if (!expense.date || !expense.amount || !expense.description.trim()) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await addExpense(expense);
      setExpense({ date: "", amount: "", type: "FOOD", description: "" });
      showSuccess("Expense added ✓");
    } catch { alert("Failed to add expense"); }
    finally  { setLoading(false); }
  };

  const navigate = async (fetchFn, targetView) => {
    setLoading(true);
    try { await fetchFn(); setView(targetView); }
    finally { setLoading(false); }
  };

  const openEdit = (exp) => {
    setEditingExpense(exp);
    setEditForm({ date: exp.date, amount: exp.amount, type: exp.type, description: exp.description });
  };

  const handleDelete = async (id) => {
    try { await deleteExpense(id); }
    catch { alert("Failed to delete expense"); }
  };

  const handleUpdate = async () => {
    try { await updateExpense(editingExpense.id, editForm); setEditingExpense(null); showSuccess("Expense updated ✓"); }
    catch { alert("Failed to update expense"); }
  };

  const handleSetBudget = () => {
    if (!budgetInput || isNaN(budgetInput) || Number(budgetInput) <= 0) return;
    setBudget(budgetInput);
    setBudgetInput("");
    setShowBudgetEdit(false);
    showSuccess("Budget saved ✓");
  };

  const fieldClass = `border rounded-xl px-3.5 py-2.5 w-full text-sm font-medium focus:outline-none transition-all duration-200 ${t.input}`;
  const isCompactView = view === "form" || view === "menu";
  const containerClass = isCompactView
    ? "w-full max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-28"
    : "w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28";

  return (
    <div className="w-full">

      {/* ── Loading overlay ────────────────────────────────────────────────── */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in-bg">
          <div className={`${t.card} border ${t.border} rounded-2xl px-8 py-6 flex flex-col items-center gap-3 shadow-2xl animate-slide-up-modal`}>
            <div className="w-8 h-8 border-3 border-[#22D3EE] border-t-transparent rounded-full animate-spin" />
            <p className={`text-xs font-bold uppercase tracking-wider ${t.muted}`}>Loading…</p>
          </div>
        </div>
      )}

      {/* ── Success toast ──────────────────────────────────────────────────── */}
      {successMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-slide-up">
          <div className="bg-[#35D07F] text-[#080D12] text-xs font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
            <span>✓</span>
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      <div className={containerClass}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5 dark:border-white/5 animate-fade-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#14B8A6] to-[#22D3EE] flex items-center justify-center text-[#080D12] text-lg shadow-md shadow-[#22D3EE]/20 font-bold">
              💳
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${t.text}`}>SpendWise</h1>
              <p className={`text-xs font-medium ${t.muted}`}>Smart Expense Tracker & Financial Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSelector theme={theme} setTheme={setTheme} />
            {user && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-black/10 dark:border-white/10">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 ${t.muted} hidden sm:inline-flex items-center gap-1`}>
                  <span>👤</span>
                  <span>{user.username}</span>
                </span>
                <button
                  onClick={logout}
                  title="Sign out"
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg ${t.btn.ghost} hover:text-[#FF5C5C] hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

      {/* ════════════════ FORM VIEW (MAIN DASHBOARD) ════════════════ */}
      {view === "form" && (
        <div className="space-y-4 sm:space-y-5 animate-fade-slide-up">

          {/* 1. Quick stats */}
          {quickStats && (
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              {[
                { label: "Today",      value: formatRupees(quickStats.today), delay: "animate-fade-slide-up-1" },
                { label: "This Week",  value: formatRupees(quickStats.week),  delay: "animate-fade-slide-up-2", highlight: true },
                { label: "This Month", value: formatRupees(quickStats.month), delay: "animate-fade-slide-up-3" },
              ].map(({ label, value, delay, highlight }) => (
                <div key={label} className={`${t.card} ${t.border} border rounded-2xl p-3.5 sm:p-4 text-center shadow-xs transition-all duration-200 hover:shadow-md ${delay} ${highlight ? "ring-2 ring-[#84A98C]/40 bg-[#84A98C]/10 dark:ring-[#22D3EE]/50 dark:bg-[#22D3EE]/10" : ""}`}>
                  <p className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1 ${t.muted}`}>{label}</p>
                  <p className={`text-sm sm:text-base md:text-lg font-black leading-tight tabular-nums ${highlight ? "text-[#354F52] dark:text-[#22D3EE]" : t.text}`}>{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* 2. Monthly Budget bar */}
          <div className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs animate-fade-slide-up-2`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-base">🎯</span>
                <div>
                  <p className={`text-xs font-extrabold uppercase tracking-wider ${t.text}`}>Monthly Budget</p>
                  <p className={`text-[11px] font-medium ${t.muted}`}>Current monthly target</p>
                </div>
              </div>
              <button onClick={() => setShowBudgetEdit((v) => !v)} className={`text-xs font-bold px-2.5 py-1 rounded-lg ${t.btn.ghost} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}>
                {budget ? "Edit Limit" : "+ Set Budget"}
              </button>
            </div>

            {showBudgetEdit && (
              <div className="flex gap-2 animate-fade-slide-up pt-1">
                <input
                  type="number"
                  placeholder="Enter monthly budget…"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className={`${fieldClass} py-2`}
                />
                <button onClick={handleSetBudget} className={`${t.btn.primary} px-4 py-2 rounded-xl text-xs font-bold shrink-0 active:scale-95 transition-all`}>
                  Save
                </button>
              </div>
            )}

            {budget > 0 ? (
              <>
                <div className="h-2.5 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 p-0.5">
                  <div
                    className={`h-full rounded-full animate-grow-width transition-all duration-500 ${barColor}`}
                    style={{ width: `${budgetProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs tabular-nums">
                  <span className={isOverBudget ? "text-[#FF5C5C] font-bold" : `font-semibold ${t.muted}`}>
                    {isOverBudget ? `Over by ${formatRupees(Math.abs(budgetRemaining))}` : `${formatRupees(budgetRemaining)} remaining`}
                  </span>
                  <span className={`font-bold ${t.text}`}>{formatRupees(monthSpent)} / {formatRupees(budget)}</span>
                </div>
              </>
            ) : (
              !showBudgetEdit && (
                <p className={`text-xs font-medium ${t.muted}`}>No monthly budget set — tap "+ Set Budget" to monitor your spending limit.</p>
              )
            )}
          </div>

          {/* 3. Add expense form */}
          <div className={`${t.card} ${t.border} border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 animate-fade-slide-up-3`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-sm sm:text-base font-extrabold uppercase tracking-wider ${t.text}`}>Add Expense</h2>
                <p className={`text-xs font-medium ${t.muted}`}>Quick transaction entry</p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#84A98C]/20 text-[#354F52] dark:bg-[#22D3EE]/15 dark:text-[#22D3EE] dark:border dark:border-[#22D3EE]/30">Quick Log</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Date</label>
                <input type="date" value={expense.date}
                  onChange={(e) => setExpense({ ...expense, date: e.target.value })}
                  className={fieldClass} />
              </div>
              <div className="space-y-1">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Amount (₹)</label>
                <input type="number" placeholder="0.00" value={expense.amount}
                  onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
                  className={fieldClass} />
              </div>
            </div>

            <div className="space-y-1">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Category</label>
              <select value={expense.type}
                onChange={(e) => setExpense({ ...expense, type: e.target.value })}
                className={fieldClass}>
                {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Description</label>
              <input type="text" placeholder="What did you spend on?"
                value={expense.description}
                onChange={(e) => setExpense({ ...expense, description: e.target.value })}
                className={fieldClass} />
            </div>

            <button onClick={handleAdd} disabled={loading}
              className={`${t.btn.primary} w-full py-3.5 rounded-xl font-extrabold text-sm tracking-wide shadow-sm active:scale-98 transition-all duration-150 ${loading ? "opacity-60" : ""}`}>
              + Add Expense
            </button>
          </div>

          {/* 4. Spending Snapshot & Small Spending Trend (Responsive 2-col on tablet/desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 animate-fade-slide-up-3">

            {/* 4a. Spending Snapshot */}
            <div className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 shadow-xs space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚡</span>
                  <div>
                    <h3 className={`text-xs font-extrabold uppercase tracking-wider ${t.text}`}>Spending Snapshot</h3>
                    <p className={`text-[10px] font-medium ${t.muted}`}>Current month metrics</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 border border-inherit opacity-80">
                  {new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 space-y-0.5">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${t.muted}`}>Spent This Month</p>
                  <p className={`text-sm font-black tabular-nums ${t.text}`}>{formatRupees(monthSpent)}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 space-y-0.5">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${t.muted}`}>Top Category</p>
                  <p className={`text-sm font-black truncate ${t.text}`}>
                    {topCategory ? `${topCategory.category}` : "—"}
                  </p>
                  {topCategory && (
                    <p className={`text-[10px] font-medium tabular-nums ${t.muted}`}>{formatRupees(topCategory.amount)}</p>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 space-y-0.5">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${t.muted}`}>Remaining Budget</p>
                  <p className={`text-sm font-black tabular-nums ${isOverBudget ? "text-[#FF5C5C]" : t.text}`}>
                    {budget ? (isOverBudget ? `-₹${Math.abs(budgetRemaining).toFixed(0)}` : formatRupees(budgetRemaining)) : "Not Set"}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 space-y-0.5">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${t.muted}`}>Budget Used</p>
                  <p className={`text-sm font-black tabular-nums ${isOverBudget ? "text-[#FF5C5C]" : t.text}`}>
                    {budget ? `${budgetProgress}%` : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* 4b. Small Spending Trend (7-Day) */}
            <div className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 shadow-xs space-y-2 flex flex-col justify-between`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">📊</span>
                  <div>
                    <h3 className={`text-xs font-extrabold uppercase tracking-wider ${t.text}`}>7-Day Spending Trend</h3>
                    <p className={`text-[10px] font-medium ${t.muted}`}>Daily expenditure</p>
                  </div>
                </div>
              </div>

              {has7DaySpending ? (
                <div className="h-28 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={recent7DaysTrend} margin={{ top: 6, right: 4, left: -22, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dashTrendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme === "dark" ? "#22D3EE" : "#84A98C"} stopOpacity={0.35} />
                          <stop offset="95%" stopColor={theme === "dark" ? "#22D3EE" : "#84A98C"} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: theme === "dark" ? "#9AAEB7" : "#52796F", fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 9, fill: theme === "dark" ? "#9AAEB7" : "#52796F", fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} width={32} />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className={`${t.card} ${t.border} border px-2.5 py-1.5 rounded-lg shadow-lg text-[11px]`}>
                                <p className={`font-semibold ${t.muted}`}>{label}</p>
                                <p className={`font-black tabular-nums ${theme === "dark" ? "text-[#22D3EE]" : "text-[#354F52]"}`}>{formatRupees(payload[0].value)}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke={theme === "dark" ? "#22D3EE" : "#52796F"}
                        strokeWidth={2}
                        fill="url(#dashTrendGrad)"
                        dot={{ fill: theme === "dark" ? "#22D3EE" : "#52796F", r: 2.5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-28 text-center">
                  <p className={`text-xs font-semibold ${t.muted}`}>No spending recorded in the last 7 days</p>
                </div>
              )}
            </div>

          </div>

          {/* 5. Recent Expenses */}
          <div className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 animate-fade-slide-up-4`}>
            <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-base">🕒</span>
                <div>
                  <h3 className={`text-xs font-extrabold uppercase tracking-wider ${t.text}`}>Recent Expenses</h3>
                  <p className={`text-[10px] font-medium ${t.muted}`}>Latest logged transactions</p>
                </div>
              </div>
              {expenses.length > 0 && (
                <button onClick={() => navigate(fetchHistory, "history")} className={`text-xs font-bold ${t.btn.ghost} hover:underline`}>
                  View all ({expenses.length}) →
                </button>
              )}
            </div>

            {recentExpenses.length > 0 ? (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {recentExpenses.map((exp) => (
                  <div key={exp.id} className="py-2.5 flex items-center justify-between gap-3 first:pt-1 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${t.badge[exp.type] || "bg-black/5"}`}>
                        {CATEGORY_ICONS[exp.type] || "💳"}
                      </span>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${t.text}`}>{exp.description || exp.type}</p>
                        <p className={`text-[10px] font-medium ${t.muted}`}>
                          {new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} • {exp.type}
                        </p>
                      </div>
                    </div>
                    <p className={`text-xs font-black tabular-nums shrink-0 ${t.text}`}>
                      {formatRupees(exp.amount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 space-y-1">
                <p className={`text-xs font-bold ${t.text}`}>No expenses yet</p>
                <p className={`text-[11px] font-medium ${t.muted}`}>Add your first expense above to start tracking.</p>
              </div>
            )}
          </div>

          {/* 6. Optional AI Insight Preview */}
          {insights?.tips?.[0] && (
            <div className={`${t.card} ${t.border} border rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3 animate-fade-slide-up-4`}>
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-[#8B7CF6]/15 text-[#8B7CF6] flex items-center justify-center text-sm shrink-0">💡</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B7CF6]">AI Insight Preview</p>
                  <p className={`text-xs font-medium truncate ${t.text}`}>{insights.tips[0]}</p>
                </div>
              </div>
              <button onClick={() => navigateTo("/ai")} className={`text-xs font-bold shrink-0 ${t.btn.ghost}`}>
                View All →
              </button>
            </div>
          )}

          {/* 7. View reports launcher */}
          <button onClick={() => setView("menu")}
            className={`${t.btn.secondary} w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all duration-150 animate-fade-slide-up-5 shadow-2xs`}>
            <span>View Reports, Breakdowns & History</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* ════════════════ MENU VIEW (REPORTS & FEATURES) ════════════════ */}
      {view === "menu" && (
        <div className="space-y-4 sm:space-y-5 animate-fade-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => setView("form")} className={`px-2.5 py-1 rounded-lg text-xs font-bold ${t.btn.ghost} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}>
                ← Back to Tracker
              </button>
              <h2 className={`text-lg sm:text-xl font-black tracking-tight ${t.text}`}>Reports & Features Hub</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {[
              { icon: "📊", title: "Dashboard",  subtitle: "Overview & metrics", onClick: () => navigate(fetchHistory, "dashboard"), accent: true,  delay: "animate-fade-slide-up-1" },
              { icon: "📆", title: "This Week",  subtitle: "Last 7 days trend",  onClick: () => navigate(fetchWeekly,  "weekly"),    accent: false, delay: "animate-fade-slide-up-2" },
              { icon: "📅", title: "This Month", subtitle: "Current month view", onClick: () => navigate(fetchMonthly, "monthly"),   accent: false, delay: "animate-fade-slide-up-3" },
              { icon: "🗂️", title: "History",    subtitle: "All transactions",   onClick: () => navigate(fetchHistory, "history"),   accent: false, delay: "animate-fade-slide-up-4" },
            ].map(({ icon, title, subtitle, onClick, accent, delay }) => (
              <button key={title} onClick={onClick}
                className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 text-left shadow-2xs active:scale-98 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 ${delay} ${accent ? "ring-2 ring-[#84A98C]/40 bg-[#84A98C]/10 dark:ring-[#22D3EE]/40 dark:bg-[#22D3EE]/10" : ""}`}>
                <span className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-xl mb-3 shadow-inner">{icon}</span>
                <p className={`text-sm sm:text-base font-extrabold ${t.text}`}>{title}</p>
                <p className={`text-xs mt-0.5 font-medium ${t.muted}`}>{subtitle}</p>
              </button>
            ))}

            {/* Analytics — 2 cols */}
            <button onClick={() => navigateTo("/analytics")}
              className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 text-left shadow-2xs active:scale-98 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 col-span-2 animate-fade-slide-up-5`}>
              <div className="flex items-center gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] dark:bg-[#22D3EE]/15 dark:text-[#22D3EE] flex items-center justify-center text-xl shrink-0">📈</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm sm:text-base font-extrabold ${t.text}`}>Analytics & Charts</p>
                  <p className={`text-xs font-medium ${t.muted}`}>Visual distributions, trends & category charts</p>
                </div>
                <span className={`text-xs font-bold ${t.muted}`}>→</span>
              </div>
            </button>

            {/* Recurring */}
            <button onClick={() => navigateTo("/recurring")}
              className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 text-left shadow-2xs active:scale-98 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 animate-fade-slide-up-5`}>
              <span className="w-10 h-10 rounded-xl bg-[#52796F]/10 text-[#52796F] dark:bg-[#14B8A6]/15 dark:text-[#14B8A6] flex items-center justify-center text-xl mb-3">🔁</span>
              <p className={`text-sm sm:text-base font-extrabold ${t.text}`}>Recurring</p>
              <p className={`text-xs mt-0.5 font-medium ${t.muted}`}>Automated bills</p>
            </button>

            {/* Goals */}
            <button onClick={() => navigateTo("/goals")}
              className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 text-left shadow-2xs active:scale-98 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 animate-fade-slide-up-5`}>
              <span className="w-10 h-10 rounded-xl bg-[#4F9D69]/10 text-[#4F9D69] dark:bg-[#35D07F]/15 dark:text-[#35D07F] flex items-center justify-center text-xl mb-3">🎯</span>
              <p className={`text-sm sm:text-base font-extrabold ${t.text}`}>Goals</p>
              <p className={`text-xs mt-0.5 font-medium ${t.muted}`}>Savings targets</p>
            </button>

            {/* AI Insights — 2 cols */}
            <button onClick={() => navigateTo("/ai")}
              className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 text-left shadow-2xs active:scale-98 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 col-span-2 animate-fade-slide-up-5`}>
              <div className="flex items-center gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-[#8B7CF6]/15 text-[#8B7CF6] flex items-center justify-center text-xl shrink-0">🤖</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm sm:text-base font-extrabold ${t.text}`}>AI Spending Insights</p>
                  <p className={`text-xs font-medium ${t.muted}`}>Smart expenditure analysis & smart budget recommendations</p>
                </div>
                <span className={`text-xs font-bold ${t.muted}`}>→</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════ VIEWS ════════════════ */}
      {view === "weekly" && weeklyData && (
        <WeeklyView data={weeklyData} displayMode={displayMode} setDisplayMode={changeDisplayMode} onBack={() => setView("menu")} tokens={t} />
      )}
      {view === "monthly" && monthlyData && (
        <MonthlyView data={monthlyData} displayMode={displayMode} setDisplayMode={changeDisplayMode} onBack={() => setView("menu")} tokens={t} />
      )}
      {view === "history" && (
        <HistoryView data={expenses} displayMode={displayMode} setDisplayMode={changeDisplayMode} onBack={() => setView("menu")} onDelete={handleDelete} onEdit={openEdit} tokens={t} />
      )}
      {view === "dashboard" && (
        <DashboardView data={expenses} onBack={() => setView("menu")} tokens={t} />
      )}

      </div>

      {/* ════════════════ EDIT MODAL ════════════════ */}
      {editingExpense && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-4 animate-fade-in-bg">
          <div className={`${t.card} ${t.border} border rounded-3xl w-full max-w-md shadow-2xl animate-slide-up-modal overflow-hidden`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${t.border}`}>
              <h2 className={`text-base font-extrabold ${t.text}`}>Edit Expense</h2>
              <button onClick={() => setEditingExpense(null)}
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold opacity-60 hover:opacity-100 transition-colors ${t.btn.secondary}`}>✕</button>
            </div>
            <div className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Date</label>
                  <input type="date" value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className={fieldClass} />
                </div>
                <div className="space-y-1">
                  <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Amount (₹)</label>
                  <input type="number" value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className={fieldClass} />
                </div>
              </div>
              <div className="space-y-1">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Category</label>
                <select value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className={fieldClass}>
                  {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Description</label>
                <input type="text" value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className={fieldClass} />
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5 pt-1">
              <button onClick={() => setEditingExpense(null)}
                className={`${t.btn.secondary} flex-1 py-3 rounded-xl text-xs font-bold active:scale-98 transition-all`}>Cancel</button>
              <button onClick={handleUpdate}
                className={`${t.btn.primary} flex-1 py-3 rounded-xl text-xs font-bold active:scale-98 transition-all`}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
