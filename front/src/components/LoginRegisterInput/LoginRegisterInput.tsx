import { ComponentProps } from "react";
import styles from "./LoginRegisterInput.module.css";
import errorIcon from "../../assets/icon_error.svg";
import classNames from "classnames";

interface LoginRegisterInputProps extends ComponentProps<"input"> {
  labelName: string;
  error?: string;
}

const LoginRegisterInput = (props: LoginRegisterInputProps) => {
  const { labelName, error, ...inputProps } = props;

  return (
    <>
      <label htmlFor={props.name} className={styles.label}>
        {labelName} {inputProps.required && "*"}
      </label>
      <input
        className={classNames(styles.input, error ? styles.error_input : "")}
        {...inputProps}
      />
      {error && (
        <div className={styles.error}>
          <img src={errorIcon} width={15} height={15} />
          <p className={styles.error_text}>{error}</p>
        </div>
      )}
    </>
  );
};

export default LoginRegisterInput;
