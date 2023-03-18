import React, { memo } from "react";
import styled from "@emotion/styled";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useRef } from "react";
import EditBranchComponent from "./EditBranchComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PopupMenu from "../../common/PopupMenu";
import ContextMenuPopup from "../../common/ContextMenuPopup";

const CloseButton = styled.div`
  width: 5rem;
  height: 5rem;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  margin-left: auto;
  position: absolute;
  right: 2rem;
  top: 1.5rem;
  background: white;
  z-index: 999;
`;
const CloseButtonRotateWrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 4rem;
  line-height: 4rem;
  transform: rotate(45deg);
`;
const EditorWrapper = styled.div`
  overflow: scroll;
  display: flex;
  flex-direction: column;
  height: 100%;
  //background: #979797;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1.6rem;
`;
const CardEditorContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem 10rem 2rem;
  z-index: 998;
`;
const OverlayWrapper = styled.div`
  position: fixed;
  min-width: 34rem;
  z-index: ${(props) => (props.zindex ? 999 : 0)};
  inset: 0px;
`;
const OverlayContentWrapper = styled.div`
  width: calc(100% - 4rem);
  position: relative;
`;
const OverlayContentContents = styled.div`
  /* position: absolute;
  width: 100%; */
`;

const CardEditor = ({ pathId }) => {
  const [editDom, setEditDom] = useState([]);
  const [movementSide, setMovementSide] = useState("");
  // 이벤트에서 실시간으로 참조하기 위한 Ref
  const editDomRef = useRef([]);
  const movementSideRef = useRef("");
  const nearElement = useRef(null);
  const hoverElement = useRef(null);
  const selectElements = useRef([]);
  const fileData = useRef(null);
  const selectPoint = useRef(null);
  const contextMenuPoint = useRef(null);

  const [overlayList, setOverlayList] = useState([]);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [popupUuid, setPopupUuid] = useState();
  const [newUuid, setNewUuid] = useState(null);
  const [draggable, setDraggable] = useState(false);
  const [contextMenuYn, setContextMenuYn] = useState();
  const [popupYn, setPopupYn] = useState(false);

  const editorRef = useRef();
  const popupRef = useRef();

  const nav = useNavigate();

  // 마우스 이벤트에서 state를 실시간으로 참조하기 위한 ref
  useEffect(() => {
    editDomRef.current = editDom;
  }, [editDom, movementSide]);

  useEffect(() => {
    movementSideRef.current = movementSide;
  }, [movementSide]);

  // 최초 페이지 진입시 기본 이벤트 셋팅
  useEffect(() => {
    getTagList();

    window.addEventListener("mousedown", windowMouseDown);
    window.addEventListener("mouseup", windowMouseUp);
    window.addEventListener("mousemove", windowMouseMove);
    return () => {
      window.removeEventListener("mousedown", windowMouseDown);
      window.removeEventListener("mouseup", windowMouseUp);
      window.removeEventListener("mousemove", windowMouseMove);
    };
  }, []);

  useEffect(() => {
    const newElement = Array.from(
      editorRef.current.querySelectorAll("[uuid]")
    ).filter((item) => {
      const elementUuid = item.getAttribute("uuid");
      if (elementUuid === newUuid) {
        return item;
      }
    });

    if (newElement.length > 0) {
      newElement[0].children[0].focus();
    }
  }, [newUuid]);

  // 서버에서 해당 Path의 모든 Tag를 조회
  const getTagList = async () => {
    const response = await axios.get("/api/editor/getList", {
      params: { pathId },
    });

    const tagList = response.data;

    tagList.sort(function (a, b) {
      return a.sort - b.sort;
    });
    setEditDom(tagList);
  };

  // 현시점 editDom 데이터를 원본과 분리하기 위해 복사해서 리턴해주는 함수
  const copyObjectArray = (arr) => {
    // 마우스 이벤트에서 실행되는 경우를 위해서 렌더링에 사용할 데이터를 제외하고는
    // ref를 사용

    // 아 근데 이게 맞나?.. 일단 보류 현시점에서 복사를 해오는거니까 괜찮을거 같긴한데
    return arr.map((element) => Object.assign({}, element));
  };

  // 마우스 이동에 따른 데이터 수정을 위한 이벤트
  const windowMouseDown = (e) => {
    if (!popupYn && !contextMenuYn && hoverElement.current && e.ctrlKey) {
      window.getSelection().removeAllRanges();

      const hoverUuid = hoverElement.current.getAttribute("uuid");
      selectElements.current = makeTree(editDomRef.current, hoverUuid);
    }

    selectPoint.current = { x: e.clientX, y: e.clientY };
  };

  const windowMouseMove = (e) => {
    const { clientX, clientY } = e;
    findNearElementByPointer(clientX, clientY);

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
      setContextMenuYn(false);
    }

    // Element를 옮기는 중이고, 선택된 Element가 있음
    const selectDatas = selectElements.current;
    const moveMentSideData = movementSideRef.current;
    if (selectDatas.length > 0 && moveMentSideData?.uuid) {
      moveElementData(selectDatas, moveMentSideData);
    } else {
      const { clientX, clientY } = e;
      const distance = Math.sqrt(
        Math.pow(Math.abs(clientX - selectPoint?.x), 2) +
          Math.pow(Math.abs(clientY - selectPoint?.y), 2)
      );

      if (distance < 10) {
        changePopupYn(e);
      }
    }

    selectElements.current = [];
    selectPoint.current = null;
    setOverlayList([]);
    setDraggable(false);
    setMovementSide(null);
  };

  const modifyDomSave = async (newEditDom) => {
    const editDomList = editDomRef.current;
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

    setEditDom(newEditDom);
    await axios.post("/api/editor/save", modifyList);
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

  const getClosestElement = (elements, pos, axis) => {
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

    nearElement.current = nearEl;
    hoverElement.current = hoverEl;
  };

  const findNearElementByPointer = (x, y) => {
    const Contents = Array.from(editorRef.current.querySelectorAll("[uuid]"));

    let filteredContents = Contents.filter((content) => {
      const data = getEditComponentData(content.getAttribute("uuid"));
      return data.tagName !== "multiple";
    });

    if (filteredContents.length > 0) {
      const equalXElements = filteredContents.filter((element) => {
        const { left, right } = element.getBoundingClientRect();
        return left <= x && x <= right;
      });

      getClosestElement(equalXElements, y, "y");

      if (!nearElement.current) {
        const equalYElements = filteredContents.filter((element) => {
          const { top, bottom } = element.getBoundingClientRect();
          return top <= y && y <= bottom;
        });

        getClosestElement(equalYElements, x, "x");
      }
    }
  };

  const decideMovementSide = (x1, y1) => {
    const targetElement = hoverElement.current || nearElement.current;

    if (!targetElement) {
      setMovementSide(null);
      return;
    }

    const clonedEditDom = copyObjectArray(editDomRef.current);
    const targetUuid = targetElement.getAttribute("uuid");
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
        `[uuid="${targetElementData.uuid}"]`
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
  const findIndexByKey = (elementList, key, value) => {
    return elementList.findIndex((element) => element[key] === value);
  };

  const filterByKey = (elementList, key, value) => {
    return elementList.filter((element) => element[key] === value);
  };

  const setPropByKey = (elementList, key, value) => {
    return elementList.forEach((element) => (element[key] = value));
  };

  // 여기까지 공통함수

  const moveElementData = (selectDatas, movementData) => {
    const targetData = getEditComponentData(movementData.uuid);
    const fromDatas = [];

    const filteredElements = copyObjectArray(editDomRef.current).filter(
      (element) => {
        if (selectDatas.some((obj) => element.uuid === obj.uuid)) {
          fromDatas.push(element);
          return false;
        }
        return true;
      }
    );

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
        const newElement = makeNewElement({
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
        const newElement = makeNewElement({
          tagName: "multiple",
          direction: "row",
        });

        const newColumElement1 = makeNewElement({
          tagName: "multiple",
          direction: "column",
          width: 50,
        });

        const newColumElement2 = makeNewElement({
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
        const remainingElements = removeColumnAndRowIfEmpty(
          filteredElements,
          selectDatas[0].uuid
        );
        // modifyDomSave(remainingElements);
        // return;
      }
    }

    //modifyDomSave(filteredElements);
  };

  // =================여기까지 수정완료======================= //

  const removeColumnAndRowIfEmpty = (elementList, uuid) => {
    const copyElements = copyObjectArray(elementList);

    // const elementData = getEditComponentData(uuid);
    // const columnData = getEditComponentData(elementData.parentId);

    // // 동일 column에 Data가 있는지 체크  [이동된 데이터는 삭제된 후]
    // const columnChildElements = filterByKey(
    //   newEditDom,
    //   "parentId",
    //   columnData.uuid
    // );

    const columnElements = filterByKey(elementList, "direction", "column");
    if (columnElements.length) {
      columnElements.forEach((element, index) => {});
      console.log("있음");
      console.log("columnElements : ", columnElements);
    }

    // column의 자식이 있는지 확인 없으면 제거
    // column의 row의 자식들이 몇개있는지 확인 1개면 row랑 column 제거

    // let rowChildElements;

    // if (columnData.tagName === "checkbox" || columnData.tagName === "bullet") {
    //   return;
    // }

    // // 해당 colum에 데이터가 1개 미만인 경우 해당 컬럼을 지우는 과정
    // if (columnChildElements.length < 1) {
    //   const rowUuid = columnData.parentId;
    //   const columnUuid = columnData.uuid;
    //   newEditDom.forEach((element, index) => {
    //     if (element.uuid === columnData.uuid) {
    //       // colum 삭제
    //       newEditDom.splice(index, 1);
    //       // 삭제했으니 data의 prarentId 비워주기
    //       elementData.parentId = null;

    //       rowChildElements = newEditDom.filter(
    //         (element) => element.parentId === columnData.parentId
    //       );
    //       // 컬럼이 지워졌으니 row에있는 column들 width 수정이 필요함
    //       rowChildElements.map((rowElement) => {
    //         if (
    //           rowElement.uuid !== columnData.uuid &&
    //           rowElement.uuid !== element.uuid
    //         ) {
    //           const newWidth = (rowElement.width / (100 - element.width)) * 100;
    //           rowElement.width = newWidth;
    //         }
    //       });
    //     }
    //   });

    //   if (rowChildElements?.length === 1) {
    //     newEditDom.forEach((element, index) => {
    //       // row 제거
    //       if (element.uuid === rowUuid) {
    //         newEditDom.splice(index, 1);
    //         columnData.parentId = null;
    //       }
    //     });

    //     newEditDom.forEach((element, index) => {
    //       if (element.uuid === columnUuid) {
    //         newEditDom.splice(index, 1);
    //         element.parentId = null;
    //       }
    //     });

    //     newEditDom.forEach((element) => {
    //       if (element.parentId === columnUuid) {
    //         element.parentId = null;
    //       }
    //     });
    //   }
    // }
  };

  const getEditComponentData = (uuid) => {
    const editDomList = editDomRef.current;
    const findData = editDomList.filter((element) => {
      return uuid === element.uuid;
    });

    return Object.assign({}, findData[0]);
  };

  const makeNewElement = ({ tagName, direction, width, sort }) => {
    const newUuid = uuidv4();
    // 추후에 타입에따라 필요한것들만 생성되게
    const newElement = {
      pathId: pathId,
      uuid: newUuid,
      tagName: tagName,
      html: "",
      parentId: null,
      direction: direction,
      checkYn: false,
      width: width ? width : 100,
      sort: sort ? sort : editDomRef.current.length,
    };

    return newElement;
  };

  const findAllChildData = (uuid) => {
    let newEditDom = copyObjectArray(editDomRef.current);
    const subData = [];

    for (let i = 0; i < newEditDom.length; i++) {
      const item = newEditDom[i];
      if (item.parentId === uuid) {
        subData.push(item.uuid);
        const subChildData = findAllChildData(item.uuid);

        if (subChildData.length > 0) {
          subData.push(...subChildData);
        }
      }
    }

    return subData;
  };

  const modifyEditDom = (uuid, data, type) => {
    let newEditDom = copyObjectArray(editDomRef.current);

    if (type === "delete") {
      const childList = findAllChildData(uuid);
      childList.push(uuid);
      newEditDom = newEditDom.filter(
        (element) => !childList.includes(element.uuid)
      );
      const remainingElements = removeColumnAndRowIfEmpty(newEditDom, uuid);
      modifyDomSave(remainingElements);
    } else if (type === "style") {
      const targetElement = newEditDom.filter(
        (element) => element.uuid === uuid
      );

      if (targetElement.length > 0) {
        targetElement[0].styleData = data.styleData;
      }
      setEditDom(newEditDom);
    } else {
      const keys = Object.keys(data);

      newEditDom = newEditDom.map((dom) => {
        if (dom.tagName === "multiple") {
          findElementFromChild(dom, uuid, data.html);
        } else {
          if (dom.uuid === uuid) {
            if (keys.length > 0) {
              keys.map((key) => {
                dom[key] = data[key];
              });
            }
          }
        }
        return dom;
      });
      modifyDomSave(newEditDom);
    }
  };

  const findElementFromChild = (dom, uuid, html) => {
    dom?.multipleData?.map((element) => {
      if (element.tagName === "multiple") {
        findElementFromChild(element, uuid, html);
      } else {
        if (element.uuid === uuid) {
          element.html = html;
        }
      }
    });
  };

  const changePopupYn = (e) => {
    // 2. 이미지 태그 이외 클릭 [왼,오 모두 팝업 닫힘만 처리되면됨]
    const hoverData = getEditComponentData(hoverElement?.getAttribute("uuid"));
    const filePopup = e.target.closest(".filePopup");

    // 파일 업로드 팝업을 클릭했을때는 처리X 업로드후 이미지 변경 이벤트일때도 X
    if (e.type === "mouseup" && filePopup) {
      return;
    }

    if (e.button === 0) {
      // 이미지태그 왼쪽 클릭
      if (hoverData.tagName === "image") {
        if (!popupYn) {
          const { bottom, left, width } = hoverElement?.getBoundingClientRect();
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
        setPopupYn(!popupYn);
      } else {
        // 이미지 태그가 아닌것 좌 클릭
        if (popupYn) {
          setPopupYn(!popupYn);
        }
      }
    } else {
      // 우클릭
      if (popupYn) {
        setPopupYn(!popupYn);
      }
    }
  };

  const changeContextMenuYn = (menuYn) => {
    setContextMenuYn(menuYn);
  };

  return (
    <EditorWrapper
      onContextMenu={(e) => {
        e.preventDefault();
        if (hoverElement.current) {
          setPopupUuid(hoverElement.current?.getAttribute("uuid"));
          setContextMenuYn(true);
        }
      }}
    >
      <CloseButton
        onClick={() => {
          nav("/");
        }}
      >
        <CloseButtonRotateWrapper>+</CloseButtonRotateWrapper>
      </CloseButton>
      <CardEditorContentWrapper
        ref={editorRef}
        onMouseUp={(e) => {
          if (
            e.button === 0 &&
            e.target === e.currentTarget &&
            !draggable &&
            !hoverElement.current
          ) {
            // 좌클릭이며, 드래그중이 아니고 마우스 위치에 Element가 없는경우
            // 새로운 Element 생성
            const newElement = makeNewElement({ tagName: "div" });
            modifyDomSave([...editDom, newElement]);
            setNewUuid(newElement.uuid);
          }
        }}
      >
        {makeTree(editDom).map((element) => {
          return (
            <EditBranchComponent
              key={element.uuid}
              data={element}
              modifyEditDom={modifyEditDom}
              movementSide={movementSide}
            />
          );
        })}
      </CardEditorContentWrapper>
      {/* 오버레이 영역 
      파일 팝업이 열려있거나, 선택된 Element가 있으며 드래그중일때 zindex를 더 위로 올려줌
      */}

      <OverlayWrapper
        onClick={(e) => {
          const contextMenu = e.target.closest(".contextMenu");

          if (!contextMenu && !draggable) {
            setContextMenuYn(false);
          }
        }}
        zindex={
          popupYn || contextMenuYn || (overlayList.length > 0 && draggable)
        }
      >
        <OverlayContentWrapper>
          <OverlayContentContents>
            <div
              style={{
                position: "fixed",
                width: "100%",
                height: "100%",
                minWidth: "34rem",
                left: 0,
                top: 0,
              }}
            ></div>
            {overlayList.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  left: currentPoint?.x + "px",
                  top: currentPoint?.y - 10 + "px",
                  opacity: "0.4",
                }}
              >
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
              </div>
            )}

            {popupYn ? (
              <div
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <PopupMenu
                  popupRef={popupRef}
                  changePopupYn={changePopupYn}
                  fileData={fileData}
                  modifyEditDom={modifyEditDom}
                />
              </div>
            ) : null}

            {contextMenuYn ? (
              <ContextMenuPopup
                pointer={contextMenuPoint.current}
                changeContextMenuYn={changeContextMenuYn}
                modifyEditDom={modifyEditDom}
                popupData={getEditComponentData(popupUuid)}
              />
            ) : null}
          </OverlayContentContents>
        </OverlayContentWrapper>
      </OverlayWrapper>
    </EditorWrapper>
  );
};

export default memo(CardEditor);
