import { useCallback, useEffect, useRef, useState } from "react";
import { SnackbarState, SnackbarSeverity } from "../interfaces/Snackbar";

const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false });

  const snackbarTimeout = useRef<ReturnType<typeof setTimeout>>();

  const openSnackbar = useCallback(
    (message: string, severity: SnackbarSeverity) => {
      setSnackbar({ open: true, message, severity });

      snackbarTimeout.current = setTimeout(() => {
        setSnackbar({ open: false });
      }, 5000);
    },
    []
  );

  const closeSnackbar = useCallback(() => {
    setSnackbar({ open: false });
    snackbarTimeout.current = undefined;
  }, []);

  useEffect(() => {
    return () => {
      snackbarTimeout.current = undefined;
    };
  }, []);

  return { snackbar, openSnackbar, closeSnackbar };
};

export default useSnackbar;
