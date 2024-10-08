import { ComponentProps } from "react";
import styles from "./LoginRegisterButton.module.css";

interface LoginRegisterButtonProps extends ComponentProps<"button"> {
  text: string;
  className?: string;
}

const LoginRegisterButton = (props: LoginRegisterButtonProps) => {
  const { text, disabled, onClick, className, ...restProps } = props;

  return (
    <button
      className={`${styles.button} ${className ?? ""}`}
      disabled={disabled}
      onClick={onClick}
      {...restProps}
    >
      {text}
    </button>
  );
};

export default LoginRegisterButton;
