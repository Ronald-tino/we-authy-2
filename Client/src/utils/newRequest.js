import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8800/api";

const newRequest = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

newRequest.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("currentUser");
    const parsed = stored ? JSON.parse(stored) : null;
    const token = parsed?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {}
  return config;
});

export default newRequest;
