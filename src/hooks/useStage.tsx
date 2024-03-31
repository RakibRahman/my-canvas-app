import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Circle } from "../components/Canvas/Shapes/Circle";
import { useCanvasStore } from "../store/canvasStore";

const BG_IMAGE_URL =
  "https://img.freepik.com/free-photo/abstract-blue-extruded-voronoi-blocks-background-minimal-light-clean-corporate-wall-3d-geometric-surface-illustration-polygonal-elements-displacement_1217-2510.jpg?w=1380&t=st=1711346586~exp=1711347186~hmac=8bfdb9381b6aafb5b32a44f7eb8555bdf91edb25aa4916ebc93c3e2f158214c6";
export const stageStyle = {
  backgroundImage: `url(${BG_IMAGE_URL})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};
type Stage = Konva.Stage;
type Layer = Konva.Layer;
type LayerDragEvent = KonvaEventObject<DragEvent>;
type KonvaShape = Konva.Shape;
type AvailableShapes = "Circle" | "Rect" | "Text" | "Ellipse";

type Vertical = number | Vertical[];
type Horizontal = number | Horizontal[];
type LineGuide = {
  lineGuide: number;
  offset: number;
  orientation: string;
  snap: string;
};

type Result = Omit<LineGuide, "orientation"> & { diff: number };

type LineGuideStops = {
  vertical: number[];
  horizontal: number[];
};

type ItemBounds = {
  vertical: {
    guide: number;
    offset: number;
    snap: string;
  }[];
  horizontal: {
    guide: number;
    offset: number;
    snap: string;
  }[];
};

export const useStage = () => {
  const setShapes = useCanvasStore((state) => state.setShapes);

  const SCALE_BY = 1.05;
  const GUIDELINE_OFFSET = 5;
  const handleZoom = useCanvasStore((state) => state.handleZoom);
  const drawingMode = useCanvasStore((state) => state.drawingMode);
  const isPaintingMode = useCanvasStore((state) => state.isPaintMode);
  const setPaintMode = useCanvasStore((state) => state.setPaintMode);

  const drawingLines = useCanvasStore((state) => state.drawingLines);
  const setDrawingLines = useCanvasStore((state) => state.setDrawingLines);
  const drawingColor = useCanvasStore((state) => state.drawingColor);

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = e.target.getStage()!;
    const oldScale = stage.scaleX();
    const stagePointerPositionX = stage.getPointerPosition()!.x;
    const stagePointerPositionY = stage.getPointerPosition()!.y;

    const mousePointTo = {
      x: stagePointerPositionX / oldScale - stage.x() / oldScale,
      y: stagePointerPositionY / oldScale - stage.y() / oldScale,
    };

    const newScale =
      e.evt.deltaY < 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

    if (e.evt.ctrlKey) {
      handleZoom({
        stageScale: newScale,
        stageX: -(mousePointTo.x - stagePointerPositionX / newScale) * newScale,
        stageY: -(mousePointTo.y - stagePointerPositionY / newScale) * newScale,
      });
    }
  };

  const getLineGuideStops = (skipShape: KonvaShape, stage: Stage) => {
    // we can snap to stage borders and the center of the stage
    const vertical: Vertical = [0, stage.width() / 2, stage.width()];
    const horizontal: Horizontal = [0, stage.height() / 2, stage.height()];

    // and we snap over edges and center of each object on the canvas

    stage.find(".object").forEach((guideItem) => {
      if (guideItem === skipShape) {
        return;
      }
      const box = guideItem.getClientRect();
      // and we can snap to all edges of shapes
      vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
      horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
    });
    return {
      vertical: vertical.flat(),
      horizontal: horizontal.flat(),
    };
  };

  const getObjectSnappingEdges = (node: KonvaShape) => {
    const box = node.getClientRect();
    const absPos = node.absolutePosition();

    return {
      vertical: [
        {
          guide: Math.round(box.x),
          offset: Math.round(absPos.x - box.x),
          snap: "start",
        },
        {
          guide: Math.round(box.x + box.width / 2),
          offset: Math.round(absPos.x - box.x - box.width / 2),
          snap: "center",
        },
        {
          guide: Math.round(box.x + box.width),
          offset: Math.round(absPos.x - box.x - box.width),
          snap: "end",
        },
      ],
      horizontal: [
        {
          guide: Math.round(box.y),
          offset: Math.round(absPos.y - box.y),
          snap: "start",
        },
        {
          guide: Math.round(box.y + box.height / 2),
          offset: Math.round(absPos.y - box.y - box.height / 2),
          snap: "center",
        },
        {
          guide: Math.round(box.y + box.height),
          offset: Math.round(absPos.y - box.y - box.height),
          snap: "end",
        },
      ],
    };
  };

  // find all snapping possibilities
  const getGuides = (
    lineGuideStops: LineGuideStops,
    itemBounds: ItemBounds
  ) => {
    const resultV: Result[] = [];
    const resultH: Result[] = [];

    lineGuideStops.vertical.forEach((lineGuide) => {
      itemBounds.vertical.forEach((itemBound) => {
        const diff = Math.abs(lineGuide - itemBound.guide);
        // if the distance between guild line and object snap point is close we can consider this for snapping
        if (diff < GUIDELINE_OFFSET) {
          resultV.push({
            lineGuide: lineGuide,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset,
          });
        }
      });
    });

    lineGuideStops.horizontal.forEach((lineGuide) => {
      itemBounds.horizontal.forEach((itemBound) => {
        const diff = Math.abs(lineGuide - itemBound.guide);
        if (diff < GUIDELINE_OFFSET) {
          resultH.push({
            lineGuide: lineGuide,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset,
          });
        }
      });
    });

    const guides = [];

    // find closest snap
    const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    const minH = resultH.sort((a, b) => a.diff - b.diff)[0];
    if (minV) {
      guides.push({
        lineGuide: minV.lineGuide,
        offset: minV.offset,
        orientation: "V",
        snap: minV.snap,
      });
    }
    if (minH) {
      guides.push({
        lineGuide: minH.lineGuide,
        offset: minH.offset,
        orientation: "H",
        snap: minH.snap,
      });
    }
    return guides;
  };

  const drawGuides = (guides: LineGuide[], layer: Layer) => {
    guides.forEach((lg) => {
      if (lg.orientation === "H") {
        const line = new Konva.Line({
          points: [-6000, 0, 6000, 0],
          stroke: "rgb(0, 161, 255)",
          strokeWidth: 1,
          name: "guid-line",
          dash: [4, 6],
        });
        layer.add(line);
        line.absolutePosition({
          x: 0,
          y: lg.lineGuide,
        });
      } else if (lg.orientation === "V") {
        const line = new Konva.Line({
          points: [0, -6000, 0, 6000],
          stroke: "rgb(0, 161, 255)",
          strokeWidth: 1,
          name: "guid-line",
          dash: [4, 6],
        });
        layer.add(line);
        line.absolutePosition({
          x: lg.lineGuide,
          y: 0,
        });
      }
    });
  };

  const layerDragMove = (e: LayerDragEvent, stage: Stage, layer: Layer) => {
    // clear all previous lines on the screen
    layer.find(".guid-line").forEach((l) => l.destroy());

    const currentTargetedShape = e.target as KonvaShape;
    // find possible snapping lines
    const lineGuideStops = getLineGuideStops(currentTargetedShape, stage);
    // find snapping points of current object
    const itemBounds = getObjectSnappingEdges(currentTargetedShape);

    // now find where can we snap current object
    const guides = getGuides(lineGuideStops as LineGuideStops, itemBounds);

    // do nothing of no snapping
    if (!guides.length) {
      return;
    }

    drawGuides(guides, layer);

    const absPos = e.target.absolutePosition();
    // now force object position
    guides.forEach((lg) => {
      switch (lg.snap) {
        case "start": {
          switch (lg.orientation) {
            case "V": {
              absPos.x = lg.lineGuide + lg.offset;
              break;
            }
            case "H": {
              absPos.y = lg.lineGuide + lg.offset;
              break;
            }
          }
          break;
        }
        case "center": {
          switch (lg.orientation) {
            case "V": {
              absPos.x = lg.lineGuide + lg.offset;
              break;
            }
            case "H": {
              absPos.y = lg.lineGuide + lg.offset;
              break;
            }
          }
          break;
        }
        case "end": {
          switch (lg.orientation) {
            case "V": {
              absPos.x = lg.lineGuide + lg.offset;
              break;
            }
            case "H": {
              absPos.y = lg.lineGuide + lg.offset;
              break;
            }
          }
          break;
        }
      }
    });
    e.target.absolutePosition(absPos);
  };

  const layerDragEnd = (layer: Layer) => {
    layer.find(".guid-line").forEach((l) => l.destroy());
  };

  const copyShape = (selectedItem: Konva.Stage | Shape<ShapeConfig>) => {
    const shapeName = selectedItem.getClassName() as AvailableShapes;

    if (shapeName === "Circle") {
      setShapes(
        <Circle
          x={selectedItem.attrs.x + 10}
          y={selectedItem.attrs.y + 10}
          fill={selectedItem.attrs.fill}
          radius={selectedItem.attrs.radius}
          draggable
        />
      );
    }
  };

  const drawGridOnLayer = (layer: Layer) => {
    const padding = 30;
    const height = window.innerHeight;
    const width = window.innerWidth;

    for (var i = 0; i < width / padding; i++) {
      layer?.add(
        new Konva.Line({
          points: [
            Math.round(i * padding) + 0.5,
            0,
            Math.round(i * padding) + 0.5,
            height,
          ],
          stroke: "#ddd",
          strokeWidth: 1,
        })
      );
    }

    layer?.add(new Konva.Line({ points: [0, 0, 10, 10] }));
    for (var j = 0; j < height / padding; j++) {
      layer?.add(
        new Konva.Line({
          points: [0, Math.round(j * padding), width, Math.round(j * padding)],
          stroke: "#ddd",
          strokeWidth: 0.5,
        })
      );
    }
  };

  const showContextMenu = (
    e: KonvaEventObject<PointerEvent>,
    stage: Stage,
    contextMenu: HTMLElement
  ) => {
    e.evt.preventDefault();
    if (e.target === stage) {
      // if we are on empty place of the stage we will do nothing
      return;
    }

    // show menu
    if (contextMenu) {
      let containerRect = stage?.container().getBoundingClientRect()!;
      const stagePointerPosition = stage?.getPointerPosition()!;
      contextMenu.style.display = "block";
      contextMenu.style.top =
        containerRect.top + stagePointerPosition?.y + 4 + "px";
      contextMenu.style.left =
        containerRect.left + stagePointerPosition?.x + 4 + "px";
    }
  };

  const handleMouseDownPainting = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
  ) => {
    setPaintMode(true);

    const pos = e?.target?.getStage()?.getPointerPosition()!;

    if (pos) {
      setDrawingLines([
        ...drawingLines,
        {
          tool: drawingMode,
          points: [pos?.x, pos?.y],
          strokeWidth: drawingMode === "brush" ? 5 : 1,
          stroke: drawingColor,
        },
      ]);
    }
  };

  const handleMouseMovePainting = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
  ) => {
    if (!isPaintingMode) {
      return;
    }

    // prevent scrolling on touch devices
    e.evt.preventDefault();
    const stage = e?.target?.getStage()!;
    const point = stage?.getPointerPosition()!;
    let lastLine = drawingLines[drawingLines.length - 1];
    // add point
    lastLine.points = lastLine?.points?.concat([point.x, point.y]);

    // replace last
    drawingLines.splice(drawingLines.length - 1, 1, lastLine);
    setDrawingLines(drawingLines?.concat());
  };

  return {
    handleWheel,
    layerDragMove,
    layerDragEnd,
    copyShape,
    drawGridOnLayer,
    showContextMenu,
    handleMouseDownPainting,
    handleMouseMovePainting,
  };
};
