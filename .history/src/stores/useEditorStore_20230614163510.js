import axios from "axios";
import { create } from "zustand";

const useEditorStore = create((set, get) => ({
  blocks: [],
  selectedBlocks: [],
  setBlocks: (blocks) => set((state) => ({ ...state, blocks: blocks })),
  getBlocks: async (pathId) => {
    const response = await axios.get("/api/editor", {
      params: { pathId },
    });
    const blocks = response.data;

    blocks.sort(function (a, b) {
      return a.sort - b.sort;
    });

    set((state) => ({ ...state, blocks }));
  },
  changeBlockStyle: (blockId, style) => {
    const blocks = get().blocks;
    const block = blocks.find((block) => block.uuid === blockId);
    Object.assign(block.style, style);

    set((state) => ({ ...state, blocks }));
  },
}));

export default useEditorStore;