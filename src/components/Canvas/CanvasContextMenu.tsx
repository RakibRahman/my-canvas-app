import Konva from "konva";
import React, { RefObject, useEffect } from "react";
import { PiCopySimple, PiTrashSimple } from "react-icons/pi";
import { useStage } from "../../hooks/useStage";
import { useCanvasStore } from "../../store/canvasStore";

interface CanvasContextMenuProps {
  contextMenuRef: RefObject<HTMLDivElement>;
  layerRef: RefObject<Konva.Layer>;
  trRef: RefObject<Konva.Transformer>;
}

export const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({
  contextMenuRef,
  trRef,layerRef
}) => {

    const selectedItem = useCanvasStore((state) => state.selectedItem);
    const { copyShape } = useStage();

  useEffect(() => {
    const hideContextMenu = () => {
      // hide menu
      if (contextMenuRef.current) {
        contextMenuRef.current.style.display = "none";
      }
    };
    window.addEventListener("click", hideContextMenu);

    return () => window.removeEventListener("scroll", hideContextMenu);
  }, []);
  return (
    <div ref={contextMenuRef} id="menu">
      <ul className="menu bg-base-200 w-28 rounded-box absolute">
        <li 
         onClick={() => {
            if (selectedItem) {
              copyShape(selectedItem);
            }
          }}
        >
          <a>
            <PiCopySimple />
            Copy
          </a>
        </li>
        <li  onClick={() => {
          trRef.current?.hide();
          selectedItem?.destroy();
          layerRef.current?.draw();
        }}>
          <a>
            <PiTrashSimple />
            Delete
          </a>
        </li>
      </ul>
    </div>
  );
};
