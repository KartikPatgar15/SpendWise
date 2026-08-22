// src/components/ui/DisplayModeSelector.jsx
// Replaces the inline display mode <select> in HistoryView, WeeklyView, MonthlyView.
// Keeps the same value/onChange interface so it's a near-drop-in swap.

export default function DisplayModeSelector({ displayMode, setDisplayMode, tokens }) {
  return (
    <div className={`inline-flex items-center p-1 rounded-xl border ${tokens?.border || "border-slate-200"} bg-black/5 dark:bg-white/5`}>
      {[
        { value: "table", label: "📋 Table" },
        { value: "card", label: "📦 Cards" },
      ].map((opt) => {
        const isActive = displayMode === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setDisplayMode(opt.value)}
            aria-pressed={isActive}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
              ${isActive
                ? `${tokens?.btn?.primary || "bg-blue-600 text-white"} shadow-2xs scale-102`
                : "opacity-60 hover:opacity-100"
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
