import axios from "axios";
import { create } from "zustand";

const useEditorStore = create((set, get) => ({
  blocks: [],
  selectBlocks: [],
  setBlocks: (blocks) => set((state) => ({ ...state, blocks: blocks })),
  setSelectBlocks: (blocks) =>
    set((state) => ({ ...state, selectBlocks: blocks })),
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
    block.style = { ...block?.style, ...style };

    set((state) => ({ ...state, blocks }));
  },
  deleteBlock: (blockId) => {
    const blocks = get().blocks;
    const blockIndex = blocks.findIndex((block) => block.uuid === blockId);
    blocks.splice(blockIndex, 1);

    set((state) => ({ ...state, blocks }));
  },
  findBlock: (blockId) => {
    const blocks = get().blocks;
    const block = blocks.find((block) => block.uuid === blockId);

    return block;
  },
  deleteBlocks: (blockIds) => {
    const blocks = get().blocks;
    const newBlocks = blocks.filter((block) => !blockIds.includes(block.uuid));

    set((state) => ({ ...state, blocks: newBlocks }));
  },
  findChildBlocks: (uuid) => {
    if (!uuid) {
      throw new Error("uuid은 필수입력 사항입니다.");
    }
    const blocks = get().blocks;

    const findChildren = (parentId) => {
      const children = [];
      blocks.forEach((element) => {
        if (element.parentId === parentId) {
          children.push(element.uuid);
          const childData = findChildren(element.uuid);
          children.push(...childData);
        }
      });
      return children;
    };
    return findChildren(uuid);
  },
}));
// const deleteElement = (uuid) => {
//   let editElements = copyObjectArray(editorStoreRef.current.blocks);

//   const childList = findAllChildUuids(editElements, uuid);
//   childList.push(uuid);
//   editElements = editElements.filter(
//     (element) => !childList.includes(element.uuid)
//   );
//   const remainingElements = removeColumnAndRowIfEmpty(editElements);
//   modifyDomSave(remainingElements);
// };
export default useEditorStore;
