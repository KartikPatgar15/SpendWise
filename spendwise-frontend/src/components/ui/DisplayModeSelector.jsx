// src/components/ui/DisplayModeSelector.jsx
// Replaces the inline display mode <select> in HistoryView, WeeklyView, MonthlyView.
// Keeps the same value/onChange interface so it's a near-drop-in swap.

export default function DisplayModeSelector({ displayMode, setDisplayMode, tokens }) {
  return (
    <div className="flex gap-1 rounded-lg overflow-hidden border border-current/10">
      {[
        { value: "table", label: "📋 Table" },
        { value: "card", label: "📦 Cards" },
      ].map((opt) => (
        <button
          key={opt.value}
          onClick={() => setDisplayMode(opt.value)}
          aria-pressed={displayMode === opt.value}
          className={`
            px-3 py-1.5 text-sm font-medium transition-colors
            ${displayMode === opt.value
              ? `${tokens?.btn?.primary || "bg-blue-600 text-white"}`
              : `${tokens?.btn?.secondary || "bg-gray-100 text-gray-700"}`
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
