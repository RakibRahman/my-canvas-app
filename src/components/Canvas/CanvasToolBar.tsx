import Konva from "konva";
import { FC, RefObject, useRef } from "react";
import { CiSaveDown1, CiSaveUp1, CiSquareRemove } from "react-icons/ci";
import { useCanvasStore } from "../../store/canvasStore";
import { Button } from "../common/Button";
import { Text } from "./Shapes/Text";
import { jsPDF } from "jspdf";
import {
  PiCursorFill,
  PiCursorLight,
  PiFilePdf,
  PiHand,
  PiHandFill,
  PiImage,
  PiTextT,
} from "react-icons/pi";
import { ShapeMenu } from "./ShapeMenu";
import { DrawingMenu } from "./DrawingMenu";

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
  const setDrawingMode = useCanvasStore((state) => state.setDrawingMode);
  const drawingMode = useCanvasStore((state) => state.drawingMode);

  function downloadURI(uri, name) {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleExport = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({
      pixelRatio: 2, // or other value you need
    });
    console.log(uri);
    downloadURI(uri, "stage.png");
    // we also can save uri as file
    // but in the demo on Konva website it will not work
    // because of iframe restrictions
    // but feel free to use it in your apps:
    // downloadURI(uri, 'stage.png');
  };

  const exportPdf = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const pdf = new jsPDF("l", "pt", [stage.width(), stage.height()]);
    pdf.setTextColor("#000000");
    console.log("sss", stage.find("Text"));

    stage.find("Text").forEach((text) => {
      const size = text.getAttr("fontSize") / 1; // convert pixels to points
      pdf.setFontSize(size);
      pdf.text(text.getAttr("text"), text.x(), text.y(), {
        baseline: "top",
        angle: -text.getAbsoluteRotation(),
      });
    });

    pdf.addImage(
      stage.toDataURL({ pixelRatio: 2 }),
      0,
      0,
      stage.width(),
      stage.height()
    );

    pdf.save("canvas.pdf");
  };

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
          isStageDraggable || drawingMode ? (
            <PiCursorLight />
          ) : (
            <PiCursorFill color="#60a5fa" />
          )
        }
        onClick={() => {
          if (isStageDraggable) {
            handleDragStage();
          }
          setDrawingMode(null);
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
      <DrawingMenu />
      <Button
        title=""
        onClick={() => {
          handleExport();
        }}
        rightIcon={<PiImage />}
      />
      <Button
        title=""
        onClick={() => {
          exportPdf();
        }}
        rightIcon={<PiFilePdf />}
      />
    </div>
  );
};
