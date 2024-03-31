import { MdOutlineDraw } from "react-icons/md";
import { PiEraser, PiPaintBrushFill, PiPencilSimpleThin } from "react-icons/pi";
import { useToggle } from "../../hooks/useToggle";
import { useCanvasStore } from "../../store/canvasStore";
import { Button } from "../common/Button";
export const DrawingMenu = () => {
 
  const setDrawingMode = useCanvasStore((state) => state.setDrawingMode);
  const drawingMode = useCanvasStore((state) => state.drawingMode);
  const [value, toggle] = useToggle();
const drawingColor = useCanvasStore((state)=>state.drawingColor);
const setDrawingColor = useCanvasStore((state)=>state.setDrawingColor)
  return (
    <div>
      <Button
        title="Draw"
        rightIcon={drawingMode?<MdOutlineDraw color="#60a5fa" />: <MdOutlineDraw />}
        className={"relative"}
        onClick={toggle}
      />
     {value? <ul className="menu bg-base-200 w-auto rounded-box absolute top-24 z-10">
        <li>
          <Button
            title="Draw with brush"
            rightIcon={
              drawingMode === "brush" ? (
                <PiPaintBrushFill color="#60a5fa" />
              ) : (
                <PiPaintBrushFill />
              )
            }
            onClick={() => {
              setDrawingMode("brush");
              toggle();
            }}
          />
        </li>
        <li>
          <Button
            title="Draw with pencil"
            rightIcon={
              drawingMode === "pencil" ? (
                <PiPencilSimpleThin color="#60a5fa" />
              ) : (
                <PiPencilSimpleThin />
              )
            }
            onClick={() => {
              setDrawingMode("pencil");
              toggle();

            }}
          />
        </li>
        <li>
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
              toggle();

            }}
          />
        </li>

        <li>
          <input id="drawingColor" name="drawingColor" type="color" value={drawingColor} onChange={(e)=>{
            console.log('e.target.value',e.target.value)
            setDrawingColor(e.target.value)
          }}/>
        </li>
      </ul>:null}
    </div>
  );
};
