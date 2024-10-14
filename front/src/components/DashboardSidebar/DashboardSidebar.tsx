import NewSheet from "../Sheets/NewSheet/NewSheet";
import styles from "./DashboardSidebar.module.css";

const DashboardSidebar = () => {
  return (
    <section className={styles.sidebar}>
      <header className={styles.sidebar_header}>Sheets</header>
      <section className={styles.sidebar_content}>
        <NewSheet />
      </section>
    </section>
  );
};

export default DashboardSidebar;
