import styles from "./LoginRegisterButton.module.css";

interface LoginRegisterButtonProps {
  type: "login" | "register";
  disabled: boolean;
  onClick: () => void;
  className?: string;
}

const LoginRegisterButton = (props: LoginRegisterButtonProps) => {
  const { type, disabled, onClick, className } = props;

  return (
    <button
      className={`${styles.button} ${className ?? ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {type === "login" ? "Log in" : "Register"}
    </button>
  );
};

export default LoginRegisterButton;
