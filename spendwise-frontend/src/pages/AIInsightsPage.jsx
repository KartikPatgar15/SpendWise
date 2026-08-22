// src/pages/AIInsightsPage.jsx
// AI Spending Insights page with Lucide icons.

import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useAI } from "../hooks/useAI";
import { formatRupees } from "../utils/expenseHelpers";
import { CATEGORY_COLORS } from "../config/themeConfig";
import { Bot, Sparkles, Target, RotateCw, Lightbulb, CheckCircle2, PartyPopper, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AIInsightsPage() {
  const { tokens: t } = useTheme();
  const navigate = useNavigate();
  const { insights, budgetSuggestion, loading, error, fetchInsights, fetchBudgetSuggestion } = useAI();
  const [activeTab, setActiveTab] = useState("insights");

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} px-4 sm:px-6 lg:px-8 pt-6 pb-28 max-w-6xl mx-auto w-full space-y-6 animate-fade-slide-up transition-colors`}>

      {/* Header */}
      <div className="pb-4 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3 mb-0.5">
          <button onClick={() => navigate(-1)} className={`p-2 rounded-xl ${t.btn.ghost} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`} title="Go back">
            <ArrowLeft size={18} />
          </button>
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#8B7CF6] to-[#6D28D9] flex items-center justify-center text-white text-lg shadow-md shadow-[#8B7CF6]/20">
            <Bot size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${t.text}`}>AI Spending Insights</h1>
            <p className={`text-xs font-medium ${t.muted}`}>Smart expenditure analysis & automated budget recommendations</p>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className={`flex rounded-xl overflow-hidden border ${t.border} p-0.5 bg-black/5 dark:bg-white/5 max-w-md animate-fade-slide-up-1`}>
        {[
          { key: "insights", label: "Insights & Tips", icon: Lightbulb },
          { key: "budget",   label: "Budget AI",       icon: Target },
        ].map(({ key, label, icon: TabIcon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all duration-150 flex items-center justify-center gap-1.5 ${activeTab === key ? `${t.btn.primary} shadow-2xs` : "opacity-60 hover:opacity-100"}`}>
            <TabIcon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── INSIGHTS TAB ── */}
      {activeTab === "insights" && (
        <div className="space-y-4 animate-fade-slide-up-2">
          {!insights && !loading && (
            <div className={`${t.card} ${t.border} border rounded-2xl p-6 sm:p-8 text-center space-y-3.5 shadow-xs max-w-2xl mx-auto`}>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#8B7CF6]/10 text-[#8B7CF6] flex items-center justify-center text-2xl">
                <Sparkles size={28} />
              </div>
              <div>
                <p className={`text-sm sm:text-base font-bold ${t.text}`}>Get Personalized Spending Insights</p>
                <p className={`text-xs font-medium mt-1 ${t.muted}`}>AI will analyze your transaction history and give you actionable advice</p>
              </div>
              <button onClick={fetchInsights}
                className={`${t.btn.primary} w-full py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider active:scale-98 transition-all shadow-sm flex items-center justify-center gap-1.5`}>
                <Sparkles size={14} />
                <span>Analyze My Spending</span>
              </button>
            </div>
          )}

          {loading && (
            <div className={`${t.card} ${t.border} border rounded-2xl p-8 flex flex-col items-center gap-3 shadow-xs max-w-md mx-auto`}>
              <div className="w-8 h-8 border-3 border-[#8B7CF6] border-t-transparent rounded-full animate-spin" />
              <p className={`text-xs font-bold uppercase tracking-wider ${t.muted}`}>AI is analyzing your spending…</p>
            </div>
          )}

          {error && (
            <div className={`${t.card} border border-rose-500/30 rounded-2xl p-4 text-center bg-rose-500/5 max-w-2xl mx-auto`}>
              <p className="text-xs font-bold text-[#E07A5F]">{error}</p>
              <p className={`text-[11px] mt-1 ${t.muted}`}>Make sure the backend is running and API keys are configured</p>
            </div>
          )}

          {insights && !loading && (
            <div className="space-y-4 animate-fade-slide-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                {/* Key insights */}
                <div className={`${t.card} ${t.border} border rounded-2xl p-5 space-y-3 shadow-xs`}>
                  <h2 className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Key Observations</h2>
                  <div className="space-y-2.5">
                    {insights.insights?.map((insight, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className="w-5 h-5 rounded-full bg-[#8B7CF6]/15 text-[#8B7CF6] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <p className={`text-xs font-medium leading-relaxed ${t.text}`}>{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className={`${t.card} ${t.border} border rounded-2xl p-5 space-y-3 shadow-xs`}>
                  <h2 className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Actionable Recommendations</h2>
                  <div className="space-y-2.5">
                    {insights.tips?.map((tip, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className="w-5 h-5 rounded-full bg-[#4F9D69]/15 text-[#4F9D69] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 size={12} />
                        </span>
                        <p className={`text-xs font-medium leading-relaxed ${t.text}`}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Positive */}
              {insights.positive && (
                <div className="bg-[#4F9D69]/10 border border-[#4F9D69]/30 rounded-2xl p-5 shadow-xs space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#4F9D69] flex items-center gap-1.5">
                    <PartyPopper size={14} />
                    <span>Well Done</span>
                  </p>
                  <p className={`text-xs font-medium leading-relaxed ${t.text}`}>{insights.positive}</p>
                </div>
              )}

              <button onClick={fetchInsights}
                className={`${t.btn.secondary} w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider active:scale-98 transition-all shadow-2xs flex items-center justify-center gap-1.5`}>
                <RotateCw size={13} />
                <span>Refresh Analysis</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── BUDGET AI TAB ── */}
      {activeTab === "budget" && (
        <div className="space-y-4 animate-fade-slide-up-2">
          {!budgetSuggestion && !loading && (
            <div className={`${t.card} ${t.border} border rounded-2xl p-6 sm:p-8 text-center space-y-3.5 shadow-xs max-w-2xl mx-auto`}>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#8B7CF6]/10 text-[#8B7CF6] flex items-center justify-center text-2xl">
                <Target size={28} />
              </div>
              <div>
                <p className={`text-sm sm:text-base font-bold ${t.text}`}>AI-Suggested Monthly Budget</p>
                <p className={`text-xs font-medium mt-1 ${t.muted}`}>Calibrated with spending trends and healthy 10-15% savings headroom</p>
              </div>
              <button onClick={fetchBudgetSuggestion}
                className={`${t.btn.primary} w-full py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider active:scale-98 transition-all shadow-sm flex items-center justify-center gap-1.5`}>
                <Target size={14} />
                <span>Suggest My Budget</span>
              </button>
            </div>
          )}

          {loading && (
            <div className={`${t.card} ${t.border} border rounded-2xl p-8 flex flex-col items-center gap-3 shadow-xs max-w-md mx-auto`}>
              <div className="w-8 h-8 border-3 border-[#8B7CF6] border-t-transparent rounded-full animate-spin" />
              <p className={`text-xs font-bold uppercase tracking-wider ${t.muted}`}>Calculating your ideal budget…</p>
            </div>
          )}

          {budgetSuggestion && !loading && (
            <div className="space-y-4 animate-fade-slide-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                <div className="space-y-4">
                  {/* Suggested total */}
                  <div className={`${t.card} ${t.border} border rounded-2xl p-5 sm:p-6 ring-2 ring-[#8B7CF6]/30 shadow-xs space-y-1`}>
                    <p className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Suggested Monthly Budget</p>
                    <p className="text-3xl sm:text-4xl font-black tabular-nums text-[#8B7CF6]">{formatRupees(budgetSuggestion.suggestedBudget)}</p>
                  </div>

                  {/* Reasoning */}
                  {budgetSuggestion.reasoning && (
                    <div className={`${t.card} ${t.border} border rounded-2xl p-5 shadow-xs space-y-1.5`}>
                      <p className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>AI Analysis & Strategy</p>
                      <p className={`text-xs font-medium leading-relaxed ${t.text}`}>{budgetSuggestion.reasoning}</p>
                    </div>
                  )}
                </div>

                {/* Category breakdown */}
                {budgetSuggestion.breakdown && (
                  <div className={`${t.card} ${t.border} border rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs`}>
                    <p className={`text-[11px] font-bold uppercase tracking-wider ${t.muted}`}>Suggested by Category</p>
                    <div className="space-y-2.5">
                      {Object.entries(budgetSuggestion.breakdown).map(([cat, amt]) => (
                        <div key={cat} className="flex justify-between items-center text-xs tabular-nums">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] || "#6b7280" }} />
                            <span className={`font-bold ${t.text}`}>{cat}</span>
                          </div>
                          <span className={`font-extrabold ${t.text}`}>{formatRupees(amt)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={fetchBudgetSuggestion}
                className={`${t.btn.secondary} w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider active:scale-98 transition-all shadow-2xs flex items-center justify-center gap-1.5`}>
                <RotateCw size={13} />
                <span>Recalculate Budget</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
