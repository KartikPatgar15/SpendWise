// src/components/expense/HistoryView.jsx
// Redesigned: theme-aware via tokens prop, mobile-friendly, consistent button sizes.

import { useState } from "react";
import { exportToCSV } from "../../utils/exportCsv";
import { exportToPDF } from "../../utils/exportPdf";
import { EXPENSE_CATEGORIES } from "../../config/themeConfig";

export default function HistoryView({
  data,
  onBack,
  onDelete,
  displayMode,
  setDisplayMode,
  onEdit,
  tokens,
}) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  // tokens fallback so the component works even without tokens passed
  const t = tokens || {
    text: "text-gray-900", muted: "text-gray-500", label: "text-gray-600",
    card: "bg-white", surface: "bg-gray-50", border: "border-gray-200",
    input: "bg-white border-gray-300 text-gray-900 placeholder-gray-400",
    btn: { primary: "bg-blue-600 text-white", secondary: "bg-gray-100 text-gray-800",
           ghost: "text-blue-600", danger: "bg-red-500 text-white", success: "bg-emerald-500 text-white" },
    tableHead: "bg-gray-100 text-gray-700", tableRow: "border-gray-200 text-gray-800",
    tableRowHover: "hover:bg-gray-50",
    badge: { FOOD:"bg-orange-100 text-orange-700", TRAVEL:"bg-blue-100 text-blue-700",
             MOBILE:"bg-purple-100 text-purple-700", LENT:"bg-yellow-100 text-yellow-700",
             ENTERTAINMENT:"bg-pink-100 text-pink-700", OTHER:"bg-gray-100 text-gray-700" },
  };

  if (!Array.isArray(data)) {
    return <div className={`p-4 text-center ${t.muted}`}>Loading...</div>;
  }

  const filteredData = data.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.type.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "ALL" || e.type === filterType;
    return matchesSearch && matchesType;
  });

  const total = filteredData.reduce((sum, e) => sum + Number(e.amount), 0);

  // ── Shared toolbar ──────────────────────────────────────────────────────────
  const Toolbar = () => (
    <div className="space-y-3 mb-4">
      {/* Search + filter row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search description or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`border rounded-xl px-3.5 py-2.5 text-xs font-medium w-full focus:outline-none transition-all duration-150 ${t.input}`}
          />
          {search && (
            <button onClick={() => setSearch("")} className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold ${t.muted}`}>
              ✕
            </button>
          )}
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={`border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none transition-all duration-150 ${t.input}`}
        >
          <option value="ALL">All Categories</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
        {/* Display mode toggle */}
        <div className={`inline-flex rounded-xl overflow-hidden border ${t.border} p-0.5 bg-black/5 dark:bg-white/5`}>
          {["table", "card"].map((mode) => (
            <button
              key={mode}
              onClick={() => setDisplayMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                displayMode === mode ? `${t.btn.primary} shadow-2xs` : "opacity-60 hover:opacity-100"
              }`}
            >
              {mode === "table" ? "📋 Table" : "📦 Cards"}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => exportToCSV(filteredData, "expense-history.csv")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all ${t.btn.success}`}
          >
            <span>⬇</span> CSV
          </button>

          <button
            onClick={() => exportToPDF(filteredData, "Expense History", "expense-history.pdf")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all ${t.btn.primary}`}
          >
            <span>⬇</span> PDF
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div className={`flex justify-between items-center text-xs pt-1 tabular-nums ${t.muted}`}>
        <span className="font-medium">{filteredData.length} transaction{filteredData.length !== 1 ? "s" : ""}</span>
        <span className={`font-bold ${t.text}`}>
          Total: <strong className="text-blue-500 font-extrabold">₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
        </span>
      </div>
    </div>
  );

  // ── Category badge ──────────────────────────────────────────────────────────
  const Badge = ({ type }) => (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${t.badge[type] || t.badge.OTHER}`}>
      {type}
    </span>
  );

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (filteredData.length === 0) {
    return (
      <div className="space-y-4 animate-fade-slide-up">
        <Header title="Expense History" onBack={onBack} t={t} />
        <Toolbar />
        <div className={`text-center py-16 ${t.muted}`}>
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm font-semibold">No expenses match your search</p>
        </div>
      </div>
    );
  }

  // ── TABLE VIEW ──────────────────────────────────────────────────────────────
  if (displayMode === "table") {
    return (
      <div className="space-y-4 animate-fade-slide-up">
        <Header title="Expense History" onBack={onBack} t={t} />
        <Toolbar />
        <div className={`overflow-x-auto rounded-2xl border ${t.border} shadow-2xs`}>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className={t.tableHead}>
                <th className="px-3.5 py-3 text-left font-bold uppercase tracking-wider">Date</th>
                <th className="px-3.5 py-3 text-left font-bold uppercase tracking-wider">Category</th>
                <th className="px-3.5 py-3 text-left font-bold uppercase tracking-wider hidden sm:table-cell">Description</th>
                <th className="px-3.5 py-3 text-right font-bold uppercase tracking-wider">Amount</th>
                <th className="px-3.5 py-3 text-center font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((e, i) => (
                <tr
                  key={e.id}
                  className={`${t.tableRow} border-t ${t.tableRowHover} transition-colors ${
                    i % 2 === 0 ? "" : "bg-current/[0.02]"
                  }`}
                >
                  <td className="px-3.5 py-3 whitespace-nowrap font-medium">{e.date}</td>
                  <td className="px-3.5 py-3"><Badge type={e.type} /></td>
                  <td className="px-3.5 py-3 hidden sm:table-cell max-w-[160px] truncate opacity-90 font-medium">{e.description}</td>
                  <td className="px-3.5 py-3 text-right font-black tabular-nums whitespace-nowrap">
                    ₹{Number(e.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="flex gap-1.5 justify-center">
                      <button
                        onClick={() => onEdit(e)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${t.btn.primary} active:scale-95 transition-all`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(e.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${t.btn.danger} active:scale-95 transition-all`}
                      >
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── CARD VIEW ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 animate-fade-slide-up">
      <Header title="Expense History" onBack={onBack} t={t} />
      <Toolbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredData.map((e) => (
          <div
            key={e.id}
            className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-4.5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge type={e.type} />
                  <span className={`text-[11px] font-medium tabular-nums ${t.muted}`}>{e.date}</span>
                </div>
                <p className={`text-sm font-bold truncate ${t.text}`}>{e.description || "No description"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 mt-2">
              <span className={`text-base font-black tabular-nums ${t.text}`}>
                ₹{Number(e.amount).toLocaleString("en-IN")}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onEdit(e)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${t.btn.primary} active:scale-95 transition-all`}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(e.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${t.btn.danger} active:scale-95 transition-all`}
                >
                  Del
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────
function Header({ title, onBack, t }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className={`px-2.5 py-1 rounded-lg text-xs font-bold ${t.btn.ghost} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}>
          ← Back
        </button>
        <h2 className={`text-xl font-black tracking-tight ${t.text}`}>{title}</h2>
      </div>
    </div>
  );
}
