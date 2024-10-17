import HeaderProfile from "../HeaderProfile/HeaderProfile";
import Logo from "../Logo/Logo";
import styles from "./DashboardHeader.module.css";

const DashboradHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header_message}>
        <p>Welcome to</p>
        <Logo />
      </div>
      <HeaderProfile />
    </header>
  );
};

export default DashboradHeader;
