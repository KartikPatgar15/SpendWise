// src/components/ui/DateRangePicker.jsx
// From/To date inputs with a clear button.
// Connects to useDateRange() hook.

export default function DateRangePicker({ from, to, setFrom, setTo, onClear, tokens }) {
  const inputClass = `border rounded-lg px-3 py-1.5 text-sm w-full ${
    tokens?.input || "border-gray-300 bg-white text-gray-900"
  }`;

  return (
    <div className="flex flex-wrap gap-2 items-end">
      <div className="flex flex-col gap-1">
        <label className={`text-xs font-medium ${tokens?.muted || "text-gray-500"}`}>
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

      <div className="flex flex-col gap-1">
        <label className={`text-xs font-medium ${tokens?.muted || "text-gray-500"}`}>
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
          className={`text-sm px-3 py-1.5 rounded-lg ${
            tokens?.btn?.ghost || "text-blue-600 hover:text-blue-700"
          }`}
        >
          Clear
        </button>
      )}
    </div>
  );
}
