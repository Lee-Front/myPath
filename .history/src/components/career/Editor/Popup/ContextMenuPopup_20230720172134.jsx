import React, { useLayoutEffect } from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import SubContextMenu from "./SubContextMenu";
import useEditorStore from "../../../../stores/useEditorStore";
import TextMenuButton from "./TextMenuButton";
import FontSizeSelector from "./FontSizeSelector";
import TextColorMenu from "./TextColorMenu";
import useTextStyler from "../../../../hooks/useTextStyler";

// 폰트 사이즈 목록

const ContextMenuPopup = ({ pointer, changeContextMenuYn, popupData }) => {
  const editorStore = useEditorStore();
  const textStyler = useTextStyler();

  const [uuid, setUuid] = useState(popupData?.uuid);
  const [isSubMenu, setIsSubMenu] = useState(false);

  const [fontSize, setFontSize] = useState(null);
  const [color, setColor] = useState(null);
  const [background, setBackground] = useState(null);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underLine, setUnderLine] = useState(false);
  const [strikethrough, setStrikethrough] = useState(false);
  const contextRef = useRef();

  useLayoutEffect(() => {
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
      const selectNodes = textStyler.getSelectNodes(nodes, selection);
      const nodesStyle = textStyler.getNodesData(selectNodes);
      const commonStyles = textStyler.getCommonAttributes(nodesStyle);
      styleData = Object.assign(styleData, commonStyles);
    } else {
      styleData = Object.assign(styleData, popupData?.style);
    }

    setFontSize(styleData["font-size"]);
    setColor(styleData["color"] || "");
    setBackground(styleData["background"] || "");
    setBold(!!styleData["font-weight"]);
    setItalic(!!styleData["font-style"]);
    setUnderLine(!!styleData["border-bottom"]);
    setStrikethrough(!!styleData["text-decoration"]);
  }, []);

  const deleteMenu = () => {
    editorStore.deleteBlocks();
    changeContextMenuYn(false);
  };

  const changeMenu = (tagName) => {
    editorStore.updateBlocks(
      editorStore.selectBlocks.map((item) => item.uuid),
      { tagName: tagName }
    );
    changeContextMenuYn(false);
  };

  const handleLinkClick = () => {
    const link = prompt("링크를 입력해주세요");

    if (link && link.length > 0) {
      const style = {
        link: link,
      };
      textStyler.changeTextStyle(uuid, style);
    }
  };

  const changeTextAlignment = async (modifyAlign) => {
    const style = { "text-align": modifyAlign };
    textStyler.changeTextStyle(uuid, style);
  };

  const handleColorChange = async (e) => {
    const rgba = e.rgb;
    const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
    setColor(rgbaText);
    const style = { color: rgbaText };
    textStyler.changeTextStyle(uuid, style);
  };

  const handleBackgroundChange = (e) => {
    const rgba = e.rgb;
    const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
    setBackground(rgbaText);
    const style = { background: rgbaText };
    textStyler.changeTextStyle(uuid, style);
  };

  const handleStateChange = (toggleState, setToggleState, styleProp, value) => {
    setToggleState(toggleState);
    const style = { [styleProp]: value };
    textStyler.changeTextStyle(uuid, style);
  };

  return (
    <ContextMenuWarpper
      ref={contextRef}
      pointer={pointer}
      className="contextMenu"
    >
      <TextMenuWrapper>
        {/* 폰트사이즈 */}
        <FontSizeSelector
          uuid={uuid}
          isSubMenu={isSubMenu}
          fontSize={fontSize}
          changeTextStyle={textStyler.changeTextStyle}
        />
        {/* 폰트 색상 */}
        <TextColorMenu
          isSubMenu={isSubMenu}
          color={color}
          setColor={setColor}
          handleColorChange={handleColorChange}
          handleColorDelete={() => handleStateChange("", setColor, "color", "")}
          changeTextStyle={textStyler.changeTextStyle}
        >
          A
        </TextColorMenu>
        {/* 배경 색상 */}
        <TextColorMenu
          isSubMenu={isSubMenu}
          color={background}
          setColor={setBackground}
          handleColorChange={handleBackgroundChange}
          handleColorDelete={() =>
            handleStateChange("", setBackground, "background", "")
          }
          changeTextStyle={textStyler.changeTextStyle}
        >
          배경
        </TextColorMenu>
        {/* Bold */}
        <TextMenuButton
          isActive={bold}
          buttonType={"bold"}
          onClick={() =>
            handleStateChange(
              !bold,
              setBold,
              "font-weight",
              !bold ? "bold" : ""
            )
          }
        >
          B
        </TextMenuButton>
        {/* 기울기 */}
        <TextMenuButton
          isActive={italic}
          buttonType={"italic"}
          onClick={() =>
            handleStateChange(
              !italic,
              setItalic,
              "font-style",
              !italic ? "italic" : ""
            )
          }
        >
          i
        </TextMenuButton>
        {/* 밑줄 */}
        <TextMenuButton
          isActive={underLine}
          buttonType={"under-line"}
          onClick={() =>
            handleStateChange(
              !underLine,
              setUnderLine,
              "border-bottom",
              !underLine ? "0.1rem solid" : ""
            )
          }
        >
          U
        </TextMenuButton>
        {/* 취소선 */}
        <TextMenuButton
          isActive={strikethrough}
          buttonType={"line-through"}
          onClick={() =>
            handleStateChange(
              !strikethrough,
              setStrikethrough,
              "text-decoration",
              !strikethrough ? "line-through" : ""
            )
          }
        >
          S
        </TextMenuButton>
      </TextMenuWrapper>
      <SubContextMenu
        popupData={popupData}
        changeTextAlignment={changeTextAlignment}
        changeMenu={changeMenu}
        deleteMenu={deleteMenu}
        setIsSubMenu={setIsSubMenu}
        handleLinkClick={handleLinkClick}
      />
    </ContextMenuWarpper>
  );
};

export default ContextMenuPopup;

const ContextMenuWarpper = styled.div`
  position: sticky;
  width: 30rem;
  left: ${(props) => props.pointer?.x + "px"};
  top: ${(props) => props.pointer?.y + "px"};
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
