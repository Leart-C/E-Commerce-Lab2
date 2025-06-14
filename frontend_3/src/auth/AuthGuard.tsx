import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.hook";
import AuthSpinner from "../components/general/AuthSpinner";
import { PATH_PUBLIC } from "../routes/paths";

interface IProps {
  roles: string[];
}

const AuthGuard = ({ roles }: IProps) => {
  const { isAuthenticated, user, isAuthLoading } = useAuth();
  const hasAccess =
    isAuthenticated && user?.roles?.find((q) => roles.includes(q));
  if (isAuthLoading) {
    console.log("Loading authentication...");
    return <AuthSpinner />;
  }

  if (!hasAccess) {
    console.warn("Access denied for roles:", roles, "user:", user);
  }

  return hasAccess ? <Outlet /> : <Navigate to={PATH_PUBLIC.unauthorized} />;
};
export default AuthGuard;
