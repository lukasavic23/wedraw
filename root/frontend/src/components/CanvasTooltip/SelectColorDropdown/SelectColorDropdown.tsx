import classNames from "classnames";
import { HexColor } from "../../../types/Common";
import styles from "./SelectColorDropdown.module.css";
import { CanvasHexColors } from "../../../enums/Canvas";

interface SelectColorDropdownProps {
  selectedColor: HexColor;
  onSelectColor: (color: HexColor) => void;
}

const BASE_COLORS = Object.values(CanvasHexColors);

const SelectColorDropdown = (props: SelectColorDropdownProps) => {
  const { selectedColor, onSelectColor } = props;

  return (
    <div className={styles.dropdown}>
      <div className={styles.base_colors}>
        {BASE_COLORS.map((color) => (
          <div
            key={color}
            className={classNames(
              styles.color_circle_wrapper,
              selectedColor === color ? styles.selected : ""
            )}
            onClick={() => onSelectColor(color)}
          >
            <div
              className={styles.color_circle}
              style={{ backgroundColor: color }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectColorDropdown;
