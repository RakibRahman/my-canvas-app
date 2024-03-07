import Konva from "konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { KonvaNodeComponent, Layer, Rect, Stage, Transformer } from "react-konva";
import { useCanvasStore } from "../../store/canvasStore";

const ColoredRect = () => {
  const [color, setColor] = useState("green");


  const handleClick = () => {
    setColor(Konva.Util.getRandomColor());
    
  };



  return (
   
    <>
     <Rect

      id={`rect-${nanoid()}`}
      x={20}
      y={20}
      width={50}
      height={50}
      fill={color}
      shadowBlur={5}
      onClick={handleClick}
      draggable
      onDragStart={(e) => {
        console.log(e);
      }}
    />
 
    </>
  );
};

export const Canvas = () => {
//   const [selectedItem, setSelectedItem] = useState<
//     Konva.Stage | Shape<ShapeConfig>
//   >();

  const [shapes, setShapes] = useState<any>([]);
//   console.log(selectedItem);
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const setSelectedItem = useCanvasStore((state) => state.setSelectedItem)

  const selectedItem = useCanvasStore((state) => state.selectedItem)
  const trRef = useRef<Konva.Transformer>(null);



  useEffect(() => {
    if (selectedItem) {
      // we need to attach transformer manually
      trRef.current?.nodes([selectedItem]);
      trRef.current?.getLayer()?.batchDraw();

    console.log(selectedItem)
    }
  }, [selectedItem]);

  return (
    <div
      style={{
        border: "1px solid red",
      }}
    >
      <button
        onClick={() => {
          const circle = new Konva.Circle({
            x: stageRef?.current?.width()! / 2,
            y: stageRef?.current?.height()! / 2,
            radius: 70,
            fill: "red",
            stroke: "black",
            strokeWidth: 4,
            draggable: true,
          });

          // add the shape to the layer
          layerRef.current?.add(circle);

          // draw the image
          layerRef.current?.draw();
        }}
      >
        add Circle
      </button>
      <button
        onClick={() => {
          setShapes((s:any) => [...s, <ColoredRect />]);
        }}
      >
        add Rect
      </button>

      <Stage
        width={800}
        height={800}
        onClick={(e) => {
          // console.log(e)
          setSelectedItem(e.target);
        }}
        ref={stageRef}
      >
        <Layer ref={layerRef}>{...shapes}
        
        
        <Transformer ref={trRef} />
        </Layer>
      </Stage>
    </div>
  );
};
