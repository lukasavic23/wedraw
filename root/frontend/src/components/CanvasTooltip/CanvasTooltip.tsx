import ColorLensIcon from "@mui/icons-material/ColorLens";
import styles from "./CanvasTooltip.module.css";
import { Dispatch, useState } from "react";
import SelectColorDropdown from "./SelectColorDropdown/SelectColorDropdown";
import { HexColor } from "../../types/Common";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import CreateIcon from "@mui/icons-material/Create";
import BrushIcon from "@mui/icons-material/Brush";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import classNames from "classnames";
import { CanvasTools } from "../../types/Sheet";
import { SetStateAction } from "jotai";

interface CanvasTooltipProps {
  tools: CanvasTools;
  setTools: Dispatch<SetStateAction<CanvasTools>>;
}

const CanvasTooltip = ({ tools, setTools }: CanvasTooltipProps) => {
  const [openColorDropdown, setOpenColorDropdown] = useState<boolean>(false);

  const outsideClickRef = useOutsideClick(() => setOpenColorDropdown(false));

  const handleChangeColor = (color: HexColor) => {
    setTools((prevTools) => ({ ...prevTools, color }));
  };

  const handleChangeActiveTool = (tool: CanvasTools["activeTool"]) => {
    setTools((prevTools) => ({ ...prevTools, activeTool: tool }));
  };

  return (
    <div className={styles.tooltip}>
      <div className={styles.tools_wrapper}>
        <button
          className={classNames(
            styles.tool_btn,
            tools.activeTool === "pencil" ? styles.active_tool : ""
          )}
          title="Pencil"
          onClick={() => handleChangeActiveTool("pencil")}
        >
          <CreateIcon sx={{ color: "white" }} fontSize="small" />
        </button>
        <button
          className={classNames(
            styles.tool_btn,
            tools.activeTool === "brush" ? styles.active_tool : ""
          )}
          title="Brush"
          onClick={() => handleChangeActiveTool("brush")}
        >
          <BrushIcon sx={{ color: "white" }} fontSize="small" />
        </button>
        <button
          className={classNames(
            styles.tool_btn,
            tools.activeTool === "eraser" ? styles.active_tool : ""
          )}
          title="Eraser"
          onClick={() => handleChangeActiveTool("eraser")}
        >
          <CleaningServicesIcon sx={{ color: "white" }} fontSize="small" />
        </button>
      </div>
      <div className={styles.colors_wrapper}>
        <div className={styles.colors_indicator}>
          <ColorLensIcon sx={{ color: "white" }} fontSize="small" />
          <p>Color</p>
        </div>
        <div
          onClick={() => setOpenColorDropdown(true)}
          className={styles.selected_color}
          style={{ backgroundColor: tools.color }}
          ref={outsideClickRef}
        >
          {openColorDropdown && (
            <SelectColorDropdown
              selectedColor={tools.color}
              onSelectColor={handleChangeColor}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasTooltip;
