// src/components/splitExpense/MatrixView.jsx

export default function MatrixView({ matrix, participants, tokens }) {
  const t = tokens;

  return (
    <div className={`overflow-x-auto rounded-2xl border ${t.border} shadow-2xs animate-fade-in`}>
      <table className="w-full border-collapse text-xs min-w-[400px]">
        <thead>
          <tr className={t.tableHead}>
            <th className="px-3.5 py-3 text-left font-bold text-[10px] uppercase tracking-wider">
              Pays ↓ / Receives →
            </th>
            {participants.map((p) => (
              <th key={p.id} className="px-3.5 py-3 text-center font-bold text-[10px] uppercase tracking-wider">
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {participants.map((payer, i) => (
            <tr key={payer.id}
              className={`${t.tableRow} border-t ${t.tableRowHover} transition-colors ${i % 2 === 0 ? "" : "bg-current/[0.02]"}`}>
              <td className={`px-3.5 py-3 font-extrabold ${t.text}`}>{payer.name}</td>
              {participants.map((receiver) => {
                const amount = matrix[payer.id]?.[receiver.id] || 0;
                const isSelf = payer.id === receiver.id;
                return (
                  <td key={receiver.id} className="px-3.5 py-3 text-center tabular-nums">
                    {isSelf ? (
                      <span className={t.muted}>—</span>
                    ) : amount > 0 ? (
                      <span className="font-black text-emerald-500">₹{amount.toFixed(2)}</span>
                    ) : (
                      <span className={t.muted}>—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
