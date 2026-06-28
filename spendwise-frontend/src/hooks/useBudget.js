// src/hooks/useBudget.js
// Phase 2 — now calls the real backend at /budget/current.
// Falls back to localStorage if the backend isn't reachable yet.

import { useState, useEffect, useCallback } from "react";
import API from "../services/api";

export function useBudget() {
  const [budget, setBudgetState] = useState(
    () => Number(localStorage.getItem("monthly_budget") || 0)
  );
  const [budgetId, setBudgetId] = useState(null);

  // ── Load from backend on mount ───────────────────────────────────────────
  useEffect(() => {
    async function loadBudget() {
      try {
        const res = await API.get("/budget/current");
        if (res.data.found) {
          setBudgetState(res.data.amount);
          setBudgetId(res.data.id);
          localStorage.setItem("monthly_budget", res.data.amount);
        }
      } catch {
        // Backend not available — keep localStorage value
      }
    }
    loadBudget();
  }, []);

  // ── Save to backend + localStorage ──────────────────────────────────────
  const setBudget = useCallback(async (amount) => {
    const n     = Number(amount);
    const now   = new Date();
    const month = now.getMonth() + 1;
    const year  = now.getFullYear();

    // Optimistic update
    setBudgetState(n);
    localStorage.setItem("monthly_budget", n);

    try {
      const res = await API.post("/budget", { month, year, amount: n });
      setBudgetId(res.data.id);
    } catch {
      // Silently keep localStorage value if backend fails
    }
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
