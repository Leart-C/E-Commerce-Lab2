import axios from "axios";
import { getAccessToken, removeSession } from "../auth/session";
import { refreshToken } from "../auth/refreshToken";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7039", // zëvendëso me URL-në të backend-it
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const success = await refreshToken();
      if (success) {
        const newAccessToken = getAccessToken();
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } else {
        removeSession();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
