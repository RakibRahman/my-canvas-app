import Konva from "konva";
import { useCallback, useEffect, useRef } from "react";
import { Group, Image as KonvaImage, Rect, Text } from "react-konva";
import useImage from "use-image";

interface Task {
  task: {
    title: string;
    avatar: string;
    status: string;
    user: string;
    x: number;
    y: number;
  };
}
export const Task = (props: Task) => {
  const { task } = props;

  const groupRef = useRef<Konva.Group>(null);
  const statusRef = useRef<Konva.Text>(null);
  const userRef = useRef<Konva.Text>(null);
  const imageRef = useRef<Konva.Image>(null);
  const titleRef = useRef<Konva.Text>(null);
  const statusBgRef = useRef<Konva.Rect>(null);
  const [image] = useImage(task.avatar, "anonymous");

  const updateTaskShape = useCallback(() => {
    if (groupRef.current && statusRef.current) {
      const clientRect = groupRef.current.size();
      const currentWidth = clientRect.width;
      const currentHeight = clientRect.height;

      const titleHeight = titleRef.current?.height();
      const usernameWidth = userRef.current?.textWidth;
      const statusWidth = statusRef.current?.textWidth;

      const belowTitle = currentHeight - titleHeight! + titleHeight! - 20;

      statusRef?.current?.position({
        x: 12,
        y: belowTitle,
      });

      statusBgRef?.current?.position({
        x: 10,
        y: belowTitle - 5,
      });

      statusBgRef.current?.setAttrs({
        width: statusWidth + 5,
        x: 10,
        y: belowTitle - 5,
      });

      userRef?.current?.position({
        x: currentWidth - (usernameWidth! + 10),
        y: belowTitle,
      });

      imageRef?.current?.position({
        x: currentWidth - (usernameWidth! + 35),
        y: belowTitle - 5,
      });
    }
  }, [groupRef]);

  useEffect(() => {
    updateTaskShape();
  }, [updateTaskShape]);

  return (
    <Group
      x={task.x}
      y={task.y}
      width={420}
      height={150}
      draggable
      listening={true}
      ref={groupRef}
    >
      <Rect
        x={0}
        y={0}
        width={420}
        height={150}
        fill="#f14e0d"
        zIndex={500}
      ></Rect>
      <Text
        text={task.title}
        fill="white"
        fontSize={16}
        x={10}
        y={10}
        width={420}
        ref={titleRef}
        listening={false}
      />

      <Rect fill="green" width={90} height={20} ref={statusBgRef} />

      <Text
        ref={statusRef}
        fill="white"
        fontSize={14}
        text={task.status}
        listening={false}
      />

      {task.avatar ? (
        <KonvaImage
          width={20}
          height={20}
          cornerRadius={50}
          image={image}
          listening={false}
          ref={imageRef}
        />
      ) : (
        <Rect
          width={20}
          height={20}
          cornerRadius={50}
          fill={"#1b75d0"}
          listening={false}
          ref={imageRef}
        />
      )}

      <Text ref={userRef} fill="white" fontSize={14} text={task.user} />
    </Group>
  );
};
