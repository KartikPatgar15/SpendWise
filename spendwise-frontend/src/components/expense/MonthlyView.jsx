// src/components/expense/MonthlyView.jsx
// Redesigned: theme-aware via tokens prop, mobile-friendly, consistent button sizes and Lucide icons.

import { exportToCSV } from "../../utils/exportCsv";
import { exportToPDF } from "../../utils/exportPdf";
import { CATEGORY_COLORS } from "../../config/themeConfig";
import {
  Table as TableIcon,
  LayoutGrid,
  FileSpreadsheet,
  FileText,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function MonthlyView({ data, onBack, displayMode, setDisplayMode, tokens }) {
  const t = tokens || defaultTokens();

  if (!data || !data.expenses) {
    return <div className={`p-4 text-center ${t.muted}`}>Loading...</div>;
  }

  const { expenses, categorySummary, total, lastMonthTotal, difference } = data;
  const isUp = difference > 0;

  // ── Toolbar ──────────────────────────────────────────────────────────────────
  const Toolbar = () => (
    <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
      <div className={`inline-flex rounded-xl overflow-hidden border ${t.border} p-0.5 bg-black/5 dark:bg-white/5`}>
        {[
          { mode: "table", label: "Table", icon: TableIcon },
          { mode: "card",  label: "Cards", icon: LayoutGrid },
        ].map(({ mode, label, icon: ModeIcon }) => (
          <button
            key={mode}
            onClick={() => setDisplayMode(mode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
              displayMode === mode ? `${t.btn.primary} shadow-2xs` : "opacity-60 hover:opacity-100"
            }`}
          >
            <ModeIcon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={() => exportToCSV(expenses, "monthly-expenses.csv")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all ${t.btn.success}`}
        >
          <FileSpreadsheet size={14} />
          <span>CSV</span>
        </button>

        <button
          onClick={() => exportToPDF(expenses, "Monthly Expense Report", "monthly-expenses.pdf")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all ${t.btn.primary}`}
        >
          <FileText size={14} />
          <span>PDF</span>
        </button>
      </div>
    </div>
  );

  // ── Summary cards ─────────────────────────────────────────────────────────────
  const SummaryCards = () => (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className={`${t.card} ${t.border} border rounded-2xl p-4 shadow-xs`}>
        <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${t.muted}`}>This Month</p>
        <p className={`text-xl font-black tabular-nums ${t.text}`}>
          ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
      </div>
      <div className={`${t.card} ${t.border} border rounded-2xl p-4 shadow-xs`}>
        <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${t.muted}`}>vs Last Month</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-base font-black tabular-nums flex items-center gap-1 ${isUp ? "text-rose-500" : "text-emerald-500"}`}>
            {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>₹{Math.abs(difference).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </span>
        </div>
      </div>
      <div className={`${t.card} ${t.border} border rounded-2xl p-4 col-span-2 shadow-xs flex items-center justify-between`}>
        <p className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Last Month Total</p>
        <p className={`text-base font-extrabold tabular-nums ${t.text}`}>
          ₹{lastMonthTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );

  // ── Category breakdown ────────────────────────────────────────────────────────
  const CategorySummary = () => (
    <div className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 mb-4 shadow-xs`}>
      <p className={`text-[11px] font-bold uppercase tracking-wider mb-3.5 ${t.muted}`}>By Category</p>
      <div className="space-y-2.5">
        {Object.entries(categorySummary).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => {
          const pct = total > 0 ? (amt / total) * 100 : 0;
          const color = CATEGORY_COLORS[cat] || "#6b7280";
          return (
            <div key={cat} className="space-y-1">
              <div className="flex justify-between text-xs tabular-nums">
                <span className={`font-bold ${t.text}`}>{cat}</span>
                <span className={`font-semibold ${t.muted}`}>
                  ₹{amt.toLocaleString("en-IN", { minimumFractionDigits: 2 })} · <strong className={t.text}>{pct.toFixed(0)}%</strong>
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
  );

  const Badge = ({ type }) => (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${t.badge?.[type] || "bg-gray-100 text-gray-700"}`}>
      {type}
    </span>
  );

  // ── TABLE VIEW ────────────────────────────────────────────────────────────────
  if (displayMode === "table") {
    return (
      <div className="space-y-4 animate-fade-slide-up">
        <Header title="Monthly Expenses" onBack={onBack} t={t} />
        <Toolbar />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 items-start">
          <SummaryCards />
          <CategorySummary />
        </div>

        <div className={`overflow-x-auto rounded-2xl border ${t.border} shadow-2xs`}>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className={t.tableHead}>
                <th className="px-3.5 py-3 text-left font-bold uppercase tracking-wider">Date</th>
                <th className="px-3.5 py-3 text-left font-bold uppercase tracking-wider">Category</th>
                <th className="px-3.5 py-3 text-left font-bold uppercase tracking-wider hidden sm:table-cell">Description</th>
                <th className="px-3.5 py-3 text-right font-bold uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr
                  key={e.id}
                  className={`${t.tableRow} border-t ${t.tableRowHover} transition-colors ${i % 2 === 0 ? "" : "bg-current/[0.02]"}`}
                >
                  <td className="px-3.5 py-3 whitespace-nowrap font-medium">{e.date}</td>
                  <td className="px-3.5 py-3"><Badge type={e.type} /></td>
                  <td className="px-3.5 py-3 hidden sm:table-cell max-w-[160px] truncate opacity-90 font-medium">{e.description}</td>
                  <td className="px-3.5 py-3 text-right font-black tabular-nums whitespace-nowrap">
                    ₹{Number(e.amount).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ── CARD VIEW ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 animate-fade-slide-up">
      <Header title="Monthly Expenses" onBack={onBack} t={t} />
      <Toolbar />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 items-start">
        <SummaryCards />
        <CategorySummary />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {expenses.map((e) => (
          <div key={e.id} className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-4.5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between`}>
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge type={e.type} />
                  <span className={`text-[11px] font-medium tabular-nums ${t.muted}`}>{e.date}</span>
                </div>
                <p className={`text-sm font-bold truncate ${t.text}`}>{e.description || "No description"}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-black/5 dark:border-white/5 flex justify-end">
              <span className={`text-base font-black tabular-nums shrink-0 ${t.text}`}>
                ₹{Number(e.amount).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Header({ title, onBack, t }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className={`px-2.5 py-1 rounded-lg text-xs font-bold ${t.btn.ghost} hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1`}>
          <ArrowLeft size={13} />
          <span>Back</span>
        </button>
        <h2 className={`text-xl font-black tracking-tight ${t.text}`}>{title}</h2>
      </div>
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
