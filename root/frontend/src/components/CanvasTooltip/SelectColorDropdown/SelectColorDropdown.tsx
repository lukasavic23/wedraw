import classNames from "classnames";
import { HexColor } from "../../../interfaces/Common";
import styles from "./SelectColorDropdown.module.css";

interface SelectColorDropdownProps {
  selectedColor: HexColor;
  onSelectColor: (color: HexColor) => void;
}

const BASE_COLORS: HexColor[] = [
  "#000000",
  "#808080",
  "#0000ff",
  "#ffff00",
  "#ff0000",
  "#ffa500",
  "#008000",
  "#800080",
];

const SelectColorDropdown = (props: SelectColorDropdownProps) => {
  const { selectedColor, onSelectColor } = props;

  return (
    <div className={styles.dropdown}>
      <div className={styles.base_colors}>
        {BASE_COLORS.map((color) => (
          <div
            className={classNames(
              styles.color_circle_wrapper,
              selectedColor === color ? styles.selected : ""
            )}
            onClick={() => onSelectColor(color)}
          >
            <div
              key={color}
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
