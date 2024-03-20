import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect } from 'react';
import { useCanvasStore } from '../store/canvasStore';

export const stageStyle =  {
  backgroundImage:`url(https://img.freepik.com/free-photo/watercolor-paper-texture_1194-6307.jpg?w=826&t=st=1710828862~exp=1710829462~hmac=746cac38f408042e7f0533ad23a482793b6909643bd208c56475381a99e8d6c8)`,
  backgroundRepeat:'no-repeat',
  backgroundSize:'cover'
}

export const useStage = () => {


  const SCALE_BY = 1.05;
  






  function handleEsc(event: KeyboardEvent) {

    console.log(event)

  }

  function unpressCTRL(event: KeyboardEvent) {
    console.log(event)
  }
  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keyup", unpressCTRL);
    };
  }, []);




  const handleZoom = useCanvasStore((state) => state.handleZoom);

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage()!;
    const oldScale = stage.scaleX();
    const stagePointerPositionX = stage.getPointerPosition()!.x;
    const stagePointerPositionY = stage.getPointerPosition()!.y;

    const mousePointTo = {
      x: stagePointerPositionX / oldScale - stage.x() / oldScale,
      y: stagePointerPositionY / oldScale - stage.y() / oldScale
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

    handleZoom({
      stageScale: newScale,
      stageX:
        -(mousePointTo.x - stagePointerPositionX / newScale) * newScale,
      stageY:
        -(mousePointTo.y - stagePointerPositionY / newScale) * newScale
    });
  };

  return { handleWheel };

}
