import { PiCircle, PiRectangle, PiShapes } from "react-icons/pi";
import EllipseIcon from "../../assets/icons/ellipse.svg";
import { useCanvasStore } from "../../store/canvasStore";
import { Button } from "../common/Button";
import { Circle } from "./Shapes/Circle";
import { Ellipse } from "./Shapes/Ellipse";
import { Rectangle } from "./Shapes/Rectangle";
import { useToggle } from "../../hooks/useToggle";

export const ShapeMenu = () => {
  const setShapes = useCanvasStore((state) => state.setShapes);
  const [value, toggle] = useToggle();

  return (
    <div>
      <Button
        title="Shapes"
        rightIcon={<PiShapes />}
        className={"relative"}
        onClick={toggle}
      />

      {value ? (
        <ul className="menu bg-base-200 w-auto rounded-box absolute top-24 z-10">
          <li>
            <a>
              <Button
                title="Circle"
                rightIcon={<PiCircle />}
                onClick={() => {
                  setShapes(<Circle />);
                  toggle();
                }}
              />
            </a>
          </li>
          <li>
            <a>
              <Button
                onClick={() => {
                  setShapes(<Rectangle />);
                  toggle();
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
                  toggle();
                }}
              />
            </a>
          </li>
        </ul>
      ) : null}
    </div>
  );
};
