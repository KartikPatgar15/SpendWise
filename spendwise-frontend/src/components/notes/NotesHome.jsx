// src/components/notes/NotesHome.jsx
// Notes dashboard: search, filter, pinned section, notes grid.

import NoteCard       from "./NoteCard";
import SearchBar      from "./SearchBar";
import CategoryFilter from "./CategoryFilter";

function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function NotesHome({
  notes, onOpenNote, onNewNote, onPin, onFavorite, onDelete, onTrash, tokens, isDark,
}) {
  const t = tokens;

  const [search, setSearch]     = [notes._search, notes._setSearch];
  const [category, setCategory] = [notes._category, notes._setCategory];
  const filtered                = notes._filtered;
  const pinned                  = filtered.filter((n) => n.pinned);
  const unpinned                = filtered.filter((n) => !n.pinned);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-slide-up">
        <div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${t.text}`}>Notes</h1>
          <p className={`text-xs mt-0.5 ${t.muted}`}>{notes._all.length} note{notes._all.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onTrash} className={`${t.btn.secondary} px-3 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all`}>
            🗑 Trash
          </button>
          <button onClick={onNewNote} className={`${t.btn.primary} px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-all`}>
            + New
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="animate-fade-slide-up-1">
        <SearchBar value={search} onChange={setSearch} tokens={t} />
      </div>

      {/* Category filter */}
      <div className="animate-fade-slide-up-2">
        <CategoryFilter active={category} onChange={setCategory} tokens={t} />
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className={`text-center py-16 ${t.muted} animate-fade-in`}>
          <p className="text-4xl mb-3">📝</p>
          <p className="text-sm font-medium">
            {search ? "No notes match your search" : "No notes yet — create one!"}
          </p>
        </div>
      )}

      {/* Pinned */}
      {pinned.length > 0 && (
        <div className="space-y-2 animate-fade-slide-up-3">
          <p className={`text-[10px] font-bold uppercase tracking-widest ${t.muted}`}>📌 Pinned</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pinned.map((note) => (
              <NoteCard key={note.id} note={note} isDark={isDark}
                onClick={() => onOpenNote(note)}
                onPin={onPin} onFavorite={onFavorite} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}

      {/* All / unpinned */}
      {unpinned.length > 0 && (
        <div className="space-y-2 animate-fade-slide-up-4">
          {pinned.length > 0 && (
            <p className={`text-[10px] font-bold uppercase tracking-widest ${t.muted}`}>Other Notes</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unpinned.map((note) => (
              <NoteCard key={note.id} note={note} isDark={isDark}
                onClick={() => onOpenNote(note)}
                onPin={onPin} onFavorite={onFavorite} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
