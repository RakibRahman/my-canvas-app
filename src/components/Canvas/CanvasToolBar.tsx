import Konva from "konva";
import { FC, RefObject } from "react";
import { CiSaveDown1, CiSaveUp1, CiSquareRemove } from "react-icons/ci";
import { useCanvasStore } from "../../store/canvasStore";
import { Button } from "../common/Button";
import { Text } from "./Shapes/Text";

import {
  PiCursorFill,
  PiCursorLight,
  PiHand,
  PiHandFill,
  PiTextT,
  PiPencilSimpleThin,
  PiEraser,
} from "react-icons/pi";
import { ShapeMenu } from "./ShapeMenu";

interface CanvasToolBarProps {
  stageRef: RefObject<Konva.Stage>;

  layerRef: RefObject<Konva.Layer>;
  trRef: RefObject<Konva.Transformer>;
}

export const CanvasToolBar: FC<CanvasToolBarProps> = ({
  stageRef,
  layerRef,
  trRef,
}) => {
  const setShapes = useCanvasStore((state) => state.setShapes);
  const isStageDraggable = useCanvasStore((state) => state.dragStage);
  const handleDragStage = useCanvasStore((state) => state.handleDragStage);
  const setStageCleared = useCanvasStore((state) => state.setStageCleared);
  const drawingMode = useCanvasStore((state) => state.drawingMode);
  const setDrawingMode = useCanvasStore((state) => state.setDrawingMode);

  return (
    <div className="flex gap-2  my-4 items-center justify-center">
      <Button
        title="Save"
        onClick={() => {
          if (stageRef.current)
            localStorage.setItem("savedStage", stageRef.current?.toJSON());
          // setSaveStage(stageRef.current?.toJSON()!);
        }}
        rightIcon={<CiSaveUp1 />}
      />

      <Button
        title="Load last save"
        onClick={() => {
          // const savedData = localStorage.getItem("savedStage");
          // if (saveStage) {
          // Konva.Node.create(savedData, "mainContainer");
          // let newLayer = Konva.Node.create(savedData, 'mainContainer');
          // stageRef?.current?.destroyChildren()
          // stageRef?.current?.add(newLayer);
          // }
        }}
        rightIcon={<CiSaveDown1 />}
      />

      <Button
        title="Clear Stage"
        onClick={() => {
          setStageCleared();
          layerRef.current?.removeChildren();
        }}
        rightIcon={<CiSquareRemove />}
      />

      <ShapeMenu />

      <Button
        title="Text"
        rightIcon={<PiTextT />}
        onClick={() => {
          setShapes(
            <Text
              stageContainer={stageRef.current?.container()!}
              transformerRef={trRef}
            />
          );
        }}
      />

      <Button
        title=""
        rightIcon={
          isStageDraggable ? (
            <PiCursorLight />
          ) : (
            <PiCursorFill color="#60a5fa" />
          )
        }
        onClick={() => {
          if (isStageDraggable) {
            handleDragStage();
          }
        }}
      />

      <Button
        title=""
        onClick={() => {
          handleDragStage();
        }}
        rightIcon={
          isStageDraggable ? <PiHandFill color="#60a5fa" /> : <PiHand />
        }
      />
      <Button
        title="Draw"
        rightIcon={
          drawingMode === "brush" ? (
            <PiPencilSimpleThin color="#60a5fa" />
          ) : (
            <PiPencilSimpleThin />
          )
        }
        onClick={() => {
          setDrawingMode("brush");
        }}
      />
      <Button
        title="Eraser"
        rightIcon={
          drawingMode === "eraser" ? (
            <PiEraser color="#60a5fa" />
          ) : (
            <PiEraser />
          )
        }
        onClick={() => {
          setDrawingMode("eraser");
        }}
      />
    </div>
  );
};
