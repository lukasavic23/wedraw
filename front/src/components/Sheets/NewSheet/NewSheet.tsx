import styles from "./NewSheet.module.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const NewSheet = () => {
  return (
    <div className={styles.new_sheet}>
      <button className={styles.new_sheet_btn}>
        <AddCircleIcon color="primary" />
      </button>
    </div>
  );
};

export default NewSheet;
