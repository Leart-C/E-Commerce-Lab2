import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setSession,
  removeSession,
} from "../auth/auth.utils";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7039/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Set Bearer token nqs ekziston
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

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token: string) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          "https://localhost:7039/api/Auth/refresh-token",
          {
            refreshToken: getRefreshToken(),
          }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          refreshResponse.data;
        setSession(accessToken, newRefreshToken);
        axiosInstance.defaults.headers.common.Authorization =
          "Bearer " + accessToken;

        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        removeSession();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
