import styles from "./DashboardContent.module.css";
import { CanvasTools, ISheet } from "../../types/Sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import { getMousePosition } from "../../helpers/canvasHelper";
import { useSetAtom } from "jotai";
import { sheetsAtom } from "../../atoms/sheets";
import CanvasTooltip from "../CanvasTooltip/CanvasTooltip";
import { CanvasHexColors } from "../../enums/Canvas";
import { HexColor } from "../../types/Common";

interface DashboardContentProps {
  sheet: ISheet;
}

interface Point {
  x: number;
  y: number;
}

interface Cursor {
  color: HexColor;
  size: number;
  canvas: HTMLCanvasElement;
  cursorUrl: string | null;
}

const INIT_TOOLS: CanvasTools = {
  activeTool: "pencil",
  pencil: { color: CanvasHexColors.Black, size: 1 },
  eraser: { size: 1 },
};

const DashboardContent = (props: DashboardContentProps) => {
  const { sheet } = props;

  const [tools, setTools] = useState<CanvasTools>(INIT_TOOLS);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [isClearDisabled, setIsClearDisabled] = useState<boolean>(
    !sheet.drawing
  );

  const setSheets = useSetAtom(sheetsAtom);

  const canvasParentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeAction = useRef<"pencil" | "eraser" | null>(null);
  const oldMousePoint = useRef<Point>({ x: 0, y: 0 });
  const cursorStyle = useRef<Cursor>({
    color: CanvasHexColors.Black,
    size: 1,
    cursorUrl: null,
    canvas: document.createElement("canvas"),
  });

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
      ctx.fillStyle = tools.pencil.color;
      ctx.arc(point.x, point.y, tools.pencil.size / 2, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.beginPath();
    },
    [tools.pencil.color, tools.pencil.size]
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, point: Point, old: Point) => {
      ctx.lineWidth = tools.pencil.size;
      ctx.strokeStyle = tools.pencil.color;
      ctx.lineCap = "round";
      ctx.moveTo(old.x, old.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    },
    [tools.pencil.size, tools.pencil.color]
  );

  const beginErasing = useCallback(
    (ctx: CanvasRenderingContext2D, point: Point) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.rect(
        point.x - tools.eraser.size / 2,
        point.y - tools.eraser.size / 2,
        tools.eraser.size,
        tools.eraser.size
      );
      ctx.fill();
    },
    [tools.eraser.size]
  );

  const erase = useCallback(
    (ctx: CanvasRenderingContext2D, point: Point, old: Point) => {
      ctx.beginPath();
      ctx.rect(
        point.x - tools.eraser.size / 2,
        point.y - tools.eraser.size / 2,
        tools.eraser.size,
        tools.eraser.size
      );
      ctx.fill();
      ctx.lineWidth = tools.eraser.size;
      ctx.beginPath();
      ctx.moveTo(old.x, old.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    },
    [tools.eraser.size]
  );

  const updateCursor = useCallback(() => {
    const size =
      tools.activeTool === "pencil" ? tools.pencil.size : tools.eraser.size;
    const color = tools.activeTool === "pencil" ? tools.pencil.color : "#fff";

    cursorStyle.current.size = size;
    cursorStyle.current.color = color;

    const cursorCanvas = cursorStyle.current.canvas;
    const cursorContext = cursorCanvas.getContext("2d");
    if (!cursorContext) return;

    cursorCanvas.width = cursorCanvas.height = size;

    if (tools.activeTool === "pencil") {
      cursorContext.fillStyle = tools.pencil.color;
      cursorContext.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      cursorContext.fill();
    } else {
      cursorContext.fillStyle = "white";
      cursorContext.fillRect(0, 0, size, size);
      cursorContext.strokeStyle = "black";
      cursorContext.lineWidth = 1;
      cursorContext.strokeRect(0, 0, size, size);
    }

    cursorCanvas.toBlob((blob) => {
      if (!blob) return;

      if (cursorStyle.current.cursorUrl)
        URL.revokeObjectURL(cursorStyle.current.cursorUrl);

      cursorStyle.current.cursorUrl = URL.createObjectURL(blob);

      if (canvasRef.current)
        canvasRef.current.style.cursor = `url(${
          cursorStyle.current.cursorUrl
        }) ${size / 2} ${size / 2}, auto`;
    });
  }, [
    tools.activeTool,
    tools.eraser.size,
    tools.pencil.color,
    tools.pencil.size,
  ]);

  // update cursor according to tool used
  useEffect(() => {
    updateCursor();
  }, [updateCursor]);

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

        beginDrawing(context, { x: mouseX, y: mouseY });
        oldMousePoint.current = {
          x: mouseX,
          y: mouseY,
        };
      } else if (tools.activeTool === "eraser") {
        const { mouseX, mouseY } = getMousePosition(e, canvas);
        activeAction.current = "eraser";

        beginErasing(context, { x: mouseX, y: mouseY });
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
  }, [beginDrawing, draw, beginErasing, erase, tools.activeTool]);

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
