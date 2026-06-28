// src/components/splitExpense/SummaryView.jsx

export default function SummaryView({ summary, participants, tokens }) {
  const t = tokens;

  const rows = [
    ["Event",            summary.eventName],
    ["Participants",     participants.map((p) => p.name).join(", ")],
    ["Total Expenses",   summary.expenseCount],
    ["Grand Total",      `₹${summary.grandTotal.toFixed(2)}`],
    ["Largest Expense",  `${summary.largestExpense.name} (₹${summary.largestExpense.amount.toFixed(2)})`],
    ["Generated",        new Date(summary.generatedAt).toLocaleString("en-IN")],
  ];

  return (
    <div className="space-y-3 animate-fade-slide-up">
      {rows.map(([label, value]) => (
        <div key={label}
          className={`${t.card} ${t.border} border rounded-2xl px-4 py-3 flex justify-between items-start gap-4`}>
          <span className={`text-xs font-semibold uppercase tracking-wider shrink-0 ${t.muted}`}>{label}</span>
          <span className={`text-sm font-bold text-right ${t.text}`}>{value}</span>
        </div>
      ))}
    </div>
  );
}
