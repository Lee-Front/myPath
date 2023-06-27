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
  // blocks 조작 함수들
  saveBlocks: async (newBlocks) => {
    const blocks = [...get().blocks];
    console.log("blocks: ", blocks);
    console.log("newBlocks: ", newBlocks);
    // 변경된 위치대로 sort를 다시 부여
    newBlocks.forEach((element, index) => {
      element.sort = index;
    });

    // newDom에는 있으나 기존 dom에는 없는것 [생성]
    const createList = newBlocks
      .filter((x) => !blocks.some((y) => x.uuid === y.uuid))
      .map((data) => {
        return { type: "create", data: data };
      });

    // 기존 dom에는 있으나 newDom에는 없는것 [삭제]
    const deleteList = blocks
      .filter((x) => !newBlocks.some((y) => x.uuid === y.uuid))
      .map((data) => {
        return { type: "delete", data: data };
      });

    const modifyList = [];
    blocks.forEach((element) => {
      const sameElement = newBlocks.find((x) => x.uuid === element.uuid);
      console.log("element: ", element);
      console.log("sameElement: ", sameElement);
      if (
        sameElement &&
        JSON.stringify(element) !== JSON.stringify(sameElement)
      ) {
        const differentData = { type: "modify", data: sameElement };
        modifyList.push(differentData);
      }
    });

    // 3개 배열 합치기
    modifyList.splice(0, 0, ...createList, ...deleteList);
    console.log("modifyList: ", modifyList);

    get().setBlocks(newBlocks);
    await axios.post("/api/editor", modifyList);
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
    const remainingElements = get().removeColumnAndRowIfEmpty(filteredBlocks);
    get().saveBlocks(remainingElements);
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
  removeColumnAndRowIfEmpty: (newBlocks) => {
    const columns = newBlocks.filter((block) => block.direction === "column");
    if (columns.length > 0) {
      columns.forEach((column) => {
        const columnChildren = newBlocks.filter(
          (block) => block.parentId === column.uuid
        );
        // 해당 컬럼에 자식이 없는경우 컬럼 삭제처리
        if (columnChildren <= 0) {
          newBlocks = newBlocks.filter((block) => block.uuid !== column.uuid);

          // 여기가 column이 삭제된것
          newBlocks.forEach((obj) => {
            if (obj.parentId === column.parentId) {
              const columnWidth = (obj.width / (100 - column.width)) * 100;
              obj.width = columnWidth;
            }
          });
        }
      });
    }

    const rows = newBlocks.filter((block) => block.direction === "row");

    if (rows.length > 0) {
      rows.forEach((row) => {
        const rowChildren = newBlocks.filter(
          (block) => block.parentId === row.uuid
        );

        // row에 column이 1개 뿐이면 row는 필요없어짐 삭제처리
        if (rowChildren.length <= 1) {
          const rowUuid = row?.uuid;
          const columnUuid = rowChildren[0]?.uuid;

          // 여기서 comumn의 자식들을 row의 위치로 옮겨주면 되지 않을까?
          const rowIndex = newBlocks.findIndex(
            (block) => block.uuid === rowUuid
          );

          newBlocks = newBlocks.filter((block) => block.uuid !== rowUuid);
          newBlocks = newBlocks.filter((block) => block.uuid !== columnUuid);
          const columns = newBlocks.filter(
            (block) => block.parentId === columnUuid
          );

          newBlocks = newBlocks.filter(
            (block) => block.parentId !== columnUuid
          );
          columns.forEach((obj) => {
            if (obj.parentId === columnUuid) {
              obj.parentId = null;
            }
          });

          newBlocks.splice(rowIndex, 0, ...columns);
        }
      });
    }
    return newBlocks;
  },
}));
export default useEditorStore;
