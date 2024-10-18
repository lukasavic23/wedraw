import { HexColor } from "./Common";

export interface ISheet {
  id: string;
  name: string;
  drawing?: string;
}

export interface CanvasTools {
  activeTool: "pencil" | "eraser";
  pencil: { color: HexColor; size: number };
  eraser: { size: number };
}
