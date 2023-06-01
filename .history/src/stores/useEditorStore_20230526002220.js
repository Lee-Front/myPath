import { create } from "lodash";

const useEditorStore = create((set, get) => ({
  blocks: [],
  setBlocks: (blocks) => set(blocks),
  addBlock: (block) => set((state) => [...state.blocks, block]),
  deleteBlock: (blockId) =>
    set((state) => state.blocks.filter((block) => block.id !== blockId)),
  updateBlock: (blockId, block) =>
    set((state) =>
      state.blocks.map((block) => (block.id === blockId ? block : block))
    ),
}));

export default useEditorStore;
