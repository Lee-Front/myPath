import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import { useEffect } from "react";
import EditBranchComponent from "./EditBranchComponent";
import axios from "axios";

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #f9f4e9;
  font-size: 1.6rem;
`;
const CardEditorContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 3rem;
`;

const CardEditor = ({ pathId }) => {
  const [nearElement, setNearElement] = useState(null);
  const [hoverElement, setHoverElement] = useState(null);
  const [selectElements, setSelectElements] = useState([]);
  const [selectPoint, setSelectPoint] = useState(null);
  const [movementSide, setMovementSide] = useState("");
  const [editDom, setEditDom] = useState([]);
  const editorRef = useRef();
  const overlayRef = useRef();

  const [newUuid, setNewUuid] = useState(null);
  const [draggable, setDraggable] = useState(false);

  const getTagList = async () => {
    const tagList = await axios.get("/api/editor/getList", {
      params: { pathId },
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
    const createList = newEditDom.map((element) => Object.assign({}, element));
    const modifyList = [];
    editDom.map((element) => {
      const differentData = getDifferentType(element, newEditDom);
      if (differentData.type) {
        // type이 있다는건 삭제, 수정 됐다는것
        differentData.data.pathId = pathId;
        modifyList.push(differentData);
      }
    });
    console.log("newEditDom : ", newEditDom);
    const data = await axios.post("/api/editor/save", modifyList);
    //console.log("data : ", data);

    //console.log("modifyList : ", modifyList);
  };

  const getDifferentType = (originalElement, newEditDom) => {
    const differentType = { type: null, data: null };
    let matchCount = 0;
    newEditDom.map((element, index) => {
      if (originalElement.uuid === element.uuid) {
        matchCount++;
        const elementKeys = Object.keys(originalElement);
        elementKeys.map((key) => {
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

  const makeTree = (list) => {
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

      if (node.parentId) {
        copyDom[map[node.parentId]].multipleData.push(node);
      } else {
        roots.push(node);
      }
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

      // 선택한 Element에 대해서는 MovementSide를 제공하지 않음
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
        }
      }

      let targetElementData = {};
      const { prevData, nextData } = getSiblingsData(targetData);
      //위, 아래

      if (minDistance.position === "top") {
        if (!hoverElement) {
          // 호버링된게 없으면 가장 가까운 Element를 찾아서
          if (minDistance.position === "top") {
            const topParentData = getTopParentData(targetData);
            const topParentSiblingsData = getSiblingsData(topParentData);

            targetElementData.uuid = topParentSiblingsData.prevData
              ? topParentSiblingsData.prevData.uuid
              : topParentData.uuid;
            targetElementData.position = topParentSiblingsData.prevData
              ? "bottom"
              : minDistance.position;
          }
        } else {
          if (minDistance.position === "top" && prevData) {
            const includeElements = selectElements.filter(
              (element) => element.uuid === prevData.uuid
            ).length;

            targetElementData.uuid = !includeElements
              ? prevData.uuid
              : targetData.uuid;
            targetElementData.position = !includeElements
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
    const findToData = newEditDom.filter((element) => {
      return to.uuid === element.uuid;
    })[0];

    const toIndex = newEditDom.findIndex((element) => {
      return element.uuid === to.uuid;
    });

    // left나 top일 경우는 앞에 right나 bottom인 경우에는 뒤로 이동
    if (movementSide.position === "left" || movementSide.position === "top") {
      moveIndex = toIndex;
    } else {
      moveIndex = toIndex + 1;
    }

    // 이동관련 Element 데이터 수정 및 추가
    if (to.parentId) {
      // 일단 위, 아래로 옮겨갔을때 multiple이 새로 생기려면 multiple 데이터 내부 데이터여야함
      if (
        movementSide.position === "top" ||
        movementSide.position === "bottom"
      ) {
        const parentData = getEditComponentData(findToData.parentId);
        // column으로의 새로운 multiple이 필요
        fromData.parentId = parentData.uuid;
      } else {
        // left right즉 해당 multiple에 들어가는 경우에만 같은 parentId로 해주면됨
        const newElement = makeNewElement({
          tagName: "multiple",
          direction: "column",
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
        const newElement = makeNewElement({
          tagName: "multiple",
          direction: "row",
        });

        const newColumElement1 = makeNewElement({
          tagName: "multiple",
          direction: "column",
        });

        const newColumElement2 = makeNewElement({
          tagName: "multiple",
          direction: "column",
        });

        newColumElement1.parentId = newElement.uuid;
        newColumElement2.parentId = newElement.uuid;
        fromData.parentId = newColumElement1.uuid;
        findToData.parentId = newColumElement2.uuid;

        newEditDom.splice(moveIndex, 0, newElement);
        newEditDom.splice(moveIndex, 0, newColumElement2);
        newEditDom.splice(moveIndex, 0, newColumElement1);
      } else {
        fromData.parentId = null;
      }
    }

    newEditDom.splice(moveIndex, 0, fromData);

    // multiple에서 데이터 삭제시 multiple 삭제 여부확인 및 처리
    if (from[0].parentId) {
      removeNullMultipleTag(newEditDom, from[0].uuid);
    }
    modifyDomSave(newEditDom);
    //setEditDom(newEditDom);
  };

  const removeNullMultipleTag = (newEditDom, uuid) => {
    const elementData = getEditComponentData(uuid);
    const columnData = getEditComponentData(elementData.parentId);
    // 동일 column에 Data가 있는지 체크
    const columnChildElements = newEditDom.filter(
      (element) => element.parentId === columnData.uuid
    );

    // 같음 column에 데이터가 없으면 colum 없애주면됨
    if (columnChildElements.length < 1) {
      newEditDom.map((element, index) => {
        // column 제거
        if (element.uuid === elementData.parentId) {
          newEditDom.splice(index, 1);
          elementData.parentId = null;
        }
      });
    }

    const rowChildElements = newEditDom.filter(
      (element) => element.parentId === columnData.parentId
    );

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

      newEditDom.map((element, index) => {
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
    if (hoverElement && e.ctrlKey) {
      window.getSelection().removeAllRanges();
      const selectArray = [];
      const hoverUuid = hoverElement.getAttribute("uuid");

      selectArray.push(getEditComponentData(hoverUuid));
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

  const windowMouseUp = () => {
    if (movementSide?.uuid && selectElements.length > 0) {
      const hoverData = getEditComponentData(movementSide.uuid);
      moveElementData(selectElements, hoverData);
    }

    setSelectElements([]);
    setDraggable(false);
    setMovementSide(null);
    setSelectPoint(null);
  };

  const makeNewElement = ({ tagName, direction }) => {
    const newUuid = uuidv4();
    const newElement = {
      uuid: newUuid,
      tagName: tagName,
      html: "",
      placeholder: "내용을 입력하세요",
      defaultPlaceHolder: "",
      parentId: null,
      direction: direction,
    };

    return newElement;
  };

  const modifyEditDom = (uuid, html) => {
    let newEditDom = editDom.map((element) => Object.assign({}, element));

    newEditDom = newEditDom.map((dom) => {
      if (dom.tagName === "multiple") {
        findElementFromChild(dom, uuid, html);
      } else {
        if (dom.uuid === uuid) {
          dom.html = html;
        }
      }
      return dom;
    });
    //saveTagBlock(uuid);

    modifyDomSave(newEditDom);
    setEditDom(() => newEditDom);
  };

  const saveTagBlock = async (uuid) => {
    if (uuid) {
      // 단건 저장
      let tagData = getEditComponentData(uuid);
      tagData.pathId = pathId;
      const data = await axios.post("/api/editor/save", tagData);
    } else {
      // 전체 저장
      const newEditDom = editDom.map((element) => {
        element.pathId = pathId;
        return Object.assign({}, element);
      });
      console.log("newEditDom ; ", newEditDom);
      // tagData.pathId = pathId;
      // const data = await axios.post("/api/editor/save", tagData);
    }
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

  useEffect(() => {
    const editor = editorRef.current;
    editor.addEventListener("mousedown", windowMouseDown);
    window.addEventListener("mouseup", windowMouseUp);
    window.addEventListener("mousemove", windowMouseMove);
    return () => {
      editor.removeEventListener("mousedown", windowMouseDown);
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
    <EditorWrapper>
      <CardEditorContentWrapper
        ref={editorRef}
        onMouseUp={() => {
          if (!draggable && !hoverElement) {
            const newUuid = uuidv4();
            setEditDom((prevEditDom) => [
              ...prevEditDom,
              {
                uuid: newUuid,
                tagName: "div",
                parentId: null,
                html: "",
                defaultPlaceHolder: "",
                placeholder: "내용을 입력하세요",
              },
            ]);
            setNewUuid(newUuid);
          }
        }}
      >
        {makeTree(editDom).map((element) => (
          <EditBranchComponent
            nearUuid={getEditComponentData(nearElement?.getAttribute("uuid"))}
            hoverUuid={hoverElement?.getAttribute("uuid")}
            key={element.uuid}
            data={element}
            modifyEditDom={modifyEditDom}
            movementSide={movementSide}
          />
        ))}
      </CardEditorContentWrapper>
      <div
        style={{
          position: "fixed",
          zIndex: 999,
          pointerEvents: "none",
          inset: "0px",
        }}
      >
        <div style={{ width: "calc(100% - 6rem)", position: "relative" }}>
          <div ref={overlayRef} style={{ position: "absolute", width: "100%" }}>
            {draggable &&
              selectElements?.map((element) => {
                return (
                  <EditBranchComponent
                    key={element.uuid}
                    data={{ ...element, uuid: null }}
                    hoverUuid={hoverElement?.getAttribute("uuid")}
                  ></EditBranchComponent>
                );
              })}
            {!draggable ? <div></div> : ""}
          </div>
        </div>
      </div>
    </EditorWrapper>
  );
};

export default CardEditor;
