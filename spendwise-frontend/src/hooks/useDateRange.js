

// src/hooks/useDateRange.js
// Manages date range state and filters an expense array to that range.

import { useState, useMemo } from "react";
import { filterByDateRange } from "../utils/expenseHelpers";

/**
 * @param {Array} expenses - All expenses to filter
 * @returns { from, to, setFrom, setTo, clearRange, filteredExpenses, hasRange }
 */
export function useDateRange(expenses) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const clearRange = () => {
    setFrom("");
    setTo("");
  };

  const hasRange = Boolean(from || to);

  const filteredExpenses = useMemo(() => {
    if (!Array.isArray(expenses)) return [];
    if (!hasRange) return expenses;
    return filterByDateRange(expenses, from, to);
  }, [expenses, from, to, hasRange]);

  return { from, to, setFrom, setTo, clearRange, filteredExpenses, hasRange };
}