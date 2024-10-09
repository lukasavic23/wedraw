import { useCallback, useState } from "react";
import { useAuthContext } from "../context/AuthProvider";
import AuthenticationService from "../services/AuthenticationService";

const useRefreshToken = () => {
  const { setAuth } = useAuthContext();
  const [isFetching, setIsFetching] = useState(true);

  const handleRefreshToken = useCallback(() => {
    return AuthenticationService.refreshUser()
      .then((response) => {
        setAuth(response.data.data);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsFetching(false));
  }, [setAuth]);

  return { handleRefreshToken, isFetching };
};

export default useRefreshToken;
