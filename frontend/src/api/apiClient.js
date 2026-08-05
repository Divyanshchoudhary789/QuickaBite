import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://quikabite.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically attach authorization tokens (ready for Phase 2)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("globaleats_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || "");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error/success logs
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] Success from ${response.config?.url}`);
    return response;
  },
  (error) => {
    console.error(
      `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} (${error.response?.status}):`,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export const parseApiError = (error, fallbackMessage = "An unexpected error occurred.") => {
  if (!error) return fallbackMessage;
  if (typeof error === "string") return error;

  const data = error.response?.data || error.data || (typeof error === "object" && !error.message ? error : null);

  if (data) {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return parseApiError(parsed, fallbackMessage);
      } catch {
        return data;
      }
    }

    if (data.message && typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (data.error && typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const firstErr = data.errors[0];
      if (typeof firstErr === "string") return firstErr;
      if (firstErr?.msg) return firstErr.msg;
      if (firstErr?.message) return firstErr.message;
      if (typeof firstErr === "object") return JSON.stringify(firstErr);
    }
  }

  if (error.message && typeof error.message === "string") {
    return error.message;
  }

  return fallbackMessage;
};

export default apiClient;

