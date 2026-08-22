// src/pages/RecurringPage.jsx
// Manage recurring expenses with Lucide icons and ConfirmModal for deletions.

import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useRecurring } from "../hooks/useRecurring";
import { EXPENSE_CATEGORIES } from "../config/themeConfig";
import { formatRupees } from "../utils/expenseHelpers";
import ConfirmModal from "../components/ui/ConfirmModal";
import { Repeat, Plus, X, ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FREQUENCIES = ["DAILY", "WEEKLY", "MONTHLY"];
const DAYS_OF_WEEK  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const emptyForm = { description: "", amount: "", type: "FOOD", frequency: "MONTHLY", dayOf: 1, startDate: "", endDate: "" };

export default function RecurringPage() {
  const { tokens: t } = useTheme();
  const navigate = useNavigate();
  const { recurring, loading, fetchRecurring, addRecurring, deleteRecurring } = useRecurring();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);

  // Single Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    id: null,
    name: "",
  });

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

  const promptDelete = (id, name) => {
    setDeleteConfirm({
      isOpen: true,
      id,
      name,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.id) return;
    await deleteRecurring(deleteConfirm.id);
    setDeleteConfirm({ isOpen: false, id: null, name: "" });
  };

  const freqLabel = (r) => {
    if (r.frequency === "DAILY")   return "Every day";
    if (r.frequency === "WEEKLY")  return `Every ${DAYS_OF_WEEK[(r.dayOf || 1) - 1]}`;
    if (r.frequency === "MONTHLY") return `Every month on day ${r.dayOf}`;
    return r.frequency;
  };

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} px-4 sm:px-6 lg:px-8 pt-6 pb-28 max-w-6xl mx-auto w-full space-y-6 animate-fade-slide-up transition-colors`}>
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Recurring Bill"
        message={`Are you sure you want to stop and delete the recurring bill for "${deleteConfirm.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, name: "" })}
        danger={true}
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className={`p-2 rounded-xl ${t.btn.ghost} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`} title="Go back">
            <ArrowLeft size={18} />
          </button>
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-lg shadow-md shadow-purple-500/20">
            <Repeat size={20} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${t.text}`}>Recurring Expenses</h1>
            <p className={`text-xs font-medium ${t.muted}`}>Auto-expenses scheduled over time</p>
          </div>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className={`${t.btn.primary} px-3.5 py-2 rounded-xl text-xs font-extrabold active:scale-95 transition-all shadow-xs flex items-center gap-1.5`}>
          {showForm ? (
            <>
              <X size={14} />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus size={14} />
              <span>Add Bill</span>
            </>
          )}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className={`${t.card} ${t.border} border rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs max-w-2xl mx-auto animate-fade-slide-up`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xs font-extrabold uppercase tracking-wider ${t.text}`}>New Recurring Expense</h2>
            <span className="text-[11px] font-semibold text-purple-400">Scheduled</span>
          </div>

          <div className="space-y-1">
            <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Description *</label>
            <input type="text" placeholder="e.g. Netflix, Apartment Rent, Gym, Wifi…" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} className={fieldClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Amount (₹) *</label>
              <input type="number" placeholder="0.00" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })} className={fieldClass} />
            </div>
            <div className="space-y-1">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Category</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={fieldClass}>
                {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Frequency</label>
              <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className={fieldClass}>
                {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            {form.frequency !== "DAILY" && (
              <div className="space-y-1">
                <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Start Date *</label>
              <input type="date" value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={fieldClass} />
            </div>
            <div className="space-y-1">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>End Date (optional)</label>
              <input type="date" value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={fieldClass} />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className={`${t.btn.primary} w-full py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider active:scale-98 transition-all shadow-sm flex items-center justify-center gap-1.5 ${saving ? "opacity-60" : ""}`}>
            <Plus size={14} />
            <span>Save Recurring Expense</span>
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className={`text-xs font-bold uppercase tracking-wider ${t.muted}`}>Loading recurring bills…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && recurring.length === 0 && (
        <div className={`text-center py-16 ${t.muted} animate-fade-in space-y-2`}>
          <div className="w-14 h-14 mx-auto mb-1 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-2xl">
            <Repeat size={28} className={t.muted} />
          </div>
          <p className="text-sm font-bold">No recurring bills recorded</p>
          <p className="text-xs opacity-75">Add subscriptions, house rent, utilities or EMIs above</p>
        </div>
      )}

      {/* List */}
      {recurring.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-slide-up-1">
          {recurring.map((r) => (
            <div key={r.id} className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between space-y-3`}>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${t.badge?.[r.type] || "bg-gray-100 text-gray-700"}`}>{r.type}</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400">{freqLabel(r)}</span>
                </div>
                <p className={`text-sm sm:text-base font-extrabold ${t.text}`}>{r.description}</p>
                {r.endDate && <p className={`text-[11px] font-medium ${t.muted}`}>Active until {r.endDate}</p>}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                <span className={`text-base font-black tabular-nums ${t.text}`}>{formatRupees(r.amount)}</span>
                <button onClick={() => promptDelete(r.id, r.description)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center gap-1 ${t.btn.danger}`}>
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
