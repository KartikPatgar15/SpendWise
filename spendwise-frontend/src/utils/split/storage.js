// src/utils/split/storage.js
// All localStorage read/write for the Split Expense module, scoped per authenticated user.

function getUsername() {
  try {
    const raw = localStorage.getItem("spendwise_user");
    if (raw) {
      const u = JSON.parse(raw);
      if (u && u.username) return u.username;
    }
  } catch {}
  return "demo";
}

function getStorageKey() {
  return `split-expense-events_${getUsername()}`;
}

export function loadEvents() {
  try {
    const key = getStorageKey();
    let raw = localStorage.getItem(key);
    // Legacy fallback for demo user
    if (!raw && getUsername() === "demo") {
      raw = localStorage.getItem("split-expense-events");
    }
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEvents(events) {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(events));
  } catch {
    console.error("Failed to save events to localStorage");
  }
}

export function loadEvent(id) {
  return loadEvents().find((e) => e.id === id) || null;
}

export function saveEvent(event) {
  const events = loadEvents();
  const idx = events.findIndex((e) => e.id === event.id);
  const updated = { ...event, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    events[idx] = updated;
  } else {
    events.push(updated);
  }
  saveEvents(events);
  return updated;
}

export function deleteEvent(id) {
  const events = loadEvents().filter((e) => e.id !== id);
  saveEvents(events);
}

export function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
