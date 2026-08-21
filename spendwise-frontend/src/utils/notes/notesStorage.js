// src/utils/notes/notesStorage.js
// All localStorage read/write for the Notes module.

const NOTES_KEY = "spendwise-notes";
const TRASH_KEY = "spendwise-notes-trash";

function genId() {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// ── Notes ─────────────────────────────────────────────────────────────────────
export function loadNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function saveNote(note) {
  const notes = loadNotes();
  const idx   = notes.findIndex((n) => n.id === note.id);
  const saved = { ...note, updatedAt: new Date().toISOString() };
  if (idx >= 0) notes[idx] = saved;
  else notes.unshift(saved);
  saveNotes(notes);
  return saved;
}

export function deleteNote(id) {
  // Move to trash
  const notes = loadNotes();
  const note  = notes.find((n) => n.id === id);
  if (!note) return;
  const trash = loadTrash();
  trash.unshift({ ...note, trashedAt: new Date().toISOString() });
  saveTrash(trash);
  saveNotes(notes.filter((n) => n.id !== id));
}

export function createNote(overrides = {}) {
  return {
    id:        genId(),
    title:     "",
    content:   "",
    category:  "Personal",
    color:     "white",
    pinned:    false,
    favorite:  false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ── Trash ─────────────────────────────────────────────────────────────────────
export function loadTrash() {
  try {
    const raw = localStorage.getItem(TRASH_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveTrash(trash) {
  localStorage.setItem(TRASH_KEY, JSON.stringify(trash));
}

export function restoreNote(id) {
  const trash   = loadTrash();
  const note    = trash.find((n) => n.id === id);
  if (!note) return;
  saveNote({ ...note, trashedAt: undefined });
  saveTrash(trash.filter((n) => n.id !== id));
}

export function deletePermanently(id) {
  saveTrash(loadTrash().filter((n) => n.id !== id));
}
