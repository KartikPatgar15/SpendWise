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
      <div>
        <h1 className={`text-2xl font-extrabold tracking-tight ${t.text}`}>Split Expense</h1>
        <p className={`text-xs mt-0.5 ${t.muted}`}>Split bills with friends — offline & private</p>
      </div>

      {/* Create new event */}
      <div className={`${t.card} ${t.border} border rounded-2xl p-4 space-y-3`}>
        <h2 className={`text-sm font-bold ${t.text}`}>New Event</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Goa Trip, Dinner, House Rent…"
            value={newName}
            onChange={(e) => { setNewName(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className={`border rounded-xl px-3 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${t.input}`}
          />
          <button
            onClick={handleCreate}
            className={`${t.btn.primary} px-4 py-2.5 rounded-xl text-sm font-bold shrink-0 active:scale-95 transition-all`}
          >
            Create
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* Previous events */}
      {events.length === 0 ? (
        <div className={`text-center py-16 ${t.muted} animate-fade-in`}>
          <p className="text-4xl mb-3">🧾</p>
          <p className="text-sm font-medium">No events yet</p>
          <p className="text-xs mt-1">Create one above to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className={`text-xs font-semibold uppercase tracking-widest ${t.muted}`}>Previous Events</p>
          {events.map((event, i) => (
            <div
              key={event.id}
              className={`${t.card} ${t.border} border rounded-2xl p-4 shadow-sm animate-fade-slide-up-${Math.min(i + 1, 5)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${t.text}`}>{event.eventName}</p>
                  <p className={`text-xs mt-0.5 ${t.muted}`}>
                    {event.participants.length} participant{event.participants.length !== 1 ? "s" : ""} ·{" "}
                    {event.expenses.length} expense{event.expenses.length !== 1 ? "s" : ""}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${t.muted}`}>
                    {new Date(event.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => onOpenEvent(event)}
                    className={`${t.btn.primary} px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className={`${t.btn.danger} px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
