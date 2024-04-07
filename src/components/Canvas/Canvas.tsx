import Konva from "konva";
import { useEffect, useRef } from "react";
import { Circle, Layer, Rect, Stage, Transformer } from "react-konva";
import { useDraw } from "../../hooks/useDraw";
import { useRenderShape } from "../../hooks/useRenderShape";
import { useStage } from "../../hooks/useStage";
import { useCanvasStore } from "../../store/canvasStore";
import { CanvasContextMenu } from "./CanvasContextMenu";
import { CanvasToolBar } from "./CanvasToolBar";
import { Drawing } from "./Drawing";
import { Text } from "./Shapes/Text";

// interface CircleShape extends BasicShape{
//   radius:number

// }

// interface RectShape extends BasicShape{
// width:number
// height:number

// }

export const Canvas = () => {
  const shapes = useCanvasStore((state) => state.shapes);

  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const selectedItem = useCanvasStore((state) => state.selectedItem);
  const setSelectedItem = useCanvasStore((state) => state.setSelectedItem);
  const selectedShape = useCanvasStore((state) => state.selectedShape);

  const isStageDraggable = useCanvasStore((state) => state.dragStage);
  const isStageCleared = useCanvasStore((state) => state.isStageCleared);
  const { stageScale, stageX, stageY } = useCanvasStore((state) => state.zoom);

  const setPaintMode = useCanvasStore((state) => state.setPaintMode);
  const drawingMode = useCanvasStore((state) => state.drawingMode);

  const {
    handleShapeOnMouseDown,
    handleShapeOnMouseUp,
    handleShapeOnMouseMove,
    addText
  } = useRenderShape();

  console.log({shapes,selectedShape})

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
          // console.log("this is it", e);
          trRef.current?.show();
          
          setSelectedItem(e.target);
          
          if(selectedShape==='TEXT'){
            addText(e)

          }
        }}
        ref={stageRef}
        onContextMenu={(e) => {
          showContextMenu(e, stageRef.current!, contextMenuRef.current!);
        }}
        onMouseDown={(e) => {
          handleMouseDownPainting(e);

          if(selectedShape){
            handleShapeOnMouseDown(e);

          }
        }}
        onTouchStart={(e) => {
          handleMouseDownPainting(e);
        }}
        
        onMouseUp={(e) => {
          setPaintMode(false);

          // if(selectedShape){
            handleShapeOnMouseUp(e);

          // }
        }}
        onTouchEnd={() => {
          setPaintMode(false);
        }}
        onMouseMove={(e) => {
          if (drawingMode) {
            handleMouseMovePainting(e);
          }

          if(selectedShape){

            handleShapeOnMouseMove(e);
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
            layerDragEnd(layerRef.current!);
          }}
        >
          {/* {...shapes} */}

          {shapes.map((value,i) => {
            return value.type === "CIRCLE" ? (
              <Circle
                x={value.x}
                y={value.y}
                radius={50}
                fill="transparent"
                stroke="black"
                key={i}
              />
            ) : value.type === "RECT" ? (
              <Rect
                x={value.x}
                y={value.y}
                width={value.width}
                height={value.height}
                fill="green"
                key={i}

              />
            ) : (
              <Text
              key={i}

              x={value.x}
              y={value.y}
              width={value.width}
              fill={Konva.Util.getRandomColor()}
              fontSize={value.fontSize}
                transformerRef={trRef!}
                stageContainer={stageRef?.current?.container()!}
              />
            );
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
