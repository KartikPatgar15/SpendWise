// src/components/notes/NotesHome.jsx
// Notes dashboard: search, filter, pinned section, notes grid with Lucide icons.

import NoteCard       from "./NoteCard";
import SearchBar      from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import { NotebookPen, Trash2, Plus, Pin } from "lucide-react";

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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-lg shadow-md shadow-amber-500/20">
            <NotebookPen size={20} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className={`text-xl font-black tracking-tight ${t.text}`}>Smart Notes</h1>
            <p className={`text-xs font-medium ${t.muted}`}>{notes._all.length} note{notes._all.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onTrash} className={`${t.btn.secondary} px-3 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all shadow-2xs flex items-center gap-1.5`}>
            <Trash2 size={13} />
            <span>Trash</span>
          </button>
          <button onClick={onNewNote} className={`${t.btn.primary} px-3.5 py-2 rounded-xl text-xs font-extrabold active:scale-95 transition-all shadow-xs flex items-center gap-1.5`}>
            <Plus size={14} />
            <span>New Note</span>
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
        <div className={`text-center py-16 ${t.muted} animate-fade-in space-y-2`}>
          <div className="w-14 h-14 mx-auto mb-1 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
            <NotebookPen size={28} className={t.muted} />
          </div>
          <p className="text-sm font-bold">
            {search ? "No notes match your search" : "No notes yet"}
          </p>
          <p className="text-xs opacity-75">Create one above to capture ideas or calculate bills</p>
        </div>
      )}

      {/* Pinned */}
      {pinned.length > 0 && (
        <div className="space-y-2.5 animate-fade-slide-up-3">
          <p className={`text-[11px] font-bold uppercase tracking-wider ${t.muted} flex items-center gap-1`}>
            <Pin size={12} />
            <span>Pinned</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
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
        <div className="space-y-2.5 animate-fade-slide-up-4">
          {pinned.length > 0 && (
            <p className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Other Notes</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
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
