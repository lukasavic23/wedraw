import DashboradHeader from "../../components/DashboardHeader/DashboradHeader";
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";
import styles from "./Dashboard.module.css";

const Welcome = () => {
  return (
    <div className={styles.dashboard}>
      <DashboardSidebar />
      <section className={styles.dashboard_content}>
        <DashboradHeader />
      </section>
    </div>
  );
};

export default Welcome;
