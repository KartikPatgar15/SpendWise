// src/components/ui/EmptyState.jsx
// Displayed when a list has no items.

export default function EmptyState({ icon = "📭", message = "Nothing here yet", tokens }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 px-4 text-center animate-fade-in ${tokens?.muted || "text-slate-400"}`}>
      <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center shadow-inner">
        <span className="text-3xl" aria-hidden="true">{icon}</span>
      </div>
      <p className="text-sm font-semibold max-w-xs">{message}</p>
    </div>
  );
}
