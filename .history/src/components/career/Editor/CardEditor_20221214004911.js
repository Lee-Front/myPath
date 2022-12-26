import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import { useEffect } from "react";
import EditBranchComponent from "./EditBranchComponent";

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #f9f4e9;
  font-size: 1.6rem;
`;

const CardTitle = styled.div`
  font-size: 4rem;
  padding: 2rem 3rem;
`;

const CardEditorContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 3rem;
`;

const CardEditor = () => {
  const [nearElement, setNearElement] = useState(null);

  const [hoverElement, setHoverElement] = useState(null);
  const [selectElements, setSelectElements] = useState([]);
  const [selectPoint, setSelectPoint] = useState({ x: 0, y: 0 });
  const [movementSide, setMovementSide] = useState("");
  const [editDom, setEditDom] = useState([]);

  const [ctrlPressFlag, setCtrlPressFlag] = useState(false);

  const [newUuid, setNewUuid] = useState(null);
  const [draggable, setDraggable] = useState(false);

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

  const editorRef = useRef();
  const overlayRef = useRef();

  useEffect(() => {
    document.addEventListener("selectionchange", () => {
      const event = document.getSelection();
      console.log("event: ", event);
    });
  }, []);
  const findNearElementByPointer = (x, y) => {
    let Contents = Array.from(editorRef.current.querySelectorAll("[uuid]"));
    if (Contents.length > 0) {
      const { nearEl, hoverEl } = findNearElementInChild(x, y, Contents);

      setNearElement(nearEl);
      setHoverElement(hoverEl);
    }
  };

  const findNearElementInChild = (x, y, Contents) => {
    let nearEl, hoverEl;

    for (let i = 0; i < Contents.length; i++) {
      if (!nearEl) {
        nearEl = Contents[i];
      }

      const nearRect = nearEl?.getBoundingClientRect();
      const contentRect = Contents[i].getBoundingClientRect();

      const nearDistance = Math.abs(nearRect.y - y);
      const contentDistance = Math.abs(contentRect.y - y);

      // 여기부터

      if (nearDistance === contentDistance) {
        if (Math.abs(nearRect.x - x) > Math.abs(contentRect.x - x)) {
          nearEl = Contents[i];
        }
      } else if (nearDistance > contentDistance) {
        nearEl = Contents[i];
      }

      const { top, bottom, left, right } = Contents[i].getBoundingClientRect();

      if (top <= y && bottom >= y && left <= x && right >= x) {
        hoverEl = Contents[i];
      }
    }
    return { nearEl, hoverEl };
  };

  const decideMovementSide = (x1, y1) => {
    const targetElement = hoverElement ? hoverElement : nearElement;

    if (targetElement && selectElements.length > 0) {
      const targetUuid = targetElement.getAttribute("uuid");
      const targetData = getEditComponentData(targetUuid);

      const parentData = targetData?.parentId
        ? getEditComponentData(targetData.parentId)
        : null;

      for (let i = 0; i < selectElements.length; i++) {
        if (targetUuid === selectElements[i].uuid) {
          setMovementSide(null);
          return;
        }
      }

      const { top, bottom, left, right } =
        targetElement.getBoundingClientRect();
      const list = [
        { position: "top", distance: Math.abs(top - y1) },
        { position: "bottom", distance: Math.abs(bottom - y1) },
        { position: "left", distance: Math.abs(left - x1) },
        { position: "right", distance: Math.abs(right - x1) },
      ];

      let minDistance = null;

      list.map((item) => {
        if (!minDistance) {
          minDistance = item;
        } else {
          if (minDistance.distance > item.distance) {
            minDistance = item;
          }
        }
      });

      let targetElementData = {};

      const equalParentElements = editDom.filter((element) => {
        return element.parentId === targetData.parentId;
      });

      const targetIndex = equalParentElements.findIndex(
        (element) => element.uuid === targetData.uuid
      );

      let siblingsData;
      if (minDistance.position === "top" || minDistance.position === "left") {
        siblingsData = equalParentElements[targetIndex - 1];
      } else {
        siblingsData = equalParentElements[targetIndex + 1];
      }

      // multiple인 경우에는 이러면 안됨..
      // multiple이 아닌 경우는 top인 경우만 체크해서 보내면됨
      // multiple인 경우에는 row, column 여부에 따라서 다르게 적용해줘야됨
      // 일단 parentId에 해당되는 Element가 multiple인지 확인

      console.log(parentData?.direction);
      // parentElement가 없거나 column인 경우
      if (!parentData || parentData.direction === "column") {
        // 부모가 column인 경우
        if (minDistance.position === "top") {
          targetElementData.uuid =
            siblingsData && siblingsData?.uuid !== selectElements[0].uuid
              ? siblingsData.uuid
              : targetUuid;

          targetElementData.position =
            siblingsData && siblingsData?.uuid !== selectElements[0].uuid
              ? "bottom"
              : minDistance.position;
        } else {
          targetElementData.uuid = targetUuid;
          targetElementData.position = minDistance.position;
        }
      } else {
        // row인 경우
        if (minDistance.position === "top") {
          targetElementData.uuid =
            siblingsData && siblingsData?.uuid !== selectElements[0].uuid
              ? siblingsData.uuid
              : targetUuid;

          targetElementData.position =
            siblingsData && siblingsData?.uuid !== selectElements[0].uuid
              ? "bottom"
              : minDistance.position;
        } else {
          targetElementData.uuid = targetUuid;
          targetElementData.position = minDistance.position;
        }
      }

      setMovementSide(targetElementData);
    } else {
      setMovementSide(null);
    }
  };

  const getEditComponentData = (uuid) => {
    const findData = editDom.filter((element) => {
      return uuid === element.uuid;
    });
    return findData[0];
  };

  const windowMouseDown = (e) => {
    if (hoverElement && e.ctrlKey) {
      const selectArray = [];
      const hoverUuid = hoverElement.getAttribute("uuid");
      selectArray.push(getEditComponentData(hoverUuid));
      setSelectElements(selectArray);
      const { clientX, clientY } = e;
      setSelectPoint({ x: clientX, y: clientY });
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
  };

  const moveElementData = (from, to) => {
    // 공통
    const newEditDom = editDom.map((element) => Object.assign({}, element));
    let moveIndex;

    const fromIndex = newEditDom.findIndex((element) => {
      return from[0].uuid === element.uuid;
    });

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
    // 공통

    // 이동관련 Element 데이터 수정 및 추가
    if (to.parentId) {
      // 일단 위, 아래로 옮겨갔을때 multiple이 새로 생기려면 multiple 데이터 내부 데이터여야함
      if (
        movementSide.position === "top" ||
        movementSide.position === "bottom"
      ) {
        // column으로의 새로운 multiple이 필요
        const newElement = makeNewElement({
          tagName: "multiple",
          direction: "column",
        });
        newElement.parentId = to.parentId;
        fromData.parentId = newElement.uuid;
        findToData.parentId = newElement.uuid;
        //newEditDom.splice(moveIndex, 0, fromData);
        newEditDom.splice(toIndex, 0, newElement);
      } else {
        // left right즉 해당 multiple에 들어가는 경우에만 같은 parentId로 해주면됨
        fromData.parentId = to.parentId;
        //fromData.parentId = null;
        //newEditDom.splice(moveIndex, 0, fromData);
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

        fromData.parentId = newElement.uuid;
        findToData.parentId = newElement.uuid;
        //newEditDom.splice(moveIndex, 0, fromData);
        newEditDom.splice(toIndex, 0, newElement);
      } else {
        fromData.parentId = null;
        //newEditDom.splice(moveIndex, 0, fromData);
      }
    }
    newEditDom.splice(moveIndex, 0, fromData);

    // multiple에서 데이터 삭제시 multiple 삭제 여부확인 및 처리
    if (from[0].parentId) {
      const childElement = newEditDom.filter(
        (element) => element.parentId === from[0].parentId
      );

      if (childElement.length <= 1) {
        // 자식 element가 1개 이하인 경우 multiple은 삭제처리
        childElement.map((element) => {
          element.parentId = null;
        });

        const multipleIndex = newEditDom.findIndex(
          (element) => element.uuid === from[0].parentId
        );
        newEditDom.splice(multipleIndex, 1);
      }
    }

    setEditDom(newEditDom);
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

  const windowMouseMove = (e) => {
    const { clientX, clientY } = e;
    findNearElementByPointer(clientX, clientY);

    // 선택된 Element가 있을경우 드래그 이벤트
    if (selectElements.length > 0) {
      const { clientX, clientY } = e;
      const distance = Math.sqrt(
        Math.pow(Math.abs(clientX - selectPoint.x), 2) +
          Math.pow(Math.abs(clientY - selectPoint.y), 2)
      );

      // 이동 거리가 5이상이어야 드래그로 인식
      if (!draggable && distance < 5) {
        return;
      }

      overlayRef.current.style.left = clientX - 10 + "px";
      overlayRef.current.style.top = clientY - 10 + "px";

      setDraggable(true);
      decideMovementSide(clientX, clientY);
    }
  };

  const modifyEditDom = (uuid, html) => {
    let newEditDom = [...editDom];

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
    setEditDom(() => newEditDom);
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
    <EditorWrapper>
      <CardTitle>
        <EditBranchComponent
          data={{
            uuid: uuidv4(),
            tagName: "title",
            html: "",
            defaultPlaceHolder: "제목을 입력하세요",
          }}
        ></EditBranchComponent>
      </CardTitle>
      <CardEditorContentWrapper
        ref={editorRef}
        onClick={() => {
          if (!hoverElement) {
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
              selectElements?.map((element, index) => {
                return (
                  <EditBranchComponent
                    key={element.uuid}
                    data={{ ...element, uuid: null }}
                    hoverUuid={hoverElement?.getAttribute("uuid")}
                  ></EditBranchComponent>
                );
              })}
          </div>
        </div>
      </div>
    </EditorWrapper>
  );
};

export default CardEditor;
