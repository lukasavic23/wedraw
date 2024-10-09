import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";
import { URLRoutes } from "../../enums/Routes";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { auth } = useAuthContext();

  return auth?.accessToken ? children : <Navigate to={URLRoutes.Empty} />;
};

export default ProtectedRoute;
