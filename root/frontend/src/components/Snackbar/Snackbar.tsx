import classNames from "classnames";
import { SnackbarSeverity } from "../../types/Snackbar";
import styles from "./Snackbar.module.css";

interface SnackbarProps {
  message: string;
  severity: SnackbarSeverity;
  onCloseSnackbar: () => void;
}

const Snackbar = (props: SnackbarProps) => {
  const getSnackbarClass = () => {
    switch (props.severity) {
      case "success":
        return styles.success_snackbar;
      case "error":
        return styles.error_snackbar;
    }
  };

  return (
    <div className={classNames(styles.snackbar, getSnackbarClass())}>
      <p className={styles.text}>{props.message}</p>
      <button type="button" onClick={props.onCloseSnackbar}>
        X
      </button>
    </div>
  );
};

export default Snackbar;
