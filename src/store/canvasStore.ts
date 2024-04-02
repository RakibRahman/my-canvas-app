import Konva from "konva";
import { Shape, ShapeConfig, } from "konva/lib/Shape";
import { KonvaNodeComponent } from "react-konva";
import { create } from 'zustand';

export type BasicShape={
  x:number
  y:number
  fill:string
  type: 'CIRCLE' | 'RECT' | 'TEXT'
  width:number
height:number
key:string | number
fontSize:number
}

type Zoom = {
  stageScale: number,
  stageX: number,
  stageY: number
}
type DrawingMode = 'brush' | 'eraser' | 'pencil' | null
type State = {

  selectedItem: Konva.Stage | Shape<ShapeConfig> | null,
  selectedShape: 'CIRCLE' | 'RECT' | 'TEXT' | null
  dragStage: boolean
  zoom: Zoom
  shapes: BasicShape[]
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
  setShapes: (payload: BasicShape[]) => void;
  setStageCleared: () => void;
  setDrawingMode:(payload:DrawingMode)=>void;
  setPaintMode:(payload:boolean)=>void;
  setDrawingLines:(payload:any)=>void;
  setDrawingColor:(payload:string)=>void;
  setSelectedShape:(payload:'CIRCLE' | 'RECT' | 'TEXT' | null )=>void;
}

type Store = State & Action

export const useCanvasStore = create<Store>()((set) => ({
  selectedShape:null,
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
  setShapes: (payload) => set((state) => ({ shapes: payload })),
  setStageCleared: () => set((state) => ({ isStageCleared: !state.isStageCleared })),
  setDrawingMode:(payload)=>set(()=>({drawingMode:payload})),
  setPaintMode:(payload)=> set(() => ({ isPaintMode:payload })),
  setDrawingLines:(payload)=>set(()=>({drawingLines:payload})),
  setDrawingColor:(payload)=>set(()=>({drawingColor:payload})),
  setSelectedShape:(payload)=>set(()=>({selectedShape:payload}))

}))