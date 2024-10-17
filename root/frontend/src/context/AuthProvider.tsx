import { createContext, useState, ReactNode, useMemo, useContext } from "react";
import { AuthenticationResponse } from "../interfaces/Login";

type Auth = AuthenticationResponse;

interface AuthProviderArgs {
  children: ReactNode;
}

interface ContextValue {
  auth: Auth | null;
  setAuth: React.Dispatch<React.SetStateAction<Auth | null>>;
}

const AuthContext = createContext<ContextValue | null>(null);

export const AuthProvider = ({ children }: AuthProviderArgs) => {
  const [auth, setAuth] = useState<Auth | null>(null);

  const contextValue = useMemo(() => ({ auth, setAuth }), [auth]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider!");
  }

  return context;
};
