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
  findBlock: (blockId) => {
    const blocks = get().blocks;
    const block = blocks.find((block) => block.uuid === blockId);

    return block;
  },
  deleteBlocks: (blockIUuids) => {
    const blocks = get().blocks;
    const deleteList = [];
    blockIUuids.forEach((uuid) => {
      deleteList.push(uuid);
      const children = get().findChildBlocks(uuid);
      deleteList.push(...children);
    });

    const filteredBlocks = blocks.filter(
      (block) => !deleteList.includes(block.uuid)
    );

    set((state) => ({ ...state, blocks: filteredBlocks }));

    get.removeColumnAndRowIfEmpty();
    //modifyDomSave(remainingElements);
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
  removeColumnAndRowIfEmpty: () => {
    let blocks = [...get().blocks];

    const columns = blocks.filter((block) => block.direction === "column");
    if (columns.length > 0) {
      columns.forEach((column) => {
        const columnChildren = blocks.filter(
          (block) => block.parentId === column.uuid
        );
        // 해당 컬럼에 자식이 없는경우 컬럼 삭제처리
        if (columnChildren <= 0) {
          blocks = blocks.filter((block) => block.uuid !== column.uuid);

          // 여기가 column이 삭제된것
          blocks.forEach((obj) => {
            if (obj.parentId === column.parentId) {
              const columnWidth = (obj.width / (100 - column.width)) * 100;
              obj.width = columnWidth;
            }
          });
        }
      });
    }

    const rows = blocks.filter((block) => block.direction === "row");

    if (rows.length > 0) {
      rows.forEach((row) => {
        const rowChildren = blocks.filter(
          (block) => block.parentId === row.uuid
        );

        // row에 column이 1개 뿐이면 row는 필요없어짐 삭제처리
        if (rowChildren.length <= 1) {
          const rowUuid = row?.uuid;
          const columnUuid = rowChildren[0]?.uuid;

          // 여기서 comumn의 자식들을 row의 위치로 옮겨주면 되지 않을까?
          const rowIndex = blocks.findIndex((block) => block.uuid === rowUuid);

          blocks = blocks.filter((block) => block.uuid !== rowUuid);
          blocks = blocks.filter((block) => block.uuid !== columnUuid);
          const columns = blocks.filter(
            (block) => block.parentId === columnUuid
          );

          blocks = blocks.filter((block) => block.parentId !== columnUuid);
          columns.forEach((obj) => {
            if (obj.parentId === columnUuid) {
              obj.parentId = null;
            }
          });

          blocks.splice(rowIndex, 0, ...columns);
        }
      });
    }
    set((state) => ({ ...state, blocks }));
  },
}));
export default useEditorStore;
