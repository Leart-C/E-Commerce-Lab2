import { getRefreshToken, setSession, removeSession } from "./session";
import axiosInstance from "../utils/axiosInstance";

export const refreshToken = async (): Promise<boolean> => {
  try {
    const token = getRefreshToken();
    if (!token) return false;

    const response = await axiosInstance.post(
      "https://localhost:7039/api/Auth/refresh-token",
      {},
      {
        headers: {
          refreshtoken: token,
        },
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    setSession(accessToken, newRefreshToken);

    return true;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    removeSession();
    return false;
  }
};
