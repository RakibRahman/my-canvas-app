import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { create } from 'zustand';

type Zoom = {
  stageScale: number,
  stageX: number,
  stageY: number
}
type State = {

  selectedItem: Konva.Stage | Shape<ShapeConfig> | null,
  dragStage:boolean
  zoom:Zoom
}
type Action = {

  setSelectedItem: (payload: Konva.Stage | Shape<ShapeConfig>) => void,
  handleDragStage:()=>void;
  handleZoom:(payload:Zoom)=>void;
}

type Store = State & Action

export const useCanvasStore = create<Store>()((set) => ({
  selectedItem: null,
  dragStage:false,
  zoom:{ stageScale: 1,
    stageX: 0,
    stageY: 0},
  setSelectedItem: (payload) => set(() => ({ selectedItem: payload })),
  handleDragStage:()=>set((state)=>({dragStage:!state.dragStage})),
  handleZoom:(payload)=>set(()=>({zoom:payload}))

}))