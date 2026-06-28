// src/pages/GoalsPage.jsx
// Phase 3 — Savings goals page.

import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useSavingsGoals } from "../hooks/useSavingsGoals";
import { formatRupees } from "../utils/expenseHelpers";

const emptyForm = { name: "", targetAmount: "", targetDate: "" };

export default function GoalsPage() {
  const { tokens: t } = useTheme();
  const { goals, loading, fetchGoals, addGoal, contribute, deleteGoal } = useSavingsGoals();
  const [showForm, setShowForm]         = useState(false);
  const [form, setForm]                 = useState(emptyForm);
  const [contributeId, setContributeId] = useState(null);
  const [contributeAmt, setContributeAmt] = useState("");
  const [saving, setSaving]             = useState(false);

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

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} px-4 pt-5 pb-28 space-y-5`}>

      {/* Header */}
      <div className="flex items-center justify-between animate-fade-slide-up">
        <div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${t.text}`}>Savings Goals</h1>
          <p className={`text-xs mt-0.5 ${t.muted}`}>Set targets and track your progress</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className={`${t.btn.primary} px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-all`}>
          {showForm ? "Cancel" : "+ Goal"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className={`${t.card} ${t.border} border rounded-2xl p-4 space-y-3 animate-fade-slide-up`}>
          <h2 className={`text-sm font-bold ${t.text}`}>New Savings Goal</h2>

          <div className="space-y-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Goal Name *</label>
            <input type="text" placeholder="e.g. New Laptop, Emergency Fund…" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Target Amount (₹) *</label>
              <input type="number" placeholder="0.00" value={form.targetAmount}
                onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} className={fieldClass} />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${t.muted}`}>Target Date</label>
              <input type="date" value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })} className={fieldClass} />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className={`${t.btn.primary} w-full py-3 rounded-xl text-sm font-bold active:scale-95 transition-all ${saving ? "opacity-60" : ""}`}>
            Create Goal
          </button>
        </div>
      )}

      {loading && <div className={`text-center py-12 ${t.muted}`}>Loading…</div>}

      {!loading && goals.length === 0 && (
        <div className={`text-center py-16 ${t.muted} animate-fade-in`}>
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-sm font-medium">No goals yet</p>
          <p className="text-xs mt-1">Create a savings goal to get started</p>
        </div>
      )}

      {/* Goals list */}
      {goals.length > 0 && (
        <div className="space-y-3 animate-fade-slide-up-1">
          {goals.map((g) => {
            const pct       = Math.min((g.savedAmount / g.targetAmount) * 100, 100);
            const remaining = g.targetAmount - g.savedAmount;
            const isContributing = contributeId === g.id;

            return (
              <div key={g.id} className={`${t.card} ${t.border} border rounded-2xl p-4 shadow-sm space-y-3`}>
                {/* Goal header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm font-bold ${t.text}`}>{g.name}</p>
                    {g.targetDate && <p className={`text-xs mt-0.5 ${t.muted}`}>By {g.targetDate}</p>}
                  </div>
                  <button onClick={() => deleteGoal(g.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold active:scale-95 transition-all ${t.btn.secondary}`}>
                    ✕
                  </button>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={t.muted}>Saved: {formatRupees(g.savedAmount)}</span>
                    <span className={`font-bold ${t.text}`}>{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden bg-current/10">
                    <div className="h-full rounded-full animate-grow-width bg-emerald-500"
                      style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1.5">
                    <span className={t.muted}>{formatRupees(remaining)} to go</span>
                    <span className={`font-semibold ${t.text}`}>Target: {formatRupees(g.targetAmount)}</span>
                  </div>
                </div>

                {/* Contribute */}
                {isContributing ? (
                  <div className="flex gap-2">
                    <input type="number" placeholder="Amount to add…" value={contributeAmt}
                      onChange={(e) => setContributeAmt(e.target.value)}
                      className={`${fieldClass} py-2`} />
                    <button onClick={() => handleContribute(g.id)}
                      className={`${t.btn.success} px-4 py-2 rounded-xl text-xs font-bold shrink-0 active:scale-95 transition-all`}>
                      Add
                    </button>
                    <button onClick={() => setContributeId(null)}
                      className={`${t.btn.secondary} px-3 py-2 rounded-xl text-xs font-semibold shrink-0`}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setContributeId(g.id); setContributeAmt(""); }}
                    className={`${t.btn.success} w-full py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all`}>
                    + Add Money
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
