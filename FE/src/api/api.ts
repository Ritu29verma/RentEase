import axios from "axios";

// Set your FastAPI backend base URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header for each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
