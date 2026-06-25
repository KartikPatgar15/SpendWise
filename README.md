# SpendWise Architecture Delivery

## Phase 1 — What's included

### Install these packages first
```bash
cd spendwise-frontend
npm install recharts jspdf jspdf-autotable
```

### Files to COPY into your project

| Output file | Destination in your project | Action |
|-------------|----------------------------|--------|
| `src/config/themeConfig.js` | `src/config/themeConfig.js` | **NEW** — create folder + file |
| `src/hooks/useTheme.js` | `src/hooks/useTheme.js` | **NEW** |
| `src/hooks/useExpenses.js` | `src/hooks/useExpenses.js` | **NEW** |
| `src/hooks/useDashboard.js` | `src/hooks/useDashboard.js` | **NEW** |
| `src/hooks/useAnalytics.js` | `src/hooks/useAnalytics.js` | **NEW** |
| `src/hooks/useDateRange.js` | `src/hooks/useDateRange.js` | **NEW** |
| `src/hooks/useBudget.js` | `src/hooks/useBudget.js` | **NEW** (Phase 2 ready) |
| `src/utils/analytics.js` | `src/utils/analytics.js` | **REPLACE stub** |
| `src/utils/expenseHelpers.js` | `src/utils/expenseHelpers.js` | **REPLACE stub** |
| `src/utils/exportPdf.js` | `src/utils/exportPdf.js` | **REPLACE stub** |
| `src/components/ui/StatCard.jsx` | `src/components/ui/StatCard.jsx` | **NEW** |
| `src/components/ui/ThemeSelector.jsx` | `src/components/ui/ThemeSelector.jsx` | **NEW** |
| `src/components/ui/DisplayModeSelector.jsx` | `src/components/ui/DisplayModeSelector.jsx` | **NEW** |
| `src/components/ui/DateRangePicker.jsx` | `src/components/ui/DateRangePicker.jsx` | **NEW** |
| `src/components/ui/EmptyState.jsx` | `src/components/ui/EmptyState.jsx` | **NEW** |
| `src/components/ui/BudgetProgressBar.jsx` | `src/components/ui/BudgetProgressBar.jsx` | **NEW** (Phase 2 ready) |
| `src/components/charts/CategoryPieChart.jsx` | `src/components/charts/CategoryPieChart.jsx` | **NEW** |
| `src/components/charts/MonthlyTrendChart.jsx` | `src/components/charts/MonthlyTrendChart.jsx` | **NEW** |
| `src/components/charts/WeeklyTrendChart.jsx` | `src/components/charts/WeeklyTrendChart.jsx` | **NEW** |
| `src/components/expense/DashboardView.jsx` | `src/components/expense/DashboardView.jsx` | **REPLACE stub** |
| `src/pages/AnalyticsPage.jsx` | `src/pages/AnalyticsPage.jsx` | **NEW** |
| `src/pages/Tracker.jsx` | `src/pages/Tracker.jsx` | **REPLACE** (hooks refactor) |
| `src/App.jsx` | `src/App.jsx` | **REPLACE** (added analytics route) |
| `src/components/BottomNav.jsx` | `src/components/BottomNav.jsx` | **REPLACE** (added Analytics link) |
| `src/services/dashboardService.js` | `src/services/dashboardService.js` | **NEW** (Phase 2 ready) |

### Files NOT touched (keep as-is)
- `HistoryView.jsx` ✅
- `WeeklyView.jsx` ✅
- `MonthlyView.jsx` ✅
- `ExpenseMenu.jsx` ✅
- `AIBot.jsx` ✅
- `api.js` ✅
- `exportCsv.js` ✅
- `index.css` ✅
- `App.css` ✅
- `main.jsx` ✅
- All backend files ✅

---

## What each piece does

**`themeConfig.js`** — Single source of truth for all theme tokens. Every color,
surface, button, badge, and input class lives here indexed by theme name.
To add a new theme: add one entry to the THEMES object.

**`useTheme()`** — Returns `{ theme, setTheme, tokens }`. Replaces the inline
theme state in Tracker.jsx. Any component can call this hook independently.

**`useExpenses()`** — Returns all fetch functions and CRUD handlers. Tracker.jsx
no longer manages fetch state directly — it just calls this hook.

**`useDashboard(expenses)`** — Takes the expenses array, returns computed stats
via `computeDashboardStats()`. Zero API calls.

**`useAnalytics(expenses)`** — Returns `pieData`, `monthlyData`, `weeklyData`,
`categorySummaryData` — all pre-formatted for Recharts.

**`useDateRange(expenses)`** — Returns date range state + a `filteredExpenses`
array. Pass this to `useAnalytics()` for range-filtered charts.

**`analytics.js`** — Pure functions: `totalAmount`, `categorySummary`,
`topCategory`, `monthlyTrend`, `weeklyTrend`, `categoryPieData`.

**`expenseHelpers.js`** — Pure formatters: `formatRupees`, `formatDate`,
`filterByDateRange`, `filterCurrentMonth`, `filterCurrentWeek`.

**`exportPdf.js`** — Requires `jspdf` + `jspdf-autotable`. Generates a
multi-section PDF with summary stats, category table, and detail table.

---

## Phase 2 checklist (when ready)

### Backend — add these files
```
controller/DashboardController.java     GET /dashboard/summary
controller/BudgetController.java        GET/POST/PUT /budget
model/Budget.java
repository/BudgetRepository.java
```

### Frontend — these files are already written
- `hooks/useBudget.js` — switch from localStorage to budgetService
- `services/dashboardService.js` — uncomment API call, remove localStorage fallback
- `components/ui/BudgetProgressBar.jsx` — import into DashboardView

---

## Phase 3 + 4 checklist

Phase 3 (Recurring + Goals) and Phase 4 (AI) are documented in ARCHITECTURE.md.
No frontend stubs are needed for these yet — the hook + service + component pattern
is identical to Phase 2 and can be added when the backend is ready.