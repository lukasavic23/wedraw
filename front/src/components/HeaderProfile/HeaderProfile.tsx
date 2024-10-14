import { useState } from "react";
import { useAuthContext } from "../../context/AuthProvider";
import styles from "./HeaderProfile.module.css";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import classNames from "classnames";
import AuthenticationService from "../../services/AuthenticationService";

const capitalizeFirstLetter = (string: string | undefined) => {
  if (!string) return "";

  return string.charAt(0).toUpperCase() + string.slice(1);
};

const HeaderProfile = () => {
  const { auth, setAuth } = useAuthContext();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const outsideClickRef = useOutsideClick(() => setIsDropdownOpen(false));

  const userInitials = `${auth?.name[0]}${auth?.lastName[0]}`.toUpperCase();

  const handleLogout = () => {
    AuthenticationService.logout()
      .then(() => {
        setAuth(null);
      })
      .catch(() => {
        setAuth(null);
      });
  };

  return (
    <div className={styles.header_profile_wrapper} ref={outsideClickRef}>
      <button
        className={classNames(
          styles.header_profile,
          isDropdownOpen ? "" : styles.header_profile_hover
        )}
        onClick={() => setIsDropdownOpen(true)}
      >
        {userInitials}
      </button>
      {isDropdownOpen ? (
        <div className={styles.dropdown}>
          <div className={styles.dropdown_profile}>
            <div className={styles.header_profile}>{userInitials}</div>
            <div className={styles.user_information}>
              <p className={styles.user_information_name}>
                {capitalizeFirstLetter(auth?.name)}{" "}
                {capitalizeFirstLetter(auth?.lastName)}
              </p>
              <p className={styles.user_information_email}>{auth?.email}</p>
            </div>
          </div>
          <div className={styles.dropdown_settings}>
            <button className={styles.dropdown_item}>
              <Person2Icon />
              <p className={styles.dropdown_item_text}>Account</p>
            </button>
            <button className={styles.dropdown_item} onClick={handleLogout}>
              <LogoutIcon />
              <p className={styles.dropdown_item_text}>Logout</p>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HeaderProfile;
