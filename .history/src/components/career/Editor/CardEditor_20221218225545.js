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
const CardEditorContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 3rem;
`;

const CardEditor = () => {
  useEffect(() => {
    const select = window.getSelection();
    if (select.type === "Range") {
      //console.log("select : ", select);
    }
  });
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
      if (nearDistance >= contentDistance) {
        nearEl = Contents[i];
      }
      // if (nearDistance === contentDistance) {
      //   if (Math.abs(nearRect.x - x) > Math.abs(contentRect.x - x)) {
      //     nearEl = Contents[i];
      //   }
      // } else if (nearDistance >= contentDistance) {
      //   nearEl = Contents[i];
      // }

      const { top, bottom, left, right } = Contents[i].getBoundingClientRect();

      if (top <= y && bottom >= y && left <= x && right >= x) {
        hoverEl = Contents[i];
      }
    }
    if (hoverEl) {
      // 호버링된 Element가 있으면 그게 가장 가까운 Element
      nearEl = hoverEl;
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

      let equalData = targetData;

      const { prevData, nextData } = getSiblingsData(equalData);

      //위, 아래
      if (minDistance.position === "top" || minDistance.position === "bottom") {
        if (!hoverElement) {
          const topParentdata = getTopParentData(targetData);
          targetElementData.uuid = topParentdata.uuid;
          targetElementData.position = minDistance.position;
        }
        // 좌, 우
      } else {
        targetElementData.uuid = equalData.uuid;
        targetElementData.position = minDistance.position;
      }

      if (parentData) {
        if (parentData.direction === "column") {
          //const siblingData = getSiblingsData(parentData);
          if (
            minDistance.position === "left" ||
            minDistance.position === "right"
          ) {
            targetElementData.uuid = parentData.uuid;
          }
        }
      }
      if (hoverElement && minDistance.position === "top") {
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
    if (data.parentId) {
      const parentData = getEditComponentData(data.parentId);
      return getTopParentData(parentData);
    } else {
      return getEditComponentData(data.uuid);
    }
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

        // fromData.parentId = newElement.uuid;
        // findToData.parentId = newElement.uuid;
        // newEditDom.splice(moveIndex, 0, newElement);
      } else {
        fromData.parentId = null;
      }
    }

    newEditDom.splice(moveIndex, 0, fromData);

    // multiple에서 데이터 삭제시 multiple 삭제 여부확인 및 처리
    // if (from[0].parentId) {
    //   const childElement = newEditDom.filter(
    //     (element) => element.parentId === from[0].parentId
    //   );

    //   if (childElement.length <= 1) {
    //     // 자식 element가 1개 이하인 경우 multiple은 삭제처리
    //     childElement.map((element) => {
    //       element.parentId = null;
    //     });

    //     const multipleIndex = newEditDom.findIndex(
    //       (element) => element.uuid === from[0].parentId
    //     );
    //     newEditDom.splice(multipleIndex, 1);
    //   }
    // }

    setEditDom(newEditDom);
  };

  const getEditComponentData = (uuid) => {
    const findData = editDom.filter((element) => {
      return uuid === element.uuid;
    });
    return findData[0];
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
