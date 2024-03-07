import React from "react";
import { Circle as CircleShape } from "react-konva";

export const Circle = () => {
  return (
    <CircleShape
      x={100}
      y={100}
      radius={50}
      fill="blue"
      // x: stageRef?.current?.width()! / 2,
      // y: stageRef?.current?.height()! / 2,
      stroke={"black"}
      strokeWidth={4}
      draggable
    />
  );
};
