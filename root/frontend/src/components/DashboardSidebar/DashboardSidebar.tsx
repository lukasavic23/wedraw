import { useAtomValue, useSetAtom } from "jotai";
import NewSheet from "../Sheets/NewSheet/NewSheet";
import styles from "./DashboardSidebar.module.css";
import { selectedSheetIdAtom, sheetsAtom } from "../../atoms/sheets";
import ExistingSheet from "../Sheets/ExistingSheet/ExistingSheet";

const DashboardSidebar = () => {
  const sheets = useAtomValue(sheetsAtom);
  const setSelectedSheetId = useSetAtom(selectedSheetIdAtom);

  return (
    <section className={styles.sidebar}>
      <header className={styles.sidebar_header}>Sheets</header>
      <section className={styles.sidebar_content}>
        <NewSheet />
        <div className={styles.existing_sheets}>
          {sheets.map((sheet) => (
            <ExistingSheet
              key={sheet.id}
              sheet={sheet}
              onClick={() => setSelectedSheetId(sheet.id)}
            />
          ))}
        </div>
      </section>
    </section>
  );
};

export default DashboardSidebar;
