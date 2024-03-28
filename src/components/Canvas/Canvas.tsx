import Konva from "konva";
import { useEffect, useRef } from "react";
import { Layer, Stage, Transformer } from "react-konva";
import { useStage } from "../../hooks/useStage";
import { useCanvasStore } from "../../store/canvasStore";
import { CanvasToolBar } from "./CanvasToolBar";
import { CanvasContextMenu } from "./CanvasContextMenu";

export const Canvas = () => {
  const shapes = useCanvasStore((state) => state.shapes);

  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const selectedItem = useCanvasStore((state) => state.selectedItem);
  const setSelectedItem = useCanvasStore((state) => state.setSelectedItem);

  const isStageDraggable = useCanvasStore((state) => state.dragStage);
  const isStageCleared = useCanvasStore((state) => state.isStageCleared);
  const { stageScale, stageX, stageY } = useCanvasStore((state) => state.zoom);
  const drawingMode = useCanvasStore((state)=>state.drawingMode);
  const isPaintingMode = useCanvasStore((state)=>state.isPaintMode);
  const setPaintMode = useCanvasStore((state)=>state.setPaintMode)
  
  const { handleWheel, layerDragMove, layerDragEnd, drawGridOnLayer,showContextMenu ,handleMouseDownPainting,handleMouseUpPainting} =
    useStage();

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
          showContextMenu(e,stageRef.current!,contextMenuRef.current!)
        }}


        onMouseDown={(e)=>{
          handleMouseDownPainting(e,stageRef.current!,layerRef.current!)
        }}
        onTouchStart={(e)=>{
          handleMouseDownPainting(e,stageRef.current!,layerRef.current!)

        }}
        onMouseUp={()=>{
          setPaintMode(false);
        }}
        onTouchEnd={()=>{
          setPaintMode(false);
        }}

        onMouseMove={(e)=>{
          handleMouseUpPainting(e,stageRef.current!,layerRef.current!)
        }}
        onTouchMove={(e)=>{
          handleMouseUpPainting(e,stageRef.current!,layerRef.current!)

        }}
      >
        <Layer
          ref={layerRef}
          onDragMove={(e) => {
            layerDragMove(e, stageRef.current!, layerRef.current!);
          }}
          onDragEnd={(e) => {
            layerDragEnd(layerRef.current!);
          }}
        >
          {...shapes}

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
