import { HexColor } from "./Common";

export interface ISheet {
  id: string;
  name: string;
  drawing?: string;
}

export interface CanvasTools {
  activeTool: "pencil" | "brush" | "eraser";
  color: HexColor;
  size: number;
}
