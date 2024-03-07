import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Layer, Stage, Transformer } from "react-konva";
import { useCanvasStore } from "../../store/canvasStore";
import { Rectangle } from "./Shapes/Rectangle";
import { Circle } from "./Shapes/Circle";
import { Ellipse } from "./Shapes/Ellipse";
import { Text } from "./Shapes/Text";

export const Canvas = () => {
  const [shapes, setShapes] = useState<any>([]);

  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const setSelectedItem = useCanvasStore((state) => state.setSelectedItem);

  const selectedItem = useCanvasStore((state) => state.selectedItem);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (selectedItem) {
      // we need to attach transformer manually
      trRef.current?.nodes([selectedItem]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [selectedItem]);

  console.log(selectedItem);

  return (
    <div
      style={{
        border: "1px solid red",
      }}
    >
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
          setShapes((s: any) => [...s, <Text />]);
        }}
      >
        add Text
      </button>


      <Stage
        id="mainContainer"
        width={800}
        height={800}
        onClick={(e) => {
          // console.log(e)
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
