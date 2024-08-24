import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Group, Image, Rect, Text } from "react-konva";
import useImage from "use-image";

export const Task = () => {
  const groupRef = useRef<Konva.Group>(null);
  const statusRef = useRef<Konva.Text>(null);
  const userRef = useRef<Konva.Text>(null);
  const imageRef = useRef<Konva.Image>(null);
  const titleRef = useRef<Konva.Text>(null);
  const [image] = useImage("https://picsum.photos/200/300");
  const [hasTransformed, setHasTransformed] = useState(false);
  const task = {
    title:
      "Just add yourJust aadJust add yourJust ad Just add yourJust ad Just add yourJust ad Just add yourJust ad Just add yourJust ad Just add yourJust ad",
    status: "Needs Review",
    user: "Irfan amin laib",
  };

  function updatePos() {
    if (groupRef.current && statusRef.current) {
      const clientRect = groupRef.current.size();
      const currentWidth = clientRect.width;
      const currentHeight = clientRect.height;

      const titleHeight = titleRef.current?.height();
      const usernameWidth = userRef.current?.textWidth;

      const belowTitle = currentHeight - titleHeight! + titleHeight! - 20;
      console.log({
        titleHeight,
        belowTitle,
      });
      statusRef?.current?.position({
        x: 10,
        y: belowTitle,
      });

      userRef?.current?.position({
        x: currentWidth - (usernameWidth! + 10),
        y: belowTitle,
      });

      imageRef?.current?.position({
        x: currentWidth - (usernameWidth! + 35),
        y: belowTitle,
      });
    }
  }

  useEffect(() => {
    updatePos();
  }, [groupRef]);

  return (
    <Group
      x={100}
      y={100}
      width={420}
      //   offsetY={30}
      height={150}
      draggable
      listening={true}
      ref={groupRef}
      onTransform={() => {
        console.log("Group transformed");
        setHasTransformed(true); // Update state to trigger re-render
      }}
      onTransformEnd={(e) => {
        console.log("wwww");
      }}
    >
      <Rect x={0} y={0} width={420} height={150} fill="red"></Rect>
      <Text
        text={task.title}
        fill="white"
        fontSize={16}
        x={0}
        y={0}
        width={420}
        ref={titleRef}
        listening={false}
      />

      <Rect fill="green" width={90} y={0} x={23} />

      <Text
        ref={statusRef}
        fill="white"
        fontSize={14}
        text={task.status}
        listening={false}
      />
      <Image
        width={20}
        height={20}
        cornerRadius={50}
        image={image}
        listening={false}
        ref={imageRef}
      />
      <Text ref={userRef} fill="white" fontSize={14} text={task.user} />
    </Group>
  );
};
