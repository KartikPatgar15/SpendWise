// src/services/dashboardService.js
// Phase 2 — Will call the optimized /dashboard/summary endpoint.
// Until the backend endpoint is ready, callers should use useExpenses + useDashboard.

import API from "./api";

/**
 * Fetch pre-computed dashboard summary from backend.
 * Backend endpoint: GET /dashboard/summary
 * Returns: { totalAll, totalThisMonth, totalThisWeek, transactionCount, topCategory, topCategoryAmount }
 */
export async function fetchDashboardSummary() {
  const res = await API.get("/dashboard/summary");
  return res.data;
}
