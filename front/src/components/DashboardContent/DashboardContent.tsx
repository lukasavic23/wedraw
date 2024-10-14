import styles from "./DashboardContent.module.css";
import { ISheet } from "../../interfaces/Sheet";
import { useCallback, useEffect, useRef } from "react";

interface DashboardContentProps {
  selectedSheet: ISheet;
}

const DashboardContent = (props: DashboardContentProps) => {
  const { selectedSheet } = props;

  const canvasParentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const scaleCanvas = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvasParentRef.current) return;

    const dimensions = canvasParentRef.current.getBoundingClientRect();
    canvas.height = dimensions.height;
    canvas.width = dimensions.width;
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

  return (
    <section className={styles.content}>
      <h2>{selectedSheet.name}</h2>
      <div className={styles.canvas_wrapper} ref={canvasParentRef}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </section>
  );
};

export default DashboardContent;
