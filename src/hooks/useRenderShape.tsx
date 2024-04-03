import React, { useState } from "react";
import { BasicShape, useCanvasStore } from "../store/canvasStore";
import { KonvaEventObject } from "konva/lib/Node";

export const useRenderShape = () => {
  const [annotations, setAnnotations] = useState<BasicShape[]>([]);
  const [newAnnotation, setNewAnnotation] = useState<BasicShape[]>([]);
  const setShapes = useCanvasStore((state) => state.setShapes);
  const selectedShape = useCanvasStore((state) => state.selectedShape);
  const shapes = useCanvasStore((state) => state.shapes);
  console.log('first',annotations)

  const addText = (e: KonvaEventObject<MouseEvent>) => {
    const { x, y } = e?.target?.getStage()?.getPointerPosition()!;

    const textProperties = {
      x,
      y,
      width: 200,
      height: 0,
      key: shapes.length ? shapes.length - 1 : 1,
      type: selectedShape ?? "CIRCLE",
      fill: "#000000",
      fontSize: 20,
    };

    setShapes([...shapes, textProperties]);
  };

  const handleShapeOnMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (selectedShape === "TEXT") {
      return;
    }

    console.log("handleShapeOnMouseDown");
    const { x, y } = e?.target?.getStage()?.getPointerPosition()!;

    if (newAnnotation.length === 0) {
      setNewAnnotation([
        {
          x,
          y,
          width: 0,
          height: 0,
          key: "0",
          type: selectedShape ?? "CIRCLE",
          fill: "#000000",
          fontSize: 20,
        },
      ]);
    }
  };

  const handleShapeOnMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    console.log("handleShapeOnMouseUp");

    if (selectedShape === "TEXT") {
      return;
    }

    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = e?.target?.getStage()?.getPointerPosition()!;
      const annotationToAdd = {
        x: sx,
        y: sy,
        width: x - sx,
        height: y - sy,
        key: annotations.length + 1,
        type: selectedShape ?? "CIRCLE",
        fill: "#000000",
        fontSize: 20,
      };

      annotations.push(annotationToAdd);
      setNewAnnotation([]);
      setAnnotations(annotations);
      setShapes([...shapes, annotationToAdd]);
    }
  };

  const handleShapeOnMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (selectedShape === "TEXT") {
      return;
    }

    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      const { x, y } = e?.target?.getStage()?.getPointerPosition()!;
      console.log({ x, y });
      setNewAnnotation([
        // ...shapes,
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          key: "0",
          type: selectedShape ?? "CIRCLE",
          fill: "#000000",
          fontSize: 20,
        },
      ]);
    }

    setShapes([...annotations, ...newAnnotation]);
  };

  return {
    handleShapeOnMouseDown,
    handleShapeOnMouseUp,
    handleShapeOnMouseMove,
    addText,
  };
};
