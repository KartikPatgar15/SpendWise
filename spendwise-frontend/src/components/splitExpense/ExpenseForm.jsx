// src/components/splitExpense/ExpenseForm.jsx
// Add or edit an expense. Handles equal and exact split modes.

import { useState, useEffect } from "react";
import { generateId } from "../../utils/split/storage";
import { validateExpense } from "../../utils/split/validation";

const emptyExpense = (participants) => ({
  id:               generateId("exp"),
  expenseName:      "",
  distributionType: "equal",
  paidBy:           participants.map((p) => ({ participantId: p.id, amount: "", checked: false })),
  sharedBy:         participants.map((p) => p.id),
  exactShares:      Object.fromEntries(participants.map((p) => [p.id, ""])),
});

export default function ExpenseForm({ event, editingExpense, onSave, onGenerateReport, onBack, tokens }) {
  const t = tokens;
  const participants = event.participants;

  const [form, setForm]     = useState(() => editingExpense
    ? {
        ...editingExpense,
        paidBy: participants.map((p) => {
          const existing = editingExpense.paidBy.find((x) => x.participantId === p.id);
          return { participantId: p.id, amount: existing?.amount ?? "", checked: !!existing && existing.amount > 0 };
        }),
        exactShares: editingExpense.exactShares || Object.fromEntries(participants.map((p) => [p.id, ""])),
      }
    : emptyExpense(participants));
  const [error, setError]   = useState("");

  const nameOf = (id) => participants.find((p) => p.id === id)?.name || id;

  const totalPaid = form.paidBy
    .filter((p) => p.checked)
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const totalExact = form.distributionType === "exact"
    ? Object.values(form.exactShares).reduce((s, v) => s + (Number(v) || 0), 0)
    : 0;

  const sharePerPerson = form.distributionType === "equal" && form.sharedBy.length > 0
    ? totalPaid / form.sharedBy.length
    : 0;

  const exactValid = form.distributionType === "exact"
    ? Math.abs(totalExact - totalPaid) < 0.01 && totalPaid > 0
    : true;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const setPayer = (id, field, value) => {
    setForm((f) => ({
      ...f,
      paidBy: f.paidBy.map((p) =>
        p.participantId === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const toggleBeneficiary = (id) => {
    setForm((f) => ({
      ...f,
      sharedBy: f.sharedBy.includes(id)
        ? f.sharedBy.filter((x) => x !== id)
        : [...f.sharedBy, id],
    }));
  };

  const setExactShare = (id, value) => {
    setForm((f) => ({ ...f, exactShares: { ...f.exactShares, [id]: value } }));
  };

  const buildExpense = () => ({
    id:               form.id,
    expenseName:      form.expenseName.trim(),
    distributionType: form.distributionType,
    paidBy:           form.paidBy
                        .filter((p) => p.checked && Number(p.amount) > 0)
                        .map((p) => ({ participantId: p.participantId, amount: Number(p.amount) })),
    sharedBy:         form.distributionType === "equal" ? form.sharedBy : [],
    exactShares:      form.distributionType === "exact"
                        ? Object.fromEntries(
                            Object.entries(form.exactShares).map(([k, v]) => [k, Number(v) || 0])
                          )
                        : {},
  });

  const handleSave = (andNext) => {
    const expense = buildExpense();
    const result  = validateExpense(expense);
    if (!result.valid) { setError(result.error); return; }
    onSave(expense, andNext);
    if (andNext) setForm(emptyExpense(participants));
    setError("");
  };

  const fieldClass = `border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${t.input}`;

  return (
    <div className="space-y-5 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-extrabold ${t.text}`}>
            {editingExpense ? "Edit Expense" : "Add Expense"}
          </h2>
          <p className={`text-xs mt-0.5 ${t.muted}`}>{event.eventName}</p>
        </div>
        <button onClick={onBack} className={`text-sm font-medium ${t.btn.ghost}`}>← Back</button>
      </div>

      {/* Expense name */}
      <div className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs`}>
        <div className="space-y-1">
          <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Expense Name</label>
          <input type="text" placeholder="e.g. Flight Tickets, Hotel, Dinner…"
            value={form.expenseName}
            onChange={(e) => setForm({ ...form, expenseName: e.target.value })}
            className={`${fieldClass} w-full`} />
        </div>

        {/* Distribution type */}
        <div className="space-y-1.5">
          <label className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Split Distribution</label>
          <div className={`inline-flex w-full rounded-xl overflow-hidden border ${t.border} p-0.5 bg-black/5 dark:bg-white/5`}>
            {[["equal", "Split Equally"], ["exact", "Exact Amount"]].map(([val, label]) => (
              <button key={val} onClick={() => setForm({ ...form, distributionType: val })}
                className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all duration-150 ${form.distributionType === val ? `${t.btn.primary} shadow-2xs` : "opacity-60 hover:opacity-100"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid for Who Paid & Who Shares on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Who Paid */}
        <div className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Who Paid</h3>
            <span className={`text-xs font-black tabular-nums ${totalPaid > 0 ? "text-blue-500" : t.muted}`}>
              Total: ₹{totalPaid.toFixed(2)}
            </span>
          </div>
          <div className="space-y-2.5">
            {participants.map((p) => {
              const payer = form.paidBy.find((x) => x.participantId === p.id);
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <input type="checkbox" checked={payer?.checked || false}
                    onChange={(e) => setPayer(p.id, "checked", e.target.checked)}
                    className="w-4 h-4 accent-blue-500 shrink-0 cursor-pointer rounded" />
                  <span className={`text-xs font-bold flex-1 ${t.text}`}>{p.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${t.muted}`}>₹</span>
                    <input type="number" min="0" placeholder="0"
                      value={payer?.amount ?? ""}
                      disabled={!payer?.checked}
                      onChange={(e) => setPayer(p.id, "amount", e.target.value)}
                      className={`${fieldClass} w-24 text-right tabular-nums ${!payer?.checked ? "opacity-30 cursor-not-allowed" : ""}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Who Shares */}
        <div className={`${t.card} ${t.border} border rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs`}>
          <h3 className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>
            {form.distributionType === "equal" ? "Who Shares (Equally)" : "Who Shares (Custom Amount)"}
          </h3>

          {form.distributionType === "equal" ? (
            <>
              <div className="space-y-2.5">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="checkbox"
                        checked={form.sharedBy.includes(p.id)}
                        onChange={() => toggleBeneficiary(p.id)}
                        className="w-4 h-4 accent-blue-500 cursor-pointer rounded" />
                      <span className={`text-xs font-bold ${t.text}`}>{p.name}</span>
                    </div>
                    {form.sharedBy.includes(p.id) && sharePerPerson > 0 && (
                      <span className="text-xs font-black tabular-nums text-emerald-500">
                        ₹{sharePerPerson.toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {form.sharedBy.length > 0 && totalPaid > 0 && (
                <div className={`pt-3 border-t ${t.border} flex justify-between text-xs tabular-nums`}>
                  <span className={`font-semibold ${t.muted}`}>Each person pays</span>
                  <span className="font-black text-emerald-500">₹{sharePerPerson.toFixed(2)}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-2.5">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className={`text-xs font-bold flex-1 ${t.text}`}>{p.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${t.muted}`}>₹</span>
                      <input type="number" min="0" placeholder="0"
                        value={form.exactShares[p.id] ?? ""}
                        onChange={(e) => setExactShare(p.id, e.target.value)}
                        className={`${fieldClass} w-24 text-right tabular-nums`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className={`pt-3 border-t ${t.border} flex justify-between text-xs tabular-nums`}>
                <span className={`font-semibold ${t.muted}`}>Shares total</span>
                <span className={`font-black ${exactValid ? "text-emerald-500" : "text-rose-500"}`}>
                  ₹{totalExact.toFixed(2)} / ₹{totalPaid.toFixed(2)}
                </span>
              </div>
              {!exactValid && totalPaid > 0 && (
                <p className="text-xs font-semibold text-rose-500">Shares must equal total paid</p>
              )}
            </>
          )}
        </div>
      </div>

      {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        {!editingExpense && (
          <button onClick={() => handleSave(true)}
            disabled={form.distributionType === "exact" && !exactValid}
            className={`${t.btn.secondary} flex-1 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider active:scale-98 transition-all ${form.distributionType === "exact" && !exactValid ? "opacity-50" : ""}`}>
            Save & Add Next
          </button>
        )}
        <button
          onClick={() => editingExpense ? handleSave(false) : handleSave(false)}
          disabled={form.distributionType === "exact" && !exactValid}
          className={`${t.btn.primary} flex-1 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-sm active:scale-98 transition-all ${form.distributionType === "exact" && !exactValid ? "opacity-50" : ""}`}>
          {editingExpense ? "Save Changes" : "Generate Report"}
        </button>
      </div>
    </div>
  );
}
