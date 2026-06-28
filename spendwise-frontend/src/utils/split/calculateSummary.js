// src/utils/split/calculateSummary.js
// Derives event summary stats from expenses.

export function calculateSummary(event) {
  const { eventName, participants, expenses, createdAt } = event;

  const grandTotal = expenses.reduce((sum, exp) => {
    return sum + exp.paidBy.reduce((s, p) => s + Number(p.amount), 0);
  }, 0);

  const largestExpense = expenses.reduce((max, exp) => {
    const total = exp.paidBy.reduce((s, p) => s + Number(p.amount), 0);
    return total > max.amount ? { name: exp.expenseName, amount: total } : max;
  }, { name: "-", amount: 0 });

  return {
    eventName,
    participantCount: participants.length,
    expenseCount: expenses.length,
    grandTotal: Math.round(grandTotal * 100) / 100,
    largestExpense,
    generatedAt: new Date().toISOString(),
    createdAt,
  };
}