import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Group, Layer, Stage, Transformer } from "react-konva";
import { useCanvasStore } from "../../store/canvasStore";
import { Rectangle } from "./Shapes/Rectangle";
import { Circle } from "./Shapes/Circle";
import { Ellipse } from "./Shapes/Ellipse";
import { Text } from "./Shapes/Text";
import { stageStyle, useStage } from "../../hooks/useStage";

export const Canvas = () => {
  const [shapes, setShapes] = useState<any>([]);

  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const setSelectedItem = useCanvasStore((state) => state.setSelectedItem);

  const selectedItem = useCanvasStore((state) => state.selectedItem);
  const isStageDraggable = useCanvasStore((state) => state.dragStage);
  const handleDragStage = useCanvasStore((state) => state.handleDragStage);
  const { stageScale, stageX, stageY } = useCanvasStore((state) => state.zoom);
  const trRef = useRef<Konva.Transformer>(null);
  const [saveStage, setSaveStage] = useState({});
  const { handleWheel } = useStage();

  useEffect(() => {
    if (selectedItem) {
      // we need to attach transformer manually
      trRef.current?.nodes([selectedItem]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [selectedItem]);

  console.log({ selectedItem });

  return (
    <div
      style={{
        border: "1px solid red",
        padding: "20px",
        overflow: "hidden",
      }}
      id="stageContainer"
    >
      <button
        onClick={() => {
          if (stageRef.current)
            localStorage.setItem("savedStage", stageRef.current?.toJSON());
          setSaveStage(stageRef.current?.toJSON()!);
          console.log(layerRef.current);
        }}
      >
        Save
      </button>

      <button
        onClick={() => {
          const savedData = localStorage.getItem("savedStage");
          if (saveStage) {
            Konva.Node.create(savedData, "mainContainer");
            // let newLayer = Konva.Node.create(savedData, 'mainContainer');
            // stageRef?.current?.destroyChildren()

            // stageRef?.current?.add(newLayer);
          }
        }}
      >
        Load last save
      </button>

      <button
        onClick={() => {
          stageRef.current?.clear();
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          setShapes((s: any) => [...s, <Circle />]);
        }}
      >
        add Circle
      </button>
      <button
        onClick={() => {
          setShapes((s: any) => [...s, <Rectangle />]);
        }}
      >
        add Rect
      </button>

      <button
        onClick={() => {
          setShapes((s: any) => [...s, <Ellipse />]);
        }}
      >
        add Ellipse
      </button>

      <button
        onClick={() => {
          setShapes((s: any) => [
            ...s,
            <Text
              stageContainer={stageRef.current?.container()!}
              transformerRef={trRef}
            />,
          ]);
        }}
      >
        add Text
      </button>
      <button
        style={{
          background: isStageDraggable ? "limegreen" : "white",
        }}
        onClick={() => {
          handleDragStage();
        }}
      >
        Drag Stage
      </button>
      <button
        style={{
          background: selectedItem?.id ? "red" : "initial",
          color: selectedItem?.id ? "white" : "black",
        }}
        disabled={selectedItem?.id ? false : true}
        onClick={() => {
          trRef.current?.hide();

          // const tr = layerRef?.current?.find('Transformer').toArray().find(tr => tr.nodes()[0] === currentShape);
          // tr.destroy();
          // currentShape.destroy();
          // layer.draw();
          selectedItem?.destroy();
          layerRef.current?.draw();
        }}
      >
        Delete
      </button>

      <Stage
        scaleX={stageScale}
        scaleY={stageScale}
        x={stageX}
        y={stageY}
        draggable={isStageDraggable}
        style={stageStyle}
        onWheel={handleWheel}
        id="mainContainer"
        width={1200}
        height={800}
        onClick={(e) => {
          // console.log(e)
          trRef.current?.show();

          setSelectedItem(e.target);
        }}
        ref={stageRef}
      >
        <Layer ref={layerRef}>
          {...shapes}

          <Transformer ref={trRef} />
        </Layer>
      </Stage>
    </div>
  );
};
