// src/components/splitExpense/SettlementView.jsx

export default function SettlementView({ settlements, participants, tokens }) {
  const t = tokens;
  const nameOf = (id) => participants.find((p) => p.id === id)?.name || id;

  if (settlements.length === 0) {
    return (
      <div className={`text-center py-16 ${t.muted}`}>
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#4F9D69]/10 text-[#4F9D69] flex items-center justify-center text-2xl">🎉</div>
        <p className="text-sm font-bold">All Settled Up!</p>
        <p className="text-xs mt-0.5">No outstanding balances or payments needed</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>
        {settlements.length} transaction{settlements.length !== 1 ? "s" : ""} to settle
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {settlements.map((s, i) => (
          <div key={i}
            className={`${t.card} ${t.border} border rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs transition-all duration-200 hover:shadow-md animate-fade-slide-up-${Math.min(i + 1, 5)}`}>
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#E07A5F]/15 text-[#E07A5F] flex items-center justify-center text-xs font-black shrink-0 shadow-2xs">
                {nameOf(s.from)[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-black truncate ${t.text}`}>{nameOf(s.from)}</p>
                <p className={`text-[11px] font-bold uppercase text-[#E07A5F]`}>pays</p>
              </div>
            </div>
            <div className="text-center shrink-0 px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <p className="text-sm font-black tabular-nums text-[#4F9D69]">₹{s.amount.toFixed(2)}</p>
              <p className={`text-[10px] font-bold ${t.muted}`}>→</p>
            </div>
            <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
              <div className="min-w-0 text-right">
                <p className={`text-xs font-black truncate ${t.text}`}>{nameOf(s.to)}</p>
                <p className={`text-[11px] font-bold uppercase text-[#4F9D69]`}>receives</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#4F9D69]/15 text-[#4F9D69] flex items-center justify-center text-xs font-black shrink-0 shadow-2xs">
                {nameOf(s.to)[0].toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
