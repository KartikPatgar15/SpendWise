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
  const barColor = progress < 70 ? "bg-emerald-500" : progress < 90 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className={`${tokens.card} ${tokens.border} border rounded-xl p-4 space-y-2`}>
      <div className="flex justify-between items-center">
        <span className={`text-xs font-semibold uppercase tracking-wider ${tokens.muted}`}>
          Monthly Budget
        </span>
        <span className={`text-xs ${isOverBudget ? "text-red-500 font-bold" : tokens.muted}`}>
          {isOverBudget ? "Over budget!" : `${formatRupees(remaining)} left`}
        </span>
      </div>

      <div className={`h-2.5 rounded-full overflow-hidden ${tokens.border} bg-current/10`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="flex justify-between">
        <span className={`text-xs ${tokens.muted}`}>
          Spent: {formatRupees(spent)}
        </span>
        <span className={`text-xs ${tokens.muted}`}>
          Budget: {formatRupees(budget)}
        </span>
      </div>
    </div>
  );
}
