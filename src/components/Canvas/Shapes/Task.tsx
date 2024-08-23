import Konva from "konva";
import React, { useRef } from "react";
import { Group, Rect, Text } from "react-konva";

export const Task = () => {
  const groupRef = useRef<Konva.Group>(null);
  const statusRef = useRef<Konva.Text>(null);

  const task = {
    title: "this is some task.",
    status: "Needs Review",
    user: "Irfan amin khan",
  };

  const clientRect = groupRef?.current?.getClientRect();
  const currentWidth = clientRect?.width;
  const currentHeight = clientRect?.height;
  const statusWidth = statusRef.current?.textWidth || 90;
  console.log({
    groupRef: groupRef.current,
    currentWidth,
    statusWidth,
    currentHeight,
  });

  return (
    <Group
      x={100}
      y={100}
      width={300}
      //   offsetY={30}
      height={150}
      draggable
      listening={true}
      ref={groupRef}
      onTransform={(e) => {
        console.log(e);
      }}
    >
      <Rect x={0} y={0} width={300} height={150} fill="red"></Rect>
      <Text text={task.title} fill="white" fontSize={16} />

      <Rect fill="black" width={statusWidth} y={40} />
      <Text
        ref={statusRef}
        fill="white"
        fontSize={14}
        text={task.status}
        y={currentHeight! - 20}
      />
    </Group>
  );
};
