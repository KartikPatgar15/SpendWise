// src/hooks/useSavingsGoals.js
// Phase 3 — Savings goals hook.

import { useState, useCallback } from "react";
import API from "../services/api";

export function useSavingsGoals() {
  const [goals, setGoals]     = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/goals");
      setGoals(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const addGoal = useCallback(async (goal) => {
    const res = await API.post("/goals", goal);
    setGoals((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  const updateGoal = useCallback(async (id, goal) => {
    const res = await API.put(`/goals/${id}`, goal);
    setGoals((prev) => prev.map((g) => (g.id === id ? res.data : g)));
  }, []);

  const contribute = useCallback(async (id, amount) => {
    const res = await API.post(`/goals/${id}/contribute`, { amount });
    setGoals((prev) => prev.map((g) => (g.id === id ? res.data : g)));
    return res.data;
  }, []);

  const deleteGoal = useCallback(async (id) => {
    await API.delete(`/goals/${id}`);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return { goals, loading, fetchGoals, addGoal, updateGoal, contribute, deleteGoal };
}
