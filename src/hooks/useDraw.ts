import { KonvaEventObject } from 'konva/lib/Node';
import { useCanvasStore } from '../store/canvasStore';

export const useDraw = () => {
    const drawingMode = useCanvasStore((state) => state.drawingMode);
    const isPaintingMode = useCanvasStore((state) => state.isPaintMode);
    const setPaintMode = useCanvasStore((state) => state.setPaintMode);
  
    const drawingLines = useCanvasStore((state) => state.drawingLines);
    const setDrawingLines = useCanvasStore((state) => state.setDrawingLines);
    const drawingColor = useCanvasStore((state) => state.drawingColor);
    
    const handleMouseDownPainting = (
        e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
      ) => {
        setPaintMode(true);
    
        const pos = e?.target?.getStage()?.getPointerPosition()!;
    
        if (pos) {
          setDrawingLines([
            ...drawingLines,
            {
              tool: drawingMode,
              points: [pos?.x, pos?.y],
              strokeWidth: drawingMode === "brush" ? 5 : 1,
              stroke: drawingColor,
            },
          ]);
        }
      };
    
      const handleMouseMovePainting = (
        e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
      ) => {
        if (!isPaintingMode) {
          return;
        }
    
        // prevent scrolling on touch devices
        e.evt.preventDefault();
        const stage = e?.target?.getStage()!;
        const point = stage?.getPointerPosition()!;
        let lastLine = drawingLines[drawingLines.length - 1];
        // add point
        lastLine.points = lastLine?.points?.concat([point.x, point.y]);
    
        // replace last
        drawingLines.splice(drawingLines.length - 1, 1, lastLine);
        setDrawingLines(drawingLines?.concat());
      };
    
      return {handleMouseDownPainting,
        handleMouseMovePainting}
}
