import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
  withCredentials: true,
});

// Optional: Token auto attach
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 