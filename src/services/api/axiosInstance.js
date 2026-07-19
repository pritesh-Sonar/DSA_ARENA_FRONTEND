import axios from "axios";
import { toastManager } from "../../utils/toastManager";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Maps each rate-limited endpoint to a human-readable cooldown message.
// Keep this in sync with the durations set in RateLimitFilter.java on the backend.
const RATE_LIMIT_MESSAGES = {
  "/api/auth/login": "Too many login attempts. Please try again in 1 minute.",
  "/api/auth/send-otp": "Too many OTP requests. Please try again in 5 minutes.",
  "/api/auth/verify-otp": "Too many verification attempts. Please try again in 5 minutes.",
  "/api/auth/forgot-password": "Too many requests. Please try again in 5 minutes.",
  "/api/auth/reset-password": "Too many reset attempts. Please try again in 5 minutes.",
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes("/api/auth/");

    if (error.response?.status === 429) {
      const url = error.config?.url || "";
      const matchedPath = Object.keys(RATE_LIMIT_MESSAGES).find((path) =>
        url.includes(path)
      );
      const message = matchedPath
        ? RATE_LIMIT_MESSAGES[matchedPath]
        : "Too many requests. Please try again shortly.";

      toastManager.show(message, "error");
    }

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;