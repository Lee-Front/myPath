import { create } from "zustand";

const useEditorStore = create((set, get) => ({
  blocks: [],
  selectedBlocks: [],
  setBlocks: (blocks) => set((state) => ({ ...state, blocks: blocks })),
}));

export default useEditorStore;
