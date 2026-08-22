// src/components/splitExpense/ReportTabs.jsx
// 4-tab report: Expenses, Settlement, Matrix, Summary with Lucide icons.

import { useState } from "react";
import ExpenseList    from "./ExpenseList";
import SettlementView from "./SettlementView";
import MatrixView     from "./MatrixView";
import SummaryView    from "./SummaryView";
import { generateSettlement } from "../../utils/split/calculateSettlement";
import { calculateMatrix }    from "../../utils/split/calculateMatrix";
import { calculateSummary }   from "../../utils/split/calculateSummary";
import { generateSplitPDF }   from "../../utils/split/generatePdf";
import { Plus, FileText, Trash2, ArrowLeft } from "lucide-react";

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

  return (
    <div className="space-y-4 animate-fade-slide-up">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className={`text-xl font-black tracking-tight ${t.text}`}>{event.eventName}</h2>
            <p className={`text-xs font-medium mt-0.5 ${t.muted}`}>
              {event.participants.length} participants · {event.expenses.length} expenses
            </p>
          </div>
          <button onClick={onBack} className={`px-2.5 py-1 rounded-lg text-xs font-bold ${t.btn.ghost} hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1`}>
            <ArrowLeft size={13} />
            <span>All Events</span>
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap animate-fade-slide-up-1">
        <button onClick={onAddExpense}
          className={`${t.btn.primary} px-3.5 py-2 rounded-xl text-xs font-extrabold active:scale-95 transition-all shadow-xs flex items-center gap-1.5`}>
          <Plus size={14} />
          <span>Add Expense</span>
        </button>
        <button onClick={handleDownloadPDF}
          className={`${t.btn.success} px-3.5 py-2 rounded-xl text-xs font-extrabold active:scale-95 transition-all flex items-center gap-1.5`}>
          <FileText size={14} />
          <span>PDF Report</span>
        </button>
        <button onClick={onDeleteEvent}
          className={`${t.btn.danger} px-3.5 py-2 rounded-xl text-xs font-extrabold active:scale-95 transition-all flex items-center gap-1.5`}>
          <Trash2 size={14} />
          <span>Delete Event</span>
        </button>
      </div>

      {/* Tab switcher */}
      <div className={`grid grid-cols-4 rounded-xl overflow-hidden border ${t.border} p-0.5 bg-black/5 dark:bg-white/5 animate-fade-slide-up-2`}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`py-2 rounded-lg text-xs font-bold transition-all duration-150 ${activeTab === tab ? `${t.btn.primary} shadow-2xs` : "opacity-60 hover:opacity-100"}`}>
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
            onDelete={onDeleteExpense}
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
