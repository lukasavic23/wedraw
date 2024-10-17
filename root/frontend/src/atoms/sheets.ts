import { atom } from "jotai";
import { ISheet } from "../interfaces/Sheet";

export const sheetsAtom = atom<ISheet[]>([]);
export const selectedSheetIdAtom = atom<ISheet["id"] | null>(null);

export const selectedSheetAtom = atom((get) => {
  const sheets = get(sheetsAtom);
  const selectedSheetId = get(selectedSheetIdAtom);
  return sheets.find((sheet) => sheet.id === selectedSheetId);
});
