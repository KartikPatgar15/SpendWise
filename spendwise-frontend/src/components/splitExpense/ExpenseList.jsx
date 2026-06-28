// src/components/splitExpense/ExpenseList.jsx
// Displays all expenses in the report with edit/delete actions.

export default function ExpenseList({ expenses, participants, onEdit, onDelete, tokens }) {
  const t = tokens;
  const nameOf = (id) => participants.find((p) => p.id === id)?.name || id;

  if (expenses.length === 0) {
    return (
      <div className={`text-center py-16 ${t.muted}`}>
        <p className="text-4xl mb-3">📋</p>
        <p className="text-sm">No expenses yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
            className={`${t.card} ${t.border} border rounded-2xl p-4 space-y-2 animate-fade-slide-up-${Math.min(i + 1, 5)}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${t.text}`}>{exp.expenseName}</p>
                <span className={`inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  exp.distributionType === "equal" ? "bg-blue-500/20 text-blue-500" : "bg-purple-500/20 text-purple-400"
                }`}>
                  {exp.distributionType === "equal" ? "Equal" : "Exact"}
                </span>
              </div>
              <p className={`text-base font-extrabold shrink-0 ${t.text}`}>₹{totalPaid.toFixed(2)}</p>
            </div>
            <div className={`text-xs space-y-1 ${t.muted}`}>
              <p><span className="font-semibold">Paid by:</span> {paidByStr}</p>
              <p><span className="font-semibold">Shared by:</span> {sharedByStr}</p>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => onEdit(exp)}
                className={`${t.btn.primary} px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-all`}>
                Edit
              </button>
              <button onClick={() => onDelete(exp.id)}
                className={`${t.btn.danger} px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-all`}>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
