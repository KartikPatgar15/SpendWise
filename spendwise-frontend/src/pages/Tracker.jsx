// src/pages/Tracker.jsx
// EDIT: Replaced inline state with useTheme() + useExpenses() hooks.
// All existing view-switching, form, edit-modal behavior is PRESERVED.
// DashboardView now receives tokens prop for theme support.

import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useExpenses } from "../hooks/useExpenses";
import WeeklyView from "../components/expense/WeeklyView";
import HistoryView from "../components/expense/HistoryView";
import MonthlyView from "../components/expense/MonthlyView";
import DashboardView from "../components/expense/DashboardView";
import ThemeSelector from "../components/ui/ThemeSelector";

const categories = ["FOOD", "TRAVEL", "MOBILE", "LENT", "ENTERTAINMENT", "OTHER"];

function Tracker() {
  const { theme, setTheme, tokens } = useTheme();

  const {
    expenses,
    weeklyData,
    monthlyData,
    addExpense,
    deleteExpense,
    updateExpense,
    fetchHistory,
    fetchWeekly,
    fetchMonthly,
    setExpenses,
  } = useExpenses();

  const [view, setView] = useState("form");
  const [expense, setExpense] = useState({ date: "", amount: "", type: "FOOD", description: "" });
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({ date: "", amount: "", type: "FOOD", description: "" });
  const [displayMode, setDisplayMode] = useState(
    () => localStorage.getItem("displayMode") || "table"
  );

  const changeDisplayMode = (mode) => {
    setDisplayMode(mode);
    localStorage.setItem("displayMode", mode);
  };

  const handleAdd = async () => {
    await addExpense(expense);
    alert("Expense added ✅");
    setExpense({ date: "", amount: "", type: "FOOD", description: "" });
  };

  const handleFetchWeekly = async () => {
    await fetchWeekly();
    setView("weekly");
  };

  const handleFetchMonthly = async () => {
    await fetchMonthly();
    setView("monthly");
  };

  const handleFetchHistory = async () => {
    await fetchHistory();
    setView("history");
  };

  const handleFetchDashboard = async () => {
    await fetchHistory();
    setView("dashboard");
  };

  const openEdit = (exp) => {
    setEditingExpense(exp);
    setEditForm({ date: exp.date, amount: exp.amount, type: exp.type, description: exp.description });
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
    } catch {
      alert("Failed to delete expense");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateExpense(editingExpense.id, editForm);
      setEditingExpense(null);
    } catch {
      alert("Failed to update expense");
    }
  };

  return (
    <div
      className={`min-h-screen ${tokens.bg} ${tokens.text}`}
      style={{ padding: "16px" }}
    >
      {/* Theme selector */}
      <div className="flex justify-end mb-3">
        <ThemeSelector theme={theme} setTheme={setTheme} />
      </div>

      {/* ---------------- FORM ---------------- */}
      {view === "form" && (
        <>
          <h1 className="text-2xl font-bold text-center mb-4">Expense Tracker</h1>

          <div className={`${tokens.card} ${tokens.border} border shadow-lg rounded-2xl p-4 space-y-3`}>
            <input
              type="date"
              value={expense.date}
              onChange={(e) => setExpense({ ...expense, date: e.target.value })}
              className={`border rounded-lg p-2 w-full focus:ring-2 focus:outline-none ${tokens.input}`}
            />
            <input
              type="number"
              placeholder="Amount"
              value={expense.amount}
              onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
              className={`border rounded-lg p-2 w-full focus:ring-2 focus:outline-none ${tokens.input}`}
            />
            <select
              value={expense.type}
              onChange={(e) => setExpense({ ...expense, type: e.target.value })}
              className={`border rounded-lg p-2 w-full focus:ring-2 focus:outline-none ${tokens.input}`}
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              type="text"
              placeholder="Description"
              value={expense.description}
              onChange={(e) => setExpense({ ...expense, description: e.target.value })}
              className={`border rounded-lg p-2 w-full focus:ring-2 focus:outline-none ${tokens.input}`}
            />
            <button
              onClick={handleAdd}
              className={`${tokens.btn.primary} p-2 rounded-xl w-full shadow font-medium`}
            >
              Add Expense
            </button>
          </div>

          <button
            onClick={() => setView("menu")}
            className={`${tokens.btn.secondary} p-2 w-full rounded-xl shadow mt-3`}
          >
            View Expense History
          </button>
        </>
      )}

      {/* ---------------- MENU ---------------- */}
      {view === "menu" && (
        <div className="space-y-3">
          <button onClick={handleFetchDashboard} className={`${tokens.btn.primary} p-3 w-full rounded-xl shadow`}>
            Dashboard
          </button>
          <button onClick={handleFetchWeekly} className={`${tokens.btn.primary} p-3 w-full rounded-xl shadow`}>
            Weekly Expense
          </button>
          <button onClick={handleFetchMonthly} className={`${tokens.btn.success} p-3 w-full rounded-xl shadow`}>
            Monthly Expense
          </button>
          <button onClick={handleFetchHistory} className={`${tokens.btn.secondary} p-3 w-full rounded-xl shadow`}>
            Expense History
          </button>
          <button onClick={() => setView("form")} className={`text-sm ${tokens.btn.ghost}`}>
            ← Back
          </button>
        </div>
      )}

      {/* ---------------- WEEKLY ---------------- */}
      {view === "weekly" && weeklyData && (
        <WeeklyView
          data={weeklyData}
          displayMode={displayMode}
          setDisplayMode={changeDisplayMode}
          onBack={() => setView("menu")}
        />
      )}

      {/* ---------------- MONTHLY ---------------- */}
      {view === "monthly" && monthlyData && (
        <MonthlyView
          data={monthlyData}
          displayMode={displayMode}
          setDisplayMode={changeDisplayMode}
          onBack={() => setView("menu")}
        />
      )}

      {/* ---------------- HISTORY ---------------- */}
      {view === "history" && (
        <HistoryView
          data={expenses}
          displayMode={displayMode}
          setDisplayMode={changeDisplayMode}
          onBack={() => setView("menu")}
          onDelete={handleDelete}
          onEdit={openEdit}
        />
      )}

      {/* ---------------- DASHBOARD ---------------- */}
      {view === "dashboard" && (
        <DashboardView
          data={expenses}
          onBack={() => setView("menu")}
          tokens={tokens}
        />
      )}

      {/* ---------------- EDIT MODAL ---------------- */}
      {editingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className={`${tokens.card} rounded-2xl p-5 w-[90%] max-w-md space-y-3`}>
            <h2 className="text-xl font-bold">Edit Expense</h2>
            <input
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              className={`border rounded-lg p-2 w-full ${tokens.input}`}
            />
            <input
              type="number"
              value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              className={`border rounded-lg p-2 w-full ${tokens.input}`}
            />
            <select
              value={editForm.type}
              onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
              className={`border rounded-lg p-2 w-full ${tokens.input}`}
            >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              type="text"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className={`border rounded-lg p-2 w-full ${tokens.input}`}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditingExpense(null)}
                className={`${tokens.btn.secondary} px-4 py-2 rounded-lg w-full`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className={`${tokens.btn.primary} px-4 py-2 rounded-lg w-full`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tracker;
