import ColorLensIcon from "@mui/icons-material/ColorLens";
import styles from "./CanvasTooltip.module.css";
import { useState } from "react";
import SelectColorDropdown from "./SelectColorDropdown/SelectColorDropdown";
import { HexColor } from "../../interfaces/Common";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const CanvasTooltip = () => {
  const [selectedColor, setSelectedColor] = useState<HexColor>("#000000");
  const [openColorDropdown, setOpenColorDropdown] = useState<boolean>(false);

  const outsideClickRef = useOutsideClick(() => setOpenColorDropdown(false));

  return (
    <>
      <div className={styles.tooltip}>
        <div className={styles.colors_wrapper}>
          <div className={styles.colors_indicator}>
            <ColorLensIcon sx={{ color: "white" }} fontSize="small" />
            <p>Color</p>
          </div>
          <div
            onClick={() => setOpenColorDropdown(true)}
            className={styles.selected_color}
            style={{ backgroundColor: selectedColor }}
            ref={outsideClickRef}
          >
            {openColorDropdown && (
              <SelectColorDropdown
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CanvasTooltip;
