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
      const { startOffset, endOffset } = range;
      let newHtml = "";

      console.log({ startOffset, endOffset });

      const nodes = Array.from(editableTag.childNodes);
      console.log("range: ", range);
      console.log("range: ", range.startContainer);
      console.log("range: ", range.endContainer);
      newHtml = makeNewHtml(nodes, range, style);

      // 일단 여기에서만 돌게 넣어둠
      modifyEditDom(uuid, {
        html: newHtml,
      });

      editableTag.innerHTML = newHtml;

      setCaretPosition(editableTag, startOffset, endOffset);
    } else {
      console.log("전체");
    }
  };

  const makeNewHtml = (nodes, range, style) => {
    const newNodeList = [];
    const newStyleList = Object.keys(style);
    const returnData = {};

    // 일단 현재 style, text 정보를 담음
    nodes.map((node) => {
      const nodeObject = {};
      nodeObject.nodeName = node.nodeName;
      nodeObject.style = [];
      if (node.nodeName === "SPAN") {
        nodeObject.textContent = node.innerText;

        for (let i = 0; i < node?.style?.length; i++) {
          const styleName = node.style[i];
          nodeObject.style.push({ [styleName]: node.style[styleName] });
        }
      } else {
        nodeObject.textContent = node.textContent;
      }

      newNodeList.push(nodeObject);
    });

    let newHtml = "";

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

    returnData.startNodeIndex = startNodeIndex;
    returnData.endNodeIndex = endNodeIndex;

    for (let i = 0; i < newNodeList.length; i++) {
      if (startNodeIndex <= i && i <= endNodeIndex) {
        // 선택된 범위안의 node 들
        const nodeData = newNodeList[i];
        const textContent = nodeData.textContent;
        if (startNodeIndex === endNodeIndex) {
          const prevText = textContent.slice(0, startOffset);
          const nextText = textContent.slice(endOffset, textContent.length);

          if (prevText.length > 0) {
            // prevText가 있다는건 분리를 시켜줘야 한다는뜻임
            const splitNode = JSON.parse(JSON.stringify(nodeData));
            splitNode.textContent = prevText;
            newNodeList.splice(i, 0, splitNode);
          }

          if (nextText.length > 0) {
            const splitNode = JSON.parse(JSON.stringify(nodeData));
            splitNode.textContent = nextText;
            const nodeDataIndex = newNodeList.findIndex(
              (node) => node === nodeData
            );
            newNodeList.splice(nodeDataIndex + 1, 0, splitNode);
          }

          nodeData.textContent = textContent.slice(startOffset, endOffset);

          // 새로운 스타일을 선택된 영역의 nodeData에 넣어줌
          for (let i = 0; i < newStyleList.length; i++) {
            const styleName = newStyleList[i];
            nodeData.style.push({ [styleName]: style[styleName] });
          }
        } else if (i === startNodeIndex) {
          // 변경되는 시작 노드
          // prevText가 있으면 둘로 쪼개주는것만 진행하면됨
          // 어차피 style일 관련한 통합은 마지막에 다시 할거임
          const prevText = textContent.slice(0, startOffset);

          if (prevText.length > 0) {
            // prevText가 있다는건 분리를 시켜줘야 한다는뜻임
            const splitNode = JSON.parse(JSON.stringify(nodeData));
            splitNode.textContent = prevText;
            newNodeList.splice(i, 0, splitNode);
          }

          nodeData.textContent = textContent.slice(
            startOffset,
            textContent.length
          );

          // 새로운 스타일을 선택된 영역의 nodeData에 넣어줌
          for (let i = 0; i < newStyleList.length; i++) {
            nodeData?.style.map((data, index) => {
              const styleName = newStyleList[i];
              const keys = Object.keys(data);
              if (keys.includes(styleName)) {
                nodeData.style[index][styleName] = style[styleName];
              } else {
                nodeData.style.push({ [styleName]: style[styleName] });
              }
            });
          }
        } else if (i === endNodeIndex) {
          const nextText = textContent.slice(endOffset, textContent.length);

          if (nextText.length > 0) {
            const splitNode = JSON.parse(JSON.stringify(nodeData));
            splitNode.textContent = nextText;
            const nodeDataIndex = newNodeList.findIndex(
              (node) => node === nodeData
            );
            newNodeList.splice(nodeDataIndex + 1, 0, splitNode);
          }

          nodeData.textContent = textContent.slice(0, endOffset);

          // 새로운 스타일을 선택된 영역의 nodeData에 넣어줌
          for (let i = 0; i < newStyleList.length; i++) {
            nodeData?.style.map((data, index) => {
              const styleName = newStyleList[i];
              const keys = Object.keys(data);
              if (keys.includes(styleName)) {
                nodeData.style[index][styleName] = style[styleName];
              } else {
                nodeData.style.push({ [styleName]: style[styleName] });
              }
            });
          }
        } else {
          // 중간에 끼어있는 node이기 때문에 전체가 해당된다 나눠줄 필요가 없음
          for (let i = 0; i < newStyleList.length; i++) {
            nodeData?.style.map((data, index) => {
              const styleName = newStyleList[i];
              const keys = Object.keys(data);
              if (keys.includes(styleName)) {
                nodeData.style[index][styleName] = style[styleName];
              } else {
                nodeData.style.push({ [styleName]: style[styleName] });
              }
            });
          }
        }
      }
    }

    const mergedNodeList = newNodeList.reduce((acc, current) => {
      if (
        JSON.stringify(acc[acc.length - 1]?.style) ===
        JSON.stringify(current.style)
      ) {
        console.log("current1 : ", current);
        console.log("startNode1 : ", startNode);
        console.log("endNode1 : ", endNode);
        console.log("current1 startNode : ", current === startNode);
        console.log("current1 endNode : ", current === endNode);
        acc[acc.length - 1].textContent += current.textContent;
      } else {
        console.log("current2 : ", current);
        console.log("startNode2 : ", startNode);
        console.log("endNode2 : ", endNode);
        console.log("current2 startNode : ", current === startNode);
        console.log("current2 endNode : ", current === endNode);
        acc.push(current);
      }
      return acc;
    }, []);

    mergedNodeList.map((node) => {
      if (node.style.length > 0) {
        let newStyle = "";
        node.style.map((nodeStyle) => {
          Object.keys(nodeStyle).forEach((key) => {
            newStyle += key + ":" + nodeStyle[key] + ";";
          });
        });

        newHtml += `<span style="${newStyle}">${node.textContent}</span>`;
      } else {
        newHtml += `${node.textContent}`;
      }
    });

    returnData.html = newHtml;
    returnData.startNodeIndex = startNodeIndex;
    returnData.endNodeIndex = endNodeIndex;

    return newHtml;
  };

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

    console.log("newRange: ", newRange);

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
