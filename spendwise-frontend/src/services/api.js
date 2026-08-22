import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081",
});

// Attach Authorization Bearer token to all outgoing requests if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("spendwise_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor to handle session expiry
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config ? error.config.url : "";
      // If unauthorized on protected routes, clear auth storage and notify
      if (!url.includes("/auth/login") && !url.includes("/auth/register")) {
        localStorage.removeItem("spendwise_token");
        localStorage.removeItem("spendwise_user");
        window.dispatchEvent(new Event("spendwise_auth_expired"));
      }
    }
    return Promise.reject(error);
  }
);

export default API;git status