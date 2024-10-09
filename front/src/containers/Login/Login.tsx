import { useState } from "react";
import LoginRegisterButton from "../../components/LoginRegisterButton/LoginRegisterButton";
import Logo from "../../components/Logo/Logo";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { URLRoutes } from "../../enums/Routes";
import AuthenticationService from "../../services/AuthenticationService";
import { useAuthContext } from "../../context/AuthProvider";

interface FormValues {
  email: string | undefined;
  password: string | undefined;
}

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthContext();

  const [formValues, setFormValues] = useState<FormValues>({
    email: undefined,
    password: undefined,
  });

  const isLoginDisabled = formValues.email === "" || formValues.password === "";

  const handleLogin = () => {
    const { email, password } = formValues;

    if (!email || !password) return;

    AuthenticationService.login({ email, password })
      .then((response) => {
        navigate(URLRoutes.Welcome);
        setAuth(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className={styles.login_wrapper}>
      <Logo />
      <div className={styles.login_form_layout}>
        <p className={styles.form_title}>Sign in</p>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className={styles.input_wrapper}>
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              autoFocus
              value={formValues.email || ""}
              onChange={(e) => {
                setFormValues((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
            />
          </div>
          <div className={styles.input_wrapper}>
            <label>Password</label>
            <input
              type="password"
              value={formValues.password || ""}
              onChange={(e) => {
                setFormValues((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />
          </div>
          <LoginRegisterButton
            type="submit"
            text="Log in"
            disabled={isLoginDisabled}
          />
        </form>
      </div>
      <div className={styles.register_breakline}>
        <div className={styles.separator}></div>
        <p className={styles.register_breakline_text}>Don't have an account?</p>
        <div className={styles.separator}></div>
      </div>
      <LoginRegisterButton
        type="button"
        text="Create an account"
        className={styles.create_acc_btn}
        onClick={() => navigate(URLRoutes.Register)}
      />
    </div>
  );
};

export default Login;
