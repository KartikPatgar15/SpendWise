// src/components/notes/NoteCard.jsx

import { NOTE_COLORS, NOTE_COLORS_DARK } from "./ColorPicker";

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function NoteCard({ note, onClick, onPin, onFavorite, onDelete, isDark }) {
  const colorKey = note.color || "white";
  const cardBg   = isDark ? NOTE_COLORS_DARK[colorKey] : NOTE_COLORS[colorKey]?.card || "bg-white";
  const preview  = stripHtml(note.content).slice(0, 120);

  return (
    <div
      onClick={onClick}
      className={`${cardBg} border border-current/10 rounded-2xl p-4 shadow-sm cursor-pointer
        active:scale-95 transition-all duration-150 space-y-2.5 animate-fade-slide-up`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold tracking-tight leading-tight flex-1 min-w-0 truncate">
          {note.title || "Untitled"}
        </h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onPin(note.id); }}
            className={`text-sm transition-all active:scale-90 ${note.pinned ? "text-blue-500" : "opacity-40 hover:opacity-80"}`}
            title="Pin"
          >📌</button>
          <button
            onClick={(e) => { e.stopPropagation(); onFavorite(note.id); }}
            className={`text-sm transition-all active:scale-90 ${note.favorite ? "text-yellow-500" : "opacity-40 hover:opacity-80"}`}
            title="Favorite"
          >⭐</button>
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <p className="text-xs leading-relaxed opacity-70 line-clamp-3">{preview}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
          {note.category}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] opacity-40">
            {new Date(note.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="text-xs opacity-30 hover:opacity-80 hover:text-red-500 transition-all active:scale-90"
            title="Delete"
          >🗑</button>
        </div>
      </div>
    </div>
  );
}
