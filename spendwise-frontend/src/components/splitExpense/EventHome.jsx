// src/components/splitExpense/EventHome.jsx
// Event dashboard — list existing events, create new.

import { useState } from "react";
import { generateId, saveEvent } from "../../utils/split/storage";
import { validateEvent } from "../../utils/split/validation";

export default function EventHome({ events, onOpenEvent, onDeleteEvent, tokens }) {
  const t = tokens;
  const [newName, setNewName] = useState("");
  const [error, setError]     = useState("");

  const handleCreate = () => {
    const result = validateEvent(newName);
    if (!result.valid) { setError(result.error); return; }

    const event = {
      id:          generateId("evt"),
      eventName:   newName.trim(),
      createdAt:   new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
      participants: [],
      expenses:    [],
    };
    saveEvent(event);
    setNewName("");
    setError("");
    onOpenEvent(event);
  };

  return (
    <div className="space-y-5 animate-fade-slide-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg shadow-md shadow-blue-500/20">
          ✂️
        </div>
        <div>
          <h1 className={`text-xl font-black tracking-tight ${t.text}`}>Split Expense</h1>
          <p className={`text-xs font-medium ${t.muted}`}>Split bills with friends — offline & private</p>
        </div>
      </div>

      {/* Create new event */}
      <div className={`${t.card} ${t.border} border rounded-2xl p-5 space-y-3.5 shadow-xs`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-xs font-extrabold uppercase tracking-wider ${t.text}`}>Create New Event</h2>
          <span className="text-[11px] font-semibold text-blue-500">Trip / Group</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Goa Trip, Team Dinner, Flat Rent…"
            value={newName}
            onChange={(e) => { setNewName(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className={`border rounded-xl px-3.5 py-2.5 text-xs font-medium flex-1 focus:outline-none transition-all duration-150 ${t.input}`}
          />
          <button
            onClick={handleCreate}
            className={`${t.btn.primary} px-4 py-2.5 rounded-xl text-xs font-extrabold shrink-0 active:scale-95 transition-all`}
          >
            + Create
          </button>
        </div>
        {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}
      </div>

      {/* Previous events */}
      {events.length === 0 ? (
        <div className={`text-center py-16 ${t.muted} animate-fade-in`}>
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-2xl">🧾</div>
          <p className="text-sm font-bold">No split events yet</p>
          <p className="text-xs mt-1">Create one above to start adding expenses and splitting</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Previous Events ({events.length})</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {events.map((event, i) => (
              <div
                key={event.id}
                className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-4.5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between animate-fade-slide-up-${Math.min(i + 1, 5)}`}
              >
                <div className="space-y-2 mb-3">
                  <p className={`text-sm sm:text-base font-black truncate ${t.text}`}>{event.eventName}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                      👥 {event.participants.length} people
                    </span>
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                      🧾 {event.expenses.length} bills
                    </span>
                    <span className={`text-[10px] tabular-nums font-medium ${t.muted}`}>
                      {new Date(event.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 justify-end pt-2 border-t border-black/5 dark:border-white/5">
                  <button
                    onClick={() => onOpenEvent(event)}
                    className={`${t.btn.primary} px-3.5 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className={`${t.btn.danger} px-3.5 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
