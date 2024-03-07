import { create } from 'zustand'

export const useCanvasStore = create((set) => ({
  selectedItem: null,
  setSelectedItem: (payload:any) => set((state:any) => ({ selectedItem: payload})),

}))