import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { useEffect } from "react";
import SubContextMenu from "./SubContextMenu";
import ColorPicker from "../../../common/ColorPicker";
import useEditorStore from "../../../../stores/useEditorStore";
import TextMenuButton from "./TextMenuButton";
import FontSizeSelector from "./FontSizeSelector";
import TextColorMenu from "./TextColorMenu";

// 폰트 사이즈 목록

const ContextMenuPopup = ({
  pointer,
  changeContextMenuYn,
  updateElement,
  deleteElement,
  popupData,
}) => {
  const editorStore = useEditorStore();
  const [uuid, setUuid] = useState(popupData?.uuid);
  const [isBackgroundSketchOpen, setIsBackgroundSketchOpen] = useState(false);

  const [color, setColor] = useState(null);
  const [background, setBackground] = useState(null);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underLine, setUnderLine] = useState(false);
  const [strikethrough, setStrikethrough] = useState(false);

  const [selectMenu, setSelectMenu] = useState(null);
  const contextRef = useRef();

  const fontRef = useRef();

  useEffect(() => {
    const target = document.querySelector(`[data-uuid="${uuid}"]`);
    const editableTag = target?.querySelector("[name=editable-tag]");

    if (!editableTag) {
      return;
    }

    const selection = window.getSelection();
    const nodes = Array.from(editableTag.childNodes);

    let styleData = {};
    // Range인 경우에는 시작부터 끝에 해당하는 node들을 넣어줘야함
    if (selection.type === "Range") {
      const selectNodes = getSelectNodes(nodes, selection);
      const nodesStyle = getNodesData(selectNodes);
      const commonStyles = getCommonAttributes(nodesStyle);
      styleData = Object.assign(styleData, commonStyles);
    } else {
      styleData = Object.assign(styleData, popupData?.style);
    }

    setColor(styleData["color"] || "");
    setBackground(styleData["background"] || "");
    setBold(!!styleData["font-weight"]);
    setItalic(!!styleData["font-style"]);
    setUnderLine(!!styleData["border-bottom"]);
    setStrikethrough(!!styleData["text-decoration"]);
  }, []);

  const getCommonAttributes = (array) => {
    const styles = array?.map((item) => JSON.parse(JSON.stringify(item.style)));
    // styles없으면 그냥 빈 객체 반환
    return styles.length > 0
      ? styles?.reduce((acc, cur) => {
          Object.keys(acc).forEach((key) => {
            if (!cur.hasOwnProperty(key) || cur[key] !== acc[key]) {
              delete acc[key];
            }
          });
          return acc;
        })
      : {};
  };

  const getSelectNodes = (nodes, selection) => {
    let startNode = selection.baseNode;
    let endNode = selection.extentNode;

    while (startNode.parentElement.nodeName !== "DIV") {
      startNode = startNode.parentElement;
    }
    while (endNode.parentElement.nodeName !== "DIV") {
      endNode = endNode.parentElement;
    }

    let startNodeIndex = nodes.indexOf(startNode);
    let endNodeIndex = nodes.indexOf(endNode);

    if (startNodeIndex > endNodeIndex) {
      [startNodeIndex, endNodeIndex] = [endNodeIndex, startNodeIndex];
    }

    return nodes.filter(
      (_, index) => startNodeIndex <= index && index <= endNodeIndex
    );
  };

  const deleteMenu = () => {
    deleteElement(popupData.uuid);
    changeContextMenuYn(false);
  };

  const changeMenu = () => {
    const tagName = prompt("tagName", "div");
    updateElement(popupData.uuid, { tagName: tagName });
    changeContextMenuYn(false);
  };

  const changeTextStyle = (blockUuid, style) => {
    const selection = window.getSelection();

    if (selection.type === "Caret") {
      fullChangeTextStyle(blockUuid, style);
    } else {
      partialChangeTextStyle(blockUuid, style);
    }
  };

  const partialChangeTextStyle = (blockUuid, style) => {
    const target = document.querySelector(`[data-uuid="${blockUuid}"]`);
    const editableTag = target.querySelector("[name=editable-tag]");
    if (!editableTag) {
      return;
    }

    const nodes = Array.from(editableTag.childNodes);

    //const isFullSelection = selection.type === "Caret";
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    const newHtmlData = makeNewHtml(nodes, range, style);

    //대상 내용물 삭제
    while (editableTag.firstChild) {
      editableTag.removeChild(editableTag.firstChild);
    }

    newHtmlData.html.forEach((node) => {
      editableTag.appendChild(node);
    });

    updateElement(blockUuid, {
      html: editableTag.innerHTML,
    });
    setCaretPosition(editableTag, newHtmlData);
  };

  const fullChangeTextStyle = async (blockUuid, style) => {
    editorStore.changeBlockStyle(blockUuid, {
      ...style,
    });

    await axios.post("/api/editor/style", {
      uuid: blockUuid,
      ...style,
    });
  };

  const makeNewHtml = (nodes, range, style) => {
    const nodeDatas = getNodesData(nodes); // nodes를 데이터로 변환하여 담을 목록
    const dragInfo = {};

    const { startOffset, endOffset, startContainer, endContainer } = range;

    let startNode = startContainer;
    let endNode = endContainer;

    while (startNode.parentElement.nodeName !== "DIV") {
      startNode = startNode.parentElement;
    }
    while (endNode.parentElement.nodeName !== "DIV") {
      endNode = endNode.parentElement;
    }

    let startNodeIndex = nodes.indexOf(startNode);
    let endNodeIndex = nodes.indexOf(endNode);

    if (startNodeIndex > endNodeIndex) {
      [startNodeIndex, endNodeIndex] = [endNodeIndex, startNodeIndex];
    }

    dragInfo.startNodeIndex = startNodeIndex;
    dragInfo.endNodeIndex = endNodeIndex;
    dragInfo.startOffset = startOffset;
    dragInfo.endOffset = endOffset;

    const { splitedNodeDatas, splitedDragInfo } = splitNodes(
      nodeDatas,
      dragInfo
    );

    const styledNodeDatas = applyStyle(
      splitedNodeDatas,
      style,
      splitedDragInfo
    );

    const { mergedNodeDatas, mergedDragInfo } = mergedNodesWithSameStyle(
      styledNodeDatas,
      splitedDragInfo
    );

    const generatedElements = generateStyledElements(mergedNodeDatas);
    mergedDragInfo.html = generatedElements;

    return mergedDragInfo;
  };

  const getNodesData = (nodes) => {
    return nodes.map((node) => {
      const nodeObject = {};
      nodeObject.nodeName = node.nodeName;
      nodeObject.style = {};

      if (node.nodeName === "A") {
        nodeObject.link = node.href;
        nodeObject.style.link = node.href;
        node = node.firstChild;
      }

      nodeObject.textContent = node.textContent;

      if (node.nodeName === "SPAN") {
        const styleText = node?.getAttribute("style");
        if (styleText) {
          const styleObj = {};
          styleText.split(";").forEach((item) => {
            const [key, value] = item.split(":");
            if (key && value) {
              styleObj[key.trim()] = value.trim();
            }
          });
          nodeObject.style = { ...nodeObject.style, ...styleObj };
        }
      }
      return nodeObject;
    });
  };

  const splitNodes = (nodeDatas, dragInfo) => {
    const splitedNodeDatas = [];
    const copyNodeDatas = JSON.parse(JSON.stringify(nodeDatas));
    const { startNodeIndex, endNodeIndex, startOffset, endOffset } = dragInfo;
    const splitedDragInfo = JSON.parse(JSON.stringify(dragInfo));

    for (let i = 0; i < copyNodeDatas.length; i++) {
      const nodeData = copyNodeDatas[i];
      if (startNodeIndex <= i && i <= endNodeIndex) {
        // 선택된 범위안의 node 들
        const prevText =
          i === startNodeIndex
            ? nodeData.textContent.slice(0, startOffset).trim()
            : "";
        const nextText =
          i === endNodeIndex
            ? nodeData.textContent
                .slice(endOffset, nodeData.textContent.length)
                .trim()
            : "";

        if (prevText.length > 0) {
          nodeData.textContent = nodeData.textContent.slice(startOffset);
          // prevText가 있다는건 분리를 시켜줘야 한다는뜻임
          splitedDragInfo.startNodeIndex += 1;
          splitedDragInfo.startOffset = 0;
          splitedDragInfo.endNodeIndex += 1;

          if (startNodeIndex === endNodeIndex) {
            splitedDragInfo.endOffset -= prevText.length;
          }

          const prevNode = JSON.parse(JSON.stringify(nodeData));
          prevNode.textContent = prevText;
          splitedNodeDatas.push(prevNode);
        }

        splitedNodeDatas.push(nodeData);

        if (nextText.length > 0) {
          nodeData.textContent = nodeData.textContent.slice(
            0,
            splitedDragInfo.endOffset
          );

          const nextNode = JSON.parse(JSON.stringify(nodeData));
          nextNode.textContent = nextText;
          splitedNodeDatas.push(nextNode);
        }
      } else {
        splitedNodeDatas.push(nodeData);
      }
    }

    return { splitedNodeDatas, splitedDragInfo };
  };

  const applyStyle = (splitedNodeDatas, style, splitedDragInfo) => {
    const newStyleList = Object.keys(style);
    return splitedNodeDatas.map((nodeData, index) => {
      if (
        index < splitedDragInfo.startNodeIndex ||
        index > splitedDragInfo.endNodeIndex
      ) {
        return nodeData;
      }

      for (let i = 0; i < newStyleList.length; i++) {
        const styleName = newStyleList[i];
        if (style[styleName] === "") {
          delete nodeData.style[styleName];
        } else {
          nodeData.style[styleName] = style[styleName];
        }
      }
      return nodeData;
    });
  };

  const mergedNodesWithSameStyle = (styledNodeDatas, splitedDragInfo) => {
    console.log("styledNodeDatas: ", styledNodeDatas);
    const mergedDragInfo = JSON.parse(JSON.stringify(splitedDragInfo));
    const mergedNodeDatas = styledNodeDatas.reduce((acc, cur, index) => {
      const curData = JSON.parse(JSON.stringify(cur));
      const prevData = acc[acc.length - 1];
      const prevStyles = Object.keys(prevData?.style || {});
      const curStyles = Object.keys(curData.style || {});

      const isSameStyle =
        prevStyles.length === curStyles.length &&
        prevStyles.every(
          (styleName) => prevData.style[styleName] === curData.style[styleName]
        );

      if (prevData && isSameStyle) {
        if (index <= splitedDragInfo.startNodeIndex) {
          mergedDragInfo.startNodeIndex -= 1;
          mergedDragInfo.endNodeIndex -= 1;
          if (index === splitedDragInfo.startNodeIndex) {
            mergedDragInfo.startOffset += prevData.textContent.length;
            mergedDragInfo.endOffset += prevData.textContent.length;
          }
        } else if (
          splitedDragInfo.startNodeIndex < index &&
          splitedDragInfo.endNodeIndex > index
        ) {
          mergedDragInfo.endNodeIndex -= 1;
        } else if (index === splitedDragInfo.endNodeIndex) {
          mergedDragInfo.endNodeIndex -= 1;
          mergedDragInfo.endOffset += prevData.textContent.length;
        }
        acc[acc.length - 1].textContent += curData.textContent;
      } else {
        acc.push(curData);
      }

      return acc;
    }, []);

    return { mergedNodeDatas, mergedDragInfo };
  };

  const generateStyledElements = (styledNodeDatas) => {
    return styledNodeDatas.map((node) => {
      const { style, textContent } = node;

      for (const nodeStyle in style) {
        if (nodeStyle === "link") {
          node.link = style[nodeStyle];
          delete style[nodeStyle];
        }
      }

      let newElement;
      const styleKeys = Object.keys(style);
      if (styleKeys.length > 0) {
        const newStyle = styleKeys
          .map((styleName) => styleName + ":" + style[styleName] + ";")
          .join("");

        newElement = document.createElement("span");
        newElement.style.cssText = newStyle;
        newElement.innerText = textContent;
      } else {
        newElement = document.createTextNode(textContent);
      }

      if (node.link) {
        const linkTag = document.createElement("a");
        linkTag.className = "link";
        linkTag.target = "_blank";

        linkTag.appendChild(newElement);
        let link = node.link;
        if (!link.startsWith("http://") && !link.startsWith("https://")) {
          linkTag.href = `http://${node.link}`;
        } else {
          linkTag.href = `${node.link}`;
        }

        return linkTag;
      }

      return newElement;
    });
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

  const changeTextAlignment = async (modifyAlign) => {
    const style = { "text-align": modifyAlign };
    changeTextStyle(uuid, style);
  };

  const changeSelectSubMenu = (e) => {
    const subMenu = e.currentTarget;
    setSelectMenu(subMenu);
  };

  const handleClick = (e) => {
    const sketchElement = e.target.closest(".color-sketch");

    if (!sketchElement) {
      if (isBackgroundSketchOpen) {
        setIsBackgroundSketchOpen(false);
      }
    }
  };

  const handleColorChange = async (e) => {
    const rgba = e.rgb;
    const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
    setColor(rgbaText);
    const style = { color: rgbaText };
    changeTextStyle(uuid, style);
  };

  const handleBackgroundChange = (e) => {
    const rgba = e.rgb;
    const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
    setBackground(rgbaText);
    const style = { background: rgbaText };
    changeTextStyle(uuid, style);
  };

  const handleToggle = (toggleState, setToggleState, styleProp, value) => {
    setToggleState(!toggleState);
    const style = { [styleProp]: !toggleState ? value : "" };
    changeTextStyle(uuid, style);
  };

  return (
    <ContextMenuWarpper
      ref={contextRef}
      pointer={pointer}
      className="contextMenu"
      onClick={handleClick}
    >
      <TextMenuWrapper>
        {/* 폰트사이즈 */}
        <FontSizeSelector
          uuid={uuid}
          defaultValue={popupData?.styleData?.fontSize || 16}
          onMouseEnter={changeSelectSubMenu}
          changeTextStyle={changeTextStyle}
        />
        {/* 폰트 색상 */}
        <TextColorMenu
          uuid={uuid}
          onMouseEnter={changeSelectSubMenu}
          color={color}
          setColor={setColor}
          handleToggle={handleToggle}
          changeTextStyle={changeTextStyle}
        />
        {/* <TextMenu
          onMouseEnter={changeSelectSubMenu}
          onClick={(e) => {
            const sketchElement = e.target.closest(".color-sketch");
            const cancelButton = e.target.closest(".cancel-button");
          }}
        >
          {color && (
            <ColorCancelButton
              className="cancel-button"
              onClick={() => {
                const style = { color: "" };
                setColor("");
                changeTextStyle(uuid, style);
              }}
            >
              <ColorCancelButtonImg
                src={process.env.PUBLIC_URL + "/images/xmark.svg"}
              />
            </ColorCancelButton>
          )}
          A
          <PickerPreview color={color} />
          {isSketchOpen && (
            <ColorPicker
              className="color-sketch"
              uuid={uuid}
              color={color}
              handleChange={handleColorChange}
            />
          )}
        </TextMenu> */}
        {/* 배경 색상 */}
        <TextMenu
          onMouseEnter={changeSelectSubMenu}
          onClick={(e) => {
            const sketchElement = e.target.closest(".color-sketch");
            const cancelButton = e.target.closest(".cancel-button");
            if (!sketchElement && !cancelButton) {
              setIsBackgroundSketchOpen(!isBackgroundSketchOpen);
            }
          }}
        >
          {background && (
            <ColorCancelButton
              className="cancel-button"
              onClick={() => {
                const style = { background: "" };
                setBackground("");
                changeTextStyle(uuid, style);
              }}
            >
              <ColorCancelButtonImg
                src={process.env.PUBLIC_URL + "/images/xmark.svg"}
              />
            </ColorCancelButton>
          )}
          배경
          <PickerPreview color={background} />
          {isBackgroundSketchOpen && (
            <ColorPicker
              className="background-sketch"
              uuid={uuid}
              color={background}
              handleChange={handleBackgroundChange}
            />
          )}
        </TextMenu>
        {/* Bold */}
        <TextMenuButton
          isActive={bold}
          buttonType={"bold"}
          onMouseEnter={changeSelectSubMenu}
          onClick={() => handleToggle(bold, setBold, "font-weight", "bold")}
        >
          B
        </TextMenuButton>

        {/* 기울기 */}
        <TextMenuButton
          isActive={italic}
          buttonType={"italic"}
          onMouseEnter={changeSelectSubMenu}
          onClick={() =>
            handleToggle(italic, setItalic, "font-style", "italic")
          }
        >
          i
        </TextMenuButton>

        {/* 밑줄 */}
        <TextMenuButton
          isActive={underLine}
          buttonType={"under-line"}
          onMouseEnter={changeSelectSubMenu}
          onClick={() =>
            handleToggle(
              underLine,
              setUnderLine,
              "border-bottom",
              "0.1rem solid"
            )
          }
        >
          U
        </TextMenuButton>
        {/* 취소선 */}
        <TextMenuButton
          isActive={strikethrough}
          buttonType={"line-through"}
          onMouseEnter={changeSelectSubMenu}
          onClick={() =>
            handleToggle(
              strikethrough,
              setStrikethrough,
              "text-decoration",
              "line-through"
            )
          }
        >
          S
        </TextMenuButton>
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

            if (link && link.length > 0) {
              const style = {
                link: link,
              };
              changeTextStyle(uuid, style);
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
  position: relative;
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

const ColorCancelButton = styled.div`
  position: absolute;
  background: white;
  right: 0;
  top: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
`;

const ColorCancelButtonImg = styled.img``;

const TextMenuSpan = styled.span`
  font-weight: ${(props) => (props.bold ? "bold" : "")};
  font-style: ${(props) => (props.italic ? "italic" : "")};
  text-decoration: ${(props) => (props.underline ? "underline" : "")};
  text-decoration: ${(props) => (props.lineThrough ? "line-through" : "")};
`;

const TextSizeWrapper = styled.div`
  display: flex;
  position: relative;
`;

const FontInput = styled.input`
  font-size: 1.6rem;
  border: none;
  outline: none;
  width: 100%;
  background: none;
`;

const FontSizeButton = styled.div`
  width: 2rem;
  text-align: center;
`;

const FontSizeListContainer = styled.div`
  position: absolute;
  top: 100%;
  width: 100%;
  height: ${(props) => (!props.isFontSizeOpen ? "0px" : "17rem")};
  transition: 0.1s;
  overflow: hidden;
`;

const FontSizeList = styled.div`
  border: 1px solid rgba(55, 53, 47, 0.2);
  overflow: auto;
  height: 100%;
  background: white;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }
`;

const TextSizeOption = styled.div`
  text-align: center;
  :hover {
    background: rgba(55, 53, 47, 0.2);
  }
`;

const PickerPreview = styled.div`
  width: 3rem;
  height: 1.2rem;
  border-radius: 0.2rem;
  background: ${(props) => props.color};
  border: 1px solid rgba(55, 53, 47, 0.2);
`;

const PickerContainer = styled.div`
  position: absolute;
  margintop: 0.2rem;
  top: 100%;
  left: 0;
`;
