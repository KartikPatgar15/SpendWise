// src/components/ui/StatCard.jsx
// Reusable metric card for dashboard stats.
// Props: label, value, subLabel, icon (emoji or text), tokens, accent

export default function StatCard({ label, value, subLabel, icon, tokens, accent = false }) {
  return (
    <div
      className={`
        ${tokens.card} ${tokens.border} border rounded-xl p-4 shadow-sm
        flex flex-col gap-1
        ${accent ? "ring-2 ring-blue-500/30" : ""}
      `}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium uppercase tracking-wider ${tokens.muted}`}>
          {label}
        </span>
        {icon && (
          <span className="text-lg" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      <div className={`text-2xl font-bold ${tokens.text}`}>
        {value}
      </div>

      {subLabel && (
        <div className={`text-xs ${tokens.muted}`}>
          {subLabel}
        </div>
      )}
    </div>
  );
}
