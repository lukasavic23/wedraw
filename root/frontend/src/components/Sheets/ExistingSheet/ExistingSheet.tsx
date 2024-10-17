import { ISheet } from "../../../interfaces/Sheet";
import styles from "./ExistingSheet.module.css";

interface ExistingSheetProps {
  sheet: ISheet;
  onClick: () => void;
}

const ExistingSheet = ({ sheet, onClick }: ExistingSheetProps) => {
  return (
    <div className={styles.existing_sheet} onClick={onClick}>
      {sheet.drawing ? (
        <img className={styles.existing_sheet_img} src={sheet.drawing} />
      ) : null}
      <p className={styles.existing_sheet_name}>{sheet.name}</p>
    </div>
  );
};

export default ExistingSheet;
