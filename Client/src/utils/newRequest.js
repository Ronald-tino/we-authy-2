import axios from "axios";
import { getCurrentUserToken } from "../firebase/auth";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8800/api";

const newRequest = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

newRequest.interceptors.request.use(async (config) => {
  try {
    // Get Firebase ID token
    const token = await getCurrentUserToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error getting Firebase token:", error);
  }
  return config;
});

export default newRequest;
