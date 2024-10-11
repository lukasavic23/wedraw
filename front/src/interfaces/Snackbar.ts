export type SnackbarSeverity = "success" | "error";

export type SnackbarState =
  | {
      open: true;
      message: string;
      severity: SnackbarSeverity;
    }
  | {
      open: false;
      message?: never;
      severity?: never;
    };
