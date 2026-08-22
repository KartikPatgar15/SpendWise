// src/components/splitExpense/ParticipantForm.jsx
// Add/remove participants with Lucide icons.

import { useState } from "react";
import { generateId } from "../../utils/split/storage";
import { validateParticipants, validateParticipantName } from "../../utils/split/validation";
import { Lock, Plus, X, ArrowRight, ArrowLeft } from "lucide-react";

export default function ParticipantForm({ event, onUpdate, onConfirm, onBack, tokens }) {
  const t = tokens;
  const [newName, setNewName] = useState("");
  const [error, setError]     = useState("");

  const participants = event.participants;
  const locked       = event.expenses.length > 0;

  const handleAdd = () => {
    const result = validateParticipantName(newName, participants);
    if (!result.valid) { setError(result.error); return; }
    const updated = [...participants, { id: generateId("p"), name: newName.trim() }];
    onUpdate({ ...event, participants: updated });
    setNewName("");
    setError("");
  };

  const handleRemove = (id) => {
    if (locked) return;
    onUpdate({ ...event, participants: participants.filter((p) => p.id !== id) });
  };

  const handleConfirm = () => {
    const result = validateParticipants(participants);
    if (!result.valid) { setError(result.error); return; }
    onConfirm();
  };

  return (
    <div className="space-y-5 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-black tracking-tight ${t.text}`}>{event.eventName}</h2>
          <p className={`text-xs font-medium mt-0.5 ${t.muted}`}>Add at least 2 participants to split expenses</p>
        </div>
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className={`px-2.5 py-1 rounded-lg text-xs font-bold ${t.btn.ghost} hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1`}>
              <ArrowLeft size={13} />
              <span>Back</span>
            </button>
          )}
          {locked && (
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Lock size={11} />
              <span>Locked</span>
            </span>
          )}
        </div>
      </div>

      {!locked && (
        <div className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs`}>
          <p className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Add Person</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Alice, Bob, Charlie…"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className={`border rounded-xl px-3.5 py-2.5 text-xs font-medium flex-1 focus:outline-none transition-all duration-150 ${t.input}`}
            />
            <button onClick={handleAdd}
              className={`${t.btn.primary} px-4 py-2.5 rounded-xl text-xs font-extrabold shrink-0 active:scale-95 transition-all flex items-center gap-1`}>
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>
          {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}
        </div>
      )}

      {/* Participant list */}
      <div className="space-y-2">
        <p className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>
          Group Members ({participants.length})
        </p>
        {participants.length === 0 ? (
          <div className={`text-center py-10 rounded-2xl border border-dashed ${t.border} ${t.muted}`}>
            <p className="text-xs font-semibold">No participants added yet</p>
            <p className="text-[11px] opacity-75 mt-0.5">Type a name above and tap Add</p>
          </div>
        ) : (
          participants.map((p, i) => (
            <div key={p.id}
              className={`${t.card} ${t.border} border rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xs transition-all duration-200 hover:shadow-xs animate-fade-slide-up-${Math.min(i + 1, 5)}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-xs shadow-blue-500/20">
                  {p.name[0].toUpperCase()}
                </div>
                <span className={`text-sm font-bold ${t.text}`}>{p.name}</span>
              </div>
              {!locked && (
                <button onClick={() => handleRemove(p.id)}
                  title="Remove person"
                  className={`w-7 h-7 rounded-lg flex items-center justify-center opacity-70 hover:opacity-100 active:scale-90 transition-all ${t.btn.danger}`}>
                  <X size={13} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleConfirm}
        disabled={participants.length < 2}
        className={`${t.btn.primary} w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-sm active:scale-98 transition-all flex items-center justify-center gap-1.5 ${participants.length < 2 ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span>Continue to Add Expenses</span>
        <ArrowRight size={14} />
      </button>

      {locked && (
        <p className={`text-xs text-center font-medium ${t.muted}`}>
          Participant list is locked because expenses have already been recorded for this event.
        </p>
      )}
    </div>
  );
}
