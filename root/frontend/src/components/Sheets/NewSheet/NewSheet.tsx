import { useState } from "react";
import styles from "./NewSheet.module.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useSetAtom } from "jotai";
import { selectedSheetIdAtom, sheetsAtom } from "../../../atoms/sheets";
import { v4 as uuidv4 } from "uuid";

enum ErrorType {
  EmptyValue = 1,
  ValueExists = 2,
}

const INPUT_ERROR = {
  [ErrorType.EmptyValue]: "Sheet name cannot be empty.",
  [ErrorType.ValueExists]: "Sheet name already exists.",
};

const NewSheet = () => {
  const [openInput, setOpenInput] = useState<boolean>(false);
  const [sheetName, setSheetName] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const setSheets = useSetAtom(sheetsAtom);
  const setSelectedSheetId = useSetAtom(selectedSheetIdAtom);

  const closeInput = () => {
    setError(undefined);
    setSheetName(undefined);
    setOpenInput(false);
  };

  const outsideClickRef = useOutsideClick(closeInput);

  const handleAddNewSheet = (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!sheetName) return setError(INPUT_ERROR[ErrorType.EmptyValue]);

    const newSheet = { id: uuidv4(), name: sheetName };
    setSheets((prevSheets) => [...prevSheets, newSheet]);
    setSelectedSheetId(newSheet.id);
    closeInput();
  };

  const handleChangeNewSheetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (error) {
      if (error === INPUT_ERROR[ErrorType.EmptyValue] && value !== "") {
        setError(undefined);
      }
    }

    setSheetName(e.target.value);
  };

  return (
    <div
      className={styles.new_sheet}
      ref={outsideClickRef}
      onClick={() => setOpenInput(true)}
    >
      <button className={styles.new_sheet_btn}>
        <AddCircleIcon color="primary" />
      </button>
      {openInput ? (
        <div className={styles.input_modal}>
          <form onSubmit={handleAddNewSheet}>
            <input
              autoFocus
              placeholder="Enter sheet name"
              value={sheetName || ""}
              onChange={handleChangeNewSheetName}
            />
            <button type="submit" title="Create sheet">
              <NoteAddIcon />
            </button>
          </form>
          {error ? <p className={styles.error}>{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
};

export default NewSheet;
