// src/pages/Splitter.jsx
// Split Expense module orchestrator.
// Manages screen flow: Home → Participants → ExpenseForm → Report
// Does NOT modify any other existing page.

import { useState, useCallback } from "react";
import { useTheme } from "../hooks/useTheme";
import { loadEvents, saveEvent, deleteEvent } from "../utils/split/storage";
import EventHome      from "../components/splitExpense/EventHome";
import ParticipantForm from "../components/splitExpense/ParticipantForm";
import ExpenseForm    from "../components/splitExpense/ExpenseForm";
import ReportTabs     from "../components/splitExpense/ReportTabs";

// Screens
const SCREEN = {
  HOME:         "home",
  PARTICIPANTS: "participants",
  EXPENSE:      "expense",
  REPORT:       "report",
};

export default function Splitter() {
  const { tokens: t } = useTheme();

  const [events, setEvents]           = useState(() => loadEvents());
  const [screen, setScreen]           = useState(SCREEN.HOME);
  const [activeEvent, setActiveEvent] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const refreshEvents = useCallback(() => setEvents(loadEvents()), []);

  const persistEvent = useCallback((event) => {
    const saved = saveEvent(event);
    setActiveEvent(saved);
    refreshEvents();
    return saved;
  }, [refreshEvents]);

  // ── Event actions ─────────────────────────────────────────────────────────
  const handleOpenEvent = (event) => {
    setActiveEvent(event);
    if (event.expenses.length > 0) {
      setScreen(SCREEN.REPORT);
    } else if (event.participants.length >= 2) {
      setScreen(SCREEN.EXPENSE);
    } else {
      setScreen(SCREEN.PARTICIPANTS);
    }
  };

  const handleDeleteEvent = (id) => {
    deleteEvent(id);
    refreshEvents();
    setScreen(SCREEN.HOME);
    setActiveEvent(null);
  };

  // ── Participant actions ───────────────────────────────────────────────────
  const handleUpdateEvent = (event) => {
    persistEvent(event);
  };

  const handleConfirmParticipants = () => {
    setScreen(SCREEN.EXPENSE);
  };

  // ── Expense actions ───────────────────────────────────────────────────────
  const handleSaveExpense = (expense, addNext) => {
    const expenses = activeEvent.expenses;
    const idx      = expenses.findIndex((e) => e.id === expense.id);
    let updated;

    if (idx >= 0) {
      updated = expenses.map((e) => (e.id === expense.id ? expense : e));
    } else {
      updated = [...expenses, expense];
    }

    const saved = persistEvent({ ...activeEvent, expenses: updated });

    if (addNext) {
      setEditingExpense(null);
      setScreen(SCREEN.EXPENSE);
    } else {
      setEditingExpense(null);
      setScreen(SCREEN.REPORT);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setScreen(SCREEN.EXPENSE);
  };

  const handleDeleteExpense = (id) => {
    const updated = activeEvent.expenses.filter((e) => e.id !== id);
    persistEvent({ ...activeEvent, expenses: updated });
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setScreen(SCREEN.EXPENSE);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${t.bg} ${t.text} px-4 pt-5 pb-28`}>
      {screen === SCREEN.HOME && (
        <EventHome
          events={events}
          onOpenEvent={handleOpenEvent}
          onDeleteEvent={handleDeleteEvent}
          tokens={t}
        />
      )}

      {screen === SCREEN.PARTICIPANTS && activeEvent && (
        <ParticipantForm
          event={activeEvent}
          onUpdate={handleUpdateEvent}
          onConfirm={handleConfirmParticipants}
          tokens={t}
        />
      )}

      {screen === SCREEN.EXPENSE && activeEvent && (
        <ExpenseForm
          event={activeEvent}
          editingExpense={editingExpense}
          onSave={handleSaveExpense}
          onBack={() => {
            setEditingExpense(null);
            setScreen(activeEvent.expenses.length > 0 ? SCREEN.REPORT : SCREEN.PARTICIPANTS);
          }}
          tokens={t}
        />
      )}

      {screen === SCREEN.REPORT && activeEvent && (
        <ReportTabs
          event={activeEvent}
          onAddExpense={handleAddExpense}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
          onDeleteEvent={handleDeleteEvent}
          onBack={() => setScreen(SCREEN.HOME)}
          tokens={t}
        />
      )}
    </div>
  );
}
