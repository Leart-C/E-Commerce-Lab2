import { IAuthUser, RolesEnum } from "../types/auth.types";
import axiosInstance from "../utils/axiosInstance";

export function setSession(token: string | null, refreshToken: string | null) {
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  } else {
    localStorage.removeItem("refreshToken");
  }
}

console.log("Stored token:", localStorage.getItem("accessToken"));

export const getSession = () => {
  return localStorage.getItem("accessToken");
};

export const allAccessRoles = [
  RolesEnum.OWNER,
  RolesEnum.ADMIN,
  RolesEnum.MANAGER,
  RolesEnum.USER,
];
export const managerAccessRoles = [
  RolesEnum.OWNER,
  RolesEnum.ADMIN,
  RolesEnum.MANAGER,
];
export const adminAccessRoles = [RolesEnum.OWNER, RolesEnum.ADMIN];
export const ownerAccessRoles = [RolesEnum.OWNER];

export const allowedRolesForUpdateArray = (
  loggedInUser?: IAuthUser
): string[] => {
  return loggedInUser?.roles.includes(RolesEnum.OWNER)
    ? [RolesEnum.ADMIN, RolesEnum.MANAGER, RolesEnum.USER]
    : [RolesEnum.MANAGER, RolesEnum.USER];
};

// auth.utils.ts

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

export const isAuthorizedForUpdateRole = (
  loggedInUserRole: string,
  selectedUserRole: string
) => {
  let result = true;
  if (
    loggedInUserRole === RolesEnum.OWNER &&
    selectedUserRole === RolesEnum.OWNER
  ) {
    result = false;
  } else if (
    loggedInUserRole === RolesEnum.ADMIN &&
    (selectedUserRole === RolesEnum.OWNER ||
      selectedUserRole === RolesEnum.ADMIN)
  ) {
    result = false;
  }

  return result;
};
