import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { SketchPicker } from "react-color";
import { useEffect } from "react";

const ContextMenuWarpper = styled.div`
  position: absolute;
  left: ${(props) => props.x + "px"};
  top: ${(props) => props.y + "px"};
  border-radius: 0.5rem;
  border: 1px solid rgba(55, 53, 47, 0.2);
  background: white;
`;

const Menu = styled.div`
  width: 20rem;
  font-size: 1.7rem;
  line-height: 2.8rem;
  padding-left: 0.5rem;
  :hover {
    border-radius: 0.5rem;
    background: rgba(55, 53, 47, 0.1);
  }
`;

const TextMenuWrapper = styled.div`
  display: flex;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(55, 53, 47, 0.2);
`;

const TextMenu = styled.div`
  min-width: 4rem;
  padding: 0 0.5rem;
  height: 4rem;
  display: flex;
  text-align: center;
  font-size: 1.5rem;

  flex-direction: column;
  justify-content: center;

  border: ${(props) =>
    props.border ? "0.2rem solid rgba(55, 53, 47, 0.2)" : null};

  border-radius: 0.3rem;
  :hover {
    background: rgba(55, 53, 47, 0.1);
    border-radius: 0.3rem;
  }
`;

const TextSizeWrapper = styled.div`
  display: flex;
`;

const TextSizeOption = styled.div`
  text-align: center;
  :hover {
    background: rgba(55, 53, 47, 0.2);
  }
`;

