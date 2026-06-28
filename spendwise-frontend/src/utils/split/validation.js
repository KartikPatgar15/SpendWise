// src/utils/split/validation.js
// Pure validation functions. Return { valid: bool, error: string }.

export function validateEvent(eventName) {
  if (!eventName || !eventName.trim()) return { valid: false, error: "Event name is required." };
  return { valid: true };
}

export function validateParticipants(participants) {
  if (!participants || participants.length < 2)
    return { valid: false, error: "At least 2 participants are required." };

  const names = participants.map((p) => p.name.trim().toLowerCase());
  const unique = new Set(names);
  if (unique.size !== names.length)
    return { valid: false, error: "Participant names must be unique." };

  for (const p of participants) {
    if (!p.name.trim()) return { valid: false, error: "Participant names cannot be empty." };
  }
  return { valid: true };
}

export function validateParticipantName(name, existing = []) {
  if (!name || !name.trim()) return { valid: false, error: "Name cannot be empty." };
  const lower = name.trim().toLowerCase();
  if (existing.some((p) => p.name.trim().toLowerCase() === lower))
    return { valid: false, error: "Name already exists." };
  return { valid: true };
}

export function validateExpense(expense) {
  if (!expense.expenseName || !expense.expenseName.trim())
    return { valid: false, error: "Expense name is required." };

  const payers = (expense.paidBy || []).filter((p) => p.amount > 0);
  if (payers.length === 0)
    return { valid: false, error: "At least one payer with amount > 0 is required." };

  const totalPaid = payers.reduce((s, p) => s + Number(p.amount), 0);
  if (totalPaid <= 0)
    return { valid: false, error: "Total paid amount must be greater than 0." };

  if (expense.distributionType === "equal") {
    if (!expense.sharedBy || expense.sharedBy.length === 0)
      return { valid: false, error: "At least one beneficiary is required." };
  }

  if (expense.distributionType === "exact") {
    const exactShares = expense.exactShares || {};
    const totalShares = Object.values(exactShares).reduce((s, v) => s + Number(v), 0);
    if (Math.abs(totalShares - totalPaid) > 0.01)
      return {
        valid: false,
        error: `Exact shares total (₹${totalShares.toFixed(2)}) must equal total paid (₹${totalPaid.toFixed(2)}).`,
      };
    const beneficiaries = Object.values(exactShares).filter((v) => Number(v) > 0);
    if (beneficiaries.length === 0)
      return { valid: false, error: "At least one beneficiary must have a share > 0." };
  }

  return { valid: true };
}
