// src/pages/Tracker.jsx — Full UI/UX polish pass
// Animations: page mount, stat cards stagger, modal slide-up, budget bar grow
// Typography: tighter hierarchy, consistent scale
// Spacing: more breathable, consistent padding
// Logic: 100% unchanged

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useExpenses } from "../hooks/useExpenses";
import { useBudget } from "../hooks/useBudget";
import WeeklyView from "../components/expense/WeeklyView";
import HistoryView from "../components/expense/HistoryView";
import MonthlyView from "../components/expense/MonthlyView";
import DashboardView from "../components/expense/DashboardView";
import ThemeSelector from "../components/ui/ThemeSelector";
import { EXPENSE_CATEGORIES } from "../config/themeConfig";
import { filterCurrentMonth, filterCurrentWeek, formatRupees } from "../utils/expenseHelpers";
import { totalAmount } from "../utils/analytics";

export default function Tracker() {
  const { theme, setTheme, tokens: t } = useTheme();
  const navigateTo = useNavigate();

  const {
    expenses, weeklyData, monthlyData,
    addExpense, deleteExpense, updateExpense,
    fetchHistory, fetchWeekly, fetchMonthly,
  } = useExpenses();

  const { budget, setBudget, computeRemaining, computeProgress } = useBudget();

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
  const barColor        = budgetProgress < 70 ? "bg-emerald-500" : budgetProgress < 90 ? "bg-yellow-400" : "bg-red-500";

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

  const fieldClass = `border rounded-xl px-3 py-3 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${t.input}`;

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} px-4 pt-5 pb-28`}>

      {/* ── Loading overlay ────────────────────────────────────────────────── */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in-bg">
          <div className={`${t.card} rounded-2xl px-8 py-6 flex flex-col items-center gap-3 shadow-2xl animate-slide-up-modal`}>
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className={`text-sm font-medium ${t.muted}`}>Loading…</p>
          </div>
        </div>
      )}

      {/* ── Success toast ──────────────────────────────────────────────────── */}
      {successMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-fade-slide-up">
          <div className="bg-emerald-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg">
            {successMsg}
          </div>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 animate-fade-slide-up">
        <div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${t.text}`}>SpendWise</h1>
          <p className={`text-xs mt-0.5 ${t.muted}`}>Track every rupee</p>
        </div>
        <ThemeSelector theme={theme} setTheme={setTheme} />
      </div>

      {/* ════════════════ FORM VIEW ════════════════ */}
      {view === "form" && (
        <div className="space-y-4">

          {/* Quick stats */}
          {quickStats && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Today",      value: formatRupees(quickStats.today), delay: "animate-fade-slide-up-1" },
                { label: "This Week",  value: formatRupees(quickStats.week),  delay: "animate-fade-slide-up-2", highlight: true },
                { label: "This Month", value: formatRupees(quickStats.month), delay: "animate-fade-slide-up-3" },
              ].map(({ label, value, delay, highlight }) => (
                <div key={label} className={`${t.card} ${t.border} border rounded-2xl p-3 text-center ${delay} ${highlight ? "ring-2 ring-blue-500/30" : ""}`}>
                  <p className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${t.muted}`}>{label}</p>
                  <p className={`text-sm font-bold leading-tight ${highlight ? "text-blue-500" : t.text}`}>{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Budget bar */}
          <div className={`${t.card} ${t.border} border rounded-2xl p-4 space-y-3 animate-fade-slide-up-2`}>
            <div className="flex items-center justify-between">
              <p className={`text-xs font-semibold uppercase tracking-widest ${t.muted}`}>Monthly Budget</p>
              <button onClick={() => setShowBudgetEdit((v) => !v)} className={`text-xs font-medium ${t.btn.ghost}`}>
                {budget ? "Edit" : "+ Set Budget"}
              </button>
            </div>

            {showBudgetEdit && (
              <div className="flex gap-2 animate-fade-slide-up">
                <input
                  type="number"
                  placeholder="Enter monthly budget…"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className={`${fieldClass} py-2`}
                />
                <button onClick={handleSetBudget} className={`${t.btn.primary} px-4 py-2 rounded-xl text-sm font-semibold shrink-0`}>
                  Save
                </button>
              </div>
            )}

            {budget > 0 ? (
              <>
                <div className="h-2.5 rounded-full overflow-hidden bg-current/10">
                  <div
                    className={`h-full rounded-full animate-grow-width ${barColor}`}
                    style={{ width: `${budgetProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className={isOverBudget ? "text-red-500 font-semibold" : t.muted}>
                    {isOverBudget ? `Over by ${formatRupees(Math.abs(budgetRemaining))}` : `${formatRupees(budgetRemaining)} remaining`}
                  </span>
                  <span className={t.muted}>{formatRupees(monthSpent)} / {formatRupees(budget)}</span>
                </div>
              </>
            ) : (
              !showBudgetEdit && (
                <p className={`text-xs ${t.muted}`}>No budget set — tap "+ Set Budget" to track your monthly limit.</p>
              )
            )}
          </div>

          {/* Add expense form */}
          <div className={`${t.card} ${t.border} border rounded-2xl p-5 shadow-sm space-y-4 animate-fade-slide-up-3`}>
            <h2 className={`text-base font-bold ${t.text}`}>Add Expense</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Date</label>
                <input type="date" value={expense.date}
                  onChange={(e) => setExpense({ ...expense, date: e.target.value })}
                  className={fieldClass} />
              </div>
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Amount (₹)</label>
                <input type="number" placeholder="0.00" value={expense.amount}
                  onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
                  className={fieldClass} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Category</label>
              <select value={expense.type}
                onChange={(e) => setExpense({ ...expense, type: e.target.value })}
                className={fieldClass}>
                {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Description</label>
              <input type="text" placeholder="What did you spend on?"
                value={expense.description}
                onChange={(e) => setExpense({ ...expense, description: e.target.value })}
                className={fieldClass} />
            </div>

            <button onClick={handleAdd} disabled={loading}
              className={`${t.btn.primary} w-full py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-sm active:scale-95 transition-all duration-150 ${loading ? "opacity-60" : ""}`}>
              + Add Expense
            </button>
          </div>

          {/* View reports */}
          <button onClick={() => setView("menu")}
            className={`${t.btn.secondary} w-full py-3.5 rounded-xl font-semibold text-sm active:scale-95 transition-all duration-150 animate-fade-slide-up-4`}>
            View Reports & History →
          </button>
        </div>
      )}

      {/* ════════════════ MENU VIEW ════════════════ */}
      {view === "menu" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 animate-fade-slide-up">
            <button onClick={() => setView("form")} className={`text-sm font-medium ${t.btn.ghost}`}>← Back</button>
            <h2 className={`text-lg font-bold ${t.text}`}>Reports</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "📊", title: "Dashboard",  subtitle: "Overview & stats",   onClick: () => navigate(fetchHistory, "dashboard"), accent: true,  delay: "animate-fade-slide-up-1" },
              { icon: "📆", title: "This Week",  subtitle: "Last 7 days",        onClick: () => navigate(fetchWeekly,  "weekly"),    accent: false, delay: "animate-fade-slide-up-2" },
              { icon: "📅", title: "This Month", subtitle: "Current month",      onClick: () => navigate(fetchMonthly, "monthly"),   accent: false, delay: "animate-fade-slide-up-3" },
              { icon: "🗂️", title: "History",    subtitle: "All transactions",   onClick: () => navigate(fetchHistory, "history"),   accent: false, delay: "animate-fade-slide-up-4" },
            ].map(({ icon, title, subtitle, onClick, accent, delay }) => (
              <button key={title} onClick={onClick}
                className={`${t.card} ${t.border} border rounded-2xl p-4 text-left shadow-sm active:scale-95 transition-all duration-150 ${delay} ${accent ? "ring-2 ring-blue-500/40" : ""}`}>
                <span className="text-2xl mb-2.5 block">{icon}</span>
                <p className={`text-sm font-bold ${t.text}`}>{title}</p>
                <p className={`text-xs mt-0.5 ${t.muted}`}>{subtitle}</p>
              </button>
            ))}

            {/* Analytics — full width */}
            <button onClick={() => navigateTo("/analytics")}
              className={`${t.card} ${t.border} border rounded-2xl p-4 text-left shadow-sm active:scale-95 transition-all duration-150 col-span-2 animate-fade-slide-up-5`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📈</span>
                <div>
                  <p className={`text-sm font-bold ${t.text}`}>Analytics</p>
                  <p className={`text-xs ${t.muted}`}>Charts, trends & category breakdown</p>
                </div>
              </div>
            </button>

            {/* Recurring */}
            <button onClick={() => navigateTo("/recurring")}
              className={`${t.card} ${t.border} border rounded-2xl p-4 text-left shadow-sm active:scale-95 transition-all duration-150 animate-fade-slide-up-5`}>
              <span className="text-2xl mb-2.5 block">🔁</span>
              <p className={`text-sm font-bold ${t.text}`}>Recurring</p>
              <p className={`text-xs mt-0.5 ${t.muted}`}>Auto expenses</p>
            </button>

            {/* Goals */}
            <button onClick={() => navigateTo("/goals")}
              className={`${t.card} ${t.border} border rounded-2xl p-4 text-left shadow-sm active:scale-95 transition-all duration-150 animate-fade-slide-up-5`}>
              <span className="text-2xl mb-2.5 block">🎯</span>
              <p className={`text-sm font-bold ${t.text}`}>Goals</p>
              <p className={`text-xs mt-0.5 ${t.muted}`}>Savings targets</p>
            </button>

            {/* AI Insights — full width */}
            <button onClick={() => navigateTo("/ai")}
              className={`${t.card} ${t.border} border rounded-2xl p-4 text-left shadow-sm active:scale-95 transition-all duration-150 col-span-2 animate-fade-slide-up-5`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className={`text-sm font-bold ${t.text}`}>AI Insights</p>
                  <p className={`text-xs ${t.muted}`}>Smart spending analysis & budget suggestions</p>
                </div>
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

      {/* ════════════════ EDIT MODAL ════════════════ */}
      {editingExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 animate-fade-in-bg">
          <div className={`${t.card} ${t.border} border rounded-2xl w-full max-w-md shadow-2xl animate-slide-up-modal`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${t.border}`}>
              <h2 className={`text-base font-bold ${t.text}`}>Edit Expense</h2>
              <button onClick={() => setEditingExpense(null)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-lg font-light transition-colors ${t.btn.secondary}`}>×</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Date</label>
                  <input type="date" value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className={fieldClass} />
                </div>
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Amount (₹)</label>
                  <input type="number" value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className={fieldClass} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Category</label>
                <select value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className={fieldClass}>
                  {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Description</label>
                <input type="text" value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className={fieldClass} />
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setEditingExpense(null)}
                className={`${t.btn.secondary} flex-1 py-3 rounded-xl text-sm font-semibold active:scale-95 transition-all`}>Cancel</button>
              <button onClick={handleUpdate}
                className={`${t.btn.primary} flex-1 py-3 rounded-xl text-sm font-bold active:scale-95 transition-all`}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
