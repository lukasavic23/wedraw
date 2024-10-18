import styles from "./DashboardContent.module.css";
import { CanvasTools, ISheet } from "../../types/Sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import { getMousePosition } from "../../helpers/canvasHelper";
import { useSetAtom } from "jotai";
import { sheetsAtom } from "../../atoms/sheets";
import iconPencil from "../../assets/icon_pencil.svg";
import CanvasTooltip from "../CanvasTooltip/CanvasTooltip";
import { CanvasHexColors } from "../../enums/Canvas";

interface DashboardContentProps {
  sheet: ISheet;
}

interface Point {
  x: number;
  y: number;
}

const DashboardContent = (props: DashboardContentProps) => {
  const { sheet } = props;

  const [tools, setTools] = useState<CanvasTools>({
    activeTool: "pencil",
    color: CanvasHexColors.Black,
    size: 1,
  });
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [isClearDisabled, setIsClearDisabled] = useState<boolean>(
    !sheet.drawing
  );

  const setSheets = useSetAtom(sheetsAtom);

  const canvasParentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef<boolean>(false);

  const scaleCanvas = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvasParentRef.current) return;

    const dimensions = canvasParentRef.current.getBoundingClientRect();
    canvas.height = dimensions.height * devicePixelRatio;
    canvas.width = dimensions.width * devicePixelRatio;
    canvas.style.height = `${dimensions.height}px`;
    canvas.style.width = `${dimensions.width}px`;
  }, []);

  const beginDrawing = useCallback(
    (ctx: CanvasRenderingContext2D, point: Point) => {
      ctx.fillStyle = tools.color;
      ctx.fillRect(point.x, point.y, 2, 2);
      ctx.beginPath();
    },
    [tools.color]
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, point: Point) => {
      ctx.lineWidth = tools.size;
      ctx.strokeStyle = tools.color;
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    },
    [tools.size, tools.color]
  );

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

  // load saved drawing
  useEffect(() => {
    if (!sheet.drawing) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const image = new Image();
    image.src = sheet.drawing;

    context.drawImage(image, 0, 0);
  }, [sheet.drawing]);

  // draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const onMouseDown = (e: MouseEvent) => {
      isDrawing.current = true;
      setIsSaveDisabled((prev) => (prev ? false : prev));
      setIsClearDisabled((prev) => (prev ? false : prev));
      canvas.style.cursor = `url(${iconPencil}), auto`;

      const { mouseX, mouseY } = getMousePosition(e, canvas);
      beginDrawing(context, { x: mouseX, y: mouseY });
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDrawing.current) {
        const { mouseX, mouseY } = getMousePosition(e, canvas);

        draw(context, { x: mouseX, y: mouseY });
      }
    };

    const onMouseUp = () => {
      canvas.style.cursor = "auto";
      isDrawing.current = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [beginDrawing, draw]);

  const handleClearCanvas = () => {
    canvasRef.current
      ?.getContext("2d")
      ?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    setIsClearDisabled(true);
    setIsSaveDisabled(false);
  };

  const handleSaveCanvas = () => {
    const drawing = canvasRef.current?.toDataURL();

    setSheets((prevSheets) =>
      prevSheets.map((prevSheet) => {
        if (prevSheet.id === sheet.id) {
          return { ...prevSheet, drawing };
        }

        return prevSheet;
      })
    );
    setIsSaveDisabled(true);
  };

  return (
    <section className={styles.content}>
      <div className={styles.header_wrapper}>
        <h2>{sheet.name}</h2>
        <div className={styles.ctrl_buttons}>
          <button
            disabled={isClearDisabled}
            className={styles.clear_btn}
            onClick={handleClearCanvas}
          >
            Clear
          </button>
          <button
            disabled={isSaveDisabled}
            className={styles.save_btn}
            onClick={handleSaveCanvas}
          >
            Save
          </button>
        </div>
      </div>
      <section className={styles.canvas_container}>
        <CanvasTooltip tools={tools} setTools={setTools} />
        <div className={styles.canvas_wrapper} ref={canvasParentRef}>
          <canvas ref={canvasRef}></canvas>
        </div>
      </section>
    </section>
  );
};

export default DashboardContent;
