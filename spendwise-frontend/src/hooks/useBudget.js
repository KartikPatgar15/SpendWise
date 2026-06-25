// src/hooks/useBudget.js
// Phase 2 — Budget tracking hook.
// Will call budgetService once the backend endpoint exists.
// Until then, budget is stored in localStorage as a temporary fallback.

import { useState, useCallback } from "react";

export function useBudget() {
  const [budget, setBudgetState] = useState(
    () => Number(localStorage.getItem("monthly_budget") || 0)
  );

  const setBudget = useCallback((amount) => {
    const n = Number(amount);
    setBudgetState(n);
    localStorage.setItem("monthly_budget", n);
  }, []);

  const computeRemaining = (spent) => {
    if (!budget) return null;
    return budget - spent;
  };

  const computeProgress = (spent) => {
    if (!budget) return 0;
    return Math.min((spent / budget) * 100, 100);
  };

  return { budget, setBudget, computeRemaining, computeProgress };
}