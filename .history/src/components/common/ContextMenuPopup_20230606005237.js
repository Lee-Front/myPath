import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { SketchPicker } from "react-color";
import { useEffect } from "react";
import SubContextMenu from "./SubContextMenu";

// 폰트 사이즈 목록
const sizeList = [10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const ContextMenuPopup = ({
  pointer,
  changeContextMenuYn,
  updateElement,
  deleteElement,
  changeElementStyle,
  popupData,
}) => {
  const [uuid, setUuid] = useState(popupData?.uuid);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [isSketchOpen, setIsSketchOpen] = useState(false);
  const [isBackgroundSketchOpen, setIsBackgroundSketchOpen] = useState(false);

  const [color, setColor] = useState(null);
  const [background, setBackground] = useState(null);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underLine, setUnderLine] = useState(false);
  const [strikethrough, setStrikethrough] = useState(false);

  const [selectMenu, setSelectMenu] = useState(null);
  const contextRef = useRef();
  const inputRef = useRef();
  const fontRef = useRef();

  useEffect(() => {
    const target = document.querySelector(`[data-uuid="${uuid}"]`);
    const editableTag = target?.querySelector(`[name="editable-tag"]`);

    if (!editableTag) {
      return;
    }

    const selection = window.getSelection();
    let nodes = Array.from(editableTag.childNodes);

    // Range인 경우에는 시작부터 끝에 해당하는 node들을 넣어줘야함
    if (selection.type === "Range") {
      let startNode = selection.baseNode;
      let endNode = selection.extentNode;

      if (startNode.parentElement.nodeName === "SPAN") {
        startNode = startNode.parentElement;
      }

      if (endNode.parentElement.nodeName === "SPAN") {
        endNode = endNode.parentElement;
      }
      let startNodeIndex = nodes.indexOf(startNode);
      let endNodeIndex = nodes.indexOf(endNode);

      if (startNodeIndex > endNodeIndex) {
        [startNodeIndex, endNodeIndex] = [endNodeIndex, startNodeIndex];
      }
      nodes = nodes.filter(
        (_, index) => startNodeIndex <= index && index <= endNodeIndex
      );
    }

    const styleArray = nodes.map((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return {}; // #text 노드는 빈 객체를 반환
      }
      const styleText = node?.getAttribute("style");
      if (styleText) {
        const styleObj = {};
        styleText.split(";").forEach((item) => {
          const [key, value] = item.split(":");
          if (key && value) {
            styleObj[key.trim()] = value.trim();
          }
        });
        return styleObj;
      }
    });

    const commonStyles = styleArray.reduce((acc, cur) => {
      if (Object.keys(acc).length === 0) {
        return cur; // 초기값 설정
      }
      return Object.keys(cur).reduce((result, key) => {
        if (acc[key] === cur[key]) {
          result[key] = acc[key];
        }
        return result;
      }, {});
    }, {});

    setColor(commonStyles["color"] || "");
    setBold(!!commonStyles["font-weight"]);
    setItalic(!!commonStyles["font-style"]);
    setUnderLine(!!commonStyles["border-bottom"]);
    setStrikethrough(!!commonStyles["text-decoration"]);

    if (selection.type === "Caret") {
      // 배경색상만 선택 타입이 Caret이면 태그 자체에 적용된걸 가져옴
      setBackground(popupData?.styleData?.background || "");
    } else {
      setBackground(commonStyles["background-color"] || "");
    }
  }, []);

  const deleteMenu = () => {
    deleteElement(popupData.uuid);
    changeContextMenuYn(false);
  };

  const changeMenu = () => {
    const tagName = prompt("tagName", "div");
    updateElement(popupData.uuid, { tagName: tagName });
    changeContextMenuYn(false);
  };

  const createFullRange = (nodes) => {
    const range = document.createRange();
    let startNode = nodes[0];
    let endNode = nodes[nodes.length - 1];

    if (startNode.nodeName === "SPAN") {
      startNode = startNode.firstChild;
    }

    if (endNode.nodeName === "SPAN") {
      endNode = endNode.firstChild;
    }
    range.setStart(startNode, 0);
    range.setEnd(endNode, endNode.length);

    return range;
  };

  const changeTextStyle = (style) => {
    const selection = window.getSelection();

    const target = document.querySelector(`[data-uuid="${uuid}"]`);
    const editableTag = target.querySelector(".editable-tag");
    if (!editableTag) {
      return;
    }
    const nodes = Array.from(editableTag.childNodes);

    const isSelectionFull = selection.type === "Caret";

    const range = isSelectionFull
      ? createFullRange(nodes)
      : selection.getRangeAt(0);

    const newHtmlData = makeNewHtml(nodes, range, style);

    while (editableTag.firstChild) {
      editableTag.removeChild(editableTag.firstChild);
    }

    newHtmlData.html.forEach((node) => {
      editableTag.appendChild(node);
    });

    updateElement(uuid, {
      html: editableTag.innerHTML,
    });

    if (!isSelectionFull) {
      setCaretPosition(editableTag, newHtmlData);
    }
  };

  const makeNewHtml = (nodes, range, style) => {
    const nodeList = []; // nodes를 데이터로 변환하여 담을 목록
    const newNodeList = []; // nodeList를 돌면서 바뀌는 nodeData를 담을 목록
    const newStyleList = Object.keys(style);
    const returnData = {};

    // 일단 현재 style, text 정보를 담음
    nodes.map((node) => {
      const nodeObject = {};

      nodeObject.nodeName = node.nodeName;
      nodeObject.style = {};
      nodeObject.link = "";

      // 하이퍼링크 즉 A태그인 경우 span만 따다가 데이터화 시켜준다
      if (node.nodeName === "A") {
        nodeObject.link = node.href;
        node = node.firstChild;
      }

      if (node.nodeName === "SPAN") {
        const styleList = node
          .getAttribute("style")
          .split(";")
          .filter((text) => text !== "");

        nodeObject.textContent = node.innerText;

        for (let i = 0; i < styleList.length; i++) {
          const [property, value] = styleList[i].split(":");
          nodeObject.style[property] = value;
        }
      } else {
        nodeObject.textContent = node.textContent;
      }

      nodeList.push(nodeObject);
    });

    let newHtml = [];

    const { startOffset, endOffset, startContainer, endContainer } = range;

    let startNode = startContainer;
    let endNode = endContainer;

    if (startNode.parentElement.nodeName === "SPAN") {
      startNode = startNode.parentElement;
    }

    if (endNode.parentElement.nodeName === "SPAN") {
      endNode = endNode.parentElement;
    }

    let startNodeIndex = nodes.indexOf(startNode);
    let endNodeIndex = nodes.indexOf(endNode);

    if (startNodeIndex > endNodeIndex) {
      let temp = startNodeIndex;
      startNodeIndex = endNodeIndex;
      endNodeIndex = temp;
    }

    returnData.startNodeIndex = startNodeIndex;
    returnData.endNodeIndex = endNodeIndex;
    returnData.startOffset = startOffset;
    returnData.endOffset = endOffset;

    // index 골라서 넘겨주고 selection 새로잡는걸로 수정해야됨
    for (let i = 0; i < nodeList.length; i++) {
      const nodeData = nodeList[i];
      if (startNodeIndex <= i && i <= endNodeIndex) {
        // 선택된 범위안의 node 들

        const textContent = nodeData.textContent;
        //const prevStyleKeys = Object.keys(nodeData.style);

        if (startNodeIndex === endNodeIndex) {
          const prevText = textContent.slice(0, startOffset);
          const nextText = textContent.slice(endOffset, textContent.length);

          // prevNode 배열에 추가
          if (prevText.length > 0) {
            // prevText가 있다는건 분리를 시켜줘야 한다는뜻임
            returnData.startNodeIndex += 1;
            returnData.startOffset = 0;
            // 한덩어리에서 나눠지는 경우에만 endOffset이 당겨질수있음
            returnData.endNodeIndex += 1;
            returnData.endOffset -= prevText.length;

            let splitNode = JSON.parse(JSON.stringify(nodeData));
            splitNode.textContent = prevText;
            newNodeList.push(splitNode);
          }

          newNodeList.push(nodeData);

          if (nextText.length > 0) {
            const splitNode = JSON.parse(JSON.stringify(nodeData));
            splitNode.textContent = nextText;
            newNodeList.push(splitNode);
          }

          // 스타일 Object 형식으로 바꾸는 작업해야됨
          // 변경된 기존 nodeData를 배열에 추가
          nodeData.textContent = textContent.slice(startOffset, endOffset);
          // 새로운 스타일을 선택된 영역의 nodeData에 넣어줌
          for (let i = 0; i < newStyleList.length; i++) {
            const styleName = newStyleList[i];
            if (styleName === "link") {
              nodeData.link = style[styleName];
            } else {
              if (style[styleName] === "") {
                delete nodeData.style[styleName];
              } else {
                nodeData.style[styleName] = style[styleName];
              }
            }
          }
        } else if (i === startNodeIndex) {
          // 변경되는 시작 노드
          // prevText가 있으면 둘로 쪼개주는것만 진행하면됨
          // 어차피 style일 관련한 통합은 마지막에 다시 할거임
          const prevText = textContent.slice(0, startOffset);

          if (prevText.length > 0) {
            // prevText가 있다는건 분리를 시켜줘야 한다는뜻임
            returnData.startNodeIndex += 1;
            returnData.startOffset = 0;
            returnData.endNodeIndex += 1;
            let splitNode = JSON.parse(JSON.stringify(nodeData));
            splitNode.textContent = prevText;
            newNodeList.push(splitNode);
          }

          nodeData.textContent = textContent.slice(
            startOffset,
            textContent.length
          );

          // 새로운 스타일을 선택된 영역의 nodeData에 넣어줌

          for (let i = 0; i < newStyleList.length; i++) {
            const styleName = newStyleList[i];
            if (styleName === "link") {
              nodeData.link = style[styleName];
            } else {
              if (style[styleName] === "") {
                delete nodeData.style[styleName];
              } else {
                nodeData.style[styleName] = style[styleName];
              }
            }
          }

          newNodeList.push(nodeData);
        } else if (i === endNodeIndex) {
          const nextText = textContent.slice(endOffset, textContent.length);

          nodeData.textContent = textContent.slice(0, endOffset);
          newNodeList.push(nodeData);

          if (nextText.length > 0) {
            const splitNode = JSON.parse(JSON.stringify(nodeData));
            splitNode.textContent = nextText;
            newNodeList.push(splitNode);
          }

          // 새로운 스타일을 선택된 영역의 nodeData에 넣어줌
          for (let i = 0; i < newStyleList.length; i++) {
            const styleName = newStyleList[i];
            if (styleName === "link") {
              nodeData.link = style[styleName];
            } else {
              if (style[styleName] === "") {
                delete nodeData.style[styleName];
              } else {
                nodeData.style[styleName] = style[styleName];
              }
            }
          }
        } else {
          // 중간에 끼어있는 node이기 때문에 전체가 해당된다 나눠줄 필요가 없음
          for (let i = 0; i < newStyleList.length; i++) {
            const styleName = newStyleList[i];
            if (styleName === "link") {
              nodeData.link = style[styleName];
              //nodeData.style["border-bottom"]
            } else {
              if (style[styleName] === "") {
                delete nodeData.style[styleName];
              } else {
                nodeData.style[styleName] = style[styleName];
              }
            }
          }
          newNodeList.push(nodeData);
        }
      } else {
        newNodeList.push(nodeData);
      }
    }

    const currentNodeData = JSON.parse(JSON.stringify(returnData));

    const mergedNodeList = newNodeList.reduce((acc, current, index) => {
      if (
        JSON.stringify(acc[acc.length - 1]?.style) ===
        JSON.stringify(current.style)
      ) {
        // 1. 시작 노드 순번보다 앞인경우
        // 2. 시작 노드
        // 3. 시작 노드보다 크고 종료 노드와 같거나 작은 경우
        //현재 순번이 시작 노드보다 이전이거나 같으면 합쳐진만큼 index를 당겨야됨
        if (index < currentNodeData.startNodeIndex) {
          returnData.startNodeIndex -= 1;
          returnData.endNodeIndex -= 1;
        } else if (index === currentNodeData.startNodeIndex) {
          // 현재 순번이 시작 노드 순번이라면
          // offset에 이전 text의 길이만큼 추가
          returnData.startNodeIndex -= 1;
          returnData.endNodeIndex -= 1;
          returnData.startOffset += newNodeList[index - 1].textContent.length;
          returnData.endOffset += newNodeList[index - 1].textContent.length;
        } else if (
          currentNodeData.startNodeIndex < index &&
          currentNodeData.endNodeIndex > index
        ) {
          returnData.endNodeIndex -= 1;
          returnData.endOffset += newNodeList[index - 1].textContent.length;
        } else if (index === currentNodeData.endNodeIndex) {
          returnData.endNodeIndex -= 1;
          returnData.endOffset += newNodeList[index - 1].textContent.length;
        }

        acc[acc.length - 1].textContent += current.textContent;
      } else {
        acc.push(current);
      }
      return acc;
    }, []);

    mergedNodeList.map((node) => {
      const styleKeys = Object.keys(node.style);
      if (styleKeys.length > 0) {
        let newStyle = "";
        styleKeys.map((nodeStyle) => {
          newStyle += nodeStyle + ":" + node.style[nodeStyle] + ";";
        });
        if (node.link.length > 0) {
          const linkTag = document.createElement("a");
          linkTag.target = "_black";
          linkTag.style.cssText =
            "opacity: 0.7; cursor: pointer; color: inherit; font-weight: 600; text-decoration: inherit;";
          linkTag.innerHTML = `<span style="${newStyle}">${node.textContent}</span>`;
          linkTag.href = `http://${node.link}`;
          linkTag.addEventListener("click", function (e) {
            e.preventDefault(); // 링크의 기본 동작 차단
            const href = e.currentTarget?.getAttribute("href");
            if (href) {
              window.open(href, "_blank");
            }
          });
          //newHtml += `<a href="http://${node.link}" target="_blank" style="opacity:0.7; cursor:pointer;color:inherit;font-weight:600;text-decoration:inherit;"><span style="${newStyle}">${node.textContent}</span></a>`;
          //newHtml += linkTag.outerHTML;
          newHtml.push(linkTag);
        } else {
          const spanTag = document.createElement("span");
          spanTag.style.cssText = newStyle;
          spanTag.innerText = node.textContent;
          newHtml.push(spanTag);
          // += `<span style="${newStyle}">${node.textContent}</span>`;
        }
      } else {
        //newHtml += `${node.textContent}`;
        const textTag = document.createTextNode(node.textContent);
        newHtml.push(textTag);
      }
    });
    returnData.html = newHtml;

    return returnData;
  };

  const setCaretPosition = (target, newHtmlData) => {
    const nodes = target.childNodes;
    const { startNodeIndex, endNodeIndex, startOffset, endOffset } =
      newHtmlData;
    const newRange = document.createRange();
    let startNode = nodes[startNodeIndex];
    let endNode = nodes[endNodeIndex];

    // 가장 마지막인 text까지 가야됨
    while (startNode.firstChild) {
      startNode = startNode.firstChild;
    }

    while (endNode.firstChild) {
      endNode = endNode.firstChild;
    }

    newRange.setStart(startNode, startOffset);
    newRange.setEnd(endNode, endOffset);
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

    if (newValue >= 10) {
      changeElementStyle(popupData.uuid, {
        ...popupData?.styleData,
        fontSize: newValue,
      });
    }

    await axios.post("/api/editor/style", {
      uuid: uuid,
      fontSize: newValue,
    });
  };

  const changeColor = async (modifyColor) => {
    if (popupData?.styleData?.color !== modifyColor) {
      changeElementStyle(popupData.uuid, {
        ...popupData?.styleData,
        color: modifyColor,
      });
    }
  };

  const changeBackground = async (modifyColor) => {
    if (popupData?.styleData?.background !== modifyColor) {
      changeElementStyle(popupData.uuid, {
        ...popupData?.styleData,
        background: modifyColor,
      });
    }
  };

  const changeTextAlignment = async (modifyAlign) => {
    if (popupData?.styleData?.textAlign !== modifyAlign) {
      changeElementStyle(popupData.uuid, {
        ...popupData?.styleData,
        textAlign: modifyAlign,
      });

      await axios.post("/api/editor/style", {
        uuid: uuid,
        textAlign: modifyAlign,
      });
    }
  };

  const changeSelectSubMenu = (subMenu) => {
    if (subMenu !== fontRef.current && isFontSizeOpen) {
      setIsFontSizeOpen(false);
    }
    setSelectMenu(subMenu);
  };

  return (
    <ContextMenuWarpper
      ref={contextRef}
      pointer={pointer}
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
          <TextMenu
            ref={fontRef}
            onMouseEnter={(e) => changeSelectSubMenu(e.currentTarget)}
          >
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
            onMouseEnter={(e) => changeSelectSubMenu(e.currentTarget)}
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
                  const style = { color: rgbaText };
                  changeTextStyle(style);
                }}
                onChangeComplete={async (e) => {
                  const rgba = e.rgb;
                  const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;

                  const style = { color: rgbaText };
                  changeTextStyle(style);

                  await axios.post("/api/editor/style", {
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
            onMouseEnter={(e) => changeSelectSubMenu(e.currentTarget)}
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

                  const selection = window.getSelection();
                  if (selection.type === "Caret") {
                    changeBackground(rgbaText);
                  } else {
                    const style = { "background-color": rgbaText };
                    changeTextStyle(style);
                  }
                }}
                onChangeComplete={async (e) => {
                  const rgba = e.rgb;
                  const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;

                  const selection = window.getSelection();
                  if (selection.type === "Caret") {
                    changeBackground(rgbaText);
                    await axios.post("/api/editor/style", {
                      uuid: uuid,
                      background: rgbaText,
                    });
                  } else {
                    const style = { "background-color": rgbaText };
                    changeTextStyle(style);
                  }
                }}
              />
            </div>
          ) : null}
        </div>
        <div style={{ fontWeight: "bold" }}>
          <TextMenu
            onMouseEnter={(e) => changeSelectSubMenu(e.currentTarget)}
            border={bold}
            onClick={async () => {
              setBold(!bold);

              const style = { "font-weight": !bold ? "bold" : "" };
              changeTextStyle(style);

              await axios.post("/api/editor/style", {
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
            onMouseEnter={(e) => changeSelectSubMenu(e.currentTarget)}
            border={italic}
            onClick={async () => {
              setItalic(!italic);

              const style = { "font-style": !italic ? "italic" : "" };
              changeTextStyle(style);

              await axios.post("/api/editor/style", {
                uuid: uuid,
                italic: !italic,
              });
            }}
          >
            i
          </TextMenu>
        </div>
        <div style={{ textDecoration: "underline" }}>
          <TextMenu
            onMouseEnter={(e) => changeSelectSubMenu(e.currentTarget)}
            border={underLine}
            onClick={async () => {
              setUnderLine(!underLine);

              const style = {
                "border-bottom": !underLine ? "0.1rem solid" : "",
              };
              changeTextStyle(style);

              await axios.post("/api/editor/style", {
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
            onMouseEnter={(e) => changeSelectSubMenu(e.currentTarget)}
            border={strikethrough}
            onClick={async () => {
              setStrikethrough(!strikethrough);

              const style = {
                "text-decoration": !strikethrough ? "line-through" : "",
              };
              changeTextStyle(style);

              await axios.post("/api/editor/style", {
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
        <SubContextMenu
          selectMenu={selectMenu}
          changeSelectSubMenu={changeSelectSubMenu}
          menuText="삭제"
          onClick={() => {
            deleteMenu();
          }}
        />
        <SubContextMenu
          selectMenu={selectMenu}
          changeSelectSubMenu={changeSelectSubMenu}
          menuText="변경"
          onClick={() => {
            changeMenu();
          }}
        />
        <SubContextMenu
          selectMenu={selectMenu}
          changeSelectSubMenu={changeSelectSubMenu}
          menuText="정렬"
          subMenuList={[
            {
              text: "왼쪽",
              isSelect: popupData?.styleData?.textAlign === "flex-start",
              event: () => {
                changeTextAlignment("start");
              },
            },
            {
              text: "가운데",
              isSelect: popupData?.styleData?.textAlign === "center",
              event: function () {
                changeTextAlignment("center");
              },
            },
            {
              text: "오른쪽",
              isSelect: popupData?.styleData?.textAlign === "flex-end",
              event: function () {
                changeTextAlignment("end");
              },
            },
          ]}
        />
        <SubContextMenu
          selectMenu={selectMenu}
          changeSelectSubMenu={changeSelectSubMenu}
          menuText="링크"
          onClick={() => {
            const link = prompt("링크를 입력해주세요");
            // 일단 임시로 prompt로 링크 받아오고 나중에 디자인 나오면 팝업을 하나 더 띄우던가 해서 링크받는걸로

            if (link && link.length > 0) {
              const style = {
                link: link,
                "border-bottom": "0.1rem solid",
                "border-color": "rgba(55,53,47,0.4)",
              };
              changeTextStyle(style);
            }
          }}
        />
      </div>
    </ContextMenuWarpper>
  );
};

export default ContextMenuPopup;

const ContextMenuWarpper = styled.div`
  position: absolute;
  width: 30rem;
  left: ${(props) => props.pointer.x + "px"};
  top: ${(props) => props.pointer.y + "px"};
  border-radius: 0.5rem;

  border: 1px solid rgba(55, 53, 47, 0.2);
  background: white;
`;

const TextMenuWrapper = styled.div`
  position: relative;
  z-index: 1;
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
