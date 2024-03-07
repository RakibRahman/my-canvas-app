import React from 'react'
import { Ellipse as EllipseShape} from 'react-konva';

export const Ellipse = () => {
  return (
    <EllipseShape x={150} y={150} radiusX={100} radiusY={50} fill="green" draggable />

  )
}
