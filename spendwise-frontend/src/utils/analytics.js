// src/utils/analytics.js
// Pure calculation functions. No React, no API calls.
// Input: expense arrays. Output: derived data for charts and dashboard.

import {
  filterCurrentMonth,
  filterCurrentWeek,
} from "./expenseHelpers";

/**
 * Total amount across an expense array.
 */
export function totalAmount(expenses) {
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
}

/**
 * Count of expenses.
 */
export function totalTransactions(expenses) {
  return expenses.length;
}

/**
 * Category breakdown: { FOOD: 1200, TRAVEL: 800, ... }
 */
export function categorySummary(expenses) {
  return expenses.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + Number(e.amount);
    return acc;
  }, {});
}

/**
 * Category with highest spend. Returns { category, amount } or null.
 */
export function topCategory(expenses) {
  const summary = categorySummary(expenses);
  const entries = Object.entries(summary);
  if (!entries.length) return null;
  const [category, amount] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  return { category, amount };
}

/**
 * Dashboard stats derived from all expenses.
 * Returns: { totalAll, totalThisMonth, totalThisWeek, transactionCount, topSpend }
 */
export function computeDashboardStats(expenses) {
  const thisMonth = filterCurrentMonth(expenses);
  const thisWeek = filterCurrentWeek(expenses);

  return {
    totalAll: totalAmount(expenses),
    totalThisMonth: totalAmount(thisMonth),
    totalThisWeek: totalAmount(thisWeek),
    transactionCount: totalTransactions(expenses),
    topSpend: topCategory(expenses),
  };
}

/**
 * Monthly trend: last N months, each with { month: "Jun 2025", total: 4200 }
 */
export function monthlyTrend(expenses, months = 6) {
  const result = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-indexed

    const filtered = expenses.filter((e) => {
      const ed = new Date(e.date);
      return ed.getFullYear() === year && ed.getMonth() === month;
    });

    result.push({
      month: d.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      total: totalAmount(filtered),
    });
  }

  return result;
}

/**
 * Weekly trend: last 7 days, each with { day: "Mon", total: 540 }
 */
export function weeklyTrend(expenses) {
  const result = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    const filtered = expenses.filter((e) => e.date === dateStr);
    result.push({
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      date: dateStr,
      total: totalAmount(filtered),
    });
  }

  return result;
}

/**
 * Category summary formatted for Recharts PieChart.
 * Returns: [{ name: "FOOD", value: 1200 }, ...]
 */
export function categoryPieData(expenses) {
  const summary = categorySummary(expenses);
  return Object.entries(summary)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
}
