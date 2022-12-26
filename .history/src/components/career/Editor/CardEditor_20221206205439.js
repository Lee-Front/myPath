import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import { useEffect } from "react";
import EditBranchComponent from "./EditBranchComponent";
import { createNoSubstitutionTemplateLiteral } from "typescript";

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

  const callback = (mutationsList, observer) => {
    console.log("observer : ", observer);
    console.log("mutationsList : ", mutationsList);
  };
  useEffect(() => {
    const observer = new MutationObserver(callback);
    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(document, config);
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
      test();

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
        const prevElement = nearElement.previousSibling;
        console.log("prevElement : ", prevElement);
        targetElementData.uuid = nearUuid;
        targetElementData.position = minDistance.position;
      }

      setMovementSide(targetElementData);
    } else {
      setMovementSide(null);
    }
  };

  const test = () => {
    const nearData = getEditComponentData(nearElement);
    console.log("nearData: ", nearData);
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
    if (element) {
      const uuid = element.getAttribute("uuid");
      let findData;
      editDom.forEach((el) => {
        if (el.uuid === uuid) {
          findData = el;
        } else if (el.tagName === "multiple") {
          const data = getEditComponentDataInMultiple(
            el.multipleData.data,
            uuid
          );
          if (data && data.uuid === uuid) {
            findData = data;
          }
        }
      });

      return findData;
    }
  };

  const getEditComponentDataInMultiple = (element, uuid) => {
    let findData;
    element.forEach((el) => {
      if (el.tagName === "multiple") {
        const data = getEditComponentDataInMultiple(el);

        if (data && data.uuid === uuid) findData = data;
      } else {
        if (el.uuid === uuid) {
          findData = el;
        }
      }
    });
    return findData;
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
      const hoverEl = document.querySelectorAll(
        '[uuid="' + movementSide.uuid + '"]'
      );
      const hoverData = getEditComponentData(hoverEl[0]);

      // const hoverData = editDom.filter((dom) => {
      //   return dom.uuid === movementSide.uuid;
      // })[0];

      filterDomData(selectElements, hoverData);
    }

    setSelectElements([]);
    setDraggable(false);
    setMovementSide(null);
  };

  const filterDomData = (from, to) => {
    // 1. 옮겨질 domData
    // 2. 옮겨질 위치의 domData
    // 3. movementSide정보 [left, right, top, bottom 어디로 붙여넣는지]

    // 1. from 데이터를 일단 모두 제거해줘야됨
    let newEditDom = [...editDom];

    const hoverIndex = newEditDom.findIndex(
      (dom) => dom.uuid === movementSide.uuid
    );

    newEditDom = newEditDom.filter((element) => {
      if (element.tagName === "multiple") {
        let childData = element?.multipleData?.data;

        if (childData) {
          childData = childData.filter((data) => {
            const includesYn = from.filter(
              (el) => el.uuid === data.uuid
            ).length;
            return includesYn <= 0;
          });
        }

        if (childData.length === 1) {
          const copyData = { ...childData[0] };
          const copyKeys = Object.keys(copyData);
          const elementKeys = Object.keys(element);
          elementKeys.map((key) => {
            if (copyKeys.includes(key)) {
              element[key] = copyData[key];
            } else {
              delete element[key];
            }
          });
        } else {
          element.multipleData.data = childData;
        }

        return element;
      } else {
        let includesYn = from.filter((el) => el.uuid === element.uuid).length;
        if (
          movementSide.position === "left" ||
          movementSide.position === "right"
        ) {
          return includesYn <= 0 && to.uuid !== element.uuid;
        } else {
          return includesYn <= 0;
        }
      }
    });

    if (movementSide.position === "top") {
      // 엘리먼트가 옮겨질 위치가 위, 왼쪽 둘중 하나인 경우
      newEditDom.splice(hoverIndex, 0, from[0]);
    } else if (
      movementSide.position === "left" ||
      movementSide.position === "right"
    ) {
      if (movementSide.position === "left") {
        console.log("left");
      } else {
        console.log("right");
      }
      //1. 일반 태그인 경우 => multiple로 바꾸고 합쳐주면됨

      if (to.tagName !== "multiple") {
        let sortData;
        if (movementSide.position === "left") {
          sortData = [from[0], to];
        } else {
          sortData = [to, from[0]];
        }

        const newUuid = uuidv4();
        const newMultipleData = {
          uuid: newUuid,
          tagName: "multiple",
          html: "",
          defaultPlaceHolder: "",
          placeholder: "내용을 입력하세요",
          multipleData: {
            direction: "row",
            data: sortData,
          },
        };

        newEditDom.splice(hoverIndex, 0, newMultipleData);
      } else {
        console.log("to : ", to);
      }
      //2. multiple 태그인 경우 => 해당 multiple 태그안에 데이터로 추가해줘야됨
    } else {
      newEditDom.splice(hoverIndex + 1, 0, from[0]);
    }

    setEditDom(newEditDom);
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
                    tagName={element.tagName ? element.tagName : "div"}
                    html={element.html}
                    defaultPlaceholder={element.defaultPlaceholder}
                    placeholder={element.placeholder}
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
