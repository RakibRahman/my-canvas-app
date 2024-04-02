import React, { FC } from "react";
import { BasicShape, useCanvasStore } from "../../store/canvasStore";
import { Circle } from "./Shapes/Circle";
import { Rectangle } from "./Shapes/Rectangle";
import { Rect } from "react-konva";

interface RenderShapesProps {
  shapes: BasicShape[];
}
export const RenderShapes = () => {
  const shapes = useCanvasStore((state) => state.shapes);
  console.log({shapes})

  return (
    <>
      {shapes.map((value) => {
        if (value.type === "CIRCLE") {
          return (
            <Circle x={value.x} radius={50} y={value.y} fill={value.fill} />
          );
        }

        if (value.type === "RECT") {
            return(<Rect
                x={20}
                y={20}
                width={50}
                height={50}
                fill={"red"}
                shadowBlur={5}
                draggable
                name="object"
              />)
          
        }

        if (value.type === "TEXT") {
        }

        return <></>;
      })}
    </>
  );
};
