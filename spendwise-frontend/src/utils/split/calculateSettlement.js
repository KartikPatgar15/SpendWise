// src/utils/split/calculateSettlement.js
// Pure settlement calculation. No React, no storage.
// Input: event (with participants + expenses)
// Output: { balances, settlements }

/**
 * Calculate net balances for all participants across all expenses.
 * Returns: { participantId: netBalance } — positive = owed money, negative = owes money
 */
export function calculateBalances(event) {
  const { participants, expenses } = event;
  const balances = {};

  // Initialize all balances to 0
  participants.forEach((p) => { balances[p.id] = 0; });

  expenses.forEach((expense) => {
    const totalPaid = expense.paidBy.reduce((s, p) => s + Number(p.amount), 0);

    // Credit payers
    expense.paidBy.forEach((payer) => {
      balances[payer.participantId] = (balances[payer.participantId] || 0) + Number(payer.amount);
    });

    // Debit beneficiaries
    if (expense.distributionType === "equal") {
      const count = expense.sharedBy.length;
      const share = totalPaid / count;
      expense.sharedBy.forEach((pid) => {
        balances[pid] = (balances[pid] || 0) - share;
      });
    } else if (expense.distributionType === "exact") {
      Object.entries(expense.exactShares).forEach(([pid, amount]) => {
        balances[pid] = (balances[pid] || 0) - Number(amount);
      });
    }
  });

  // Round to 2 decimal places to avoid floating point noise
  Object.keys(balances).forEach((id) => {
    balances[id] = Math.round(balances[id] * 100) / 100;
  });

  return balances;
}

/**
 * Generate optimized settlement transactions using greedy debt simplification.
 * Input: balances map { participantId: netBalance }
 * Output: [{ from: participantId, to: participantId, amount: number }]
 */
export function calculateSettlement(balances) {
  // Separate into creditors (positive) and debtors (negative)
  const creditors = [];
  const debtors   = [];

  Object.entries(balances).forEach(([id, balance]) => {
    if (balance > 0.01)  creditors.push({ id, amount: balance });
    if (balance < -0.01) debtors.push({ id, amount: -balance });
  });

  // Sort descending for greedy matching
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements = [];

  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const credit = creditors[ci];
    const debt   = debtors[di];
    const amount = Math.min(credit.amount, debt.amount);

    if (amount > 0.01) {
      settlements.push({
        from:   debt.id,
        to:     credit.id,
        amount: Math.round(amount * 100) / 100,
      });
    }

    credit.amount -= amount;
    debt.amount   -= amount;

    if (credit.amount < 0.01) ci++;
    if (debt.amount   < 0.01) di++;
  }

  return settlements;
}

/**
 * Full calculation — call this once per report generation.
 * Returns: { balances, settlements }
 */
export function generateSettlement(event) {
  const balances    = calculateBalances(event);
  const settlements = calculateSettlement(balances);
  return { balances, settlements };
}
