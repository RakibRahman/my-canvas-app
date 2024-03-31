import Konva from "konva";
import { useEffect, useRef } from "react";
import { Layer, Line, Stage, Transformer } from "react-konva";
import { useStage } from "../../hooks/useStage";
import { useCanvasStore } from "../../store/canvasStore";
import { CanvasToolBar } from "./CanvasToolBar";
import { CanvasContextMenu } from "./CanvasContextMenu";

export const Canvas = () => {
  const shapes = useCanvasStore((state) => state.shapes);
  const drawingLines = useCanvasStore((state) => state.drawingLines);
  const drawingColor = useCanvasStore((state) => state.drawingColor);

  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const selectedItem = useCanvasStore((state) => state.selectedItem);
  const setSelectedItem = useCanvasStore((state) => state.setSelectedItem);

  const isStageDraggable = useCanvasStore((state) => state.dragStage);
  const isStageCleared = useCanvasStore((state) => state.isStageCleared);
  const { stageScale, stageX, stageY } = useCanvasStore((state) => state.zoom);

  const setPaintMode = useCanvasStore((state) => state.setPaintMode);

  const {
    handleWheel,
    layerDragMove,
    layerDragEnd,
    drawGridOnLayer,
    showContextMenu,
    handleMouseDownPainting,
    handleMouseMovePainting,
  } = useStage();

  useEffect(() => {
    if (selectedItem) {
      // we need to attach transformer manually
      trRef.current?.nodes([selectedItem]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [selectedItem]);

  useEffect(() => {
    drawGridOnLayer(layerRef.current!);
  }, [isStageCleared]);

  return (
    <div
      style={{
        overflow: "hidden",
        cursor: isStageDraggable ? "grabbing" : "default",
      }}
      id="stageContainer"
    >
      <CanvasToolBar stageRef={stageRef} trRef={trRef} layerRef={layerRef} />
      <CanvasContextMenu
        contextMenuRef={contextMenuRef}
        trRef={trRef}
        layerRef={layerRef}
      />
      <Stage
        scaleX={stageScale}
        scaleY={stageScale}
        x={stageX}
        y={stageY}
        draggable={isStageDraggable}
        // style={stageStyle}
        onWheel={handleWheel}
        id="mainContainer"
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={(e) => {
          // console.log(e)
          trRef.current?.show();

          setSelectedItem(e.target);
        }}
        ref={stageRef}
        onContextMenu={(e) => {
          showContextMenu(e, stageRef.current!, contextMenuRef.current!);
        }}
        onMouseDown={(e) => {
          handleMouseDownPainting(e);
        }}
        onTouchStart={(e) => {
          handleMouseDownPainting(e);
        }}
        onMouseUp={() => {
          setPaintMode(false);
        }}
        onTouchEnd={() => {
          setPaintMode(false);
        }}
        onMouseMove={(e) => {
          handleMouseMovePainting(e);
        }}
        onTouchMove={(e) => {
          handleMouseMovePainting(e);
        }}
      >
        <Layer
          ref={layerRef}
          onDragMove={(e) => {
            layerDragMove(e, stageRef.current!, layerRef.current!);
          }}
          onDragEnd={() => {
            layerDragEnd(layerRef.current!);
          }}
        >
          {...shapes}

          {drawingLines.map((line, i) => (
            <Line
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

          <Transformer
            ref={trRef}
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ]}
          />
        </Layer>
      </Stage>
    </div>
  );
};
