// src/components/notes/SearchBar.jsx

export default function SearchBar({ value, onChange, tokens }) {
  const t = tokens;
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
      <input
        type="text"
        placeholder="Search notes…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border rounded-xl pl-9 pr-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${t.input}`}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${t.muted}`}
        >×</button>
      )}
    </div>
  );
}
