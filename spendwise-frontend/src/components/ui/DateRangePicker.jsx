// src/components/ui/DateRangePicker.jsx
// From/To date inputs with a clear button.
// Connects to useDateRange() hook.

export default function DateRangePicker({ from, to, setFrom, setTo, onClear, tokens }) {
  const inputClass = `border rounded-xl px-3 py-2 text-xs font-medium w-full focus:outline-none transition-all duration-150 ${
    tokens?.input || "border-slate-300 bg-white text-slate-900"
  }`;

  return (
    <div className="flex flex-wrap gap-2.5 items-end">
      <div className="flex-1 min-w-[130px] flex flex-col gap-1">
        <label className={`text-[11px] font-bold uppercase tracking-wider ${tokens?.muted || "text-slate-400"}`}>
          From
        </label>
        <input
          type="date"
          value={from}
          max={to || undefined}
          onChange={(e) => setFrom(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex-1 min-w-[130px] flex flex-col gap-1">
        <label className={`text-[11px] font-bold uppercase tracking-wider ${tokens?.muted || "text-slate-400"}`}>
          To
        </label>
        <input
          type="date"
          value={to}
          min={from || undefined}
          onChange={(e) => setTo(e.target.value)}
          className={inputClass}
        />
      </div>

      {(from || to) && (
        <button
          onClick={onClear}
          className={`text-xs font-bold px-3 py-2 rounded-xl transition-all duration-150 active:scale-95 ${
            tokens?.btn?.ghost || "text-blue-600 hover:text-blue-700"
          }`}
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}
