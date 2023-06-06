import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRef } from "react";

const EditableBlock = ({ updateElement, data, overlayWidth, movementSide }) => {
  const [html, setHtml] = useState(data?.html);
  const [editPlaceHolder, setEditPlaceHolder] = useState(null);
  const editRef = useRef(null);

  const getMovementStyle = (movementData) => {
    const side = movementData.position;
    const styleObject = {
      position: "absolute",
      background: "rgb(160,202,242)",
      zIndex: "999",
    };
    if (side === "top") {
      styleObject.top = 0;
      styleObject.left = 0;
      styleObject.width = "100%";
      styleObject.height = "4px";
    } else if (side === "bottom") {
      styleObject.bottom = 0;
      styleObject.left = 0;
      styleObject.width = "100%";
      styleObject.height = "4px";
    } else if (side === "left") {
      styleObject.top = 0;
      styleObject.left = 0;
      styleObject.width = "4px";
      styleObject.height = "100%";
    } else if (side === "right") {
      styleObject.top = 0;
      styleObject.right = 0;
      styleObject.width = "4px";
      styleObject.height = "100%";
    }
    return styleObject;
  };
  const style = movementSide && getMovementStyle(movementSide);

  const hadleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Editable
        styleData={data?.styleData}
        ref={editRef}
        className="editable-tag"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onDragStart={(e) => {
          e.preventDefault();
        }}
        placeholder={editPlaceHolder}
        onFocus={() => {
          setEditPlaceHolder("내용을 입력하세요");
        }}
        onBlur={() => {
          setEditPlaceHolder(null);
        }}
        onKeyDown={hadleKeyDown}
        onInput={(e) => {}}
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning={true}
      />

      {style ? <div style={style}></div> : null}
    </>
  );
};

export default EditableBlock;

const Editable = styled.div`
  position: relative;
  outline: none;
  word-break: break-all;
  flex: 1;

  text-align: ${(props) =>
    props?.styleData?.textAlign ? props?.styleData?.textAlign : null};
  font-size: ${(props) =>
    props?.styleData?.fontSize ? props?.styleData?.fontSize + "px" : "1.6rem"};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};

  :hover {
    background: rgba(55, 53, 47, 0.1);
  }
`;
