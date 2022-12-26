import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import { useEffect } from "react";
import EditBranchComponent from "./EditBranchComponent";
import { useCallback } from "react";

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

  const [newUuid, setNewUuid] = useState(null);
  const [draggable, setDraggable] = useState(false);

  const editorRef = useRef();
  const overlayRef = useRef();

  const findNearElementByPointer = (x, y) => {
    let Contents = Array.from(editorRef.current.querySelectorAll("[uuid]"));
    if (Contents.length > 0) {
      let nearEl = null;
      let hoverEl = null;

      for (let i = 0; i < Contents.length; i++) {
        if (!nearEl) {
          nearEl = Contents[i];
        }
        const nearRect = nearEl?.getBoundingClientRect();
        const contentRect = Contents[i].getBoundingClientRect();

        const nearDistance = Math.abs(nearRect.y - y);
        const contentDistance = Math.abs(contentRect.y - y);

        if (nearDistance === contentDistance) {
          if (Math.abs(nearRect.x - x) > Math.abs(contentRect.x - x)) {
            nearEl = Contents[i];
          }
        } else if (nearDistance > contentDistance) {
          nearEl = Contents[i];
        }
        const { top, bottom, left, right } =
          Contents[i].getBoundingClientRect();
        if (top <= y && bottom >= y && left <= x && right >= x) {
          hoverEl = Contents[i];
        }
      }
      setNearElement(nearEl);
      setHoverElement(hoverEl);
    }
  };

  const decideMovementSide = (x1, y1) => {
    if (nearElement && selectElements.length > 0) {
      const nearUuid = nearElement.getAttribute("uuid");

      for (let i = 0; i < selectElements.length; i++) {
        if (nearUuid === selectElements[i].uuid) {
          setMovementSide(null);
          return;
        }
      }

      const { bottom, left, right } = nearElement.getBoundingClientRect();
      const minDistance = { position: "" };

      if (left <= x1 && right >= x1) {
        if (bottom <= y1) {
          minDistance.position = "bottom";
        } else {
          minDistance.position = "top";
        }
      } else {
        if (left >= x1) {
          minDistance.position = "left";
        } else {
          minDistance.position = "right";
        }
      }

      const targetElementData = {};
      // hover된 element에 위, 아래에 element가 있는경우 해당 element에 select line을 그려줌 [안 그러면 비슷한 위치에 2개가 나옴]
      if (minDistance.position === "top") {
        const prevElement = nearElement.previousSibling;

        targetElementData.uuid = prevElement
          ? nearElement.previousSibling.getAttribute("uuid")
          : nearUuid;

        targetElementData.position = prevElement
          ? "bottom"
          : minDistance.position;
      } else {
        targetElementData.uuid = nearUuid;
        targetElementData.position = minDistance.position;
      }

      setMovementSide(targetElementData);
    } else {
      setMovementSide(null);
    }
  };

  const getMovementStyle = (movementSide) => {
    const styleObject = {
      position: "absolute",
      background: "rgba(35,131,226,0.43)",
    };
    if (movementSide === "top") {
      styleObject.top = 0;
      styleObject.left = 0;
      styleObject.width = "100%";
      styleObject.height = "4px";
    } else if (movementSide === "bottom") {
      styleObject.bottom = 0;
      styleObject.left = 0;
      styleObject.width = "100%";
      styleObject.height = "4px";
    } else if (movementSide === "left") {
      styleObject.top = 0;
      styleObject.left = 0;
      styleObject.width = "4px";
      styleObject.height = "100%";
    } else if (movementSide === "right") {
      styleObject.top = 0;
      styleObject.right = 0;
      styleObject.width = "4px";
      styleObject.height = "100%";
    }
    return styleObject;
  };

  const getEditComponentData = (element) => {
    const componentData = {};
    if (element) {
      componentData.uuid = element.getAttribute("uuid");
      componentData.tagName = element.getAttribute("tagName");
      componentData.html = element.innerText;
      componentData.defaultPlaceholder =
        element.getAttribute("defaultPlaceholder");
      componentData.placeholder = element.getAttribute("placeholder");
    }
    return componentData;
  };

  const windowMouseDown = (e) => {
    if (hoverElement) {
      const selectArray = [];
      selectArray.push(getEditComponentData(hoverElement));
      setSelectElements(selectArray);
      const { clientX, clientY } = e;
      setSelectPoint({ x: clientX, y: clientY });
    }
  };

  const windowMouseUp = () => {
    if (movementSide && selectElements.length > 0) {
      let newEditDom = [...editDom];

      // 옮기려고 선택된 Element
      const selectData = newEditDom.filter((dom) => {
        return dom.uuid === selectElements[0].uuid;
      });

      const hoverData = newEditDom.filter((dom) => {
        return dom.uuid === movementSide.uuid;
      })[0];

      // 옮겨갈 위치에있는 Element의 Dom순서
      const hoverIndex = newEditDom.findIndex(
        (dom) => dom.uuid === movementSide.uuid
      );

      // 옮기려고 선택한 Element를 제외한 나머지 Element 데이터
      newEditDom = newEditDom.filter((dom) => {
        return (
          dom.uuid !== selectElements[0].uuid && dom.uuid !== movementSide.uuid
        );
      });

      if (movementSide.position === "top") {
        // 엘리먼트가 옮겨질 위치가 위, 왼쪽 둘중 하나인 경우
        newEditDom.splice(hoverIndex, 0, selectData[0]);
      } else if (movementSide.position === "left") {
        //1. 일반 태그인 경우 => multiple로 바꾸고 합쳐주면됨

        if (hoverData.tagName !== "multiple") {
          const newUuid = uuidv4();
          const newMultipleData = {
            uuid: newUuid,
            tagName: "multiple",
            html: "",
            defaultPlaceHolder: "",
            placeholder: "내용을 입력하세요",
            multipleData: {
              direction: "row",
              data: [selectData[0], hoverData],
            },
          };

          newEditDom.splice(hoverIndex, 0, newMultipleData);
        }
        //2. multiple 태그인 경우 => 해당 multiple 태그안에 데이터로 추가해줘야됨
      } else {
        newEditDom.splice(hoverIndex + 1, 0, selectData[0]);
      }
      console.log("newEditDom : ", newEditDom);
      setEditDom(newEditDom);
    }

    setSelectElements([]);
    setDraggable(false);
    setMovementSide(null);
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

  const flatten = require("flat").flatten;

  function getObjectDepth(obj) {
    if (typeof obj !== "object" || obj === null) {
      return 0;
    }

    const flat = flatten(obj);

    const keys = Object.keys(flat);

    if (keys.length === 0) {
      return 1;
    }

    const depthOfKeys = keys.map((key) => key.split(".").length);

    return Math.max(...depthOfKeys);
  }

  const testObj = {
    name: "John",
    age: 10,
    address: {
      street: "St street",
      code: "1234-135",
    },
  };

  console.log(getObjectDepth(testObj));

  const modifyEditDom = useCallback(
    (uuid, html) => {
      let newEditDom = [...editDom];
      const elementData = newEditDom.filter((dom) => {
        return dom.uuid === uuid;
      })[0];
      console.log(Array.from(newEditDom));
      const modifyData = { ...elementData, html: html };

      // 옮겨갈 위치에있는 Element의 Dom순서
      const modifyIndex = newEditDom.findIndex((dom) => dom.uuid === uuid);

      newEditDom = newEditDom.filter((dom) => {
        return dom.uuid !== uuid;
      });

      newEditDom.splice(modifyIndex, 0, modifyData);

      setEditDom(() => newEditDom);
    },
    [editDom]
  );

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
          uuid={uuidv4()}
          tagName="title"
          html=""
          defaultPlaceHolder="제목을 입력하세요"
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
                html: "",
                defaultPlaceHolder: "",
                placeholder: "내용을 입력하세요",
              },
            ]);
            setNewUuid(newUuid);
          }
        }}
      >
        {editDom.map((element) => (
          <EditBranchComponent
            hoverUuid={hoverElement?.getAttribute("uuid")}
            key={element.uuid}
            uuid={element.uuid}
            tagName={element.tagName ? element.tagName : "div"}
            html={element?.html}
            defaultPlaceholder={element.defaultPlaceholder}
            placeholder={element.placeholder}
            multipleData={element.multipleData}
            modifyEditDom={modifyEditDom}
          >
            {draggable &&
            selectElements.length > 0 &&
            movementSide?.uuid === element.uuid ? (
              <div style={getMovementStyle(movementSide?.position)}></div>
            ) : (
              ""
            )}
          </EditBranchComponent>
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
              selectElements?.map((element, index) => (
                <EditBranchComponent
                  key={element.uuid}
                  tagName={element.tagName ? element.tagName : "div"}
                  html={element.html}
                  defaultPlaceholder={element.defaultPlaceholder}
                  placeholder={element.placeholder}
                  hoverUuid={hoverElement?.getAttribute("uuid")}
                ></EditBranchComponent>
              ))}
          </div>
        </div>
      </div>
    </EditorWrapper>
  );
};

export default CardEditor;
