// src/components/splitExpense/SettlementView.jsx

export default function SettlementView({ settlements, participants, tokens }) {
  const t = tokens;
  const nameOf = (id) => participants.find((p) => p.id === id)?.name || id;

  if (settlements.length === 0) {
    return (
      <div className={`text-center py-16 ${t.muted}`}>
        <p className="text-4xl mb-3">🎉</p>
        <p className="text-sm font-semibold">All settled!</p>
        <p className="text-xs mt-1">No transactions needed</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className={`text-xs font-semibold uppercase tracking-widest ${t.muted}`}>
        {settlements.length} transaction{settlements.length !== 1 ? "s" : ""} to settle
      </p>
      {settlements.map((s, i) => (
        <div key={i}
          className={`${t.card} ${t.border} border rounded-2xl p-4 flex items-center justify-between gap-3 animate-fade-slide-up-${Math.min(i + 1, 5)}`}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-xs font-bold shrink-0">
              {nameOf(s.from)[0]}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-bold ${t.text}`}>{nameOf(s.from)}</p>
              <p className={`text-xs ${t.muted}`}>pays</p>
            </div>
          </div>
          <div className="text-center shrink-0">
            <p className="text-base font-extrabold text-emerald-500">₹{s.amount.toFixed(2)}</p>
            <p className={`text-[10px] ${t.muted}`}>→</p>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <div className="min-w-0 text-right">
              <p className={`text-sm font-bold ${t.text}`}>{nameOf(s.to)}</p>
              <p className={`text-xs ${t.muted}`}>receives</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs font-bold shrink-0">
              {nameOf(s.to)[0]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
