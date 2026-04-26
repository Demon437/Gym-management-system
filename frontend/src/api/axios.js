import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // backend URL
  withCredentials: true,
});
{console.log("API URL:", import.meta.env.VITE_API_URL)}

// Optional: Token auto attach
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 