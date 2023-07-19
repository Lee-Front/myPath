import React from "react";
import styled from "@emotion/styled";
import { useState, useEffect, useRef } from "react";
import EditBranchComponent from "./EditBranchComponent";
import FileUploader from "./Popup/FileUploader";
import ContextMenuPopup from "./Popup/ContextMenuPopup";
import useEditorStore from "../../../stores/useEditorStore";
import DraggbleSelection from "./DraggbleSelection";
import { keyframes } from "@emotion/react";
import { throttle } from "lodash";

const CardEditor = ({ pathId, readonly }) => {
  const editorStore = useEditorStore();

  // state로 빼면 리렌더링이 너무 많이 발생함
  const nearElement = useRef(null);

  // 삭제처리 해야됨
  const fileData = useRef(null);

  // 엘리먼트 접근을 위한 Ref
  const editorRef = useRef();
  const contentRef = useRef();
  const popupRef = useRef();

  const [movementSide, setMovementSide] = useState(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [selectPoint, setSelectPoint] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [contextMenuPoint, setContextMenuPoint] = useState(null);

  const [popupUuid, setPopupUuid] = useState();
  const [draggable, setDraggable] = useState(false);
  const [handleBlock, setHandleBlock] = useState(null);
  const [newUuid, setNewUuid] = useState(null);

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [isFileUploderOpen, setIsFileUploderOpen] = useState(false);

  const mouseEventRef = useRef({ down: null, move: null, up: null });

  useEffect(() => {
    editorStore.getBlocks(pathId);
    editorStore.setPathId(pathId);
  }, [pathId]);

  useEffect(() => {
    let animationFrameId;
    const scrollContainer = editorRef.current;

    const handleMouseMove = (event) => {
      // 현재 마우스의 Y 좌표를 가져옵니다.
      const currentY = event.clientY;

      // 스크롤 컨테이너의 상단과 현재 위치 사이의 거리를 계산합니다.
      const scrollContainerTop = scrollContainer.getBoundingClientRect().top;
      const distanceFromTop = currentY - scrollContainerTop;

      // 스크롤 속도를 계산합니다 (스크롤 속도를 조절하려면 적절한 값을 설정하세요).
      const scrollSpeed = distanceFromTop / 5;

      // 스크롤 컨테이너를 이동시킵니다.
      scrollContainer.scrollBy(0, scrollSpeed);
    };

    const updateScroll = () => {
      // 다음 애니메이션 프레임을 요청합니다.
      animationFrameId = requestAnimationFrame(updateScroll);

      // 화면 밖에서 마우스 움직임을 시뮬레이트합니다.
      const mouseY = window.innerHeight / 2; // 원하는 Y 좌표로 바꿔주세요.

      // clientY 값을 갖는 가짜 이벤트 객체를 생성합니다.
      const mockEvent = { clientY: mouseY };

      // 가짜 이벤트로 handleMouseMove 함수를 호출합니다.
      handleMouseMove(mockEvent);
    };

    // mousemove 이벤트 리스너를 추가합니다.
    document.addEventListener("mousemove", handleMouseMove);

    // 스크롤 애니메이션을 시작합니다.
    updateScroll();

    return () => {
      // 컴포넌트가 언마운트될 때 mousemove 이벤트 리스너와 애니메이션 프레임을 제거합니다.
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const mouseDown = (e) => {
    mouseEventRef.current.mouseDown(e);
  };
  const mouseUp = (e) => {
    mouseEventRef.current.mouseUp(e);
  };
  const mouseMove = throttle((e) => {
    mouseEventRef.current.mouseMove(e);
  }, 50);
  // 최초 페이지 진입시 기본 이벤트 셋팅
  useEffect(() => {
    editorStore.getBlocks(pathId);
    if (!readonly) {
      const keyDown = (e) => {
        if (e.key === "Escape") {
          setIsContextMenuOpen(false);
          setIsFileUploderOpen(false);
          editorStore.setSelectBlocks([]);
        }
      };
      window.addEventListener("keydown", keyDown);
      window.addEventListener("mousedown", mouseDown);
      window.addEventListener("mouseup", mouseUp);
      window.addEventListener("mousemove", mouseMove);

      return () => {
        window.removeEventListener("keydown", keyDown);
        window.removeEventListener("mousedown", mouseDown);
        window.removeEventListener("mouseup", mouseUp);
        window.removeEventListener("mousemove", mouseMove);
      };
    }
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
    const handleBlockData = editorStore.findBlock(handleBlock?.uuid);

    if (!isFileUploderOpen && !isContextMenuOpen) {
      if (!handleBlockData) {
        editorStore.setSelectBlocks([]);
      }

      const isSelected = editorStore.selectBlocks.find(
        (block) => block.uuid === handleBlockData?.uuid
      );

      const isHandle = e.target.closest("[name=block-handle]");

      if (isHandle) {
        if (!isSelected) {
          const block = document.querySelector(
            `[data-uuid="${handleBlockData.uuid}"]`
          );

          const { x, y } = block.getBoundingClientRect();

          const blocks = findBlocksByPoint(x, y, "data").filter(
            (block) =>
              block.uuid === handleBlockData.uuid ||
              block.tagName === "multiple"
          );

          editorStore.setSelectBlocks(blocks);
        }
        window.getSelection().removeAllRanges();
        setIsGrabbing(true);
      }

      if (!editorStore.hoverBlock && e.button !== 2) {
        window.getSelection().removeAllRanges();
      }
    }

    setSelectPoint({ x: e.clientX, y: e.clientY });
  };

  mouseEventRef.current.mouseMove = (e) => {
    const { clientX, clientY } = e;

    const Contents = Array.from(
      contentRef.current.querySelectorAll("[data-uuid]")
    );

    const editorRect = editorRef.current?.getBoundingClientRect();

    const filteredContents = Contents.filter((content) => {
      const { top, bottom } = content.getBoundingClientRect();

      if (top < editorRect.top || bottom > editorRect.bottom) {
        return false;
      }

      const data = editorStore.findBlock(content.getAttribute("data-uuid"));
      return data.tagName !== "multiple";
    });

    if (Contents.length > 0) {
      getElementsByPoint(filteredContents, clientX, clientY);
    } else if (nearElement.current || editorStore.hoverBlock) {
      nearElement.current = null;
      editorStore.setHoverBlock(null);
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
    const hoverBlock = editorStore.hoverBlock;

    if (hoverBlock && !contextMenu && e.button === 2) {
      const { clientX, clientY } = e;
      setContextMenuPoint({ x: clientX, y: clientY });

      const isSelected = editorStore.selectBlocks.find(
        (block) => block.uuid === hoverBlock.uuid
      );

      if (!isSelected) {
        const block = document.querySelector(
          `[data-uuid="${hoverBlock.uuid}"]`
        );
        const { x, y } = block.getBoundingClientRect();

        const blocks = findBlocksByPoint(x, y, "data").filter(
          (block) =>
            block.uuid === hoverBlock.uuid || block.tagName === "multiple"
        );
        editorStore.setSelectBlocks(blocks);
        if (e.button !== 2) {
          window.getSelection().removeAllRanges();
        }
      }
      setIsContextMenuOpen(false);
    }

    const moveMentSideData = movementSide;
    if (editorStore.selectBlocks.length > 0 && moveMentSideData?.data.uuid) {
      const filteredBlocks = editorStore.selectBlocks.filter(
        (item) => item.tagName !== "multiple"
      );
      editorStore.moveBlocks(filteredBlocks, movementSide);
    }

    if (
      !isFileUploderOpen &&
      !isContextMenuOpen &&
      e.button !== 2 &&
      !draggable &&
      !isGrabbing
    ) {
      editorStore.setSelectBlocks([]);
    }

    setSelectPoint(null);
    setIsGrabbing(false);
    setDraggable(false);
    setMovementSide(null);
  };

  const findBlocksByPoint = (x, y, type) => {
    let blocks = document
      .elementsFromPoint(x, y)
      .filter((item) => item.getAttribute("data-uuid"));

    if (type === "data") {
      blocks = blocks.map((item) => {
        const blockUuid = item.getAttribute("data-uuid");
        return editorStore.findBlock(blockUuid);
      });
    }

    return blocks;
  };

  const makeTree = (blocks, targetUuid) => {
    // 원본 state 유지를 위해 복사하여 사용
    const copyList = copyObjectArray(blocks);
    const map = {};
    const roots = [];
    // 모든 노드에 대한 빈 데이터를 만들어줌
    copyList.forEach((node, index) => {
      // map에 uuid가 몇번째인지 넣어줌
      map[node.uuid] = index;
      node.multipleData = [];
    });

    copyList.forEach((node) => {
      if (node.parentId && copyList[map[node.parentId]]) {
        copyList[map[node.parentId]]?.multipleData.push(node);
      } else {
        node.parentId = null;
      }
    });

    // targetUuid가 undefined가 아니면 해당 노드만 반환하고,
    // undefined이면 부모가 없는 노드를 roots에 넣어서 반환
    if (targetUuid) {
      return roots.concat(copyList.filter((node) => node.uuid === targetUuid));
    }
    return copyList.filter((node) => !node.parentId);
  };

  const getElementByAxis = (elements, pos, axis) => {
    if (!elements || elements.length === 0) {
      nearElement.current = null;
      editorStore.setHoverBlock(null);
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

  const getElementsByPoint = (elements, x, y) => {
    if (elements.length > 0) {
      // 같은 y선상에 존재하는 blocks
      const equalYElements = elements.filter((element) => {
        const { top, bottom } = element.getBoundingClientRect();
        return top <= y && y <= bottom;
      });

      // 같은 X선상에 존재하는 Blocks
      const xAxisResults = getElementByAxis(equalYElements, x, "x");

      const nearRect = xAxisResults?.nearEl?.getBoundingClientRect();
      const minDistance = nearRect
        ? Math.min(Math.abs(nearRect?.left - x), Math.abs(nearRect?.right - x))
        : null;

      // handleBlock 지정
      if (
        !isContextMenuOpen &&
        !isFileUploderOpen &&
        !draggable &&
        (xAxisResults?.hoverEl || (minDistance && minDistance < 25))
      ) {
        const blockUuid = xAxisResults?.nearEl.getAttribute("data-uuid");
        if (blockUuid !== handleBlock?.uuid) {
          const editorTop = editorRef.current?.getBoundingClientRect().top;
          setHandleBlock({
            uuid: blockUuid,
            position: { x: nearRect.x, y: Math.max(editorTop, nearRect.y) },
          });
        }
      } else {
        setHandleBlock(null);
      }

      if (!xAxisResults?.nearEl) {
        const equalXElements = elements.filter((element) => {
          const { left, right } = element.getBoundingClientRect();
          return left <= x && x <= right;
        });
        const yAxisResults = getElementByAxis(equalXElements, y, "y");

        nearElement.current = editorStore.findBlock(
          yAxisResults?.nearEl.getAttribute("data-uuid")
        );
      } else {
        nearElement.current = editorStore.findBlock(
          xAxisResults?.nearEl.getAttribute("data-uuid")
        );
        const hoverBlock = editorStore.findBlock(
          xAxisResults?.hoverEl?.getAttribute("data-uuid")
        );
        editorStore.setHoverBlock(hoverBlock);
      }
    }
  };

  const decideMovementSide = (x, y) => {
    let targetBlock = editorStore.hoverBlock || nearElement.current;
    if (!targetBlock) {
      setMovementSide(null);
      return;
    }

    const targetElement = document.querySelector(
      `[data-uuid="${targetBlock.uuid}"]`
    );

    // 가장 가까운 면 구하기
    const minDistance = getNearestSide(targetElement, x, y);
    if (!minDistance) {
      setMovementSide(null);
      return;
    }

    // 여러 조건을 고려한 최종적으로 옮겨질 위치의 block 계산
    const targetElementData = getMovePositionByBlock(
      targetBlock,
      minDistance.position,
      x
    );

    setMovementSide(targetElementData);
  };

  const getNearestSide = (element, x, y) => {
    const { top, bottom, left, right } = element.getBoundingClientRect();
    const distanceList = [];

    if (top <= y && y <= bottom) {
      distanceList.push({ position: "left", distance: Math.abs(left - x) });
      distanceList.push({ position: "right", distance: Math.abs(right - x) });
    }

    if (left <= x && x <= right) {
      distanceList.push({ position: "top", distance: Math.abs(top - y) });
      distanceList.push({
        position: "bottom",
        distance: Math.abs(bottom - y),
      });
    }

    if (distanceList.length <= 0) {
      return null;
    }

    return distanceList.reduce((min, item) =>
      min.distance > item.distance ? item : min
    );
  };

  const getMovePositionByBlock = (targetBlock, position, x) => {
    const blocks = copyObjectArray(editorStore.blocks);
    const hoverBlock = editorStore.hoverBlock;
    const targetElementData = {};

    const { previousSibling } = getSiblingsData(targetBlock, blocks);
    const topParentData = getTopParentData(targetBlock);
    const topParentSiblingsData = getSiblingsData(topParentData, blocks);

    let siblingBlock = targetBlock;
    targetBlock = hoverBlock ? targetBlock : topParentData;
    if (position === "top") {
      siblingBlock = hoverBlock
        ? previousSibling
        : topParentSiblingsData.previousSibling;
    } else if (position === "bottom") {
      siblingBlock = hoverBlock
        ? targetBlock
        : topParentSiblingsData.nextSibling;
    }

    targetElementData.data = siblingBlock ? siblingBlock : targetBlock;
    targetElementData.position =
      position === "top" && siblingBlock ? "bottom" : position;

    if (targetBlock.parentId && (position === "left" || position === "right")) {
      const parentBlock = editorStore.findBlock(targetBlock.parentId);
      const parentSiblingData = getSiblingsData(parentBlock, blocks);
      // left, right는 기본적으로 parent의 uuid로 바뀜
      if (position === "left" && parentSiblingData.previousSibling) {
        targetElementData.data = parentSiblingData.previousSibling;
        targetElementData.position = "right";
      } else {
        targetElementData.data = parentBlock;
      }
    }

    // 좌측, 우측이 나뉘어진 Tag의 경우 하위로 들어갈때 별도의 영역처리 필요
    const isSubTextAreaTag =
      targetElementData.data.tagName === "checkbox" ||
      targetElementData.data.tagName === "bullet";

    // 체크박스만 예외적으로 추가처리 필요
    if (isSubTextAreaTag && targetElementData.position === "bottom") {
      const checkboxElement = contentRef.current.querySelector(
        `[data-uuid="${targetElementData.data.uuid}"]`
      );
      const checkboxTextElement =
        checkboxElement.querySelector(`[name="text-area"]`);

      const { left, right } = checkboxTextElement.getBoundingClientRect();

      if (left <= x && x <= right) {
        targetElementData.movementSideType = "text";
      } else {
        targetElementData.movementSideType = "box";
      }
    }
    return targetElementData;
  };

  const getSiblingsData = (data, blocks) => {
    const siblingElements = blocks.filter(
      (element) => element.parentId === data.parentId
    );

    const targetIndex = siblingElements.findIndex(
      (element) => element.uuid === data.uuid
    );

    const previousSibling = siblingElements[targetIndex - 1];
    const nextSibling = siblingElements[targetIndex + 1];

    return { previousSibling, nextSibling };
  };

  const getTopParentData = (block) => {
    // 초기값 할당
    let topParentdata = block;
    while (topParentdata.parentId) {
      topParentdata = editorStore.findBlock(topParentdata.parentId);
    }
    return topParentdata;
  };

  const toggleFileUploader = (e) => {
    const filePopup = e.target.closest(`[name="filePopup"]`);

    if (e.type === "mouseup" && filePopup) {
      return;
    }

    if (e.button === 0 && editorStore.hoverBlock?.tagName === "image") {
      if (!isFileUploderOpen) {
        const hoverElement = document.querySelector(
          `[data-uuid="${editorStore.hoverBlock.uuid}"]`
        );
        const { bottom, left, width } = hoverElement.getBoundingClientRect();
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

        fileData.current = {
          uuid: editorStore.hoverBlock.uuid,
          y: popupY,
          x: popupX,
        };

        if (!editorStore.selectBlocks.includes(editorStore.hoverBlock)) {
          editorStore.toggleSelectBlock(editorStore.hoverBlock.uuid);
        }
      }
      setIsFileUploderOpen(!isFileUploderOpen);
    } else {
      setIsFileUploderOpen(false);
    }
  };

  const toggleContextMenuYn = (menuState) => {
    setIsContextMenuOpen(menuState);
  };

  const handleEditorClick = (e) => {
    const isHandle = e.target.closest("[name=block-handle]");

    if (
      e.button === 0 &&
      e.target === e.currentTarget &&
      !isHandle &&
      !draggable
    ) {
      // 마지막 블록이 텍스트 블록인데 비어있으면 생성하지 않음
      if (editorStore.blocks.length > 0) {
        const lastBlockData = editorStore.blocks
          .filter((block) => block.tagName !== "multiple")
          ?.reduce((acc, cur) => (acc.srot > cur.sort ? acc : cur));
        console.log("lastBlockData: ", lastBlockData);
        if (lastBlockData.tagName === "div" && lastBlockData.html === "") {
          const lastBloack = document.querySelector(
            `[data-uuid="${lastBlockData.uuid}"]`
          );
          lastBloack.firstChild.focus();
          return;
        }
      }

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
    const filePopup = e.target.closest(`[name="filePopup"]`);
    if (!filePopup && editorStore.hoverBlock) {
      setPopupUuid(editorStore.hoverBlock?.uuid);
      toggleContextMenuYn(true);
    }
  };

  const handleOverlayMouseUp = (e) => {
    const contextMenu = e.target.closest(".contextMenu");
    const filePopup = e.target.closest(`[name="filePopup"]`);
    if (!filePopup && !contextMenu && !draggable) {
      toggleContextMenuYn(false);
      toggleFileUploader(e);
    }
  };

  return (
    <EditorContainer
      readonly={readonly}
      onMouseLeave={() => setHandleBlock(null)}
      onContextMenu={handleEditorContextMenu}
      ref={editorRef}
      onScroll={() => {
        if (handleBlock) {
          setHandleBlock(null);
        }
      }}
    >
      <ContentWrapper
        name="content-area"
        ref={contentRef}
        onClick={handleEditorClick}
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
      {(isFileUploderOpen || isContextMenuOpen || draggable) && (
        <OverlayContainer
          onMouseUp={handleOverlayMouseUp}
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
            <FileUploader
              popupRef={popupRef}
              changeShowFileUploader={toggleFileUploader}
              fileData={fileData.current}
            />
          )}
          {isContextMenuOpen && (
            <ContextMenuPopup
              pointer={contextMenuPoint}
              changeContextMenuYn={toggleContextMenuYn}
              popupData={editorStore.findBlock(popupUuid)}
            />
          )}
          {!isFileUploderOpen &&
            !isContextMenuOpen &&
            findBlocksByPoint(selectPoint?.x, selectPoint?.y).length <= 0 &&
            !isGrabbing &&
            draggable && (
              <DraggbleSelection
                startPointe={selectPoint}
                currentPoint={currentPoint}
              />
            )}
        </OverlayContainer>
      )}
      {handleBlock && (
        <BlockHandleContainer
          name="block-handle"
          handlePosition={handleBlock.position}
        >
          <BlockHandle src={`${process.env.PUBLIC_URL}/images/blockGrip.svg`} />
        </BlockHandleContainer>
      )}
    </EditorContainer>
  );
};

export default CardEditor;

const EditorContainer = styled.div`
  pointer-events: ${(props) => (props.readonly ? "none" : "auto")};
  display: flex;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  flex-direction: column;
  height: 100%;
  font-size: 1.6rem;
  overflow: auto;
`;
const ContentWrapper = styled.div`
  flex: 1;
  flex-direction: column;
  padding: 1rem 0 10rem 0;
  z-index: 2;
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
const BlockHandleContainer = styled.div`
  position: absolute;
  left: ${(props) => props.handlePosition?.x + "px"};
  top: ${(props) => props.handlePosition?.y + "px"};
`;
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const BlockHandle = styled.img`
  position: absolute;
  left: -1.4rem;
  top: 0;
  width: 1.2rem;
  height: 2.1rem;
  z-index: 3;
  animation: ${fadeIn} 0.2s ease-in-out;
`;
