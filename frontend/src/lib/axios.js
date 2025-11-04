import axios from "axios";

// Set to 5002 (or whichever port your task app's backend is using)
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5002/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
