import LoginRegisterButton from "../../components/LoginRegisterButton/LoginRegisterButton";
import Logo from "../../components/Logo/Logo";
import styles from "./Login.module.css";

const Login = () => {
  return (
    <div className={styles.login_wrapper}>
      <Logo />
      <div className={styles.login_form_layout}>
        <p className={styles.form_title}>Sign in</p>
        <form className={styles.form}>
          <div className={styles.input_wrapper}>
            <label>Email</label>
            <input type="email" autoFocus />
          </div>
          <div className={styles.input_wrapper}>
            <label>Password</label>
            <input type="password" />
          </div>
          <LoginRegisterButton
            type="login"
            disabled={false}
            onClick={() => {}}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
