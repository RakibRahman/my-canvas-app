import Konva from "konva";
import { useEffect, useRef } from "react";
import { Layer, Line, Rect, Stage, Transformer } from "react-konva";
import { useStage } from "../../hooks/useStage";
import { useCanvasStore } from "../../store/canvasStore";
import { CanvasToolBar } from "./CanvasToolBar";
import { CanvasContextMenu } from "./CanvasContextMenu";
import { useDraw } from "../../hooks/useDraw";
import { Drawing } from "./Drawing";
import { Task } from "./Shapes/Task";

export const Canvas = () => {
  const shapes = useCanvasStore((state) => state.shapes);
  const groupRef = useRef<Konva.Group>(null);
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
  const drawingMode = useCanvasStore((state) => state.drawingMode);

  const {
    handleWheel,
    layerDragMove,
    layerDragEnd,
    drawGridOnLayer,
    showContextMenu,
  } = useStage();

  const { handleMouseDownPainting, handleMouseMovePainting } = useDraw();

  useEffect(() => {
    if (selectedItem) {
      // we need to attach transformer manually
      trRef.current?.nodes([selectedItem]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [selectedItem]);

  useEffect(() => {
    // drawGridOnLayer(layerRef.current!);
  }, [isStageCleared]);

  const tasks = [
    {
      title: "Task 1: Implement New Feature",
      status: "In Progress",
      user: "John Doe",
      avatar: "https://picsum.photos/200/301",
      x: 100,
      y: 100,
    },
    {
      title: "Task 2: Fix Bug in UI",
      status: "Needs Review",
      user: "Jane Smith",
      avatar: "https://picsum.photos/200/302",
      x: 100,
      y: 250,
    },
    {
      title: "Task 3: Optimize Database Queries",
      status: "Completed",
      user: "Bob Johnson",
      avatar: "https://picsum.photos/200/303",
      x: 500,
      y: 350,
    },
    {
      title: "Task 4: Update Documentation",
      status: "In Progress",
      user: "Unknown User",
      avatar: "",
      x: 600,
      y: 450,
    },
  ];

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
          if (drawingMode) {
            handleMouseMovePainting(e);
          }
        }}
        onTouchMove={(e) => {
          if (drawingMode) {
            handleMouseMovePainting(e);
          }
        }}
      >
        <Layer
          ref={layerRef}
          onDragMove={(e) => {
            layerDragMove(e, stageRef.current!, layerRef.current!);
          }}
          onDragEnd={() => {
            // layerDragEnd(layerRef.current!);
          }}
        >
          {/* {...shapes} */}
          {tasks.map((t) => {
            return <Task task={t} />;
          })}
          <Drawing />

          <Transformer
            anchorCornerRadius={10}
            borderEnabled={false}
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
