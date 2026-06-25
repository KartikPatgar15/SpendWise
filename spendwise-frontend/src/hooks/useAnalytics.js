// src/hooks/useAnalytics.js
// Derives chart data from an expenses array.
// No API calls — works off data already fetched by useExpenses.

import { useMemo } from "react";
import {
  categoryPieData,
  monthlyTrend,
  weeklyTrend,
  categorySummary,
} from "../utils/analytics";

/**
 * @param {Array} expenses - All expenses from useExpenses().expenses
 */
export function useAnalytics(expenses) {
  const data = useMemo(() => {
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return {
        pieData: [],
        monthlyData: [],
        weeklyData: [],
        categorySummaryData: {},
      };
    }

    return {
      pieData: categoryPieData(expenses),
      monthlyData: monthlyTrend(expenses, 6),
      weeklyData: weeklyTrend(expenses),
      categorySummaryData: categorySummary(expenses),
    };
  }, [expenses]);

  return data;
}