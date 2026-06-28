// src/pages/RecurringPage.jsx
// Phase 3 — Manage recurring expenses.

import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useRecurring } from "../hooks/useRecurring";
import { EXPENSE_CATEGORIES } from "../config/themeConfig";
import { formatRupees } from "../utils/expenseHelpers";

const FREQUENCIES = ["DAILY", "WEEKLY", "MONTHLY"];
const DAYS_OF_WEEK  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const emptyForm = { description: "", amount: "", type: "FOOD", frequency: "MONTHLY", dayOf: 1, startDate: "", endDate: "" };

export default function RecurringPage() {
  const { tokens: t } = useTheme();
  const { recurring, loading, fetchRecurring, addRecurring, deleteRecurring } = useRecurring();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);

  useEffect(() => { fetchRecurring(); }, [fetchRecurring]);

  const fieldClass = `border rounded-xl px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${t.input}`;

  const handleSave = async () => {
    if (!form.description || !form.amount || !form.startDate) { alert("Fill all required fields"); return; }
    setSaving(true);
    try {
      await addRecurring({ ...form, amount: Number(form.amount), dayOf: Number(form.dayOf) });
      setForm(emptyForm);
      setShowForm(false);
    } finally { setSaving(false); }
  };

  const freqLabel = (r) => {
    if (r.frequency === "DAILY")   return "Every day";
    if (r.frequency === "WEEKLY")  return `Every ${DAYS_OF_WEEK[(r.dayOf || 1) - 1]}`;
    if (r.frequency === "MONTHLY") return `Every month on day ${r.dayOf}`;
    return r.frequency;
  };

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} px-4 pt-5 pb-28 space-y-5`}>

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-slide-up">
        <div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${t.text}`}>Recurring</h1>
          <p className={`text-xs mt-0.5 ${t.muted}`}>Auto-expenses that repeat on a schedule</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className={`${t.btn.primary} px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-all`}>
          {showForm ? "Cancel" : "+ New"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className={`${t.card} ${t.border} border rounded-2xl p-4 space-y-3 animate-fade-slide-up`}>
          <h2 className={`text-sm font-bold ${t.text}`}>New Recurring Expense</h2>

          <div className="space-y-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Description *</label>
            <input type="text" placeholder="e.g. Netflix, Rent…" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} className={fieldClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Amount (₹) *</label>
              <input type="number" placeholder="0.00" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })} className={fieldClass} />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Category</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={fieldClass}>
                {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Frequency</label>
              <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className={fieldClass}>
                {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            {form.frequency !== "DAILY" && (
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>
                  {form.frequency === "WEEKLY" ? "Day of Week" : "Day of Month"}
                </label>
                {form.frequency === "WEEKLY" ? (
                  <select value={form.dayOf} onChange={(e) => setForm({ ...form, dayOf: e.target.value })} className={fieldClass}>
                    {DAYS_OF_WEEK.map((d, i) => <option key={d} value={i + 1}>{d}</option>)}
                  </select>
                ) : (
                  <input type="number" min="1" max="28" value={form.dayOf}
                    onChange={(e) => setForm({ ...form, dayOf: e.target.value })} className={fieldClass} />
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Start Date *</label>
              <input type="date" value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={fieldClass} />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>End Date (optional)</label>
              <input type="date" value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={fieldClass} />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className={`${t.btn.primary} w-full py-3 rounded-xl text-sm font-bold active:scale-95 transition-all ${saving ? "opacity-60" : ""}`}>
            Save Recurring Expense
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && <div className={`text-center py-12 ${t.muted}`}>Loading…</div>}

      {/* Empty */}
      {!loading && recurring.length === 0 && (
        <div className={`text-center py-16 ${t.muted} animate-fade-in`}>
          <p className="text-4xl mb-3">🔁</p>
          <p className="text-sm font-medium">No recurring expenses yet</p>
          <p className="text-xs mt-1">Add rent, subscriptions, EMIs…</p>
        </div>
      )}

      {/* List */}
      {recurring.length > 0 && (
        <div className="space-y-3 animate-fade-slide-up-1">
          {recurring.map((r) => (
            <div key={r.id} className={`${t.card} ${t.border} border rounded-2xl p-4 shadow-sm`}>
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${t.badge?.[r.type] || "bg-gray-100 text-gray-700"}`}>{r.type}</span>
                    <span className={`text-[10px] font-medium ${t.muted}`}>{freqLabel(r)}</span>
                  </div>
                  <p className={`text-sm font-bold ${t.text}`}>{r.description}</p>
                  {r.endDate && <p className={`text-xs mt-0.5 ${t.muted}`}>Until {r.endDate}</p>}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-sm font-extrabold ${t.text}`}>{formatRupees(r.amount)}</span>
                  <button onClick={() => deleteRecurring(r.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold active:scale-95 transition-all ${t.btn.danger}`}>
                    Remove
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
