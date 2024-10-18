import { createContext, ReactNode, useContext, useMemo } from "react";
import useSnackbar from "../hooks/useSnackbar";
import { SnackbarState, SnackbarSeverity } from "../types/Snackbar";
import Snackbar from "../components/Snackbar/Snackbar";

interface SnackbarProviderArgs {
  children: ReactNode;
}

interface ContextValue {
  snackbar: SnackbarState;
  openSnackbar: (message: string, severity: SnackbarSeverity) => void;
  closeSnackbar: () => void;
}

const SnackbarContext = createContext<ContextValue | null>(null);

export const SnackbarProvider = ({ children }: SnackbarProviderArgs) => {
  const { snackbar, openSnackbar, closeSnackbar } = useSnackbar();

  const contextValue = useMemo(
    () => ({ snackbar, openSnackbar, closeSnackbar }),
    [closeSnackbar, openSnackbar, snackbar]
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {snackbar.open ? (
        <Snackbar
          message={snackbar.message}
          severity={snackbar.severity}
          onCloseSnackbar={closeSnackbar}
        />
      ) : null}
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error(
      "useSnackbarContext must be used within a SnackbarProvider!"
    );
  }

  return context;
};
