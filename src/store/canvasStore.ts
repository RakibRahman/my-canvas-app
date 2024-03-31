import Konva from "konva";
import { Shape, ShapeConfig, } from "konva/lib/Shape";
import { KonvaNodeComponent } from "react-konva";
import { create } from 'zustand';

type Zoom = {
  stageScale: number,
  stageX: number,
  stageY: number
}
type DrawingMode = 'brush' | 'eraser' | 'pencil' | null
type State = {

  selectedItem: Konva.Stage | Shape<ShapeConfig> | null,
  dragStage: boolean
  zoom: Zoom
  shapes: JSX.Element[]
  drawingLines: any[]
  isStageCleared: boolean
  drawingMode: DrawingMode
  drawingColor:string
  isPaintMode:boolean
}
type Action = {

  setSelectedItem: (payload: Konva.Stage | Shape<ShapeConfig>) => void,
  handleDragStage: () => void;
  handleZoom: (payload: Zoom) => void;
  setShapes: (payload: JSX.Element) => void;
  setStageCleared: () => void;
  setDrawingMode:(payload:DrawingMode)=>void;
  setPaintMode:(payload:boolean)=>void;
  setDrawingLines:(payload:any)=>void;
  setDrawingColor:(payload:string)=>void;
}

type Store = State & Action

export const useCanvasStore = create<Store>()((set) => ({

  selectedItem: null,
  shapes: [],
  dragStage: false,
  zoom: {
    stageScale: 1,
    stageX: 0,
    stageY: 0
  },
  isStageCleared: false,
  drawingMode:null,
  isPaintMode:false,
  drawingLines:[],
  drawingColor:'#df4b26',
  setSelectedItem: (payload) => set(() => ({ selectedItem: payload })),
  handleDragStage: () => set((state) => ({ dragStage: !state.dragStage })),
  handleZoom: (payload) => set(() => ({ zoom: payload })),
  setShapes: (payload) => set((state) => ({ shapes: [...state.shapes, payload] })),
  setStageCleared: () => set((state) => ({ isStageCleared: !state.isStageCleared })),
  setDrawingMode:(payload)=>set(()=>({drawingMode:payload})),
  setPaintMode:(payload)=> set(() => ({ isPaintMode:payload })),
  setDrawingLines:(payload)=>set(()=>({drawingLines:payload})),
  setDrawingColor:(payload)=>set(()=>({drawingColor:payload}))
}))