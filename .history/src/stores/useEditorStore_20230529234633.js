import axios from "axios";
import { create } from "zustand";

const useEditorStore = create((set, get) => ({
  blocks: [],
  selectedBlocks: [],
  setBlocks: (blocks) => set((state) => ({ ...state, blocks: blocks })),
  addBlock: (block) => {
    set((state) => ({ ...state, blocks: [...state.blocks, block] }));
    axios.post("/api/editor", { type: "add", data: block });
  },
  deleteBlock: (blockId) =>
    set((state) => state.blocks.filter((block) => block.id !== blockId)),
  updateBlock: (blockId, block) =>
    set((state) =>
      state.blocks.map((block) => (block.id === blockId ? block : block))
    ),
}));

export default useEditorStore;
