import React from "react";
import styled from "@emotion/styled";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useRef } from "react";
import EditBranchComponent from "./EditBranchComponent";
import PopupMenu from "./Popup/PopupMenu";
import ContextMenuPopup from "./Popup/ContextMenuPopup";
import useEditorStore from "../../../stores/useEditorStore";
import DraggbleSelection from "./DraggbleSelection";
import { createPortal } from "react-dom";
import { find } from "lodash";

const CardEditor = ({ pathId }) => {
  const editorStore = useEditorStore();
  const editorStoreRef = useRef(editorStore);
  const [movementSide, setMovementSide] = useState("");

  // 이 두개는 store로 빼거나 state로 빼면 리렌더링이 너무 많이 발생함
  const nearElement = useRef(null);
  const hoverElement = useRef(null);
  const movementSideRef = useRef("");
  const fileData = useRef(null);
  const contextMenuPoint = useRef(null);

  const editorRef = useRef();
  const contentRef = useRef();
  const popupRef = useRef();

  const [isGrabbing, setIsGrabbing] = useState(false);
  const [selectPoint, setSelectPoint] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [popupUuid, setPopupUuid] = useState();
  const [newUuid, setNewUuid] = useState(null);
  const [draggable, setDraggable] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [isFileUploderOpen, setIsFileUploderOpen] = useState(false);
  const [handleBlock, setHandleBlock] = useState(null);

  const mouseEventRef = useRef({ down: null, move: null, up: null });

  useEffect(() => {
    editorStore.getBlocks(pathId);
    editorStore.setPathId(pathId);
  }, [pathId]);

  // 마우스 이벤트에서 state를 실시간으로 참조하기 위한 ref
  useEffect(() => {
    editorStoreRef.current = editorStore;
  }, [editorStore]);

  useEffect(() => {
    movementSideRef.current = movementSide;
  }, [movementSide]);
  const mouseDown = (e) => {
    mouseEventRef.current.mouseDown(e);
  };
  const mouseUp = (e) => {
    mouseEventRef.current.mouseUp(e);
  };
  const mouseMove = (e) => {
    mouseEventRef.current.mouseMove(e);
  };
  // 최초 페이지 진입시 기본 이벤트 셋팅
  useEffect(() => {
    editorStore.getBlocks(pathId);

    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  useEffect(() => {
    const newElement = Array.from(
      contentRef.current.querySelectorAll("[data-uuid]")
    ).filter((item) => item.getAttribute("data-uuid") === newUuid);

    if (newElement.length > 0) {
      newElement[0].children[0].focus();
    }
  }, [newUuid]);

  // 현시점 editDom 데이터를 원본과 분리하기 위해 복사해서 리턴해주는 함수
  const copyObjectArray = (arr) => {
    return JSON.parse(JSON.stringify(arr));
  };

  // 마우스 이동에 따른 데이터 수정을 위한 이벤트
  mouseEventRef.current.mouseDown = (e) => {
    const hoverData = editorStore.findBlock(
      hoverElement.current?.getAttribute("data-uuid")
    );
    const handleBlockData = editorStore.findBlock(handleBlock?.uuid);

    if (!isFileUploderOpen && !isContextMenuOpen) {
      if (!handleBlockData) {
        editorStore.setSelectBlocks([]);
      }

      const isSelected = editorStore.selectBlocks.find(
        (block) => block.uuid === hoverData?.uuid
      );

      const isHandle = e.target.closest("[name=block-handle]");

      // if (hoverData && e.ctrlKey && isSelected) {
      //   window.getSelection().removeAllRanges();
      //   setIsGrabbing(true);
      // }
      if (isHandle) {
        if (editorStore.selectBlocks.length <= 0 || !isSelected) {
          editorStore.setSelectBlocks([handleBlockData]);
        }
        window.getSelection().removeAllRanges();
        setIsGrabbing(true);
      }
    }

    setSelectPoint({ x: e.clientX, y: e.clientY });
  };

  mouseEventRef.current.mouseMove = (e) => {
    const { clientX, clientY } = e;

    const Contents = Array.from(
      contentRef.current.querySelectorAll("[data-uuid]")
    );

    const filteredContents = Contents.filter((content) => {
      const data = getEditComponentData(content.getAttribute("data-uuid"));
      return data.tagName !== "multiple";
    });

    if (Contents.length > 0) {
      const { nearBlock, hoverBlock } = findElementsByPoint(
        filteredContents,
        clientX,
        clientY
      );
    } else if (nearElement.current || hoverElement.current) {
      nearElement.current = null;
      hoverElement.current = null;
    }

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
      setCurrentPoint({ x: clientX, y: clientY });
    }

    // 선택된 Element가 있을경우 드래그 이벤트
    if (isGrabbing && editorStore.selectBlocks.length > 0) {
      window.getSelection().removeAllRanges();
      decideMovementSide(clientX, clientY);
    }
  };

  mouseEventRef.current.mouseUp = (e) => {
    const contextMenu = e.target.closest(".contextMenu");

    if (hoverElement.current && !contextMenu && e.button === 2) {
      const { clientX, clientY } = e;
      contextMenuPoint.current = { x: clientX, y: clientY };
      setIsContextMenuOpen(false);
    }

    const moveMentSideData = movementSideRef.current;
    if (editorStore.selectBlocks.length > 0 && moveMentSideData?.uuid) {
      const filteredBlocks = editorStore.selectBlocks.filter(
        (item) => item.tagName !== "multiple"
      );
      editorStore.moveBlocks(filteredBlocks, moveMentSideData);
    }

    if (
      !isFileUploderOpen &&
      !isContextMenuOpen &&
      e.button !== 2 &&
      !draggable &&
      !e.ctrlKey &&
      !isGrabbing
    ) {
      editorStore.setSelectBlocks([]);
    }

    if (!draggable && hoverElement.current && e.ctrlKey) {
      const blocks = findBlocksByPoint(e.clientX, e.clientY);

      blocks.forEach((block) => {
        editorStore.toggleSelectBlock(block.uuid);
      });
    }

    setSelectPoint(null);
    setIsGrabbing(false);
    setDraggable(false);
    setMovementSide(null);
  };

  const findBlocksByPoint = (x, y) => {
    const blocks = document
      .elementsFromPoint(x, y)
      .filter((item) => item.getAttribute("data-uuid"))
      .map((item) => {
        const blockUuid = item.getAttribute("data-uuid");
        return editorStore.findBlock(blockUuid);
      });
    return blocks;
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

  const findElementByAxis = (elements, pos, axis) => {
    if (!elements || elements.length === 0) {
      nearElement.current = null;
      hoverElement.current = null;
      return;
    }

    let hoverEl = null;

    const rectProp = axis === "x" ? "left" : "top";
    const sizeProp = axis === "x" ? "right" : "bottom";

    const nearEl = elements.reduce((prev, curr) => {
      const prevRect = prev.getBoundingClientRect();
      const currRect = curr.getBoundingClientRect();

      if (currRect[rectProp] <= pos && pos <= currRect[sizeProp]) {
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

  const findElementsByPoint = (Contents, x, y) => {
    let hoverBlock = null;
    let nearBlock = null;
    if (Contents.length > 0) {
      const equalYElements = Contents.filter((element) => {
        const { top, bottom } = element.getBoundingClientRect();
        return top <= y && y <= bottom;
      });

      const xAxisResults = findElementByAxis(equalYElements, x, "x");
      const nearRect = xAxisResults?.nearEl?.getBoundingClientRect();
      const minDistance = nearRect
        ? Math.min(Math.abs(nearRect?.left - x), Math.abs(nearRect?.right - x))
        : null;

      if (xAxisResults?.hoverEl || (minDistance && minDistance < 25)) {
        const blockUuid = xAxisResults?.nearEl.getAttribute("data-uuid");
        setHandleBlock({
          uuid: blockUuid,
          position: { x: nearRect.x, y: nearRect.y },
        });
      } else {
        setHandleBlock(null);
      }

      if (!xAxisResults?.nearEl) {
        const equalXElements = Contents.filter((element) => {
          const { left, right } = element.getBoundingClientRect();
          return left <= x && x <= right;
        });
        const yAxisResults = findElementByAxis(equalXElements, y, "y");

        nearElement.current = yAxisResults?.nearEl;
        hoverElement.current = yAxisResults?.hoverEl;
        nearBlock = yAxisResults?.nearEl;
        hoverBlock = yAxisResults?.hoverEl;
      } else {
        nearElement.current = xAxisResults?.nearEl;
        hoverElement.current = xAxisResults?.hoverEl;
        nearBlock = xAxisResults?.nearEl;
        hoverBlock = xAxisResults?.hoverEl;
      }
    }
    return { nearBlock, hoverBlock };
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
      const checkboxElement = contentRef.current.querySelector(
        `[data-uuid="${targetElementData.uuid}"]`
      );

      const checkboxTextElement =
        checkboxElement.querySelector(`[name="text-area"]`);

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

  const getEditComponentData = (uuid) => {
    const elements = copyObjectArray(editorStore.blocks);
    const findData = elements.find((element) => {
      return uuid === element.uuid;
    });

    return Object.assign({}, findData);
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

  const handleEditorClick = (e) => {
    if (
      e.button === 0 &&
      e.target === e.currentTarget &&
      !draggable &&
      !hoverElement.current
    ) {
      const newElement = editorStore.createBlock({ pathId, tagName: "div" });
      editorStore.saveBlocks([
        ...copyObjectArray(editorStore.blocks),
        newElement,
      ]);
      setNewUuid(newElement.uuid);
    }
  };

  const handleEditorContextMenu = (e) => {
    e.preventDefault();
    const filePopup = e.target.closest(".filePopup");
    if (!filePopup && hoverElement.current) {
      setPopupUuid(hoverElement.current?.getAttribute("data-uuid"));
      toggleContextMenuYn(true);
    }
  };

  return (
    <EditorContainer onContextMenu={handleEditorContextMenu} ref={editorRef}>
      <ContentWrapper
        name="content-area"
        ref={contentRef}
        onMouseUp={handleEditorClick}
      >
        {makeTree(editorStore.blocks).map((element) => (
          <EditBranchComponent
            key={element.uuid}
            data={element}
            movementSide={movementSide}
            changeShowFileUploader={toggleFileUploader}
          />
        ))}
      </ContentWrapper>
      {isFileUploderOpen || isContextMenuOpen || draggable ? (
        <OverlayContainer
          onMouseUp={(e) => {
            const contextMenu = e.target.closest(".contextMenu");
            const filePopup = e.target.closest(".filePopup");
            if (!filePopup && !contextMenu && !draggable) {
              toggleContextMenuYn(false);
              toggleFileUploader(e);
            }
          }}
          zindex={isFileUploderOpen || isContextMenuOpen || draggable}
        >
          {isGrabbing && editorStore.selectBlocks.length > 0 && (
            <OverlayWrapper currentPoint={currentPoint}>
              {makeTree(editorStore.selectBlocks).map((item) => {
                const overlayWidth = item.width;
                return (
                  <EditBranchComponent
                    key={`${item.uuid}_overlay`}
                    data={item}
                    overlayWidth={overlayWidth}
                    isOverlay={true}
                  ></EditBranchComponent>
                );
              })}
            </OverlayWrapper>
          )}
          {isFileUploderOpen && (
            <PopupMenu
              popupRef={popupRef}
              changeShowFileUploader={toggleFileUploader}
              fileData={fileData.current}
            />
          )}
          {isContextMenuOpen && (
            <ContextMenuPopup
              pointer={contextMenuPoint.current}
              changeContextMenuYn={toggleContextMenuYn}
              popupData={getEditComponentData(popupUuid)}
            />
          )}
          {selectPoint &&
            findBlocksByPoint(selectPoint?.x, selectPoint?.y).length <= 0 &&
            !isGrabbing &&
            draggable && (
              <DraggbleSelection
                startPointe={selectPoint}
                currentPoint={currentPoint}
              />
            )}
        </OverlayContainer>
      ) : null}
      {editorStore.selectBlocks.map((item) => {
        if (item.tagName === "multiple") return null;
        const element = document.querySelector(`[data-uuid="${item?.uuid}"]`);
        return createPortal(<SelectionHalo />, element);
      })}
      {handleBlock && (
        <BlockHandleContainer
          name="block-handle"
          handlePosition={handleBlock.position}
        >
          <BlockHandle />
        </BlockHandleContainer>
      )}
    </EditorContainer>
  );
};

export default CardEditor;

const EditorContainer = styled.div`
  display: flex;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  flex-direction: column;
  height: 100%;
  font-size: 1.6rem;
`;
const ContentWrapper = styled.div`
  flex: 1;
  flex-direction: column;
  margin: 1rem 0 10rem 0;
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
  width: calc(100% - 5rem);
  left: ${(props) => props.currentPoint?.x + "px"};
  top: ${(props) => props.currentPoint?.y - 10 + "px"};
  opacity: 0.4;
`;

const SelectionHalo = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(35, 131, 226, 0.14);
  z-index: -1;
`;

const BlockHandleContainer = styled.div`
  position: absolute;
  left: ${(props) => props.handlePosition?.x + "px"};
  top: ${(props) => props.handlePosition?.y + "px"};
`;

const BlockHandle = styled.div`
  position: absolute;
  left: -1.4rem;
  top: 0;
  width: 1.2rem;
  height: 2rem;
  background: #000;
`;
