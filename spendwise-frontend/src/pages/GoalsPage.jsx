// src/pages/GoalsPage.jsx
// Savings goals page with Lucide icons and ConfirmModal for deletions.

import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useSavingsGoals } from "../hooks/useSavingsGoals";
import { formatRupees } from "../utils/expenseHelpers";
import ConfirmModal from "../components/ui/ConfirmModal";
import { Target, Plus, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const emptyForm = { name: "", targetAmount: "", targetDate: "" };

export default function GoalsPage() {
  const { tokens: t } = useTheme();
  const navigate = useNavigate();
  const { goals, loading, fetchGoals, addGoal, contribute, deleteGoal } = useSavingsGoals();
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState(emptyForm);
  const [contributeId, setContributeId] = useState(null);
  const [contributeAmt, setContributeAmt] = useState("");
  const [saving, setSaving]             = useState(false);

  // Single Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    id: null,
    name: "",
  });

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const fieldClass = `border rounded-xl px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${t.input}`;

  const handleSave = async () => {
    if (!form.name || !form.targetAmount) { alert("Fill required fields"); return; }
    setSaving(true);
    try {
      await addGoal({ ...form, targetAmount: Number(form.targetAmount) });
      setForm(emptyForm);
      setShowForm(false);
    } finally { setSaving(false); }
  };

  const handleContribute = async (id) => {
    if (!contributeAmt || isNaN(contributeAmt)) return;
    await contribute(id, Number(contributeAmt));
    setContributeId(null);
    setContributeAmt("");
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
    await deleteGoal(deleteConfirm.id);
    setDeleteConfirm({ isOpen: false, id: null, name: "" });
  };

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} px-4 sm:px-6 lg:px-8 pt-6 pb-28 max-w-6xl mx-auto w-full space-y-6 animate-fade-slide-up transition-colors`}>
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Savings Goal"
        message={`Are you sure you want to delete the "${deleteConfirm.name}" goal?`}
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
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-lg shadow-md shadow-emerald-500/20">
            <Target size={20} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${t.text}`}>Savings Goals</h1>
            <p className={`text-xs font-medium ${t.muted}`}>Set targets and monitor your progress</p>
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
              <span>New Goal</span>
            </>
          )}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className={`${t.card} ${t.border} border rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs max-w-2xl mx-auto animate-fade-slide-up`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xs font-extrabold uppercase tracking-wider ${t.text}`}>Create New Goal</h2>
            <span className="text-[11px] font-semibold text-emerald-500">Target</span>
          </div>

          <div className="space-y-1">
            <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Goal Name *</label>
            <input type="text" placeholder="e.g. New Laptop, Emergency Fund, Vacation…" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Target Amount (₹) *</label>
              <input type="number" placeholder="0.00" value={form.targetAmount}
                onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} className={fieldClass} />
            </div>
            <div className="space-y-1">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Target Date</label>
              <input type="date" value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })} className={fieldClass} />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className={`${t.btn.primary} w-full py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider active:scale-98 transition-all shadow-sm flex items-center justify-center gap-1.5 ${saving ? "opacity-60" : ""}`}>
            <Plus size={14} />
            <span>Create Goal</span>
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className={`text-xs font-bold uppercase tracking-wider ${t.muted}`}>Loading goals…</p>
        </div>
      )}

      {!loading && goals.length === 0 && (
        <div className={`text-center py-16 ${t.muted} animate-fade-in space-y-2`}>
          <div className="w-14 h-14 mx-auto mb-1 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
            <Target size={28} className={t.muted} />
          </div>
          <p className="text-sm font-bold">No savings goals yet</p>
          <p className="text-xs opacity-75">Tap "+ New Goal" above to start building your savings</p>
        </div>
      )}

      {/* Goals list */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-slide-up-1">
          {goals.map((g) => {
            const pct       = Math.min((g.savedAmount / g.targetAmount) * 100, 100);
            const remaining = g.targetAmount - g.savedAmount;
            const isContributing = contributeId === g.id;

            return (
              <div key={g.id} className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between space-y-4`}>
                {/* Goal header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm sm:text-base font-extrabold ${t.text}`}>{g.name}</p>
                    {g.targetDate && (
                      <p className={`text-[11px] font-medium mt-0.5 ${t.muted}`}>
                        Target: {new Date(g.targetDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <button onClick={() => promptDelete(g.id, g.name)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold opacity-60 hover:opacity-100 hover:text-rose-500 active:scale-90 transition-all ${t.btn.secondary}`}>
                    <X size={13} />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs tabular-nums">
                    <span className={`font-semibold ${t.muted}`}>Saved: <strong className="text-emerald-500 font-extrabold">{formatRupees(g.savedAmount)}</strong></span>
                    <span className={`font-black ${t.text}`}>{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 p-0.5">
                    <div className="h-full rounded-full animate-grow-width bg-emerald-500 transition-all duration-500"
                      style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1 tabular-nums">
                    <span className={`font-medium ${t.muted}`}>{formatRupees(remaining)} to go</span>
                    <span className={`font-bold ${t.text}`}>Target: {formatRupees(g.targetAmount)}</span>
                  </div>
                </div>

                {/* Contribute */}
                {isContributing ? (
                  <div className="flex gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                    <input type="number" placeholder="Amount to contribute…" value={contributeAmt}
                      onChange={(e) => setContributeAmt(e.target.value)}
                      className={`${fieldClass} py-2 text-xs`} />
                    <button onClick={() => handleContribute(g.id)}
                      className={`${t.btn.success} px-4 py-2 rounded-xl text-xs font-bold shrink-0 active:scale-95 transition-all`}>
                      Add
                    </button>
                    <button onClick={() => setContributeId(null)}
                      className={`${t.btn.secondary} px-3 py-2 rounded-xl text-xs font-semibold shrink-0`}>
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setContributeId(g.id); setContributeAmt(""); }}
                    className={`${t.btn.success} w-full py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider active:scale-98 transition-all shadow-2xs flex items-center justify-center gap-1`}>
                    <Plus size={13} />
                    <span>Add Funds</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
