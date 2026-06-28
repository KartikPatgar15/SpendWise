// src/pages/AIInsightsPage.jsx
// Phase 4 — AI Spending Insights page.

import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useAI } from "../hooks/useAI";
import { formatRupees } from "../utils/expenseHelpers";
import { CATEGORY_COLORS } from "../config/themeConfig";

export default function AIInsightsPage() {
  const { tokens: t } = useTheme();
  const { insights, budgetSuggestion, loading, error, fetchInsights, fetchBudgetSuggestion } = useAI();
  const [activeTab, setActiveTab] = useState("insights");

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} px-4 pt-5 pb-28 space-y-5`}>

      {/* Header */}
      <div className="animate-fade-slide-up">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🤖</span>
          <h1 className={`text-2xl font-extrabold tracking-tight ${t.text}`}>AI Insights</h1>
        </div>
        <p className={`text-xs ${t.muted}`}>Smart analysis powered by AI</p>
      </div>

      {/* Tab switcher */}
      <div className={`flex rounded-2xl overflow-hidden border ${t.border} animate-fade-slide-up-1`}>
        {[
          { key: "insights", label: "💡 Insights" },
          { key: "budget",   label: "💰 Budget AI" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${activeTab === key ? t.btn.primary : t.btn.secondary}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── INSIGHTS TAB ── */}
      {activeTab === "insights" && (
        <div className="space-y-4 animate-fade-slide-up-2">
          {!insights && !loading && (
            <div className={`${t.card} ${t.border} border rounded-2xl p-6 text-center space-y-3`}>
              <p className="text-4xl">✨</p>
              <p className={`text-sm font-semibold ${t.text}`}>Get personalized spending insights</p>
              <p className={`text-xs ${t.muted}`}>AI will analyze your expense history and give you actionable advice</p>
              <button onClick={fetchInsights}
                className={`${t.btn.primary} w-full py-3 rounded-xl text-sm font-bold active:scale-95 transition-all mt-2`}>
                Analyze My Spending
              </button>
            </div>
          )}

          {loading && (
            <div className={`${t.card} ${t.border} border rounded-2xl p-8 flex flex-col items-center gap-3`}>
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className={`text-sm ${t.muted}`}>AI is analyzing your spending…</p>
            </div>
          )}

          {error && (
            <div className={`${t.card} border border-red-500/30 rounded-2xl p-4 text-center`}>
              <p className="text-sm text-red-500">{error}</p>
              <p className={`text-xs mt-1 ${t.muted}`}>Make sure the backend is running and OPENAI_API_KEY is set</p>
            </div>
          )}

          {insights && !loading && (
            <div className="space-y-4 animate-fade-slide-up">
              {/* Key insights */}
              <div className={`${t.card} ${t.border} border rounded-2xl p-4 space-y-3`}>
                <h2 className={`text-xs font-bold uppercase tracking-widest ${t.muted}`}>Key Insights</h2>
                {insights.insights?.map((insight, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-blue-500 font-black text-sm shrink-0">{i + 1}</span>
                    <p className={`text-sm leading-relaxed ${t.text}`}>{insight}</p>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div className={`${t.card} ${t.border} border rounded-2xl p-4 space-y-3`}>
                <h2 className={`text-xs font-bold uppercase tracking-widest ${t.muted}`}>Actionable Tips</h2>
                {insights.tips?.map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-emerald-500 text-sm shrink-0">✓</span>
                    <p className={`text-sm leading-relaxed ${t.text}`}>{tip}</p>
                  </div>
                ))}
              </div>

              {/* Positive */}
              {insights.positive && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Well Done 🎉</p>
                  <p className={`text-sm leading-relaxed ${t.text}`}>{insights.positive}</p>
                </div>
              )}

              <button onClick={fetchInsights}
                className={`${t.btn.secondary} w-full py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all`}>
                Refresh Analysis
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── BUDGET AI TAB ── */}
      {activeTab === "budget" && (
        <div className="space-y-4 animate-fade-slide-up-2">
          {!budgetSuggestion && !loading && (
            <div className={`${t.card} ${t.border} border rounded-2xl p-6 text-center space-y-3`}>
              <p className="text-4xl">🎯</p>
              <p className={`text-sm font-semibold ${t.text}`}>Get an AI-suggested monthly budget</p>
              <p className={`text-xs ${t.muted}`}>Based on your spending history with 10-15% savings target</p>
              <button onClick={fetchBudgetSuggestion}
                className={`${t.btn.primary} w-full py-3 rounded-xl text-sm font-bold active:scale-95 transition-all mt-2`}>
                Suggest My Budget
              </button>
            </div>
          )}

          {loading && (
            <div className={`${t.card} ${t.border} border rounded-2xl p-8 flex flex-col items-center gap-3`}>
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className={`text-sm ${t.muted}`}>Calculating your ideal budget…</p>
            </div>
          )}

          {budgetSuggestion && !loading && (
            <div className="space-y-4 animate-fade-slide-up">
              {/* Suggested total */}
              <div className={`${t.card} ${t.border} border rounded-2xl p-4 ring-2 ring-blue-500/30`}>
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${t.muted}`}>Suggested Monthly Budget</p>
                <p className="text-3xl font-extrabold text-blue-500">{formatRupees(budgetSuggestion.suggestedBudget)}</p>
              </div>

              {/* Reasoning */}
              {budgetSuggestion.reasoning && (
                <div className={`${t.card} ${t.border} border rounded-2xl p-4`}>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${t.muted}`}>Why This Amount</p>
                  <p className={`text-sm leading-relaxed ${t.text}`}>{budgetSuggestion.reasoning}</p>
                </div>
              )}

              {/* Category breakdown */}
              {budgetSuggestion.breakdown && (
                <div className={`${t.card} ${t.border} border rounded-2xl p-4 space-y-3`}>
                  <p className={`text-xs font-bold uppercase tracking-widest ${t.muted}`}>Suggested by Category</p>
                  {Object.entries(budgetSuggestion.breakdown).map(([cat, amt]) => (
                    <div key={cat} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] || "#6b7280" }} />
                        <span className={`text-sm font-semibold ${t.text}`}>{cat}</span>
                      </div>
                      <span className={`text-sm font-bold ${t.text}`}>{formatRupees(amt)}</span>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={fetchBudgetSuggestion}
                className={`${t.btn.secondary} w-full py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all`}>
                Recalculate
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
