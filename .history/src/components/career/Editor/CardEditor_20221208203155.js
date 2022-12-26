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
        targetElementData.uuid = nearUuid;
        targetElementData.position = minDistance.position;
      }

      setMovementSide(targetElementData);
    } else {
      setMovementSide(null);
    }
  };

  const test = () => {
    //const nearData = getEditComponentData(nearElement);
  };

  const getEditComponentData = (uuid) => {
    const findData = editDom.filter((element) => {
      return uuid === element.uuid;
    });
    return findData[0];
  };

  const windowMouseDown = (e) => {
    if (hoverElement) {
      const selectArray = [];
      const hoverUuid = hoverElement.getAttribute("uuid");
      selectArray.push(getEditComponentData(hoverUuid));
      setSelectElements(selectArray);
      const { clientX, clientY } = e;
      setSelectPoint({ x: clientX, y: clientY });
    }
  };

  const windowMouseUp = () => {
    if (movementSide && selectElements.length > 0) {
      const hoverData = getEditComponentData(movementSide.uuid);
      filterDomData(selectElements, hoverData);
    }

    setSelectElements([]);
    setDraggable(false);
    setMovementSide(null);
  };

  const filterDomData = (from, to) => {
    // 1. 수정될 element들 탐색
    // 2. 수정
    // 3. 새로운 dom 리턴

    const newEditDom = editDom.map((element) => Object.assign({}, element));

    // 1. 위치만 바뀌는 경우  => sort순서만 바꿔주면됨
    // 2. 멀티플 데이터로 수정되는경우 => 합쳐질 데이터 짤라내서 멀티플에 넣어줘야됨
    // 3. 멀티플에서 싱글로 변하는 경우 => 멀티플 제거후 멀티플데이터를 싱글로 붙여넣어줘야됨

    const findFromData = newEditDom.filter((element) => {
      return from.filter((el) => el.uuid === element.uuid).length > 0;
    })[0];

    const findToData = newEditDom.filter((element) => {
      return to.uuid === element.uuid;
    })[0];

    // parentId가 있는 Element한테가는것은 무조건 합병
    if (to.parentId) {
      console.log("무조건 합병");
    } else {
      // 아닌 경우에는 left, right인 경우에만 합병
      if (
        movementSide.position === "left" ||
        movementSide.position === "right"
      ) {
        console.log("합병");
        const newElement = makeNewElement("multiple");

        const toIndex = newEditDom.findIndex((element) => {
          return element.uuid === to.uuid;
        });

        const fromIndex = newEditDom.findIndex((element) => {
          return from.filter((el) => el.uuid === element.uuid).length > 0;
        })[0];

        console.log("fromIndex: ", fromIndex);

        newEditDom.splice(toIndex, 0, newElement);

        findFromData.parentId = newElement.uuid;
        findToData.parentId = newElement.uuid;
      } else {
        console.log("위치이동");
      }
    }

    setEditDom(newEditDom);
    // left, right인 경우 child로 들어가는것임

    // newEditDom = newEditDom.filter((element) => {
    //   if (element.tagName === "multiple") {
    //     let childData = element?.multipleData?.data;

    //     if (childData) {
    //       childData = childData.filter((data) => {
    //         const includesYn = from.filter(
    //           (el) => el.uuid === data.uuid
    //         ).length;
    //         return includesYn <= 0;
    //       });
    //     }

    //     if (childData.length === 1) {
    //       const copyData = { ...childData[0] };
    //       const copyKeys = Object.keys(copyData);
    //       const elementKeys = Object.keys(element);
    //       elementKeys.map((key) => {
    //         if (copyKeys.includes(key)) {
    //           element[key] = copyData[key];
    //         } else {
    //           delete element[key];
    //         }
    //       });
    //     } else {
    //       element.multipleData.data = childData;
    //     }

    //     return element;
    //   } else {
    //     let includesYn = from.filter((el) => el.uuid === element.uuid).length;
    //     if (
    //       movementSide.position === "left" ||
    //       movementSide.position === "right"
    //     ) {
    //       return includesYn <= 0 && to.uuid !== element.uuid;
    //     } else {
    //       return includesYn <= 0;
    //     }
    //   }
    // });

    // if (movementSide.position === "top") {
    //   // 엘리먼트가 옮겨질 위치가 위, 왼쪽 둘중 하나인 경우
    //   newEditDom.splice(hoverIndex, 0, from[0]);
    // } else if (
    //   movementSide.position === "left" ||
    //   movementSide.position === "right"
    // ) {
    //   if (movementSide.position === "left") {
    //     console.log("left");
    //   } else {
    //     console.log("right");
    //   }
    //   //1. 일반 태그인 경우 => multiple로 바꾸고 합쳐주면됨

    //   if (to.tagName !== "multiple") {
    //     let sortData;
    //     if (movementSide.position === "left") {
    //       sortData = [from[0], to];
    //     } else {
    //       sortData = [to, from[0]];
    //     }

    //     const newUuid = uuidv4();
    //     const newMultipleData = {
    //       uuid: newUuid,
    //       tagName: "multiple",
    //       html: "",
    //       defaultPlaceHolder: "",
    //       placeholder: "내용을 입력하세요",
    //       multipleData: {
    //         direction: "row",
    //         data: sortData,
    //       },
    //     };

    //     newEditDom.splice(hoverIndex, 0, newMultipleData);
    //   } else {
    //     console.log("to : ", to);
    //   }
    //   //2. multiple 태그인 경우 => 해당 multiple 태그안에 데이터로 추가해줘야됨
    // } else {
    //   newEditDom.splice(hoverIndex + 1, 0, from[0]);
    // }

    // setEditDom(newEditDom);
  };

  const makeNewElement = (tagName) => {
    const newUuid = uuidv4();
    const newMultipleData = {
      uuid: newUuid,
      tagName: tagName,
      html: "",
      defaultPlaceHolder: "",
      placeholder: "내용을 입력하세요",
    };
    return newMultipleData;
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
            hoverUuid={hoverElement?.getAttribute("uuid")}
            key={element.uuid}
            data={element}
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
