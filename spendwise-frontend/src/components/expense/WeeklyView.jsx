// src/components/expense/WeeklyView.jsx
// Redesigned: theme-aware via tokens prop, mobile-friendly, consistent button sizes.

import { exportToCSV } from "../../utils/exportCsv";
import { exportToPDF } from "../../utils/exportPdf";
import { CATEGORY_COLORS, EXPENSE_CATEGORIES } from "../../config/themeConfig";

export default function WeeklyView({ data, onBack, displayMode, setDisplayMode, tokens }) {
  const t = tokens || defaultTokens();

  if (!data || !data.expenses) {
    return <div className={`p-4 text-center ${t.muted}`}>Loading...</div>;
  }

  const { expenses, categorySummary, total, lastWeekTotal, difference } = data;
  const isUp = difference > 0;

  // ── Toolbar ─────────────────────────────────────────────────────────────────
  const Toolbar = () => (
    <div className="flex gap-2 flex-wrap mb-4">
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
        onClick={() => exportToCSV(expenses, "weekly-expenses.csv")}
        className={`px-3 py-2 rounded-xl text-xs font-medium ${t.btn.success}`}
      >
        ⬇ CSV
      </button>

      <button
        onClick={() => exportToPDF(expenses, "Weekly Expense Report", "weekly-expenses.pdf")}
        className={`px-3 py-2 rounded-xl text-xs font-medium ${t.btn.primary}`}
      >
        ⬇ PDF
      </button>
    </div>
  );

  // ── Summary cards ────────────────────────────────────────────────────────────
  const SummaryCards = () => (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className={`${t.card} ${t.border} border rounded-xl p-3`}>
        <p className={`text-xs uppercase tracking-wider mb-1 ${t.muted}`}>This Week</p>
        <p className={`text-lg font-bold ${t.text}`}>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
      </div>
      <div className={`${t.card} ${t.border} border rounded-xl p-3`}>
        <p className={`text-xs uppercase tracking-wider mb-1 ${t.muted}`}>vs Last Week</p>
        <p className={`text-lg font-bold ${isUp ? "text-red-500" : "text-emerald-500"}`}>
          {isUp ? "▲" : "▼"} ₹{Math.abs(difference).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );

  // ── Category pills ────────────────────────────────────────────────────────
  const CategorySummary = () => (
    <div className={`${t.card} ${t.border} border rounded-xl p-3 mb-4`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${t.muted}`}>By Category</p>
      <div className="space-y-2">
        {Object.entries(categorySummary).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => {
          const pct = total > 0 ? (amt / total) * 100 : 0;
          const color = CATEGORY_COLORS[cat] || "#6b7280";
          return (
            <div key={cat}>
              <div className="flex justify-between text-xs mb-1">
                <span className={`font-medium ${t.text}`}>{cat}</span>
                <span className={t.muted}>₹{amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })} · {pct.toFixed(0)}%</span>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden bg-current/10`}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const Badge = ({ type }) => (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${t.badge?.[type] || "bg-gray-100 text-gray-700"}`}>
      {type}
    </span>
  );

  // ── TABLE VIEW ───────────────────────────────────────────────────────────────
  if (displayMode === "table") {
    return (
      <div className="space-y-4">
        <Header title="Weekly Expenses" onBack={onBack} t={t} />
        <Toolbar />
        <SummaryCards />
        <CategorySummary />

        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "inherit" }}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className={t.tableHead}>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Description</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr
                  key={e.id}
                  className={`${t.tableRow} border-t ${t.tableRowHover} transition-colors ${i % 2 === 0 ? "" : "bg-current/[0.02]"}`}
                >
                  <td className="px-3 py-2.5 text-xs whitespace-nowrap">{e.date}</td>
                  <td className="px-3 py-2.5"><Badge type={e.type} /></td>
                  <td className="px-3 py-2.5 text-xs hidden sm:table-cell max-w-[140px] truncate">{e.description}</td>
                  <td className="px-3 py-2.5 text-right text-xs font-semibold whitespace-nowrap">
                    ₹{Number(e.amount).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={onBack} className={`text-sm ${t.btn.ghost}`}>← Back</button>
      </div>
    );
  }

  // ── CARD VIEW ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <Header title="Weekly Expenses" onBack={onBack} t={t} />
      <Toolbar />
      <SummaryCards />
      <CategorySummary />

      <div className="space-y-2">
        {expenses.map((e) => (
          <div key={e.id} className={`${t.card} ${t.border} border rounded-xl p-3 shadow-sm`}>
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge type={e.type} />
                  <span className={`text-xs ${t.muted}`}>{e.date}</span>
                </div>
                <p className={`text-sm truncate ${t.text}`}>{e.description}</p>
              </div>
              <span className={`text-sm font-bold shrink-0 ${t.text}`}>
                ₹{Number(e.amount).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onBack} className={`text-sm ${t.btn.ghost}`}>← Back</button>
    </div>
  );
}

function Header({ title, onBack, t }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className={`text-xl font-bold ${t.text}`}>{title}</h2>
      <button onClick={onBack} className={`text-sm ${t.btn.ghost}`}>← Back</button>
    </div>
  );
}

function defaultTokens() {
  return {
    text: "text-gray-900", muted: "text-gray-500", card: "bg-white",
    border: "border-gray-200", surface: "bg-gray-50",
    input: "bg-white border-gray-300 text-gray-900",
    btn: { primary: "bg-blue-600 text-white", secondary: "bg-gray-100 text-gray-800",
           ghost: "text-blue-600", success: "bg-emerald-500 text-white" },
    tableHead: "bg-gray-100 text-gray-700", tableRow: "border-gray-200 text-gray-800",
    tableRowHover: "hover:bg-gray-50",
    badge: { FOOD:"bg-orange-100 text-orange-700", TRAVEL:"bg-blue-100 text-blue-700",
             MOBILE:"bg-purple-100 text-purple-700", LENT:"bg-yellow-100 text-yellow-700",
             ENTERTAINMENT:"bg-pink-100 text-pink-700", OTHER:"bg-gray-100 text-gray-700" },
  };
}
