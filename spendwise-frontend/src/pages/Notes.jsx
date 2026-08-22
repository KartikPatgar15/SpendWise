// src/pages/Notes.jsx
// Notes module orchestrator — Home, Editor, Trash screens.
// Does NOT modify any other existing page or component.

import { useState, useMemo } from "react";
import { useTheme } from "../hooks/useTheme";
import {
  loadNotes, saveNote, deleteNote, createNote,
  loadTrash, restoreNote, deletePermanently,
} from "../utils/notes/notesStorage";
import NotesHome   from "../components/notes/NotesHome";
import NoteEditor  from "../components/notes/NoteEditor";
import TrashView   from "../components/notes/TrashView";

const SCREEN = { HOME: "home", EDITOR: "editor", TRASH: "trash" };

export default function Notes() {
  const { tokens: t, theme } = useTheme();
  const isDark = theme === "dark" || theme === "grey";

  const [screen, setScreen]         = useState(SCREEN.HOME);
  const [activeNote, setActiveNote] = useState(null);
  const [notes, setNotes]           = useState(() => loadNotes());
  const [trash, setTrash]           = useState(() => loadTrash());
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");

  // ── Derived filtered notes ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = notes;

    if (category === "⭐ Favorites") {
      list = list.filter((n) => n.favorite);
    } else if (category !== "All") {
      list = list.filter((n) => n.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          (n.title || "").toLowerCase().includes(q) ||
          (n.content || "").toLowerCase().includes(q) ||
          (n.category || "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [notes, category, search]);

  // ── Refresh helpers ───────────────────────────────────────────────────────
  const refreshNotes = () => setNotes(loadNotes());
  const refreshTrash = () => setTrash(loadTrash());

  // ── Note actions ──────────────────────────────────────────────────────────
  const handleNewNote = () => {
    const note = createNote();
    saveNote(note);
    setActiveNote(note);
    refreshNotes();
    setScreen(SCREEN.EDITOR);
  };

  const handleOpenNote = (note) => {
    setActiveNote(note);
    setScreen(SCREEN.EDITOR);
  };

  const handleSaveNote = (note) => {
    saveNote(note);
    setActiveNote(note);
    refreshNotes();
  };

  const handleDelete = (id) => {
    deleteNote(id);
    refreshNotes();
    refreshTrash();
    if (activeNote?.id === id) setScreen(SCREEN.HOME);
  };

  const handlePin = (id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    saveNote({ ...note, pinned: !note.pinned });
    refreshNotes();
  };

  const handleFavorite = (id) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    saveNote({ ...note, favorite: !note.favorite });
    refreshNotes();
  };

  // ── Trash actions ─────────────────────────────────────────────────────────
  const handleRestore = (id) => {
    restoreNote(id);
    refreshNotes();
    refreshTrash();
  };

  const handleDeleteForever = (id) => {
    if (!window.confirm("Delete this note forever? This cannot be undone.")) return;
    deletePermanently(id);
    refreshTrash();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${t.bg} ${t.text} transition-colors`}>
      {screen === SCREEN.EDITOR && activeNote ? (
        <NoteEditor
          note={activeNote}
          onSave={handleSaveNote}
          onBack={() => { refreshNotes(); setScreen(SCREEN.HOME); }}
          tokens={t}
          isDark={isDark}
        />
      ) : screen === SCREEN.TRASH ? (
        <div className={`px-4 sm:px-6 lg:px-8 pt-6 pb-28 max-w-6xl mx-auto w-full animate-fade-in`}>
          <TrashView
            trash={trash}
            onRestore={handleRestore}
            onDeleteForever={handleDeleteForever}
            onBack={() => setScreen(SCREEN.HOME)}
            tokens={t}
          />
        </div>
      ) : (
        <div className={`px-4 sm:px-6 lg:px-8 pt-6 pb-28 max-w-6xl mx-auto w-full animate-fade-in`}>
          <NotesHome
            notes={{
              _all:         notes,
              _filtered:    filtered,
              _search:      search,
              _setSearch:   setSearch,
              _category:    category,
              _setCategory: setCategory,
            }}
            onOpenNote={handleOpenNote}
            onNewNote={handleNewNote}
            onPin={handlePin}
            onFavorite={handleFavorite}
            onDelete={handleDelete}
            onTrash={() => { refreshTrash(); setScreen(SCREEN.TRASH); }}
            tokens={t}
            isDark={isDark}
          />
        </div>
      )}
    </div>
  );
}
