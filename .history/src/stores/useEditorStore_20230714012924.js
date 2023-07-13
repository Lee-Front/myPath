import axios from "axios";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";

const useEditorStore = create((set, get) => ({
  pathId: null,
  blocks: [],
  selectBlocks: [],
  hoverBlock: null,
  setPathId: (pathId) => set((state) => ({ ...state, pathId: pathId })),
  setBlocks: (blocks) => set((state) => ({ ...state, blocks: blocks })),
  setSelectBlocks: (blocks) => {
    set((state) => ({ ...state, selectBlocks: blocks }));
  },
  setHoverBlock: (block) => {
    set((state) => ({ ...state, hoverBlock: block }));
  },
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
  createBlock: ({ tagName, direction, width }) => {
    if (!tagName) {
      throw new Error("tagName은 필수입력 사항입니다.");
    }
    const uuid = uuidv4();
    // 추후에 타입에따라 필요한것들만 생성되게
    const newBlock = {
      pathId: get().pathId,
      uuid,
      tagName,
      html: "",
      style: {},
      parentId: null,
      direction,
      width,
    };

    return newBlock;
  },
  updateBlock: (blockUuid, newBlock) => {
    let blocks = JSON.parse(JSON.stringify(get().blocks));
    const keys = Object.keys(newBlock);

    blocks = blocks.map((block) => {
      if (block.uuid === blockUuid) {
        keys.forEach((key) => {
          block[key] = newBlock[key];
        });
      }
      return block;
    });

    get().saveBlocks(blocks);
  },
  deleteBlocks: () => {
    const blocks = get().blocks;
    const selectBlocks = JSON.parse(JSON.stringify(get().selectBlocks)).filter(
      (block) => block.tagName !== "multiple"
    );
    const deleteList = [];
    selectBlocks.forEach((block) => {
      deleteList.push(block.uuid);
      const children = get().findChildBlocks(block.uuid);
      deleteList.push(...children);
    });

    const filteredBlocks = blocks.filter(
      (block) => !deleteList.includes(block.uuid)
    );
    get().setSelectBlocks([]);
    const remainingElements = get().removeColumnAndRowIfEmpty(filteredBlocks);
    get().saveBlocks(remainingElements);
  },
  saveBlocks: async (newBlocks) => {
    let blocks = JSON.parse(JSON.stringify(get().blocks));
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

    get().setBlocks(newBlocks);
    await axios.post("/api/editor", modifyList);
  },
  changeBlockStyle: (blockId, style) => {
    const blocks = get().blocks;
    const selectBlocks = get().selectBlocks;

    const updatedBlocks = cloneDeep(blocks).map((block) => {
      const findBlock = selectBlocks.find((x) => x.uuid === block.uuid);
      if (findBlock) {
        block.style = { ...block.style, ...style };
      }
      return block;
    });

    set((state) => ({ ...state, blocks: updatedBlocks }));
  },
  findBlock: (blockUuid) => {
    const blocks = get().blocks;
    const block = blocks.find((block) => block.uuid === blockUuid);

    return block;
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
  moveBlocks: (selectDatas, movementData) => {
    const targetData = get().findBlock(movementData.uuid);
    const fromDatas = [];

    const filteredBlocks = JSON.parse(JSON.stringify(get().blocks)).filter(
      (element) => {
        if (selectDatas.some((obj) => element.uuid === obj.uuid)) {
          fromDatas.push(element);
          return false;
        }
        return true;
      }
    );

    const toIndex = filteredBlocks.findIndex((block) => {
      return block.uuid === targetData.uuid;
    });
    const findToData = filteredBlocks[toIndex];

    // 해당 데이터들이 없으면 실행되지 않아야함
    if (toIndex === -1 || !movementData || !findToData) return;

    // 이동관련 Element 데이터 수정 및 추가
    if (targetData.parentId) {
      // 일단 위, 아래로 옮겨갔을때 multiple이 새로 생기려면 multiple 데이터 내부 데이터여야함
      if (
        movementData.position === "top" ||
        movementData.position === "bottom"
      ) {
        if (movementData?.movementSideType === "text") {
          // checkbox나 bullet의 경우 text 영역에 아래로 들어가는 경우에

          fromDatas.forEach((block) => (block.parentId = findToData.uuid));

          filteredBlocks.splice("top" ? toIndex : toIndex + 1, 0, ...fromDatas);
        } else {
          const parentData = get().findBlock(findToData.parentId);
          fromDatas.forEach((block) => (block.parentId = parentData.uuid));

          filteredBlocks.splice(
            movementData.position === "top" ? toIndex : toIndex + 1,
            0,
            ...fromDatas
          );
        }
      } else {
        const rowChildElements = filteredBlocks.filter(
          (block) => block.parentId === targetData.parentId
        );
        const width = (100 / (rowChildElements.length + 1)).toFixed(4);

        // left right즉 해당 multiple에 들어가는 경우에만 같은 parentId로 해주면됨
        const newElement = get().createBlock({
          tagName: "multiple",
          direction: "column",
          width: parseFloat(width),
        });

        rowChildElements.forEach((element) => {
          const newWidth = (element.width / 100) * (100 - width);
          element.width = newWidth;
        });

        newElement.parentId = targetData.parentId;
        fromDatas.forEach((block) => (block.parentId = newElement.uuid));

        filteredBlocks.splice(
          movementData.position === "left" ? toIndex : toIndex + 1,
          0,
          newElement,
          ...fromDatas
        );
      }
    } else {
      //left, right의 경에우 multiple로 나눠줘야됨
      if (
        movementData.position === "left" ||
        movementData.position === "right"
      ) {
        // 일단 sort가 이단계에서 들어가야 하는지 검토필요
        //let elementSort = editDomRef.current.length;
        const newElement = get().createBlock({
          pathId: get().pathId,
          tagName: "multiple",
          direction: "row",
        });

        const newColumElement1 = get().createBlock({
          pathId: get().pathId,
          tagName: "multiple",
          direction: "column",
          width: 50,
        });

        const newColumElement2 = get().createBlock({
          pathId: get().pathId,
          tagName: "multiple",
          direction: "column",
          width: 50,
        });

        newColumElement1.parentId = newElement.uuid;
        newColumElement2.parentId = newElement.uuid;

        fromDatas.forEach((block) => (block.parentId = newColumElement1.uuid));
        findToData.parentId = newColumElement2.uuid;

        if (movementData.position === "left") {
          filteredBlocks.splice(
            toIndex,
            0,
            newElement,
            newColumElement1,
            ...fromDatas,
            newColumElement2
          );
        } else {
          filteredBlocks.splice(toIndex + 1, 0, newColumElement1, ...fromDatas);
          filteredBlocks.splice(toIndex, 0, newElement, newColumElement2);
        }
      } else {
        console.log("a");
        fromDatas.forEach(
          (element) =>
            (element.parentId =
              movementData?.movementSideType === "text"
                ? findToData.uuid
                : null)
        );

        if (movementData.position === "top") {
          filteredBlocks.splice(toIndex, 0, ...fromDatas);
        } else {
          filteredBlocks.splice(toIndex + 1, 0, ...fromDatas);
        }
      }
    }

    // multiple에서 데이터 삭제시 multiple 삭제 여부확인 및 처리
    const remainingElements = get().removeColumnAndRowIfEmpty(filteredBlocks);
    const remainingSelectBlocks = get().selectBlocks.filter((block) =>
      remainingElements.find((element) => element.uuid === block.uuid)
    );
    get().setSelectBlocks(remainingSelectBlocks);
    get().saveBlocks(remainingElements);
  },
  removeColumnAndRowIfEmpty: (blocks) => {
    let newBlocks = JSON.parse(JSON.stringify(blocks));
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
  toggleSelectBlock: (uuid) => {
    const selectBlocks = get().selectBlocks;
    const isSelected = selectBlocks.find((block) => block.uuid === uuid);
    if (isSelected) {
      set((state) => ({
        ...state,
        selectBlocks: selectBlocks.filter((block) => block.uuid !== uuid),
      }));
    } else {
      const block = get().findBlock(uuid);
      set((state) => ({ ...state, selectBlocks: [...selectBlocks, block] }));
    }
  },
}));
export default useEditorStore;
