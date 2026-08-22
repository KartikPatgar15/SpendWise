// src/components/ui/BudgetProgressBar.jsx
// Phase 2 — Budget progress bar.
// Shows monthly budget vs actual spend.

import { formatRupees } from "../../utils/expenseHelpers";

export default function BudgetProgressBar({
  budget,
  spent,
  remaining,
  progress,
  tokens,
}) {
  if (!budget) return null;

  const isOverBudget = remaining < 0;
  const barColor = progress < 70 ? "bg-emerald-500 shadow-xs shadow-emerald-500/30" : progress < 90 ? "bg-amber-400 shadow-xs shadow-amber-400/30" : "bg-rose-500 shadow-xs shadow-rose-500/30";

  return (
    <div className={`${tokens.card} ${tokens.border} border rounded-2xl p-4 space-y-2.5 shadow-xs`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold uppercase tracking-wider ${tokens.muted}`}>
            Monthly Budget
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            progress < 70 ? "bg-emerald-500/10 text-emerald-500" : progress < 90 ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
          }`}>
            {progress.toFixed(0)}%
          </span>
        </div>
        <span className={`text-xs font-semibold ${isOverBudget ? "text-rose-500 font-bold" : tokens.muted}`}>
          {isOverBudget ? `Over by ${formatRupees(Math.abs(remaining))}` : `${formatRupees(remaining)} remaining`}
        </span>
      </div>

      <div className="h-2 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs tabular-nums">
        <span className={`font-medium ${tokens.muted}`}>
          Spent: <strong className={tokens.text}>{formatRupees(spent)}</strong>
        </span>
        <span className={`font-medium ${tokens.muted}`}>
          Limit: <strong className={tokens.text}>{formatRupees(budget)}</strong>
        </span>
      </div>
    </div>
  );
}
