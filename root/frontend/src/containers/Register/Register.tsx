import { useState } from "react";
import LoginRegisterButton from "../../components/LoginRegisterButton/LoginRegisterButton";
import Logo from "../../components/Logo/Logo";
import { URLRoutes } from "../../enums/Routes";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import LoginRegisterInput from "../../components/LoginRegisterInput/LoginRegisterInput";
import validator from "validator";
import AuthenticationService from "../../services/AuthenticationService";
import { useAuthContext } from "../../context/AuthProvider";
import { useSnackbarContext } from "../../context/SnackbarProvider";

interface FormValues {
  name: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
}

type FieldError =
  | { error: true; message: string }
  | { error: false; message?: never };

interface FormValueErrors {
  name: FieldError;
  lastName: FieldError;
  email: FieldError;
  password: FieldError;
  confirmPassword: FieldError;
}

const Register = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthContext();
  const { openSnackbar } = useSnackbarContext();

  const [formValues, setFormValues] = useState<FormValues>({
    name: undefined,
    lastName: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
  });
  const [formErrors, setFormErrors] = useState<FormValueErrors | null>(null);

  const handleFormErrors = () => {
    const errors: FormValueErrors = {
      name: { error: false },
      lastName: { error: false },
      email: { error: false },
      password: { error: false },
      confirmPassword: { error: false },
    };

    // name validation
    if (formValues.name === "" || formValues.name === undefined) {
      errors.name = { error: true, message: "Name is required." };
    }

    // last name validation
    if (formValues.name === "" || formValues.name === undefined) {
      errors.lastName = { error: true, message: "Last name is required." };
    }

    // email validation
    if (formValues.email === "" || formValues.email === undefined) {
      errors.email = { error: true, message: "Email is required." };
    } else if (formValues.email && !validator.isEmail(formValues.email)) {
      errors.email = { error: true, message: "Email format is not valid." };
    }

    // password validation
    if (formValues.password === "" || formValues.password === undefined) {
      errors.password = { error: true, message: "Password is required." };
    }

    // confirm password validation
    if (formValues.confirmPassword === "") {
      errors.confirmPassword = {
        error: true,
        message: "Password confirmation is required.",
      };
    } else if (
      formValues.password &&
      formValues.confirmPassword &&
      formValues.password !== formValues.confirmPassword
    ) {
      errors.confirmPassword = {
        error: true,
        message: "Passwords do not match!",
      };
    }

    if (Object.values(errors).some((value) => value.error)) {
      return errors;
    } else {
      return null;
    }
  };

  const isRegisterDisabled = Object.values(formValues).some(
    (formValue) => formValue === "" || formValue === undefined
  );

  const handleRegister = () => {
    const errors = handleFormErrors();
    if (errors !== null) {
      return setFormErrors(errors);
    }

    if (
      !formValues.name ||
      !formValues.lastName ||
      !formValues.email ||
      !formValues.password ||
      !formValues.confirmPassword
    )
      return;

    AuthenticationService.register({
      name: formValues.name,
      lastName: formValues.name,
      email: formValues.email,
      password: formValues.password,
      passwordConfirm: formValues.confirmPassword,
    })
      .then((response) => {
        navigate(URLRoutes.Dashboard);
        setAuth(response.data.data);
      })
      .catch((err) => {
        openSnackbar(err.response.data.message, "error");
      });

    setFormErrors(null);
  };

  return (
    <div className={styles.register_wrapper}>
      <Logo />
      <div className={styles.register_form_layout}>
        <p className={styles.form_title}>Register</p>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div className={styles.input_wrapper}>
            <LoginRegisterInput
              labelName="Name"
              name="name"
              type="name"
              required
              autoFocus
              error={
                formErrors?.name.error ? formErrors.name.message : undefined
              }
              value={formValues.name || ""}
              onChange={(e) => {
                setFormValues((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
            />
          </div>
          <div className={styles.input_wrapper}>
            <LoginRegisterInput
              labelName="Last name"
              name="lastName"
              type="lastName"
              required
              error={
                formErrors?.lastName.error
                  ? formErrors.lastName.message
                  : undefined
              }
              value={formValues.lastName || ""}
              onChange={(e) => {
                setFormValues((prev) => ({
                  ...prev,
                  lastName: e.target.value,
                }));
              }}
            />
          </div>
          <div className={styles.input_wrapper}>
            <LoginRegisterInput
              labelName="Email"
              name="email"
              type="name"
              required
              error={
                formErrors?.email.error ? formErrors.email.message : undefined
              }
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
            <LoginRegisterInput
              labelName="Password"
              name="password"
              type="password"
              required
              error={
                formErrors?.password.error
                  ? formErrors.password.message
                  : undefined
              }
              value={formValues.password || ""}
              onChange={(e) => {
                setFormValues((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />
          </div>
          <div className={styles.input_wrapper}>
            <LoginRegisterInput
              labelName="Confirm password"
              name="confirmPassword"
              type="password"
              required
              error={
                formErrors?.confirmPassword.error
                  ? formErrors.confirmPassword.message
                  : undefined
              }
              value={formValues.confirmPassword || ""}
              onChange={(e) => {
                setFormValues((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }));
              }}
            />
          </div>
          <LoginRegisterButton
            type="submit"
            text="Register"
            disabled={isRegisterDisabled}
          />
        </form>
      </div>
      <div className={styles.register_breakline}>
        <div className={styles.separator}></div>
        <p className={styles.register_breakline_text}>
          Already have an account?
        </p>
        <div className={styles.separator}></div>
      </div>
      <LoginRegisterButton
        type="button"
        text="Log in"
        className={styles.create_acc_btn}
        onClick={() => navigate(URLRoutes.Empty)}
      />
    </div>
  );
};

export default Register;
