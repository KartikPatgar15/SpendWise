// src/components/splitExpense/ReportTabs.jsx
// 4-tab report: Expenses, Settlement, Matrix, Summary.

import { useState } from "react";
import ExpenseList    from "./ExpenseList";
import SettlementView from "./SettlementView";
import MatrixView     from "./MatrixView";
import SummaryView    from "./SummaryView";
import { generateSettlement } from "../../utils/split/calculateSettlement";
import { calculateMatrix }    from "../../utils/split/calculateMatrix";
import { calculateSummary }   from "../../utils/split/calculateSummary";
import { generateSplitPDF }   from "../../utils/split/generatePdf";

const TABS = ["Expenses", "Settlement", "Matrix", "Summary"];

export default function ReportTabs({ event, onAddExpense, onEditExpense, onDeleteExpense, onDeleteEvent, onBack, tokens }) {
  const t = tokens;
  const [activeTab, setActiveTab] = useState("Settlement");

  // Recalculate every render — never stored
  const { balances, settlements } = generateSettlement(event);
  const matrix  = calculateMatrix(settlements, event.participants);
  const summary = calculateSummary(event);

  const handleDownloadPDF = () => {
    generateSplitPDF({ event, settlements, matrix, summary });
  };

  const handleDeleteExpense = (id) => {
    if (!window.confirm("Delete this expense?")) return;
    onDeleteExpense(id);
  };

  const handleDeleteEvent = () => {
    if (!window.confirm(`Delete "${event.eventName}" and all its data? This cannot be undone.`)) return;
    onDeleteEvent(event.id);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="animate-fade-slide-up">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className={`text-xl font-extrabold tracking-tight ${t.text}`}>{event.eventName}</h2>
            <p className={`text-xs mt-0.5 ${t.muted}`}>
              {event.participants.length} participants · {event.expenses.length} expenses
            </p>
          </div>
          <button onClick={onBack} className={`text-sm font-medium shrink-0 ${t.btn.ghost}`}>← Home</button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap animate-fade-slide-up-1">
        <button onClick={onAddExpense}
          className={`${t.btn.primary} px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all`}>
          + Add Expense
        </button>
        <button onClick={handleDownloadPDF}
          className={`${t.btn.success} px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all`}>
          ⬇ PDF
        </button>
        <button onClick={handleDeleteEvent}
          className={`${t.btn.danger} px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all`}>
          Delete Event
        </button>
      </div>

      {/* Tab switcher */}
      <div className={`grid grid-cols-4 rounded-2xl overflow-hidden border ${t.border} animate-fade-slide-up-2`}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`py-2.5 text-xs font-bold transition-colors ${activeTab === tab ? t.btn.primary : t.btn.secondary}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === "Expenses" && (
          <ExpenseList
            expenses={event.expenses}
            participants={event.participants}
            onEdit={onEditExpense}
            onDelete={handleDeleteExpense}
            tokens={t}
          />
        )}
        {activeTab === "Settlement" && (
          <SettlementView
            settlements={settlements}
            participants={event.participants}
            tokens={t}
          />
        )}
        {activeTab === "Matrix" && (
          <MatrixView
            matrix={matrix}
            participants={event.participants}
            tokens={t}
          />
        )}
        {activeTab === "Summary" && (
          <SummaryView
            summary={summary}
            participants={event.participants}
            tokens={t}
          />
        )}
      </div>
    </div>
  );
}
