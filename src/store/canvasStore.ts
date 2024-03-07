import Konva from "konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { create } from 'zustand';




type Store = {
    selectedItem: Konva.Stage | Shape<ShapeConfig> | null
    setSelectedItem: (payload: Konva.Stage | Shape<ShapeConfig>) => void
  }

export const useCanvasStore = create<Store>()((set) => ({
  selectedItem: null,
  setSelectedItem: (payload ) => set((state) => ({ selectedItem: payload})),

}))