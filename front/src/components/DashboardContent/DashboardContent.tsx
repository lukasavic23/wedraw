import styles from "./DashboardContent.module.css";
import { ISheet } from "../../interfaces/Sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import { getMousePosition } from "../../helpers/canvasHelper";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { selectedSheetAtom, sheetsAtom } from "../../atoms/sheets";

interface DashboardContentProps {
  sheet: ISheet;
}

interface Point {
  x: number;
  y: number;
}

const draw = (ctx: CanvasRenderingContext2D, point: Point) => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
};

const DashboardContent = (props: DashboardContentProps) => {
  const { sheet } = props;

  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const setSheets = useSetAtom(sheetsAtom);
  const selectedSheet = useAtomValue(selectedSheetAtom);

  const canvasParentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scaleCanvas = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvasParentRef.current) return;

    const dimensions = canvasParentRef.current.getBoundingClientRect();
    canvas.height = dimensions.height * devicePixelRatio;
    canvas.width = dimensions.width * devicePixelRatio;
    canvas.style.height = `${dimensions.height}px`;
    canvas.style.width = `${dimensions.width}px`;
  }, []);

  // set canvas dimensions
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    scaleCanvas(canvasRef.current);

    window.addEventListener("resize", () => scaleCanvas(canvas));

    return () => {
      window.removeEventListener("resize", () => scaleCanvas(canvas));
    };
  }, [scaleCanvas]);

  // draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const onMouseDown = (e: MouseEvent) => {
      setIsDrawing(true);
      canvas.style.cursor = "cell";

      const { mouseX, mouseY } = getMousePosition(e, canvas);
      draw(context, { x: mouseX, y: mouseY });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDrawing) {
        const { mouseX, mouseY } = getMousePosition(e, canvas);

        draw(context, { x: mouseX, y: mouseY });
      }
    };

    const onMouseUp = () => {
      canvas.style.cursor = "auto";
      setIsDrawing(false);

      context.beginPath();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDrawing]);

  return (
    <section className={styles.content}>
      <div className={styles.header_wrapper}>
        <h2>{sheet.name}</h2>
        <button>save</button>
      </div>
      <div className={styles.canvas_wrapper} ref={canvasParentRef}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </section>
  );
};

export default DashboardContent;
