// src/hooks/useAI.js
// Phase 4 — AI insights hook.

import { useState, useCallback } from "react";
import API from "../services/api";

export function useAI() {
  const [insights, setInsights]           = useState(null);
  const [budgetSuggestion, setBudgetSug]  = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await API.get("/ai/insights");
      const data = JSON.parse(res.data.result);
      setInsights(data);
      return data;
    } catch (e) {
      setError("Could not load AI insights");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBudgetSuggestion = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await API.get("/ai/budget-suggestion");
      const data = JSON.parse(res.data.result);
      setBudgetSug(data);
      return data;
    } catch (e) {
      setError("Could not load budget suggestion");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const categorize = useCallback(async (description) => {
    try {
      const res  = await API.post("/ai/categorize", { description });
      return JSON.parse(res.data.result);
    } catch {
      return null;
    }
  }, []);

  return {
    insights, budgetSuggestion, loading, error,
    fetchInsights, fetchBudgetSuggestion, categorize,
  };
}
