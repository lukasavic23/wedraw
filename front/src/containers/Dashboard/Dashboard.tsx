import { useAtomValue } from "jotai";
import DashboardContent from "../../components/DashboardContent/DashboardContent";
import DashboradHeader from "../../components/DashboardHeader/DashboradHeader";
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";
import styles from "./Dashboard.module.css";
import { selectedSheetAtom } from "../../atoms/sheets";

const Dashboard = () => {
  const selectedSheet = useAtomValue(selectedSheetAtom);

  return (
    <div className={styles.dashboard}>
      <DashboardSidebar />
      <section className={styles.dashboard_content}>
        <DashboradHeader />
        {selectedSheet ? (
          <DashboardContent selectedSheet={selectedSheet} />
        ) : (
          <p className={styles.empty_sheet_msg}>
            Select existing sheets or add new one to create new drawing.
          </p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
