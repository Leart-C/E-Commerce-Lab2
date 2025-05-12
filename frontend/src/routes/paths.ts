export const PATH_PUBLIC = {
  home: "/",
  register: "/register",
  login: "/login",
  unauthorized: "/unauthorized",
  products: "/products",
  notFound: "/404",
};

export const PATH_DASHBOARD = {
  dashboard: "/dashboard",
  usersManagement: "/dashboard/users-management",
  updateRole: "/dashboard/update-role/:userName",
  systemLogs: "/dashboard/system-logs",
  myLogs: "/dashboard/my-logs",
  owner: "/dashboard/owner",
  admin: "/dashboard/admin",
  manager: "/dashboard/manager",
  user: "/dashboard/user",
};

export const baseUrl = "https://localhost:5162/api/Product/Get";

export const updateUrl = "https://localhost:5162/api/Product";
