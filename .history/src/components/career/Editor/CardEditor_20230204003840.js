import React from "react";
import styled from "@emotion/styled";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useRef } from "react";
import EditBranchComponent from "./EditBranchComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PopupMenu from "../../common/PopupMenu";

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
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
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
  z-index: ${(props) => (props.zindex ? 999 : "")};
  inset: 0px;
`;

const OverlayContentWrapper = styled.div`
  width: calc(100% - 6rem);
  position: relative;
`;

const OverlayContentContents = styled.div`
  position: absolute;
  width: 100%;
`;

const CardEditor = ({ pathId }) => {
  const [editDom, setEditDom] = useState([]);

  const [nearElement, setNearElement] = useState(null);
  const [hoverElement, setHoverElement] = useState(null);

  const [selectElements, setSelectElements] = useState([]);
  const [selectPoint, setSelectPoint] = useState(null); // Object
  const [movementSide, setMovementSide] = useState("");

  const [popupYn, setPopupYn] = useState(false);
  const [contextMenuYn, setContextMenuYn] = useState();
  const [newUuid, setNewUuid] = useState(null);
  const [draggable, setDraggable] = useState(false);
  const [fileData, setFileData] = useState(null);

  const editorRef = useRef();
  const overlayRef = useRef();
  const popupRef = useRef();

  const nav = useNavigate();

  const getTagList = async () => {
    const tagList = await axios.get("/api/editor/getList", {
      params: { pathId },
    });

    tagList.data.sort(function (a, b) {
      return a.sort - b.sort;
    });

    const newEditDom = [];

    tagList.data.map((tag) => {
      newEditDom.push(tag);
    });

    setEditDom(newEditDom);
  };

  useEffect(() => {
    getTagList();
  }, []);

  const modifyDomSave = async (newEditDom) => {
    newEditDom.map((element, index) => {
      element.sort = index;
    });

    const modifyList = [];
    editDom.map((element) => {
      const differentData = getDifferentType(element, newEditDom);
      if (differentData.type) {
        // type이 있다는건 삭제, 수정 됐다는것
        modifyList.push(differentData);
      }
    });

    newEditDom.map((newElement) => {
      let matchCount = 0;
      editDom.map((element) => {
        if (newElement.uuid === element.uuid) matchCount++;
      });
      if (!matchCount) {
        const newData = { type: "create", data: newElement };
        modifyList.push(newData);
      }
    });

    setEditDom(newEditDom);
    await axios.post("/api/editor/save", modifyList);
  };

  const getDifferentType = (originalElement, newEditDom) => {
    const differentType = { type: null, data: null };
    let matchCount = 0;

    newEditDom.map((element) => {
      if (originalElement.uuid === element.uuid) {
        matchCount++;
        const newEditKeys = Object.keys(element);

        newEditKeys.map((key) => {
          if (originalElement[key] !== element[key]) {
            differentType.data = element;
            differentType.type = "modify";
          }
        });
      }
    });

    // 매칭된게 없으면 삭제처리된것
    if (!matchCount) {
      differentType.data = originalElement;
      differentType.type = "delete";
    }
    return differentType;
  };

  const makeTree = (list, targetUuid) => {
    const copyDom = list.map((element) => Object.assign({}, element));
    const map = {};
    const roots = [];
    let node;
    let i;

    // 미리 모든 노드에 대한 빈 데이터를 만들고
    // list를 반복돌면서 parentId즉 부모가 있는 애들한테는
    // 미리 만들어둔 해당 노드의 정보를 넣어줌
    // 이를 반복하다 부모가 없는 node가 나오면 roots에 넣어서 반환
    for (i = 0; i < copyDom.length; i += 1) {
      map[copyDom[i].uuid] = i;
      copyDom[i].multipleData = [];
    }

    for (i = 0; i < copyDom.length; i += 1) {
      node = copyDom[i];

      if (targetUuid) {
        if (targetUuid === node.uuid) {
          roots.push(node);
        } else {
          if (node.parentId) {
            copyDom[map[node.parentId]].multipleData.push(node);
          }
        }
      } else {
        if (node.parentId) {
          copyDom[map[node.parentId]].multipleData.push(node);
        } else {
          roots.push(node);
        }
      }
    }
    if (targetUuid && roots.length > 0) {
      return roots[0];
    }

    return roots;
  };

  const findNearElementByPointer = (x, y) => {
    let Contents = Array.from(editorRef.current.querySelectorAll("[uuid]"));

    Contents = Contents.filter((content) => {
      const data = getEditComponentData(content.getAttribute("uuid"));
      if (data.tagName !== "multiple") {
        return content;
      }
    });

    if (Contents.length > 0) {
      const { nearEl, hoverEl } = findNearElementInChild(x, y, Contents);

      setNearElement(nearEl);
      setHoverElement(hoverEl);
    }
  };

  const findNearElementInChild = (x, y, Contents) => {
    let nearEl;
    let hoverEl;

    const equalXElements = Contents.filter((element) => {
      const { left, right } = element.getBoundingClientRect();
      if (left <= x && x <= right) {
        return element;
      }
    });

    if (equalXElements.length > 0) {
      equalXElements.map((element) => {
        if (!nearEl) {
          nearEl = element;
        }
        const nearElRect = nearEl.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        if (elementRect.top <= y && y <= elementRect.bottom) {
          nearEl = element;
          hoverEl = element;
        } else {
          if (Math.abs(nearElRect.y - y) > Math.abs(elementRect.y - y)) {
            nearEl = element;
          }
        }
      });
    } else {
      const equalYElements = Contents.filter((element) => {
        const { top, bottom } = element.getBoundingClientRect();
        if (top <= y && y <= bottom) {
          return element;
        }
      });

      if (equalYElements.length > 0) {
        equalYElements.map((element) => {
          if (!nearEl) {
            nearEl = element;
          }
          const nearElRect = nearEl.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          if (elementRect.left <= x && x <= elementRect.right) {
            nearEl = element;
            hoverEl = element;
          } else {
            if (Math.abs(nearElRect.x - x) > Math.abs(elementRect.x - x)) {
              nearEl = element;
            }
          }
        });
      }
    }
    return { nearEl, hoverEl };
  };

  const decideMovementSide = (x1, y1) => {
    const targetElement = hoverElement ? hoverElement : nearElement;

    if (targetElement && selectElements.length > 0) {
      const targetUuid = targetElement.getAttribute("uuid");
      let targetData = getEditComponentData(targetUuid);

      const parentData = targetData?.parentId
        ? getEditComponentData(targetData.parentId)
        : null;

      const { top, bottom, left, right } =
        targetElement.getBoundingClientRect();
      const list = [];
      let minDistance = null;

      if (top <= y1 && y1 <= bottom) {
        list.push({ position: "left", distance: Math.abs(left - x1) });
        list.push({ position: "right", distance: Math.abs(right - x1) });
      }

      if (left <= x1 && x1 <= right) {
        list.push({ position: "top", distance: Math.abs(top - y1) });
        list.push({ position: "bottom", distance: Math.abs(bottom - y1) });
      }

      if (list.length <= 0) return;

      list.map((item) => {
        if (!minDistance) {
          minDistance = item;
        } else {
          if (minDistance.distance > item.distance) {
            minDistance = item;
          }
        }
      });

      const { prevData, nextData } = getSiblingsData(targetData);
      //const topParentData = getTopParentData(targetData);
      //const topSiblingsData = getSiblingsData(topParentData);
      for (let i = 0; i < selectElements.length; i++) {
        if (targetUuid === selectElements[i].uuid) {
          if (
            hoverElement ||
            (!hoverElement &&
              (minDistance.position === "left" ||
                minDistance.position === "right"))
          ) {
            setMovementSide(null);
            return;
          }
        } else if (
          minDistance.position === "top" &&
          prevData?.uuid === selectElements[i].uuid
        ) {
          setMovementSide(null);
          return;
        } else if (
          minDistance.position === "bottom" &&
          nextData?.uuid === selectElements[i].uuid
        ) {
          if (targetData.tagName !== "checkbox") {
            setMovementSide(null);
            return;
          }
        }
      }

      let targetElementData = {};

      if (minDistance.position === "top" || minDistance.position === "bottom") {
        if (!hoverElement) {
          // 호버링된게 없으면 가장 가까운 Element를 찾아서
          const topParentData = getTopParentData(targetData);
          if (minDistance.position === "top") {
            const topParentSiblingsData = getSiblingsData(topParentData);
            //prevData가 없으면 맨위
            if (!topParentSiblingsData.prevData) {
              const includeElements = selectElements.filter(
                (element) => element.uuid === topParentData.uuid
              ).length;

              targetElementData.uuid =
                includeElements && topParentSiblingsData.nextData
                  ? topParentSiblingsData.nextData.uuid
                  : topParentData.uuid;
              targetElementData.position = minDistance.position;
            } else {
              targetElementData.uuid = topParentSiblingsData.prevData
                ? topParentSiblingsData.prevData.uuid
                : topParentData.uuid;
              targetElementData.position = topParentSiblingsData.prevData
                ? "bottom"
                : minDistance.position;
            }
          } else {
            const includeElements = selectElements.filter(
              (element) => element.uuid === topParentData.uuid
            ).length;
            targetElementData.uuid =
              includeElements && prevData ? prevData.uuid : topParentData.uuid;
            targetElementData.position = minDistance.position;
          }
        } else {
          if (minDistance.position === "top" && prevData) {
            targetElementData.uuid = prevData ? prevData.uuid : targetData.uuid;
            targetElementData.position = prevData
              ? "bottom"
              : minDistance.position;
          } else {
            targetElementData.uuid = targetData.uuid;
            targetElementData.position = minDistance.position;
          }
        }
        // 좌, 우
      } else {
        targetElementData.uuid = targetData.uuid;
        targetElementData.position = minDistance.position;
      }

      if (parentData) {
        const parentSiblingData = getSiblingsData(parentData);
        if (
          minDistance.position === "left" ||
          minDistance.position === "right"
        ) {
          // left, right는 기본적으로 parent의 uuid로 바뀜
          if (minDistance.position === "left" && parentSiblingData.prevData) {
            targetElementData.uuid = parentSiblingData.prevData.uuid;
            targetElementData.position = "right";
          } else {
            targetElementData.uuid = parentData.uuid;
          }
        }
      }

      const findTargerData = getEditComponentData(targetElementData.uuid);

      // 체크박스만 예외적으로 추가처리 필요
      if (
        findTargerData.tagName === "checkbox" &&
        targetElementData.position === "bottom"
      ) {
        const checkboxElement = editorRef.current.querySelector(
          `[uuid="${targetElementData.uuid}"]`
        );

        const checkboxTextElement =
          checkboxElement.querySelector(".checkbox-text");

        const { left, right } = checkboxTextElement.getBoundingClientRect();

        if (left <= x1 && x1 <= right) {
          targetElementData.movementSideType = "text";
        } else {
          targetElementData.movementSideType = "box";
        }
      }

      setMovementSide(targetElementData);
    } else {
      setMovementSide(null);
    }
  };

  const getSiblingsData = (data) => {
    const equalParentElements = editDom.filter(
      (element) => element.parentId === data.parentId
    );

    const targetIndex = equalParentElements.findIndex(
      (element) => element.uuid === data.uuid
    );

    const prevData = equalParentElements[targetIndex - 1];
    const nextData = equalParentElements[targetIndex + 1];

    return { prevData, nextData };
  };

  const getTopParentData = (data) => {
    if (data?.parentId) {
      const parentData = getEditComponentData(data.parentId);
      return getTopParentData(parentData);
    } else {
      return getEditComponentData(data.uuid);
    }
  };

  const moveElementData = (from, to) => {
    // 이전 데이터 보존을 위한 똑같은 데이터를 복사
    const newEditDom = editDom.map((element) => Object.assign({}, element));

    let moveIndex;
    // 옮겨질 Data가 있는 index
    const fromIndex = newEditDom.findIndex((element) => {
      return from[0].uuid === element.uuid;
    });

    // from 데이터를 빼냈음
    const fromData = newEditDom.splice(fromIndex, 1)[0];

    const toIndex = newEditDom.findIndex((element) => {
      return element.uuid === to.uuid;
    });

    const findToData = newEditDom.filter((element) => {
      return to.uuid === element.uuid;
    })[0];

    if (toIndex === -1) return;
    //left나 top일 경우는 앞에 right나 bottom인 경우에는 뒤로 이동
    if (
      movementSide.position === "right" ||
      movementSide.position === "bottom"
    ) {
      moveIndex = toIndex + 1;
    } else {
      moveIndex = toIndex;
    }

    // 이동관련 Element 데이터 수정 및 추가
    if (to.parentId) {
      // 일단 위, 아래로 옮겨갔을때 multiple이 새로 생기려면 multiple 데이터 내부 데이터여야함
      if (
        movementSide.position === "top" ||
        movementSide.position === "bottom"
      ) {
        // column으로의 새로운 multiple이 필요
        if (movementSide?.movementSideType === "text") {
          fromData.parentId = findToData.uuid;
        } else {
          const parentData = getEditComponentData(findToData.parentId);
          fromData.parentId = parentData.uuid;
        }
      } else {
        const rowChildElements = newEditDom.filter(
          (element) => element.parentId === to.parentId
        );

        const width = (100 / (rowChildElements.length + 1)).toFixed(4);

        // left right즉 해당 multiple에 들어가는 경우에만 같은 parentId로 해주면됨
        const newElement = makeNewElement({
          tagName: "multiple",
          direction: "column",
          width: parseFloat(width),
        });

        rowChildElements.map((element) => {
          const newWidth = (element.width / 100) * (100 - width);
          console.log("element : ", element);
          element.width = newWidth;
        });

        newElement.parentId = to.parentId;
        fromData.parentId = newElement.uuid;
        newEditDom.splice(moveIndex, 0, newElement);
      }
    } else {
      // 아닌 경우에는 left, right인 경우에만 합병
      if (
        movementSide.position === "left" ||
        movementSide.position === "right"
      ) {
        let elementSort = editDom.length;
        const newElement = makeNewElement({
          tagName: "multiple",
          direction: "row",
          sort: elementSort,
        });

        const newColumElement1 = makeNewElement({
          tagName: "multiple",
          direction: "column",
          width: 50,
          sort: elementSort + 1,
        });

        const newColumElement2 = makeNewElement({
          tagName: "multiple",
          direction: "column",
          width: 50,
          sort: elementSort + 2,
        });

        newColumElement1.parentId = newElement.uuid;
        newColumElement2.parentId = newElement.uuid;
        fromData.parentId = newColumElement1.uuid;
        findToData.parentId = newColumElement2.uuid;

        newEditDom.splice(moveIndex, 0, newElement);
        newEditDom.splice(moveIndex, 0, newColumElement2);
        newEditDom.splice(moveIndex, 0, newColumElement1);
      } else {
        if (movementSide?.movementSideType === "text") {
          fromData.parentId = findToData.uuid;
        } else {
          fromData.parentId = null;
        }
      }
    }

    newEditDom.splice(moveIndex, 0, fromData);

    // multiple에서 데이터 삭제시 multiple 삭제 여부확인 및 처리
    if (from[0].parentId) {
      const fromParentData = getEditComponentData(from[0].parentId);
      if (fromParentData.tagName !== "checkbox") {
        removeNullMultipleTag(newEditDom, from[0].uuid);
      }
    }

    modifyDomSave(newEditDom);
  };

  const removeNullMultipleTag = (newEditDom, uuid) => {
    const elementData = getEditComponentData(uuid);
    const columnData = getEditComponentData(elementData.parentId);

    // 동일 column에 Data가 있는지 체크  [이동된 데이터는 삭제된 후]
    const columnChildElements = newEditDom.filter(
      (element) => element.parentId === columnData.uuid
    );

    let rowChildElements = newEditDom.filter(
      (element) =>
        element.parentId === columnData.parentId &&
        element.uuid !== columnData.uuid
    );

    // 같음 column에 데이터가 없으면 colum 없애주면됨
    if (columnChildElements.length <= 1) {
      newEditDom.map((element, index) => {
        // column 제거
        if (element.uuid === columnData.uuid) {
          newEditDom.splice(index, 1);
          elementData.parentId = null;

          // 남아있는 동일 column의 Element들 parentId 삭제
          columnChildElements.map((columnElement) => {
            columnElement.parentId = null;
          });

          // 컬럼이 없어지면 이웃 컬럼들의 width값을 재조정 해야함
          rowChildElements.map((rowElement) => {
            if (rowElement.uuid !== element.uuid) {
              const newWidth = (rowElement.width / (100 - element.width)) * 100;
              rowElement.width = newWidth;
            }
          });
        }
      });
    }

    if (rowChildElements.length <= 1) {
      const rowUuid = rowChildElements[0].parentId;
      const columnUuid = rowChildElements[0].uuid;

      newEditDom.map((element, index) => {
        // row 제거
        if (element.uuid === rowUuid) {
          newEditDom.splice(index, 1);
          columnData.parentId = null;
        }
      });

      newEditDom.map((element, index) => {
        if (element.uuid === columnUuid) {
          newEditDom.splice(index, 1);
          element.parentId = null;
        }
      });

      newEditDom.map((element) => {
        if (element.parentId === columnUuid) {
          element.parentId = null;
        }
      });
    }
  };

  const getEditComponentData = (uuid) => {
    const findData = editDom.filter((element) => {
      return uuid === element.uuid;
    });

    return Object.assign({}, findData[0]);
  };

  const windowMouseDown = (e) => {
    if (!popupYn && hoverElement && e.ctrlKey) {
      window.getSelection().removeAllRanges();
      const selectArray = [];
      const hoverUuid = hoverElement.getAttribute("uuid");

      const hoverTree = makeTree(editDom, hoverUuid);
      selectArray.push(hoverTree);
      setSelectElements(selectArray);
    }

    const { clientX, clientY } = e;
    setSelectPoint({ x: clientX, y: clientY });
  };

  const windowMouseMove = (e) => {
    const { clientX, clientY } = e;
    findNearElementByPointer(clientX, clientY);

    // 마우스 클릭 좌표가 있을 경우에만 드래그 확인
    if (selectPoint) {
      const distance = Math.sqrt(
        Math.pow(Math.abs(clientX - selectPoint.x), 2) +
          Math.pow(Math.abs(clientY - selectPoint.y), 2)
      );

      // 이동 거리가 5이상이어야 드래그로 인식
      if (!draggable && distance < 5) {
        return;
      }

      setDraggable(true);
    }

    // 선택된 Element가 있을경우 드래그 이벤트
    if (selectElements.length > 0) {
      window.getSelection().removeAllRanges();

      overlayRef.current.style.left = clientX - 10 + "px";
      overlayRef.current.style.top = clientY - 10 + "px";

      decideMovementSide(clientX, clientY);
    }
  };

  const windowMouseUp = (e) => {
    if (movementSide?.uuid && selectElements.length > 0) {
      const hoverData = getEditComponentData(movementSide.uuid);
      moveElementData(selectElements, hoverData);
    } else {
      const { clientX, clientY } = e;
      const distance = Math.sqrt(
        Math.pow(Math.abs(clientX - selectPoint.x), 2) +
          Math.pow(Math.abs(clientY - selectPoint.y), 2)
      );

      if (distance < 10) {
        changePopupYn(e);
      }
    }

    setSelectElements([]);
    setDraggable(false);
    setMovementSide(null);
    setSelectPoint(null);
    setContextMenuYn(false);
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
      sort: sort ? sort : editDom.length,
    };

    return newElement;
  };

  const modifyEditDom = (uuid, data) => {
    let newEditDom = editDom.map((element) => Object.assign({}, element));

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
    //setEditDom(newEditDom);
  };

  const findElementFromChild = (dom, uuid, html) => {
    dom?.multipleData?.data.map((element) => {
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
          const { bottom, left } = hoverElement?.getBoundingClientRect();
          console.log("left : ", left);
          console.log("widht : ", window.innerWidth);
          console.log("after : ", 400 + left);
          let popupY = 0;
          let popupX = 0;

          if (bottom + 100 > window.innerHeight) {
            popupY = window.innerHeight - 110;
          } else {
            popupY = bottom;
          }

          const popupRight = 400 + left;
          if (popupRight > window.innerWidth) {
            popupX = popupRight - window.innerWidth;
          } else {
            popupX = left;
          }

          setFileData({ uuid: hoverData.uuid, y: popupY, x: popupX });
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

  useEffect(() => {
    window.addEventListener("mousedown", windowMouseDown);
    window.addEventListener("mouseup", windowMouseUp);
    window.addEventListener("mousemove", windowMouseMove);
    return () => {
      window.removeEventListener("mousedown", windowMouseDown);
      window.removeEventListener("mouseup", windowMouseUp);
      window.removeEventListener("mousemove", windowMouseMove);
    };
  });

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

  return (
    <EditorWrapper
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenuYn(true);
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
            !hoverElement
          ) {
            // 좌클릭이며, 드래그중이 아니고 마우스 위치에 Element가 없는경우
            // 새로운 Element 생성
            const newElement = makeNewElement({ tagName: "div" });
            setEditDom((prevEditDom) => [...prevEditDom, newElement]);
            setNewUuid(newElement.uuid);
          }
        }}
      >
        {makeTree(editDom).map((element) => (
          <EditBranchComponent
            key={element.uuid}
            data={element}
            hoverUuid={hoverElement?.getAttribute("uuid")}
            modifyEditDom={modifyEditDom}
            movementSide={movementSide}
          />
        ))}
      </CardEditorContentWrapper>
      {/* 오버레이 영역 
      파일 팝업이 열려있거나, 선택된 Element가 있으며 드래그중일때 zindex를 더 위로 올려줌
      */}
      <OverlayWrapper
        zindex={popupYn || (selectElements.length > 0 && draggable)}
      >
        <OverlayContentWrapper>
          <OverlayContentContents ref={overlayRef}>
            {draggable &&
              selectElements?.map((element) => {
                console.log("element: ", element);
                return (
                  <EditBranchComponent
                    key={element.uuid}
                    data={{ ...element, uuid: null }}
                  ></EditBranchComponent>
                );
              })}
            {!draggable ? <div></div> : ""}
          </OverlayContentContents>
        </OverlayContentWrapper>
        <div
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          {popupYn ? (
            <PopupMenu
              popupRef={popupRef}
              changePopupYn={changePopupYn}
              fileData={fileData}
              modifyEditDom={modifyEditDom}
            />
          ) : null}
        </div>
      </OverlayWrapper>
    </EditorWrapper>
  );
};

export default CardEditor;
