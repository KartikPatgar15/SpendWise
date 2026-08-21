// src/components/notes/TrashView.jsx

export default function TrashView({ trash, onRestore, onDeleteForever, onBack, tokens }) {
  const t = tokens;

  return (
    <div className="space-y-4 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-extrabold ${t.text}`}>🗑 Trash</h2>
          <p className={`text-xs mt-0.5 ${t.muted}`}>{trash.length} deleted note{trash.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={onBack} className={`text-sm font-medium ${t.btn.ghost}`}>← Back</button>
      </div>

      {trash.length === 0 ? (
        <div className={`text-center py-16 ${t.muted}`}>
          <p className="text-4xl mb-3">🗑</p>
          <p className="text-sm">Trash is empty</p>
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
                  className={`${t.btn.success} px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all`}>
                  Restore
                </button>
                <button onClick={() => onDeleteForever(note.id)}
                  className={`${t.btn.danger} px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all`}>
                  Delete Forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
