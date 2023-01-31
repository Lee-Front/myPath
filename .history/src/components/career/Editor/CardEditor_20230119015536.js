import React from "react";
import styled from "@emotion/styled";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useRef } from "react";
import EditBranchComponent from "./EditBranchComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  padding: 1rem 3rem;
  z-index: 998;
`;
const OverlayWrapper = styled.div`
  position: fixed;
  min-width: 34rem;
  z-index: ${(props) => (props.popupYn ? 999 : "")};
  inset: 0px;
`;
const CardEditor = ({ pathId }) => {
  const [nearElement, setNearElement] = useState(null);
  const [hoverElement, setHoverElement] = useState(null);
  const [selectElements, setSelectElements] = useState([]);
  const [selectPoint, setSelectPoint] = useState(null);
  const [movementSide, setMovementSide] = useState("");
  const [editDom, setEditDom] = useState([]);
  const [popupYn, setPopupYn] = useState(false);
  const [newUuid, setNewUuid] = useState(null);
  const [draggable, setDraggable] = useState(false);
  const [fileData, setFileData] = useState(null);

  const editorRef = useRef();
  const overlayRef = useRef();
  const popupRef = useRef();
  const fileUploadRef = useRef();

  const nav = useNavigate();

  const fileUpload = async (file) => {
    const formData = new FormData();
    formData.append("img", file);
    formData.append("uuid", fileData.uuid);

    const upload = await axios.post("/api/common/upload", formData);
    modifyEditDom(fileData.uuid, upload.data);
  };

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
          setMovementSide(null);
          return;
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
    if (!popupYn && hoverElement && e.ctrlKey) {
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

  const windowMouseUp = (e) => {
    console.log("popupYn : ", popupYn);
    if (movementSide?.uuid && selectElements.length > 0) {
      const hoverData = getEditComponentData(movementSide.uuid);
      moveElementData(selectElements, hoverData);
    } else {
      const { clientX, clientY } = e;
      console.log("hoverElement: ", hoverElement);
      console.log("selectPoint : ", selectPoint);
      if (
        hoverElement &&
        clientX === selectPoint.x &&
        clientY === selectPoint.y
      ) {
        const hoverData = getEditComponentData(
          hoverElement.getAttribute("uuid")
        );
        console.log("hoverData : ", hoverData);

        if (!popupYn && hoverData.tagName === "image") {
          const { bottom } = hoverElement.getBoundingClientRect();
          console.log(
            "hoverElement.getBoundingClientRect(); : ",
            hoverElement.getBoundingClientRect()
          );
          setFileData({ uuid: hoverData.uuid, y: bottom });
          changePopupYn();
        }
      }
    }

    setSelectElements([]);
    setDraggable(false);
    setMovementSide(null);
    setSelectPoint(null);
  };

  const makeNewElement = ({ tagName, direction }) => {
    const newUuid = uuidv4();
    // 추후에 타입에따라 필요한것들만 생성되게
    const newElement = {
      pathId: pathId,
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

  const modifyEditDom = (uuid, data) => {
    let newEditDom = editDom.map((element) => Object.assign({}, element));

    newEditDom = newEditDom.map((dom) => {
      if (dom.tagName === "multiple") {
        findElementFromChild(dom, uuid, data.html);
      } else {
        if (dom.uuid === uuid) {
          if (dom.tagName === "image") {
            dom.files = [data];
          } else {
            dom.html = data.html;
          }
        }
      }
      return dom;
    });

    modifyDomSave(newEditDom);
    setEditDom(newEditDom);
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

  const changePopupYn = () => {
    console.log("popupRef: ", popupRef.current);
    setPopupYn(!popupYn);
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
            const newElement = makeNewElement({ tagName: "div" });
            setEditDom((prevEditDom) => [...prevEditDom, newElement]);
            setNewUuid(newElement.uuid);
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
      {/* 오버레이 영역 */}
      <OverlayWrapper popupYn={popupYn}>
        <div style={{ width: "calc(100% - 6rem)", position: "relative" }}>
          <div ref={overlayRef} style={{ position: "absolute", width: "100%" }}>
            {draggable &&
              selectElements?.map((element) => {
                return (
                  <EditBranchComponent
                    key={element.uuid}
                    data={{ ...element, uuid: null }}
                  ></EditBranchComponent>
                );
              })}
            {!draggable ? <div></div> : ""}
          </div>
        </div>
        <div
          ref={popupRef}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          {popupYn ? (
            <>
              <div
                onClick={() => {
                  changePopupYn();
                }}
                style={{
                  position: "fixed",
                  width: "100%",
                  height: "100%",
                  minWidth: "34rem",
                  left: 0,
                  top: 0,
                  zIndex: 998,
                }}
              ></div>
              <div
                style={{
                  position: "fixed",
                  top: fileData?.y,
                  width: "54rem",
                  minWidth: "18rem",
                  maxWidth: "calc(100vw - 4rem)",
                  height: "10rem",
                  zIndex: 999,
                  border: "1px solid rgba(55, 53, 47, 0.3)",
                  borderRadius: "0.5rem",
                  background: "white",
                  boxShadow:
                    "rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: " 0.7rem 0.7rem 0 0.7rem",
                  }}
                >
                  <div
                    style={{
                      cursor: "pointer",
                      height: "3rem",
                      width: "6rem",
                      textAlign: "center",
                      //borderBottom: "0.2rem solid black",
                    }}
                  >
                    이미지
                  </div>
                  <div
                    style={{
                      cursor: "pointer",
                      height: "3rem",
                      width: "6rem",
                      textAlign: "center",
                      //borderBottom: "0.2rem solid black",
                    }}
                  >
                    링크
                  </div>
                </div>
                <div style={{ borderTop: "1px solid rgba(55, 53, 47, 0.3)" }}>
                  <div
                    onClick={() => {
                      fileUploadRef.current.click();
                    }}
                    style={{
                      cursor: "pointer",
                      margin: "1rem 1rem 0 1rem",
                      padding: "0.5rem",
                      border: "1px solid rgba(55, 53, 47, 0.3)",
                      borderRadius: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    <input
                      type="file"
                      ref={fileUploadRef}
                      style={{ display: "none" }}
                      onChange={(e) => {
                        changePopupYn();
                        fileUpload(e.target.files[0]);
                      }}
                    />
                    파일 업로드
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </OverlayWrapper>
    </EditorWrapper>
  );
};

export default CardEditor;
