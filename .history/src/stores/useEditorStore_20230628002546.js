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

    //const remainingElements = removeColumnAndRowIfEmpty(filteredBlocks);
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
    const blocks = [...get().blocks];

    const columns = blocks.filter((block) => block.direction === "column");
    if (columns.length > 0) {
      columns.forEach((column) => {
        const columnChildren = get().findChildBlocks(column.uuid).length;

        // 해당 컬럼에 자식이 없는경우 컬럼 삭제처리
        if (columnChildren <= 0) {
          copyElements = filterByKey(copyElements, "!uuid", column.uuid);

          // 여기가 column이 삭제된것
          copyElements.forEach((obj) => {
            if (obj.parentId === column.parentId) {
              const columnWidth = (obj.width / (100 - column.width)) * 100;
              obj.width = columnWidth;
            }
          });
        }
      });
    }

    const rows = filterByKey(copyElements, "direction", "row");
    if (rows.length > 0) {
      rows.forEach((element) => {
        const rowChildren = filterByKey(copyElements, "parentId", element.uuid);

        // row에 column이 1개 뿐이면 row는 필요없어짐 삭제처리
        if (rowChildren.length <= 1) {
          const rowUuid = element?.uuid;
          const columnUuid = rowChildren[0]?.uuid;

          // 여기서 comumn의 자식들을 row의 위치로 옮겨주면 되지 않을까?
          const rowIndex = findIndexByKey(copyElements, "uuid", rowUuid);

          copyElements = filterByKey(copyElements, "!uuid", rowUuid);
          copyElements = filterByKey(copyElements, "!uuid", columnUuid);
          const columnChildren = filterByKey(
            copyElements,
            "parentId",
            columnUuid
          );

          copyElements = filterByKey(copyElements, "!parentId", columnUuid);
          columnChildren.forEach((obj) => {
            if (obj.parentId === columnUuid) {
              obj.parentId = null;
            }
          });

          copyElements.splice(rowIndex, 0, ...columnChildren);
        }
      });
    }

    return copyElements;
  },
}));
export default useEditorStore;
