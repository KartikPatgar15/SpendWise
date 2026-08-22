// src/components/notes/TrashView.jsx
// Displays trashed notes with restore and permanent delete actions using Lucide icons.

import { Trash2, RotateCcw, ArrowLeft } from "lucide-react";

export default function TrashView({ trash, onRestore, onDeleteForever, onBack, tokens }) {
  const t = tokens;

  return (
    <div className="space-y-4 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-extrabold ${t.text}`}>Trash</h2>
          <p className={`text-xs mt-0.5 ${t.muted}`}>{trash.length} deleted note{trash.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={onBack} className={`text-sm font-medium ${t.btn.ghost} flex items-center gap-1`}>
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
      </div>

      {trash.length === 0 ? (
        <div className={`text-center py-16 ${t.muted} space-y-2`}>
          <div className="w-14 h-14 mx-auto mb-1 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-2xl">
            <Trash2 size={28} className={t.muted} />
          </div>
          <p className="text-sm font-bold">Trash is empty</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trash.map((note, i) => (
            <div key={note.id}
              className={`${t.card} ${t.border} border rounded-2xl p-4 space-y-2 animate-fade-slide-up-${Math.min(i + 1, 5)}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${t.text}`}>{note.title || "Untitled"}</p>
                  <p className={`text-xs mt-0.5 ${t.muted}`}>{note.category}</p>
                  <p className={`text-xs mt-0.5 ${t.muted}`}>
                    Deleted {new Date(note.trashedAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onRestore(note.id)}
                  className={`${t.btn.success} px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center gap-1`}>
                  <RotateCcw size={12} />
                  <span>Restore</span>
                </button>
                <button onClick={() => onDeleteForever(note.id, note.title || "Untitled Note")}
                  className={`${t.btn.danger} px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center gap-1`}>
                  <Trash2 size={12} />
                  <span>Delete Forever</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
