// src/components/ui/EmptyState.jsx
// Displayed when a list has no items.

export default function EmptyState({ icon = "📭", message = "Nothing here yet", tokens }) {
  return (
    <div className={`flex flex-col items-center gap-3 py-16 ${tokens?.muted || "text-gray-400"}`}>
      <span className="text-4xl" aria-hidden="true">{icon}</span>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
