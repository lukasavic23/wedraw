import { useLayoutEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthProvider";
import useRefreshToken from "../../hooks/useRefreshToken";
import { Navigate, Outlet } from "react-router-dom";
import { URLRoutes } from "../../enums/Routes";

interface PersistentLoginProps {
  isGuestRoute?: boolean;
}

const PersistentLogin = ({ isGuestRoute }: PersistentLoginProps) => {
  const { auth } = useAuthContext();
  const { handleRefreshToken, isFetching } = useRefreshToken();

  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const verifyRefreshToken = () => {
      handleRefreshToken()
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    };

    if (auth?.accessToken) {
      setIsLoading(false);
    } else {
      verifyRefreshToken();
    }
  }, [auth?.accessToken, handleRefreshToken]);

  if (isGuestRoute) {
    if (auth?.accessToken && !isFetching) {
      return <Navigate to={URLRoutes.Dashboard} />;
    } else if (isFetching) {
      return <p>loading..</p>;
    } else {
      return <Outlet />;
    }
  }

  return isLoading ? <p>Loading...</p> : <Outlet />;
};

export default PersistentLogin;
