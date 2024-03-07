import { nanoid } from "@reduxjs/toolkit";
import Konva from "konva";
import { useState } from "react";
import { Rect } from "react-konva";

export const Rectangle = () => {
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
        fill={'red'}
        shadowBlur={5}
        onClick={handleClick}
        draggable
       
      />
   
      </>
    );
  };
  