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
        <input
          type="text"
          placeholder="Search description or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`border rounded-xl px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${t.input}`}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={`border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${t.input}`}
        >
          <option value="ALL">All</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Action row */}
      <div className="flex gap-2 flex-wrap">
        {/* Display mode toggle */}
        <div className={`flex rounded-xl overflow-hidden border ${t.border}`}>
          {["table", "card"].map((mode) => (
            <button
              key={mode}
              onClick={() => setDisplayMode(mode)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                displayMode === mode ? t.btn.primary : t.btn.secondary
              }`}
            >
              {mode === "table" ? "📋 Table" : "📦 Cards"}
            </button>
          ))}
        </div>

        <button
          onClick={() => exportToCSV(filteredData, "expense-history.csv")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium ${t.btn.success}`}
        >
          ⬇ CSV
        </button>

        <button
          onClick={() => exportToPDF(filteredData, "Expense History", "expense-history.pdf")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium ${t.btn.primary}`}
        >
          ⬇ PDF
        </button>
      </div>

      {/* Summary row */}
      <div className={`flex justify-between text-xs ${t.muted}`}>
        <span>{filteredData.length} transaction{filteredData.length !== 1 ? "s" : ""}</span>
        <span className={`font-semibold ${t.text}`}>
          Total: ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );

  // ── Category badge ──────────────────────────────────────────────────────────
  const Badge = ({ type }) => (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${t.badge[type] || t.badge.OTHER}`}>
      {type}
    </span>
  );

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (filteredData.length === 0) {
    return (
      <div className="space-y-4">
        <Header title="Expense History" onBack={onBack} t={t} />
        <Toolbar />
        <div className={`text-center py-16 ${t.muted}`}>
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm">No expenses match your search</p>
        </div>
      </div>
    );
  }

  // ── TABLE VIEW ──────────────────────────────────────────────────────────────
  if (displayMode === "table") {
    return (
      <div className="space-y-4">
        <Header title="Expense History" onBack={onBack} t={t} />
        <Toolbar />
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "inherit" }}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className={t.tableHead}>
                <th className="px-3 py-2.5 text-left font-semibold text-xs uppercase tracking-wider">Date</th>
                <th className="px-3 py-2.5 text-left font-semibold text-xs uppercase tracking-wider">Category</th>
                <th className="px-3 py-2.5 text-left font-semibold text-xs uppercase tracking-wider hidden sm:table-cell">Description</th>
                <th className="px-3 py-2.5 text-right font-semibold text-xs uppercase tracking-wider">Amount</th>
                <th className="px-3 py-2.5 text-center font-semibold text-xs uppercase tracking-wider">Actions</th>
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
                  <td className="px-3 py-2.5 text-xs whitespace-nowrap">{e.date}</td>
                  <td className="px-3 py-2.5"><Badge type={e.type} /></td>
                  <td className="px-3 py-2.5 text-xs hidden sm:table-cell max-w-[140px] truncate">{e.description}</td>
                  <td className="px-3 py-2.5 text-right text-xs font-semibold whitespace-nowrap">
                    ₹{Number(e.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1.5 justify-center">
                      <button
                        onClick={() => onEdit(e)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${t.btn.primary}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(e.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${t.btn.danger}`}
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
        <BackButton onBack={onBack} t={t} />
      </div>
    );
  }

  // ── CARD VIEW ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <Header title="Expense History" onBack={onBack} t={t} />
      <Toolbar />
      <div className="space-y-2">
        {filteredData.map((e) => (
          <div
            key={e.id}
            className={`${t.card} ${t.border} border rounded-xl p-3 shadow-sm`}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge type={e.type} />
                  <span className={`text-xs ${t.muted}`}>{e.date}</span>
                </div>
                <p className={`text-sm truncate ${t.text}`}>{e.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`text-sm font-bold ${t.text}`}>
                  ₹{Number(e.amount).toLocaleString("en-IN")}
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onEdit(e)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium ${t.btn.primary}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(e.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium ${t.btn.danger}`}
                  >
                    Del
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BackButton onBack={onBack} t={t} />
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────
function Header({ title, onBack, t }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className={`text-xl font-bold ${t.text}`}>{title}</h2>
      <button onClick={onBack} className={`text-sm ${t.btn.ghost}`}>← Back</button>
    </div>
  );
}

function BackButton({ onBack, t }) {
  return (
    <button onClick={onBack} className={`text-sm ${t.btn.ghost}`}>← Back</button>
  );
}
