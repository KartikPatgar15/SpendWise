// src/hooks/useRecurring.js
// Phase 3 — Recurring expenses hook.

import { useState, useCallback } from "react";
import API from "../services/api";

export function useRecurring() {
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading]     = useState(false);

  const fetchRecurring = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/recurring");
      setRecurring(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const addRecurring = useCallback(async (item) => {
    const res = await API.post("/recurring", item);
    setRecurring((prev) => [...prev, res.data]);
  }, []);

  const updateRecurring = useCallback(async (id, item) => {
    const res = await API.put(`/recurring/${id}`, item);
    setRecurring((prev) => prev.map((r) => (r.id === id ? res.data : r)));
  }, []);

  const deleteRecurring = useCallback(async (id) => {
    await API.delete(`/recurring/${id}`);
    setRecurring((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { recurring, loading, fetchRecurring, addRecurring, updateRecurring, deleteRecurring };
}
