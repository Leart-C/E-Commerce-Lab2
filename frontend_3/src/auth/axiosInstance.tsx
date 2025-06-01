import axios from "axios";
import { setSession } from "../auth/auth.utils";
import { getAccessToken, getRefreshToken, removeSession } from "./session";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7039/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Vendos token fillestar në headers nëse ekziston
const token = getAccessToken();
if (token) {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
}

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // KONTROLL: Nëse kemi 401 dhe s’jemi refreshuar më parë
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        // Bëj refresh token
        const refreshResponse = await axios.post(
          "https://localhost:7039/api/Auth/refresh-token",
          {},
          {
            headers: {
              refreshtoken: getRefreshToken(),
            },
          }
        );

        const { accessToken, refreshToken } = refreshResponse.data;

        // Ruaj tokenat e rinj
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Përditëso Authorization header global dhe të kërkesës aktuale
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        // Riprovo kërkesën origjinale me token të ri
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        removeSession(); // fshij token-at nëse refresh dështoi
        window.location.href = "/unauthorized"; // ose thirr logout()
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
