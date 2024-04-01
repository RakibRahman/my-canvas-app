import { Line } from "react-konva";
import { useCanvasStore } from "../../store/canvasStore";

export const Drawing = () => {
  const drawingLines = useCanvasStore((state) => state.drawingLines);
  const drawingColor = useCanvasStore((state) => state.drawingColor);
  return (
    <>
      {drawingLines.map((line, i) => (
        <Line
          draggable
          key={i}
          points={line.points}
          stroke={line.stroke ?? drawingColor}
          strokeWidth={line?.tool === "eraser" ? 5 : line.strokeWidth ?? 5}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation={
            line?.tool === "eraser" ? "destination-out" : "source-over"
          }
        />
      ))}
    </>
  );
};
