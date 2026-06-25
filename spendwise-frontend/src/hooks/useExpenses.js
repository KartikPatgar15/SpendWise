// src/hooks/useExpenses.js
// Extracts all expense fetch + CRUD logic from Tracker.jsx.
// Tracker.jsx calls this hook instead of managing the state itself.
// Existing behavior is preserved exactly.

import { useState, useCallback } from "react";
import API from "../services/api";

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/expenses/history");
      setExpenses(res.data);
      return res.data;
    } catch (e) {
      setError("Failed to load expenses");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeekly = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/expenses/weekly");
      setWeeklyData(res.data);
      return res.data;
    } catch (e) {
      setError("Failed to load weekly data");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMonthly = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/expenses/monthly");
      setMonthlyData(res.data);
      return res.data;
    } catch (e) {
      setError("Failed to load monthly data");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = useCallback(async (expense) => {
    await API.post("/expenses", {
      ...expense,
      amount: Number(expense.amount),
    });
    // Refetch history to stay in sync
    await fetchHistory();
  }, [fetchHistory]);

  const deleteExpense = useCallback(async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch {
      throw new Error("Failed to delete expense");
    }
  }, []);

  const updateExpense = useCallback(async (id, editForm) => {
    try {
      await API.put(`/expenses/${id}`, editForm);
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...editForm } : e))
      );
    } catch {
      throw new Error("Failed to update expense");
    }
  }, []);

  return {
    expenses,
    weeklyData,
    monthlyData,
    loading,
    error,
    fetchHistory,
    fetchWeekly,
    fetchMonthly,
    addExpense,
    deleteExpense,
    updateExpense,
    // Allow direct override (for views that already mutate data)
    setExpenses,
  };
}