import React from "react";
import styled from "@emotion/styled";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useRef } from "react";
import EditBranchComponent from "./EditBranchComponent";
import axios from "axios";
import PopupMenu from "../../common/PopupMenu";
import ContextMenuPopup from "../../common/ContextMenuPopup";
import useEditorStore from "../../../stores/useEditorStore";

const CardEditor = ({ pathId }) => {
  const editorStore = useEditorStore();
  const editorStoreRef = useRef(editorStore);
  //const [editDom, setEditDom] = useState(editorStoreRef.current.blocks);
  //const editDomRef = useRef([]);
  const [movementSide, setMovementSide] = useState("");

  // 이 두개는 store로 빼거나 state로 빼면 리렌더링이 너무 많이 발생함
  const nearElement = useRef(null);
  const hoverElement = useRef(null);

  const movementSideRef = useRef("");

  const selectElements = useRef([]);
  const fileData = useRef(null);
  const selectPoint = useRef(null);
  const contextMenuPoint = useRef(null);
  const editorRef = useRef();
  const popupRef = useRef();

  const [overlayList, setOverlayList] = useState([]);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [popupUuid, setPopupUuid] = useState();
  const [newUuid, setNewUuid] = useState(null);
  const [draggable, setDraggable] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState();
  const [isFileUploderOpen, setIsFileUploderOpen] = useState(false);

  useEffect(() => {
    editorStore.getBlocks(pathId);
  }, [pathId]);

  // 마우스 이벤트에서 state를 실시간으로 참조하기 위한 ref
  useEffect(() => {
    editorStoreRef.current = editorStore;
  }, [editorStore]);

  useEffect(() => {
    movementSideRef.current = movementSide;
  }, [movementSide]);

  // 최초 페이지 진입시 기본 이벤트 셋팅
  const attachWindowEvent = () => {
    console.log("att");
    window.addEventListener("mousedown", windowMouseDown);
    window.addEventListener("mouseup", windowMouseUp);
    window.addEventListener("mousemove", windowMouseMove);
  };

  const detachWindowEvent = () => {
    console.log("det");
    window.removeEventListener("mousedown", windowMouseDown);
    window.removeEventListener("mouseup", windowMouseUp);
    window.removeEventListener("mousemove", windowMouseMove);
  };

  useEffect(() => {
    getTagList();
    console.log("a");

    window.addEventListener("pointerenter", () => {
      console.log("enter");
    });
    window.addEventListener("pointerleave", () => {
      console.log("leave");
    });
    return () => {
      window.removeEventListener("mouseenter", attachWindowEvent);
      window.removeEventListener("mouseleave", detachWindowEvent);
    };

    // window.addEventListener("mousedown", windowMouseDown);
    // window.addEventListener("mouseup", windowMouseUp);
    // window.addEventListener("mousemove", windowMouseMove);
    // return () => {
    //   window.removeEventListener("mousedown", windowMouseDown);
    //   window.removeEventListener("mouseup", windowMouseUp);
    //   window.removeEventListener("mousemove", windowMouseMove);
    //   editorStore.setBlocks([]);
    // };
  }, []);

  useEffect(() => {
    const newElement = Array.from(
      editorRef.current.querySelectorAll("[data-uuid]")
    ).filter((item) => item.getAttribute("data-uuid") === newUuid);

    if (newElement.length > 0) {
      newElement[0].children[0].focus();
    }
  }, [newUuid]);

  // 서버에서 해당 Path의 모든 Tag를 조회
  const getTagList = async () => {
    const response = await axios.get("/api/editor", {
      params: { pathId },
    });
    const tagList = response.data;

    tagList.sort(function (a, b) {
      return a.sort - b.sort;
    });

    editorStore.setBlocks(tagList);

    //setEditDom(tagList);
  };

  // 현시점 editDom 데이터를 원본과 분리하기 위해 복사해서 리턴해주는 함수
  const copyObjectArray = (arr) => {
    return arr.map((element) => Object.assign({}, element));
  };

  // 마우스 이동에 따른 데이터 수정을 위한 이벤트
  const windowMouseDown = (e) => {
    if (
      !isFileUploderOpen &&
      !isContextMenuOpen &&
      hoverElement.current &&
      e.ctrlKey
    ) {
      window.getSelection().removeAllRanges();
      const hoverUuid = hoverElement.current.getAttribute("data-uuid");

      const blocks = copyObjectArray(editorStoreRef.current.blocks);
      selectElements.current = makeTree(blocks, hoverUuid);
    }

    selectPoint.current = { x: e.clientX, y: e.clientY };
  };

  const windowMouseMove = (e) => {
    const { clientX, clientY } = e;
    const Contents = Array.from(
      editorRef.current.querySelectorAll("[data-uuid]")
    );
    const filteredContents = Contents.filter((content) => {
      const data = getEditComponentData(content.getAttribute("data-uuid"));
      return data.tagName !== "multiple";
    });

    if (Contents.length > 0) {
      findNearElementByPointer(filteredContents, clientX, clientY);
    } else if (nearElement.current || hoverElement.current) {
      nearElement.current = null;
      hoverElement.current = null;
    }

    // 마우스 클릭 좌표가 있을 경우에만 드래그 확인
    if (selectPoint.current) {
      const distance = Math.sqrt(
        Math.pow(Math.abs(clientX - selectPoint.current.x), 2) +
          Math.pow(Math.abs(clientY - selectPoint.current.y), 2)
      );

      // 이동 거리가 5이상이어야 드래그로 인식
      if (!draggable && distance < 5) {
        return;
      }

      setDraggable(true);
    }

    // 선택된 Element가 있을경우 드래그 이벤트
    if (selectElements.current.length > 0) {
      window.getSelection().removeAllRanges();
      setCurrentPoint({ x: clientX, y: clientY });
      setOverlayList(selectElements.current);
      decideMovementSide(clientX, clientY);
    }
  };

  const windowMouseUp = (e) => {
    const contextMenu = e.target.closest(".contextMenu");
    if (hoverElement.current && !contextMenu && e.button === 2) {
      const { clientX, clientY } = e;
      const popupRight = clientX + 300;
      const popupBottom = clientY + 120;

      let popupX = clientX;
      let popupY = clientY;

      if (popupRight > window.innerWidth) {
        popupX = window.innerWidth - 310;
      }

      if (popupBottom > window.innerHeight) {
        popupY = window.innerHeight - 130;
      }
      contextMenuPoint.current = { x: popupX, y: popupY };
      // 한번 닫았다 열어줘서 열려있는 스크롤같은걸 닫아줌
      setIsContextMenuOpen(false);
    }

    // Element를 옮기는 중이고, 선택된 Element가 있음
    const selectDatas = selectElements.current;
    const moveMentSideData = movementSideRef.current;
    if (selectDatas.length > 0 && moveMentSideData?.uuid) {
      moveElementData(selectDatas, moveMentSideData);
    }

    selectElements.current = [];
    selectPoint.current = null;
    setOverlayList([]);
    setDraggable(false);
    setMovementSide(null);
  };

  const modifyDomSave = async (newEditDom) => {
    const editDomList = copyObjectArray(editorStoreRef.current.blocks);
    // 변경된 위치대로 sort를 다시 부여
    newEditDom.map((element, index) => {
      element.sort = index;
    });

    // newDom에는 있으나 기존 dom에는 없는것 [생성]
    const createList = newEditDom
      .filter((x) => !editDomList.some((y) => x.uuid === y.uuid))
      .map((data) => {
        return { type: "create", data: data };
      });

    // 기존 dom에는 있으나 newDom에는 없는것 [삭제]
    const deleteList = editDomList
      .filter((x) => !newEditDom.some((y) => x.uuid === y.uuid))
      .map((data) => {
        return { type: "delete", data: data };
      });

    const modifyList = [];
    editDomList.map((element) => {
      const sameElement = newEditDom.find((x) => x.uuid === element.uuid);
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

    //setEditDom(newEditDom);
    editorStore.setBlocks(newEditDom);
    await axios.post("/api/editor", modifyList);
  };

  const makeTree = (list, targetUuid) => {
    // 원본 state 유지를 위해 복사하여 사용
    const copyList = copyObjectArray(list);
    const map = {};
    const roots = [];

    // 모든 노드에 대한 빈 데이터를 만들어줌
    copyList.forEach((node, index) => {
      // map에 uuid가 몇번째인지 넣어줌
      map[node.uuid] = index;
      node.multipleData = [];
    });

    copyList.forEach((node) => {
      if (node.parentId) {
        copyList[map[node.parentId]].multipleData.push(node);
      }
    });

    // targetUuid가 undefined가 아니면 해당 노드만 반환하고,
    // undefined이면 부모가 없는 노드를 roots에 넣어서 반환
    if (targetUuid) {
      return roots.concat(copyList.filter((node) => node.uuid === targetUuid));
    }
    return copyList.filter((node) => !node.parentId);
  };

  const findClosestElementByAxis = (elements, pos, axis) => {
    if (!elements || elements.length === 0) {
      nearElement.current = null;
      hoverElement.current = null;
      return;
    }

    let hoverEl = null;

    const rectProp = axis === "x" ? "left" : "top";
    const sizeProp = axis === "x" ? "width" : "height";

    const nearEl = elements.reduce((prev, curr) => {
      const prevRect = prev.getBoundingClientRect();
      const currRect = curr.getBoundingClientRect();

      if (
        currRect[rectProp] <= pos &&
        pos <= currRect[rectProp] + currRect[sizeProp]
      ) {
        hoverEl = curr;
        return curr;
      }

      return Math.abs(prevRect[rectProp] - pos) >
        Math.abs(currRect[rectProp] - pos)
        ? curr
        : prev;
    }, elements[0]);

    return { nearEl, hoverEl };
  };

  const findNearElementByPointer = (Contents, x, y) => {
    if (Contents.length > 0) {
      const equalXElements = Contents.filter((element) => {
        const { left, right } = element.getBoundingClientRect();
        return left <= x && x <= right;
      });

      const closestDataByY = findClosestElementByAxis(equalXElements, y, "y");

      if (!closestDataByY?.nearEl) {
        const equalYElements = Contents.filter((element) => {
          const { top, bottom } = element.getBoundingClientRect();
          return top <= y && y <= bottom;
        });

        const closestDataByX = findClosestElementByAxis(equalYElements, x, "x");
        nearElement.current = closestDataByX?.nearEl;
        hoverElement.current = closestDataByX?.hoverEl;
      } else {
        nearElement.current = closestDataByY?.nearEl;
        hoverElement.current = closestDataByY?.hoverEl;
      }
    }
  };

  const decideMovementSide = (x1, y1) => {
    const targetElement = hoverElement.current || nearElement.current;
    if (!targetElement) {
      setMovementSide(null);
      return;
    }

    const clonedEditDom = copyObjectArray(editorStoreRef.current.blocks);
    const targetUuid = targetElement.getAttribute("data-uuid");
    const targetData = getEditComponentData(targetUuid);
    const parentData =
      targetData?.parentId && getEditComponentData(targetData.parentId);
    const { top, bottom, left, right } = targetElement.getBoundingClientRect();
    const distanceList = [];

    if (top <= y1 && y1 <= bottom) {
      distanceList.push({ position: "left", distance: Math.abs(left - x1) });
      distanceList.push({ position: "right", distance: Math.abs(right - x1) });
    }

    if (left <= x1 && x1 <= right) {
      distanceList.push({ position: "top", distance: Math.abs(top - y1) });
      distanceList.push({
        position: "bottom",
        distance: Math.abs(bottom - y1),
      });
    }

    if (!distanceList.length) {
      setMovementSide(null);
      return;
    }

    // list에 넣어둔 각 방향의 거리를 비교해서 가장 짧은 거리 찾아내기
    const minDistance = distanceList.reduce(
      (min, item) => (min.distance > item.distance ? item : min),
      distanceList[0]
    );

    const { previousSibling } = getSiblingsData(targetData, clonedEditDom);
    const topParentData = getTopParentData(targetData);
    const topParentSiblingsData = getSiblingsData(topParentData, clonedEditDom);

    let targetElementData = {};

    if (minDistance.position === "top") {
      if (!hoverElement.current) {
        //prevData가 없으면 맨위
        targetElementData.uuid = topParentSiblingsData.previousSibling
          ? topParentSiblingsData.previousSibling.uuid
          : topParentData.uuid;
        targetElementData.position = topParentSiblingsData.previousSibling
          ? "bottom"
          : minDistance.position;
      } else {
        targetElementData.uuid = previousSibling
          ? previousSibling.uuid
          : targetData.uuid;
        targetElementData.position = previousSibling
          ? "bottom"
          : minDistance.position;
      }
    } else if (minDistance.position === "bottom") {
      if (!hoverElement.current) {
        targetElementData.uuid = topParentSiblingsData.nextSibling
          ? topParentSiblingsData.nextSibling.uuid
          : topParentData.uuid;
        targetElementData.position = minDistance.position;
      } else {
        targetElementData.uuid = targetData.uuid;
        targetElementData.position = minDistance.position;
      }
    } else {
      targetElementData.uuid = targetData.uuid;
      targetElementData.position = minDistance.position;
    }

    if (
      parentData &&
      (minDistance.position === "left" || minDistance.position === "right")
    ) {
      const parentSiblingData = getSiblingsData(parentData, clonedEditDom);
      // left, right는 기본적으로 parent의 uuid로 바뀜
      if (
        minDistance.position === "left" &&
        parentSiblingData.previousSibling
      ) {
        targetElementData.uuid = parentSiblingData.previousSibling.uuid;
        targetElementData.position = "right";
      } else {
        targetElementData.uuid = parentData.uuid;
      }
    }

    const findTargerData = getEditComponentData(targetElementData.uuid);

    // 좌측, 우측이 나뉘어진 Tag의 경우 하위로 들어갈때 별도의 영역처리 필요
    const isSubTextAreaTag =
      findTargerData.tagName === "checkbox" ||
      findTargerData.tagName === "bullet";

    // 체크박스만 예외적으로 추가처리 필요
    if (isSubTextAreaTag && targetElementData.position === "bottom") {
      const checkboxElement = editorRef.current.querySelector(
        `[data-uuid="${targetElementData.uuid}"]`
      );

      const checkboxTextElement = checkboxElement.querySelector(".text-area");

      const { left, right } = checkboxTextElement.getBoundingClientRect();

      if (left <= x1 && x1 <= right) {
        targetElementData.movementSideType = "text";
      } else {
        targetElementData.movementSideType = "box";
      }
    }

    setMovementSide(targetElementData);
  };

  const getSiblingsData = (data, editDomElements) => {
    const siblingElements = editDomElements.filter(
      (element) => element.parentId === data.parentId
    );

    const targetIndex = siblingElements.findIndex(
      (element) => element.uuid === data.uuid
    );

    const previousSibling = siblingElements[targetIndex - 1];
    const nextSibling = siblingElements[targetIndex + 1];

    return { previousSibling, nextSibling };
  };

  const getTopParentData = (data) => {
    // 초기값 할당
    let topParentdata = data;
    while (topParentdata.parentId) {
      topParentdata = getEditComponentData(topParentdata.parentId);
    }
    return topParentdata;
  };

  // 공통 함수

  const getEditComponentData = (uuid) => {
    const elements = copyObjectArray(editorStoreRef.current.blocks);
    const findData = elements.find((element) => {
      return uuid === element.uuid;
    });

    return Object.assign({}, findData);
  };

  const findIndexByKey = (elements, key, value) => {
    return elements.findIndex((element) => element[key] === value);
  };

  /**
   * 주어진 배열에서 지정한 키-값 쌍을 포함하는 요소만을 필터링합니다.
   *
   * @param {Array} array - 처리할 배열입니다.
   * @param {string} key - 필터링할 속성명(key)입니다.
   *                       앞에 !를 작성하여 logicalNot을 사용 할 수 있습니다.
   * @param {any} value - 필터링할 속성의 값(value)입니다.
   * @returns {Array} - 필터링된 요소들로 이루어진 새로운 배열입니다.
   */
  const filterByKey = (elements, key, value) => {
    const isLogicalNot = key.includes("!");
    const filterKey = isLogicalNot ? key.substr(1) : key;
    return elements.filter((element) =>
      isLogicalNot ? element[filterKey] !== value : element[key] === value
    );
  };

  const setPropByKey = (elements, key, value) => {
    return elements.forEach((element) => (element[key] = value));
  };

  // 여기까지 공통함수

  const moveElementData = (selectDatas, movementData) => {
    const targetData = getEditComponentData(movementData.uuid);
    const fromDatas = [];

    const filteredElements = copyObjectArray(
      editorStoreRef.current.blocks
    ).filter((element) => {
      if (selectDatas.some((obj) => element.uuid === obj.uuid)) {
        fromDatas.push(element);
        return false;
      }
      return true;
    });

    const toIndex = findIndexByKey(filteredElements, "uuid", targetData.uuid);
    const findToData = filteredElements[toIndex];
    // 여기까지 수정했음

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
          setPropByKey(fromDatas, "parentId", findToData.uuid);
          filteredElements.splice(
            "top" ? toIndex : toIndex + 1,
            0,
            ...fromDatas
          );
        } else {
          const parentData = getEditComponentData(findToData.parentId);
          setPropByKey(fromDatas, "parentId", parentData.uuid);

          filteredElements.splice(
            movementData.position === "top" ? toIndex : toIndex + 1,
            0,
            ...fromDatas
          );
        }
      } else {
        const rowChildElements = filterByKey(
          filteredElements,
          "parentId",
          targetData.parentId
        );

        const width = (100 / (rowChildElements.length + 1)).toFixed(4);

        // left right즉 해당 multiple에 들어가는 경우에만 같은 parentId로 해주면됨
        const newElement = createElementData({
          tagName: "multiple",
          direction: "column",
          width: parseFloat(width),
        });

        rowChildElements.forEach((element) => {
          const newWidth = (element.width / 100) * (100 - width);
          element.width = newWidth;
        });

        newElement.parentId = targetData.parentId;

        setPropByKey(fromDatas, "parentId", newElement.uuid);
        filteredElements.splice(
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
        const newElement = createElementData({
          tagName: "multiple",
          direction: "row",
        });

        const newColumElement1 = createElementData({
          tagName: "multiple",
          direction: "column",
          width: 50,
        });

        const newColumElement2 = createElementData({
          tagName: "multiple",
          direction: "column",
          width: 50,
        });

        newColumElement1.parentId = newElement.uuid;
        newColumElement2.parentId = newElement.uuid;

        setPropByKey(fromDatas, "parentId", newColumElement1.uuid);

        findToData.parentId = newColumElement2.uuid;

        if (movementData.position === "left") {
          filteredElements.splice(
            toIndex,
            0,
            newElement,
            newColumElement1,
            ...fromDatas,
            newColumElement2
          );
        } else {
          filteredElements.splice(
            toIndex + 1,
            0,
            newColumElement1,
            ...fromDatas
          );
          filteredElements.splice(toIndex, 0, newElement, newColumElement2);
        }
      } else {
        fromDatas.forEach((element) => {
          element.parentId =
            movementData?.movementSideType === "text" ? findToData.uuid : null;
        });

        if (movementData.position === "top") {
          filteredElements.splice(toIndex, 0, ...fromDatas);
        } else {
          filteredElements.splice(toIndex + 1, 0, ...fromDatas);
        }
      }
    }

    // multiple에서 데이터 삭제시 multiple 삭제 여부확인 및 처리
    if (selectDatas[0].parentId) {
      const fromParentData = getEditComponentData(selectDatas[0].parentId);
      if (
        fromParentData.tagName !== "checkbox" &&
        fromParentData.tagName !== "bullet"
      ) {
        const remainingElements = removeColumnAndRowIfEmpty(filteredElements);

        modifyDomSave(remainingElements);
        return;
      }
    }

    modifyDomSave(filteredElements);
  };

  /**
   * 1. Element 리스트에서 자식 엘리먼트가 없는 column과 row를 제거합니다.
   * 2. row에 column이 하나만 남았다면 row와 column을 제거하고
   *    column의 자식 엘리먼트의 parentId를 비워줍니다.
   * @param {Array} elements - 처리할 엘리먼트의 배열
   * @returns {Array} - 자식 엘리먼트가 없는 column, row를 제거한후 새로운 엘리먼트 배열
   **/

  const removeColumnAndRowIfEmpty = (elements) => {
    let copyElements = copyObjectArray(elements);

    const columns = filterByKey(copyElements, "direction", "column");
    if (columns.length) {
      columns.forEach((column) => {
        const columnChildren = filterByKey(
          copyElements,
          "parentId",
          column.uuid
        ).length;

        if (!columnChildren) {
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

    if (rows.length) {
      rows.forEach((element) => {
        const rowChildren = filterByKey(copyElements, "parentId", element.uuid);

        if (rowChildren.length === 1) {
          const rowUuid = element.uuid;
          const columnUuid = rowChildren[0].uuid;

          copyElements = filterByKey(copyElements, "!uuid", rowUuid);
          copyElements = filterByKey(copyElements, "!uuid", columnUuid);
          copyElements.forEach((obj) => {
            if (obj.parentId === columnUuid) {
              obj.parentId = null;
            }
          });
        }
      });
    }

    return copyElements;
  };

  const createElementData = ({ tagName, direction, width }) => {
    if (!tagName) {
      throw new Error("tagName은 필수입력 사항입니다.");
    }
    const uuid = uuidv4();
    // 추후에 타입에따라 필요한것들만 생성되게
    const newElement = {
      pathId,
      uuid,
      tagName,
      html: "",
      parentId: null,
      direction,
      checkYn: false,
      width: width ? width : 100,
    };

    return newElement;
  };

  const findAllChildUuids = (elements, uuid) => {
    if (!uuid) {
      throw new Error("uuid은 필수입력 사항입니다.");
    }
    if (!elements || elements.length === 0) {
      return [];
    }
    const subData = [];
    const stack = [uuid];

    while (stack.length > 0) {
      const currUuid = stack.pop();

      elements.forEach((element) => {
        if (element.parentId === currUuid) {
          subData.push(element.uuid);
          if (!stack.includes(element.uuid)) {
            stack.push(element.uuid);
          }
        }
      });
    }

    return subData;
  };

  // =================여기까지 수정완료======================= //

  const deleteElement = (uuid) => {
    let editElements = copyObjectArray(editorStoreRef.current.blocks);

    const childList = findAllChildUuids(editElements, uuid);
    childList.push(uuid);
    editElements = editElements.filter(
      (element) => !childList.includes(element.uuid)
    );
    const remainingElements = removeColumnAndRowIfEmpty(editElements);
    modifyDomSave(remainingElements);
  };

  const changeElementStyle = (uuid, styleData) => {
    const editElements = copyObjectArray(editorStoreRef.current.blocks).map(
      (element) => {
        if (element.uuid === uuid) {
          return { ...element, styleData };
        }
        return element;
      }
    );
    editorStore.setBlocks(editElements);
    //setEditDom(editElements);
  };

  const updateElement = (uuid, data) => {
    let editElements = copyObjectArray(editorStoreRef.current.blocks);
    const keys = Object.keys(data);

    editElements.forEach((element) => {
      if (element.uuid === uuid) {
        keys.forEach((key) => {
          element[key] = data[key];
        });
      }
      return element;
    });

    modifyDomSave(editElements);
  };

  const toggleFileUploader = (e) => {
    const hoverData = getEditComponentData(
      hoverElement.current?.getAttribute("data-uuid")
    );

    const filePopup = e.target.closest(".filePopup");

    if (e.type === "mouseup" && filePopup) {
      return;
    }

    if (e.button === 0 && hoverData.tagName === "image") {
      if (!isFileUploderOpen) {
        const { bottom, left, width } =
          hoverElement.current?.getBoundingClientRect();
        let popupY = 0;
        let popupX = 0;

        if (bottom + 100 > window.innerHeight) {
          popupY = window.innerHeight - 110;
        } else {
          popupY = bottom;
        }

        const popupRight = 410 + left;

        if (popupRight > window.innerWidth) {
          popupX = left - (popupRight - window.innerWidth);
        } else {
          const newX = left + (width - 400) / 2;

          popupX = newX <= 20 ? left : newX;
        }

        fileData.current = { uuid: hoverData.uuid, y: popupY, x: popupX };
      }
      setIsFileUploderOpen(!isFileUploderOpen);
    } else {
      setIsFileUploderOpen(false);
    }
  };

  const toggleContextMenuYn = (menuYn) => {
    setIsContextMenuOpen(menuYn);
  };

  return (
    <EditorContainer
      onMouseDown={windowMouseDown}
      onMouseMove={windowMouseMove}
      onMouseUp={windowMouseUp}
      onContextMenu={(e) => {
        e.preventDefault();
        if (hoverElement.current) {
          setPopupUuid(hoverElement.current?.getAttribute("data-uuid"));
          toggleContextMenuYn(true);
        }
      }}
    >
      <CardEditorContentWrapper
        ref={editorRef}
        onMouseUp={(e) => {
          if (
            e.button === 0 &&
            e.target === e.currentTarget &&
            !draggable &&
            !hoverElement.current
          ) {
            const newElement = createElementData({ tagName: "div" });
            modifyDomSave([...copyObjectArray(editorStore.blocks), newElement]);
            setNewUuid(newElement.uuid);
          }
        }}
      >
        {makeTree(editorStore.blocks).map((element) => {
          return (
            <EditBranchComponent
              key={element.uuid}
              data={element}
              updateElement={updateElement}
              movementSide={movementSide}
              changeShowFileUploader={toggleFileUploader}
            />
          );
        })}
      </CardEditorContentWrapper>
      {isFileUploderOpen ||
      isContextMenuOpen ||
      (overlayList.length > 0 && draggable) ? (
        <OverlayContainer
          onMouseUp={(e) => {
            const contextMenu = e.target.closest(".contextMenu");
            if (!contextMenu && !draggable) {
              toggleContextMenuYn(false);
            }

            if (!draggable) {
              toggleFileUploader(e);
            }
          }}
          zindex={
            isFileUploderOpen ||
            isContextMenuOpen ||
            (overlayList.length > 0 && draggable)
          }
        >
          {overlayList.length > 0 && (
            <OverlayWrapper currentPoint={currentPoint}>
              {overlayList?.map((element) => {
                const selectElement = getEditComponentData(element?.parentId);
                const overlayWidth = selectElement.width;
                return (
                  <EditBranchComponent
                    key={`${element.uuid}_overlay`}
                    data={element}
                    overlayWidth={overlayWidth}
                  ></EditBranchComponent>
                );
              })}
            </OverlayWrapper>
          )}
          {isFileUploderOpen ? (
            <PopupMenu
              popupRef={popupRef}
              changeShowFileUploader={toggleFileUploader}
              fileData={fileData.current}
              updateElement={updateElement}
            />
          ) : null}

          {isContextMenuOpen ? (
            <ContextMenuPopup
              pointer={contextMenuPoint.current}
              changeContextMenuYn={toggleContextMenuYn}
              deleteElement={deleteElement}
              updateElement={updateElement}
              changeElementStyle={changeElementStyle}
              popupData={getEditComponentData(popupUuid)}
            />
          ) : null}
        </OverlayContainer>
      ) : null}
    </EditorContainer>
  );
};

export default CardEditor;

const EditorContainer = styled.div`
  overflow-y: auto;
  overlfow-x: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1.6rem;
`;
const CardEditorContentWrapper = styled.div`
  flex: 1;
  flex-direction: column;
  padding: 1rem 2rem 10rem 2rem;
  z-index: 998;
`;
const OverlayContainer = styled.div`
  position: absolute;
  min-width: 34rem;
  z-index: ${(props) => (props.zindex ? 999 : 0)};
  width: 100%;
  height: 100%;
  inset: 0px;
`;
const OverlayWrapper = styled.div`
  position: absolute;
  width: 100%;
  left: ${(props) => props.currentPoint?.x + "px"};
  top: ${(props) => props.currentPoint?.y - 10 + "px"};
  opacity: 0.4;
`;
