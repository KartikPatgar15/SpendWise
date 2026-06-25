// src/utils/expenseHelpers.js
// Pure date/filter utility functions. No React, no API calls.

/**
 * Format a number as Indian Rupees.
 * e.g. formatRupees(1234.5) → "₹1,234.50"
 */
export function formatRupees(amount) {
  return `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format a date string as "DD MMM YYYY".
 * e.g. formatDate("2025-06-01") → "01 Jun 2025"
 */
export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Return YYYY-MM-DD string for a Date object.
 */
export function toISODate(date) {
  return date.toISOString().split("T")[0];
}

/**
 * Get the first day of the current month as YYYY-MM-DD.
 */
export function currentMonthStart() {
  const now = new Date();
  return toISODate(new Date(now.getFullYear(), now.getMonth(), 1));
}

/**
 * Get today as YYYY-MM-DD.
 */
export function today() {
  return toISODate(new Date());
}

/**
 * Get date 7 days ago as YYYY-MM-DD.
 */
export function weekAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return toISODate(d);
}

/**
 * Filter expenses to current calendar month.
 */
export function filterCurrentMonth(expenses) {
  const start = currentMonthStart();
  const end = today();
  return filterByDateRange(expenses, start, end);
}

/**
 * Filter expenses to last 7 days.
 */
export function filterCurrentWeek(expenses) {
  const start = weekAgo();
  const end = today();
  return filterByDateRange(expenses, start, end);
}

/**
 * Filter expenses to a date range [from, to] inclusive.
 * @param {Array} expenses
 * @param {string} from - YYYY-MM-DD
 * @param {string} to   - YYYY-MM-DD
 */
export function filterByDateRange(expenses, from, to) {
  return expenses.filter((e) => {
    const date = e.date;
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  });
}

/**
 * Sort expenses by date descending (latest first).
 */
export function sortByDateDesc(expenses) {
  return [...expenses].sort((a, b) => b.date.localeCompare(a.date));
}
