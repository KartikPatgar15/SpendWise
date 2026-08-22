// src/components/notes/SearchBar.jsx
// Notes search bar with Lucide Search & Clear icons.

import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, tokens }) {
  const t = tokens;
  return (
    <div className="relative">
      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${t.muted}`}>
        <Search size={16} />
      </span>
      <input
        type="text"
        placeholder="Search notes…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm w-full focus:outline-none transition-all ${t.input}`}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg ${t.muted} hover:opacity-100`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
