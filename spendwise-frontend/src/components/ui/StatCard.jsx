// src/components/ui/StatCard.jsx
// Reusable metric card for dashboard stats supporting Lucide icon components.

export default function StatCard({ label, value, subLabel, icon: Icon, tokens, accent = false }) {
  return (
    <div
      className={`
        ${tokens.card} ${tokens.border} border rounded-2xl p-4 shadow-xs
        flex flex-col gap-1.5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
        ${accent ? "ring-2 ring-[#84A98C]/40 bg-[#84A98C]/10 dark:ring-[#22D3EE]/40 dark:bg-[#22D3EE]/10" : ""}
      `}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${tokens.muted}`}>
          {label}
        </span>
        {Icon && (
          <span className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-sm" aria-hidden="true">
            {typeof Icon === "function" || (typeof Icon === "object" && Icon !== null) ? (
              <Icon size={15} className={accent ? "text-[#354F52] dark:text-[#22D3EE]" : tokens.text} />
            ) : (
              Icon
            )}
          </span>
        )}
      </div>

      <div className={`text-xl sm:text-2xl font-extrabold tracking-tight tabular-nums ${tokens.text}`}>
        {value}
      </div>

      {subLabel && (
        <div className={`text-xs font-medium ${tokens.muted}`}>
          {subLabel}
        </div>
      )}
    </div>
  );
}
