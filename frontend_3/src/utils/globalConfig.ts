import { PATH_DASHBOARD, PATH_PUBLIC } from "../routes/paths";

export const HOST_API_KEY = "https://localhost:7039/api";
export const REGISTER_URL = "/api/Auth/register";
export const LOGIN_URL = "/api/Auth/login";
export const ME_URL = "/api/Auth/me";
export const USERS_LIST_URL = "/api/Auth/users";
export const UPDATE_ROLE_URL = "/api/Auth/update-role";
export const USERNAMES_LIST_URL = "/Auth/usernames";
export const ALL_MESSAGES_URL = "/Messages";
export const CREATE_MESSAGE_URL = "/Messages/create";
export const MY_MESSAGE_URL = "/Messages/mine";
export const LOGS_URL = "/api/Logs";
export const MY_LOGS_URL = "/api/Logs/mine";

export const PATH_AFTER_REGISTER = PATH_PUBLIC.login;
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.dashboard;
export const PATH_AFTER_LOGOUT = PATH_PUBLIC.home;
