// src/components/splitExpense/ExpenseList.jsx
// Displays all expenses in the report with edit/delete actions.

export default function ExpenseList({ expenses, participants, onEdit, onDelete, tokens }) {
  const t = tokens;
  const nameOf = (id) => participants.find((p) => p.id === id)?.name || id;

  if (expenses.length === 0) {
    return (
      <div className={`text-center py-16 ${t.muted}`}>
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-2xl">📋</div>
        <p className="text-sm font-bold">No expenses added yet</p>
        <p className="text-xs mt-0.5">Tap "+ Add Expense" above to record a split item</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {expenses.map((exp, i) => {
        const totalPaid = exp.paidBy.reduce((s, p) => s + Number(p.amount), 0);
        const paidByStr = exp.paidBy
          .map((p) => `${nameOf(p.participantId)} ₹${Number(p.amount).toFixed(2)}`)
          .join(", ");

        let sharedByStr;
        if (exp.distributionType === "equal") {
          const share = exp.sharedBy.length > 0 ? totalPaid / exp.sharedBy.length : 0;
          sharedByStr = exp.sharedBy
            .map((id) => `${nameOf(id)} (₹${share.toFixed(2)})`)
            .join(", ");
        } else {
          sharedByStr = Object.entries(exp.exactShares)
            .filter(([, v]) => Number(v) > 0)
            .map(([id, v]) => `${nameOf(id)} ₹${Number(v).toFixed(2)}`)
            .join(", ");
        }

        return (
          <div key={exp.id}
            className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between animate-fade-slide-up-${Math.min(i + 1, 5)}`}>
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-black truncate ${t.text}`}>{exp.expenseName}</p>
                  <span className={`inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    exp.distributionType === "equal" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-400"
                  }`}>
                    {exp.distributionType === "equal" ? "Equal Split" : "Exact Split"}
                  </span>
                </div>
                <p className={`text-base font-black tabular-nums shrink-0 ${t.text}`}>₹{totalPaid.toFixed(2)}</p>
              </div>
              <div className={`text-xs space-y-1 ${t.muted}`}>
                <p><span className="font-bold text-slate-400">Paid by:</span> {paidByStr}</p>
                <p><span className="font-bold text-slate-400">Shared by:</span> {sharedByStr}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2 border-t border-black/5 dark:border-white/5 justify-end">
              <button onClick={() => onEdit(exp)}
                className={`${t.btn.primary} px-3.5 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all`}>
                Edit
              </button>
              <button onClick={() => onDelete(exp.id)}
                className={`${t.btn.danger} px-3.5 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all`}>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
