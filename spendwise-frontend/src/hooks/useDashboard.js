// src/hooks/useDashboard.js
// Derives all dashboard stats from an expenses array.
// No API calls — works off data already fetched by useExpenses.

import { useMemo } from "react";
import { computeDashboardStats } from "../utils/analytics";

/**
 * @param {Array} expenses - All expenses from useExpenses().expenses
 */
export function useDashboard(expenses) {
  const stats = useMemo(
    () => (Array.isArray(expenses) ? computeDashboardStats(expenses) : null),
    [expenses]
  );

  return { stats };
}