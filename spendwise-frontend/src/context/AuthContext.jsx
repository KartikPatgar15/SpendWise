import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("spendwise_token") || null);
  const [user, setUser]   = useState(() => {
    try {
      const stored = localStorage.getItem("spendwise_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleAuthExpired = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener("spendwise_auth_expired", handleAuthExpired);
    return () => window.removeEventListener("spendwise_auth_expired", handleAuthExpired);
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { username, password });
      const { token: receivedToken, id, username: uname, role } = res.data;
      const userData = { id, username: uname, role };

      localStorage.setItem("spendwise_token", receivedToken);
      localStorage.setItem("spendwise_user", JSON.stringify(userData));

      setToken(receivedToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed. Please check your credentials.";
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/register", { username, password });
      const { token: receivedToken, id, username: uname, role } = res.data;
      const userData = { id, username: uname, role };

      localStorage.setItem("spendwise_token", receivedToken);
      localStorage.setItem("spendwise_user", JSON.stringify(userData));

      setToken(receivedToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed. Please try again.";
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("spendwise_token");
    localStorage.removeItem("spendwise_user");
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
