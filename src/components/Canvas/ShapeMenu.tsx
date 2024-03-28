import { useState } from "react";
import {
    PiCircle,
    PiRectangle,
    PiShapes
} from "react-icons/pi";
import EllipseIcon from "../../assets/icons/ellipse.svg";
import { useCanvasStore } from "../../store/canvasStore";
import { Button } from "../common/Button";
import { Circle } from "./Shapes/Circle";
import { Ellipse } from "./Shapes/Ellipse";
import { Rectangle } from "./Shapes/Rectangle";

export const ShapeMenu = () => {
  const setShapes = useCanvasStore((state) => state.setShapes);

  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = ()=>setShowMenu((s)=>!s);

  return (
    <div>
      <Button
        title="Shapes"
        rightIcon={<PiShapes />}
        className={"relative"}
        onClick={toggleMenu}
      />

      {showMenu ? (
        <ul className="menu bg-base-200 w-auto rounded-box absolute top-24 z-10">
          <li>
            <a>
              <Button
                title="Circle"
                rightIcon={<PiCircle />}
                onClick={() => {
                  setShapes(<Circle />);
                  toggleMenu();
                }}
              />
            </a>
          </li>
          <li>
            <a>
              <Button
                onClick={() => {
                  setShapes(<Rectangle />);
                  toggleMenu();
                }}
                title="Rect"
                rightIcon={<PiRectangle />}
              />
            </a>
          </li>
          <li>
            <a>
              <Button
                title="Ellipse"
                rightIcon={<img src={EllipseIcon} alt="Ellipse Logo" />}
                onClick={() => {
                  setShapes(<Ellipse />);
                  toggleMenu();
                }}
              />
            </a>
          </li>
        </ul>
      ) : null}
    </div>
  );
};
