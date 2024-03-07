import React from 'react'

import { Text as KonvaText } from 'react-konva';


export const Text = () => {
  return (
<KonvaText text="Hello, World!" x={50} y={50} fontSize={30} fill="black" draggable />
    
  )
}
