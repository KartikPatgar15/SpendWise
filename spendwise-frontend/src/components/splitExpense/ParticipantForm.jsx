// src/components/splitExpense/ParticipantForm.jsx
// Add/remove participants before any expense is added.

import { useState } from "react";
import { generateId } from "../../utils/split/storage";
import { validateParticipants, validateParticipantName } from "../../utils/split/validation";

export default function ParticipantForm({ event, onUpdate, onConfirm, tokens }) {
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
          <h2 className={`text-xl font-extrabold ${t.text}`}>{event.eventName}</h2>
          <p className={`text-xs mt-0.5 ${t.muted}`}>Add participants</p>
        </div>
        {locked && (
          <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500">
            Locked
          </span>
        )}
      </div>

      {!locked && (
        <div className={`${t.card} ${t.border} border rounded-2xl p-4 space-y-3`}>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Participant name…"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className={`border rounded-xl px-3 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${t.input}`}
            />
            <button onClick={handleAdd}
              className={`${t.btn.primary} px-4 py-2.5 rounded-xl text-sm font-bold shrink-0 active:scale-95 transition-all`}>
              Add
            </button>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}

      {/* Participant list */}
      <div className="space-y-2">
        {participants.length === 0 ? (
          <p className={`text-sm text-center py-8 ${t.muted}`}>No participants yet — add at least 2</p>
        ) : (
          participants.map((p, i) => (
            <div key={p.id}
              className={`${t.card} ${t.border} border rounded-xl px-4 py-3 flex items-center justify-between animate-fade-slide-up-${Math.min(i + 1, 5)}`}>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {p.name[0].toUpperCase()}
                </div>
                <span className={`text-sm font-medium ${t.text}`}>{p.name}</span>
              </div>
              {!locked && (
                <button onClick={() => handleRemove(p.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold active:scale-95 ${t.btn.danger}`}>
                  ✕
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleConfirm}
        disabled={participants.length < 2}
        className={`${t.btn.primary} w-full py-3.5 rounded-xl font-bold text-sm active:scale-95 transition-all ${participants.length < 2 ? "opacity-50" : ""}`}
      >
        Confirm Participants →
      </button>

      {locked && (
        <p className={`text-xs text-center ${t.muted}`}>
          Participants are locked once expenses exist
        </p>
      )}
    </div>
  );
}
