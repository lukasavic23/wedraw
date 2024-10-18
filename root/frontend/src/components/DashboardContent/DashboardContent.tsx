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
  const activeAction = useRef<"pencil" | "eraser" | null>(null);
  const oldMousePoint = useRef<Point>({ x: 0, y: 0 });

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
      ctx.beginPath();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = tools.color;
      ctx.arc(point.x, point.y, tools.size / 2, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.beginPath();
    },
    [tools.color, tools.size]
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, point: Point, old: Point) => {
      ctx.lineWidth = tools.size;
      ctx.strokeStyle = tools.color;
      ctx.lineCap = "round";
      ctx.moveTo(old.x, old.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    },
    [tools.size, tools.color]
  );

  const erase = useCallback(
    (ctx: CanvasRenderingContext2D, point: Point, old: Point) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.rect(
        point.x - tools.size / 2,
        point.y - tools.size / 2,
        tools.size,
        tools.size
      );
      ctx.fill();
      ctx.lineWidth = tools.size;
      ctx.beginPath();
      ctx.moveTo(old.x, old.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    },
    [tools.size]
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
      setIsSaveDisabled((prev) => (prev ? false : prev));
      setIsClearDisabled((prev) => (prev ? false : prev));

      if (tools.activeTool === "pencil") {
        const { mouseX, mouseY } = getMousePosition(e, canvas);
        activeAction.current = "pencil";
        canvas.style.cursor = `url(${iconPencil}), auto`;

        beginDrawing(context, { x: mouseX, y: mouseY });
        oldMousePoint.current = {
          x: mouseX,
          y: mouseY,
        };
      } else if (tools.activeTool === "eraser") {
        const { mouseX, mouseY } = getMousePosition(e, canvas);
        activeAction.current = "eraser";
        oldMousePoint.current = {
          x: mouseX,
          y: mouseY,
        };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (activeAction.current === "pencil") {
        const { mouseX, mouseY } = getMousePosition(e, canvas);

        draw(
          context,
          { x: mouseX, y: mouseY },
          { x: oldMousePoint.current.x, y: oldMousePoint.current.y }
        );
        oldMousePoint.current = {
          x: mouseX,
          y: mouseY,
        };
      } else if (activeAction.current === "eraser") {
        const { mouseX, mouseY } = getMousePosition(e, canvas);

        erase(
          context,
          { x: mouseX, y: mouseY },
          { x: oldMousePoint.current.x, y: oldMousePoint.current.y }
        );
        oldMousePoint.current = {
          x: mouseX,
          y: mouseY,
        };
      }
    };

    const onMouseUp = () => {
      canvas.style.cursor = "auto";
      activeAction.current = null;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [beginDrawing, draw, erase, tools.activeTool]);

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
