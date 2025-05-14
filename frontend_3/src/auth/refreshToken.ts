import axios from "axios";
import { getRefreshToken, setSession, removeSession } from "./session";

export const refreshToken = async (): Promise<boolean> => {
  try {
    const token = getRefreshToken();
    if (!token) return false;

    const response = await axios.post(
      "https://localhost:7039/api/Auth/refresh-token",
      {
        refreshToken: token,
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
