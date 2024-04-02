import React, { FC } from "react";
import { Circle as CircleShape } from "react-konva";
import { nanoid } from "nanoid";

interface CircleShapeProps{
  fill:string
  x:number
  y:number
  radius:number
  draggable:boolean

}


export const Circle:FC<Partial<CircleShapeProps>> = ({x=100,y=100,radius=50,fill='#60a5fa',draggable=true}) => {
  return (
    <CircleShape
    id={nanoid()}
      x={x}
      y={y}
      radius={radius}
      fill={fill}
      // x: stageRef?.current?.width()! / 2,
      // y: stageRef?.current?.height()! / 2,
      name="object"
      stroke={"#2563eb"}
      strokeWidth={4}
      draggable={draggable}
      // listening={false}
      onClick={(e)=>{
        console.log('hello from circle')
      }}
      
    />
  );
};
