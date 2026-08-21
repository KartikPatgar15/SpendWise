// src/components/notes/CategoryFilter.jsx

export const CATEGORIES = ["All", "Personal", "Study", "Work", "Shopping", "Ideas", "Other"];

export default function CategoryFilter({ active, onChange, tokens }) {
  const t = tokens;
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
            active === cat ? t.btn.primary : t.btn.secondary
          }`}
        >
          {cat === "All" ? "📋 All" :
           cat === "Personal" ? "👤 Personal" :
           cat === "Study" ? "📚 Study" :
           cat === "Work" ? "💼 Work" :
           cat === "Shopping" ? "🛒 Shopping" :
           cat === "Ideas" ? "💡 Ideas" : "📂 Other"}
        </button>
      ))}
      <button
        onClick={() => onChange("⭐ Favorites")}
        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
          active === "⭐ Favorites" ? "bg-yellow-500 text-white" : t.btn.secondary
        }`}
      >
        ⭐ Favorites
      </button>
    </div>
  );
}