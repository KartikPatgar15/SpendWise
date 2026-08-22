// src/pages/Splitter.jsx
// Split Expense module orchestrator with ThemeSelector, Branding, and single ConfirmModal.

import { useState, useCallback } from "react";
import { useTheme } from "../hooks/useTheme";
import { loadEvents, saveEvent, deleteEvent } from "../utils/split/storage";
import EventHome      from "../components/splitExpense/EventHome";
import ParticipantForm from "../components/splitExpense/ParticipantForm";
import ExpenseForm    from "../components/splitExpense/ExpenseForm";
import ReportTabs     from "../components/splitExpense/ReportTabs";
import ThemeSelector  from "../components/ui/ThemeSelector";
import ConfirmModal   from "../components/ui/ConfirmModal";
import Logo           from "../components/ui/Logo";

// Screens
const SCREEN = {
  HOME:         "home",
  PARTICIPANTS: "participants",
  EXPENSE:      "expense",
  REPORT:       "report",
};

export default function Splitter() {
  const { theme, setTheme, tokens: t } = useTheme();

  const [events, setEvents]           = useState(() => loadEvents());
  const [screen, setScreen]           = useState(SCREEN.HOME);
  const [activeEvent, setActiveEvent] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  // Single Delete Confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

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

  const promptDeleteEvent = (id, name = "this event") => {
    setDeleteConfirm({
      isOpen: true,
      title: "Delete Event",
      message: `Are you sure you want to delete "${name}" and all of its recorded expenses? This cannot be undone.`,
      onConfirm: () => {
        deleteEvent(id);
        refreshEvents();
        setScreen(SCREEN.HOME);
        setActiveEvent(null);
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
      },
    });
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

  const promptDeleteExpense = (id, name = "this expense") => {
    setDeleteConfirm({
      isOpen: true,
      title: "Delete Split Expense",
      message: `Are you sure you want to delete "${name}" from this event?`,
      onConfirm: () => {
        if (!activeEvent) return;
        const updated = activeEvent.expenses.filter((e) => e.id !== id);
        persistEvent({ ...activeEvent, expenses: updated });
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setScreen(SCREEN.EXPENSE);
  };

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} px-4 sm:px-6 lg:px-8 pt-6 pb-28 max-w-6xl mx-auto w-full transition-colors`}>
      {/* Top Header with Brand & Theme Selector */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5 dark:border-white/5 animate-fade-slide-up">
        <Logo variant="auto" size="md" />
        <div className="flex items-center gap-2">
          <ThemeSelector theme={theme} setTheme={setTheme} />
        </div>
      </div>

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.title}
        message={deleteConfirm.message}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteConfirm.onConfirm}
        onCancel={() => setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))}
        danger={true}
      />

      {screen === SCREEN.HOME && (
        <EventHome
          events={events}
          onOpenEvent={handleOpenEvent}
          onDeleteEvent={(id, name) => promptDeleteEvent(id, name)}
          tokens={t}
        />
      )}

      {screen === SCREEN.PARTICIPANTS && activeEvent && (
        <ParticipantForm
          event={activeEvent}
          onUpdate={handleUpdateEvent}
          onConfirm={handleConfirmParticipants}
          onBack={() => setScreen(SCREEN.HOME)}
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
          onDeleteExpense={(id, name) => promptDeleteExpense(id, name)}
          onDeleteEvent={() => promptDeleteEvent(activeEvent.id, activeEvent.eventName)}
          onBack={() => setScreen(SCREEN.HOME)}
          tokens={t}
        />
      )}
    </div>
  );
}
