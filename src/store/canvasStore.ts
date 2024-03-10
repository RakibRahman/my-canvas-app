import Konva from "konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { create } from 'zustand';

type State = {

  selectedItem: Konva.Stage | Shape<ShapeConfig> | null
}
type Action = {

  setSelectedItem: (payload: Konva.Stage | Shape<ShapeConfig>) => void
}

type Store = State & Action

export const useCanvasStore = create<Store>()((set) => ({
  selectedItem: null,
  setSelectedItem: (payload) => set(() => ({ selectedItem: payload })),

}))