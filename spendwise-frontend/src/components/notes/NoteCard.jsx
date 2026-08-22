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
      className={`${cardBg} border border-current/10 rounded-2xl p-4 shadow-xs cursor-pointer
        active:scale-98 transition-all duration-200 hover:shadow-md space-y-2.5 animate-fade-slide-up`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-extrabold tracking-tight leading-tight flex-1 min-w-0 truncate">
          {note.title || "Untitled Note"}
        </h3>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onPin(note.id); }}
            className={`text-xs p-1 rounded-lg transition-all active:scale-90 ${note.pinned ? "text-[#52796F] bg-[#52796F]/15" : "opacity-40 hover:opacity-100"}`}
            title="Pin note"
          >📌</button>
          <button
            onClick={(e) => { e.stopPropagation(); onFavorite(note.id); }}
            className={`text-xs p-1 rounded-lg transition-all active:scale-90 ${note.favorite ? "text-[#D88C9A] bg-[#D88C9A]/20" : "opacity-40 hover:opacity-100"}`}
            title="Favorite"
          >⭐</button>
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <p className="text-xs leading-relaxed opacity-75 line-clamp-3 font-medium">{preview}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-current/5">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-current/5 opacity-80">
          {note.category}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] opacity-50 tabular-nums font-medium">
            {new Date(note.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="text-xs opacity-40 hover:opacity-100 hover:text-[#E07A5F] transition-all active:scale-90 p-0.5"
            title="Delete"
          >🗑</button>
        </div>
      </div>
    </div>
  );
}
