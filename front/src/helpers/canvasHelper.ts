export const getMousePosition = (e: MouseEvent, canvas: HTMLCanvasElement) => {
  const { left, top } = canvas.getBoundingClientRect();

  return {
    mouseX: e.clientX - left,
    mouseY: e.clientY - top,
  };
};