const ContextMenuPopup = ({
  pointer,
  changeContextMenuYn,
  modifyEditDom,
  popupData,
}) => {
  const [uuid, setUuid] = useState(popupData?.uuid);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [isSketchOpen, setIsSketchOpen] = useState(false);
  const [isBackgroundSketchOpen, setIsBackgroundSketchOpen] = useState(false);

  const [fontSize, setFontSize] = useState(
    popupData?.styleData?.fontSize || 16
  );
  const [color, setColor] = useState(popupData?.styleData?.color);
  const [background, setBackground] = useState(
    popupData?.styleData?.background
  );
  const [bold, setBold] = useState(popupData?.styleData?.bold);
  const [italic, setItalic] = useState(popupData?.styleData?.italic);
  const [underLine, setUnderLine] = useState(popupData?.styleData?.underLine);
  const [strikethrough, setStrikethrough] = useState(
    popupData?.styleData?.strikethrough
  );

  const inputRef = useRef();

  const sizeList = [10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

  const deleteMenu = () => {
    modifyEditDom(popupData.uuid, {}, "delete");
    changeContextMenuYn(false);
  };

  const changeMenu = () => {
    const tagName = prompt("tagName", "div");
    modifyEditDom(popupData.uuid, { tagName: tagName });
    changeContextMenuYn(false);
  };

  const checkStyleIndex = (selection, style) => {
    // 시작과 끝의 노드가 다르거나
    // 시작점과 끝점이 다른경우
    if (
      selection.baseNode !== selection.extentNode ||
      selection.anchorOffset !== selection.focusOffset
    ) {
      //일단 체크를한다 해당 html 영역이 span에 껴있는가
      const target = document.querySelector(`[uuid="${uuid}"]`);
      const editableTag = target.querySelector(".editable-tag");
      const range = selection.getRangeAt(0);
      let newHtml = "";

      const nodes = Array.from(editableTag.childNodes);

      //newHtml = makeNewHtml(targetNodeList, startOffset, endOffset, style);
      newHtml = makeNewHtml(nodes, range, style);
      console.log("newHtml: ", newHtml);

      // 일단 여기에서만 돌게 넣어둠
      modifyEditDom(uuid, {
        html: newHtml,
      });

      editableTag.innerHTML = newHtml;

      //setCaretPosition(editableTag, startOffset, endOffset);
    } else {
      console.log("전체");
    }
  };

  const makeNewHtml = (nodes, range, style) => {
    const newNodeList = [];
    console.log("nodes : ", nodes);

    // 일단 현재 style, text 정보를 담음
    nodes.map((node) => {
      const nodeObject = {};
      if (node.nodeName === "SPAN") {
        nodeObject.nodeName = node.nodeName;
        nodeObject.textContent = node.innerText;
        nodeObject.style = [];

        for (let i = 0; i < node?.style?.length; i++) {
          const styleName = node.style[i];
          nodeObject.style.push({ [styleName]: node.style[styleName] });
        }
      } else {
        nodeObject.nodeName = node.nodeName;
        nodeObject.textContent = node.textContent;
      }

      newNodeList.push(nodeObject);
    });

    let newHtml = "";
    let newStyle = "";

    const { startOffset, endOffset, startContainer, endContainer } = range;

    let startNode = startContainer;
    let endNode = endContainer;

    if (startNode.parentElement.nodeName === "SPAN") {
      startNode = startNode.parentElement;
    }

    if (endNode.parentElement.nodeName === "SPAN") {
      endNode = endNode.parentElement;
    }

    const startNodeIndex = nodes.indexOf(startNode);
    const endNodeIndex = nodes.indexOf(endNode);

    for (let i = 0; i < newNodeList.length; i++) {
      if (startNodeIndex <= i && i <= endNodeIndex) {
        // 선택된 범위안의 node 들
        const nodeData = newNodeList[i];
        if (nodeData.nodeName === "SPAN") {
          console.log("nodeData : ", nodeData);
        } else {
          console.log("nodeData: ", nodeData);
          // 일반 text
        }

        if (i === startNodeIndex) {
          // 변경되는 시작 노드
          // splice(1,0,'test');
          const prevText = nodeData.textContent.slice(0, startOffset);
          if (prevText.length > 0) {
            // prevText가 있다는건 분리를 시켜줘야 한다는뜻임
            const splitNode = JSON.parse(JSON.stringify(nodeData));
            console.log("splitNode : ", splitNode);
            splitNode.textContent = splitNode.textContent.slice(0, startOffset);
            nodeData.textContent = nodeData.textContent.slice(
              startOffset,
              nodeData.textContent.length
            );
            newNodeList.splice(i, 0, splitNode);
          }
        } else if (i === endNodeIndex) {
          console.log("a");
          // 변경이 끝나는 노드
        } else {
          console.log("b");
          // 시작과 끝 노드 사이에 있는 노드
        }
      }
    }
    console.log("newNodeList: ", newNodeList);

    return newHtml;
  };
  // const makeNewHtml = (nodes, range, style) => {
  //   let newHtml = "";
  //   let newStyle = "";

  //   // 전체 Html 즉 node의 html부분을 다 만들고나서 대상이 아니던 앞뒤로 붙을 유지되는 node들 Html
  //   let prevHtml = "";
  //   let nextHtml = "";

  //   const { startOffset, endOffset, startContainer, endContainer } = range;

  //   let startNode = startContainer;
  //   let endNode = endContainer;

  //   const targetNodeList = [];
  //   console.log("nodes : ", nodes);

  //   if (startNode.parentElement.nodeName === "SPAN") {
  //     startNode = startNode.parentElement;
  //   }

  //   if (endNode.parentElement.nodeName === "SPAN") {
  //     endNode = endNode.parentElement;
  //   }

  //   const startNodeIndex = nodes.indexOf(startNode);
  //   const endNodeIndex = nodes.indexOf(endNode);

  //   for (let i = 0; i < nodes.length; i++) {
  //     if (startNodeIndex <= i && i <= endNodeIndex) {
  //       // 선택된 범위안의 node 들
  //       targetNodeList.push(nodes[i]);
  //     }
  //   }

  //   // 아예 html을 새로 만들어줘야함
  //   targetNodeList.map((node, targetNodeIndex) => {
  //     // 실제로 대상이되는 node들의 span화 작업이 끝난 html이 들어갈곳
  //     let prev = "";
  //     let next = "";
  //     let html = "";
  //     let prevStyleText = "";

  //     const textContent = node.textContent;
  //     const styleList = []; // 이전 스타일 목록
  //     const styleKeys = Object.keys(style);

  //     // 현재 노드의 스타일들을 styleList에 넣고
  //     for (let i = 0; i < node?.style?.length; i++) {
  //       const styleName = node.style[i];
  //       styleList.push({ [styleName]: node.style[styleName] });
  //     }

  //     // 애초에 새로 들어오는 스타일은 무조건 바뀌는거고
  //     // 기존 스타일을 대체될지 말지를 결정해야함

  //     // 그럼 일단 style을 for돌아서 newStyle에 다 넣고
  //     // 기존 node의 style을 for문 돌아서 새 style과 겹치는 key가 있으면 스킵하고 없으면 넣으면됨

  //     styleList.map((nodeStyle) => {
  //       Object.keys(nodeStyle).forEach((key) => {
  //         if (styleKeys.includes(key)) {
  //           newStyle += key + ":" + style[key] + ";";
  //         } else {
  //           newStyle += key + ":" + nodeStyle[key] + ";";
  //         }
  //         prevStyleText += key + ":" + nodeStyle[key] + ";";
  //       });
  //     });

  //     if (node.nodeName === "SPAN") {
  //       // span일때는 일단 start랑 end가 text의 전체와 겹치는지 확인부터 해야됨

  //       // 1. span의 앞부분이 남는경우 [기존 span>  <새span>]으로 분리
  //       // 2. span이 앞뒤로 남는경우 [기존 span> <새span>  <기존 span>] 으로 분리
  //       // 3. span의 뒷부분이 남는경우 [<새span> <기존span>]
  //       prev = textContent.slice(0, startOffset);
  //       next = textContent.slice(endOffset, textContent.length);
  //       html = textContent.slice(startOffset, endOffset);
  //       // targetNodeList가 1개면 몇번째고 이런걸 판단할 필요가 없음
  //       if (targetNodeList.length === 1) {
  //         newHtml = `<span style="${newStyle}">${html}</span>`;
  //         if (startOffset === 0 && endOffset < textContent.length) {
  //           newHtml += `<span style="${prevStyleText}">${next}</span>`;
  //         } else if (0 < startOffset && endOffset === textContent.length) {
  //           newHtml = `<span style="${prevStyleText}">${prev}</span>${newHtml}`;
  //           // 앞쪽이 남음
  //         } else if (0 < startOffset && endOffset < textContent.length) {
  //           newHtml = `<span style="${prevStyleText}">${prev}</span>${newHtml}<span style="${prevStyleText}">${next}</span>`;
  //           // 앞뒤로 남음
  //         }
  //       } else {
  //         // 하지만 1개 이상이면 몇번째 node인지에 따라서 처리방법이 달라짐
  //         if (targetNodeIndex === 0) {
  //           // 첫번째 노드
  //           // startOffset부터 마지막 text까지
  //           newHtml += `${prev}<span style="${newStyle}">${html}</span>`;
  //         } else if (targetNodeIndex === targetNodeList.length) {
  //           // 마지막 노드
  //           // 0부터 마지막 endOffset까지
  //           newHtml += `<span style="${newStyle}">${html}</span>${next}`;
  //         } else {
  //           // 중간에 껴있는 node이므로 시작점부터 끝까지 다 들어가면됨
  //           newHtml += `<span style="${newStyle}">${html}</span>${next}`;
  //         }
  //       }

  //       // span이니까 일단 시작과 끝점 비교해서
  //     } else {
  //       // 일반 text일때는 선택된 부분만 스타일 먹인 span으로 바꾸고 앞뒤 내용을 붙여줌

  //       // Object.keys(style).forEach((key) => {
  //       //   newStyle += key + ":" + style[key] + ";";
  //       // });
  //       if (targetNodeList.length === 1) {
  //         prev = textContent.slice(0, startOffset);
  //         next = textContent.slice(endOffset, textContent.length);
  //         html = textContent.slice(startOffset, endOffset);
  //         console.log({ prev, html, next });

  //         newHtml += `${prev}<span style="${newStyle}">${html}</span>${next}`;
  //       } else {
  //         prev = textContent.slice(0, startOffset);
  //         next = textContent.slice(endOffset, textContent.length);
  //         html = textContent.slice(startOffset, endOffset);
  //         // 하지만 1개 이상이면 몇번째 node인지에 따라서 처리방법이 달라짐
  //         if (targetNodeIndex === 0) {
  //           // 첫번째 노드
  //           // startOffset부터 마지막 text까지
  //           newHtml += `${prev}<span style="${newStyle}">${html}</span>`;
  //         } else if (targetNodeIndex === targetNodeList.length) {
  //           // 마지막 노드
  //           // 0부터 마지막 endOffset까지
  //           newHtml += `<span style="${newStyle}">${html}</span>${next}`;
  //         } else {
  //           // 중간에 껴있는 node이므로 시작점부터 끝까지 다 들어가면됨
  //           newHtml += `<span style="${newStyle}">${html}</span>${next}`;
  //         }
  //       }

  //       console.log({ prev, next, html });

  //       //newHtml += `${prev}<span style="${newStyle}">${html}</span>${next}`;
  //       console.log("text : ", newHtml);
  //     }
  //   });

  //   nodes.map((node, index) => {
  //     let nodeHtml =
  //       node.nodeName === "SPAN" ? node.outerHTML : node.textContent;
  //     if (index < startNodeIndex) {
  //       prevHtml += nodeHtml;
  //     } else if (endNodeIndex < index) {
  //       nextHtml += nodeHtml;
  //     }
  //   });

  //   newHtml = `${prevHtml}${newHtml}${nextHtml}`;

  //   return newHtml;
  // };

  const setCaretPosition = (target, start, end) => {
    const nodes = target.childNodes;
    let currentNodeStartIndex = 0;
    let currentNodeEndIndex = 0;
    const newRange = document.createRange();

    // 노드들을 돌면서 작업 시작
    for (let i = 0; i < nodes.length; i++) {
      let textLength = nodes[i].textContent.length;

      currentNodeEndIndex += textLength;
      if (currentNodeStartIndex <= start && currentNodeEndIndex > start) {
        const textNode =
          nodes[i].nodeName === "#text" ? nodes[i] : nodes[i].firstChild;
        newRange.setStart(textNode, start - currentNodeStartIndex);
      }

      if (currentNodeStartIndex < end && currentNodeEndIndex >= end) {
        // 셀랙트 끝점이 해당 node의 범위안에 있는경우
        const textNode =
          nodes[i].nodeName === "#text" ? nodes[i] : nodes[i].firstChild;

        newRange.setEnd(
          textNode,
          textLength - Math.abs(currentNodeStartIndex - start)
        );
      }
      currentNodeStartIndex += textLength;
    }

    document.getSelection().removeAllRanges();
    document.getSelection().addRange(newRange);
  };

  const changeFontSize = async (value) => {
    let newValue;
    if (value < 10) {
      newValue = 10;
    } else {
      newValue = value;
    }

    setFontSize(newValue);
    inputRef.current.value = newValue;

    if (newValue >= 10) {
      modifyEditDom(
        popupData.uuid,
        {
          styleData: { ...popupData?.styleData, fontSize: newValue },
        },
        "style"
      );
    }

    await axios.post("/api/editor/style/save", {
      uuid: uuid,
      fontSize: newValue,
    });
  };

  const changeColor = async (modifyColor) => {
    if (popupData?.styleData?.color !== modifyColor) {
      modifyEditDom(
        popupData.uuid,
        {
          styleData: { ...popupData?.styleData, color: modifyColor },
        },
        "style"
      );
    }
  };

  const changeBackground = async (modifyColor) => {
    if (popupData?.styleData?.background !== modifyColor) {
      modifyEditDom(
        popupData.uuid,
        {
          styleData: { ...popupData?.styleData, background: modifyColor },
        },
        "style"
      );
    }
  };

  return (
    <ContextMenuWarpper
      x={pointer?.x}
      y={pointer?.y}
      className="contextMenu"
      onClick={(e) => {
        if (isFontSizeOpen) {
          setIsFontSizeOpen(false);
        }

        const sketchElement = e.target.closest(".color-sketch");
        // 팔레트가 아니고 팝업이 열려있으면
        if (!sketchElement && isSketchOpen) {
          setIsSketchOpen(false);
          changeColor(color);
        }

        const backgroundSketchElement = e.target.closest(".background-sketch");
        // 팔레트가 아니고 팝업이 열려있으면
        if (!backgroundSketchElement && isBackgroundSketchOpen) {
          setIsBackgroundSketchOpen(false);
          changeBackground(background);
        }
      }}
    >
      <TextMenuWrapper>
        <div style={{ position: "relative" }}>
          <TextMenu>
            <TextSizeWrapper>
              <div style={{ width: "2rem", position: "relative" }}>
                <input
                  ref={inputRef}
                  defaultValue={
                    popupData?.styleData?.fontSize
                      ? popupData?.styleData?.fontSize
                      : 16
                  }
                  //value={fontSize}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const value = e.target.value;
                      changeFontSize(value);
                      setIsFontSizeOpen(false);
                    }
                  }}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^-0-9]/g, "");
                  }}
                  style={{
                    fontSize: "1.6rem",
                    border: "none",
                    outline: "none",
                    width: "100%",
                    background: "none",
                  }}
                />
              </div>
              <div
                onClick={() => {
                  setIsFontSizeOpen(!isFontSizeOpen);
                }}
                style={{ width: "2rem", textAlign: "center" }}
              >
                ▼
              </div>
            </TextSizeWrapper>
          </TextMenu>
          <div
            style={{
              position: "absolute",
              width: "90%",
              height: !isFontSizeOpen ? "0px" : "17rem",
              transition: "0.1s",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                border: "1px solid rgba(55, 53, 47, 0.2)",
                overflow: "scroll",
                height: "100%",
                background: "white",
              }}
            >
              {sizeList.map((size, index) => (
                <TextSizeOption
                  key={index}
                  onClick={() => {
                    changeFontSize(size);
                  }}
                >
                  {size}
                </TextSizeOption>
              ))}
            </div>
          </div>
        </div>
        <div>
          <TextMenu
            onClick={() => {
              setIsSketchOpen(!isSketchOpen);
            }}
          >
            A
            <div
              style={{
                width: "3rem",
                height: "1.2rem",
                borderRadius: "0.2rem",
                background: color,
                border: "1px solid rgba(55, 53, 47, 0.2)",
              }}
            ></div>
          </TextMenu>
          {isSketchOpen ? (
            <div
              className="color-sketch"
              style={{ position: "absolute", marginTop: "0.2rem" }}
            >
              <SketchPicker
                color={color}
                onChange={(e) => {
                  const rgba = e.rgb;
                  const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
                  setColor(rgbaText);
                  changeColor(rgbaText);
                }}
                onChangeComplete={async (e) => {
                  const rgba = e.rgb;
                  const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
                  changeColor(rgbaText);
                  const selection = window.getSelection();

                  const style = { color: rgbaText };

                  checkStyleIndex(selection, style);
                  await axios.post("/api/editor/style/save", {
                    uuid: uuid,
                    color: rgbaText,
                  });
                }}
              />
            </div>
          ) : null}
        </div>
        <div>
          <TextMenu
            onClick={() => {
              setIsBackgroundSketchOpen(!isBackgroundSketchOpen);
            }}
          >
            배경
            <div
              style={{
                width: "3rem",
                height: "1.2rem",
                borderRadius: "0.2rem",
                background: background,
                border: "1px solid rgba(55, 53, 47, 0.2)",
              }}
            ></div>
          </TextMenu>
          {isBackgroundSketchOpen ? (
            <div
              className="background-sketch"
              style={{ position: "absolute", marginTop: "0.2rem" }}
            >
              <SketchPicker
                color={background}
                onChange={(e) => {
                  const rgba = e.rgb;
                  const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
                  setBackground(rgbaText);
                  changeBackground(rgbaText);
                }}
                onChangeComplete={async (e) => {
                  const rgba = e.rgb;
                  const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
                  changeBackground(rgbaText);
                  await axios.post("/api/editor/style/save", {
                    uuid: uuid,
                    background: rgbaText,
                  });
                }}
              />
            </div>
          ) : null}
        </div>
        <div style={{ fontWeight: "bold" }}>
          <TextMenu
            border={bold}
            onClick={async () => {
              setBold(!bold);
              modifyEditDom(
                popupData.uuid,
                {
                  styleData: { ...popupData?.styleData, bold: !bold },
                },
                "style"
              );
              await axios.post("/api/editor/style/save", {
                uuid: uuid,
                bold: !bold,
              });
            }}
          >
            B
          </TextMenu>
        </div>
        <div style={{ fontStyle: "italic" }}>
          <TextMenu
            border={italic}
            onClick={async () => {
              setItalic(!italic);
              modifyEditDom(
                popupData.uuid,
                {
                  styleData: { ...popupData?.styleData, italic: !italic },
                },
                "style"
              );
              await axios.post("/api/editor/style/save", {
                uuid: uuid,
                italic: !italic,
              });
            }}
          >
            i
          </TextMenu>
        </div>
        <div>
          <TextMenu
            border={underLine}
            onClick={async () => {
              setUnderLine(!underLine);
              modifyEditDom(
                popupData.uuid,
                {
                  styleData: { ...popupData?.styleData, underLine: !underLine },
                },
                "style"
              );

              await axios.post("/api/editor/style/save", {
                uuid: uuid,
                underLine: !underLine,
              });
            }}
          >
            U
          </TextMenu>
        </div>
        <div style={{ textDecoration: "line-through" }}>
          <TextMenu
            border={strikethrough}
            onClick={async () => {
              setStrikethrough(!strikethrough);
              modifyEditDom(
                popupData.uuid,
                {
                  styleData: {
                    ...popupData?.styleData,
                    strikethrough: !strikethrough,
                  },
                },
                "style"
              );

              await axios.post("/api/editor/style/save", {
                uuid: uuid,
                strikethrough: !strikethrough,
              });
            }}
          >
            S
          </TextMenu>
        </div>
      </TextMenuWrapper>
      <div style={{ padding: "0.5rem" }}>
        <Menu
          onClick={(e) => {
            deleteMenu();
          }}
        >
          삭제
        </Menu>
        <Menu
          onClick={(e) => {
            changeMenu();
          }}
        >
          변경
        </Menu>
      </div>
    </ContextMenuWarpper>
  );
};

export default ContextMenuPopup;
