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
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
          }
        }}
        onInput={(e) => {
          const childNodes = Array.from(e.target.childNodes);
          let newHtml = "";
          if (childNodes.length > 1) {
            for (let i = 0; i < childNodes.length; i++) {
              if (childNodes[i]?.nodeName === "SPAN") {
                newHtml += childNodes[i].outerHTML;
              } else {
                console.log("childNodes[i] : ", childNodes[i]);
                newHtml += childNodes[i].textContent;
              }

              if (
                childNodes[i]?.nodeName === "SPAN" ||
                childNodes[i]?.nodeName === "B"
              ) {
                childNodes[i] = childNodes[i].firstChild;
              }
            }

            const range = window.getSelection().getRangeAt(0);

            const startIndex = childNodes.indexOf(range.startContainer);
            const startOffset = range.startOffset;

            const target = document.querySelector(`[data-uuid="${data.uuid}"]`);
            const editableTag = target.querySelector(".editable-tag");

            editableTag.innerHTML = newHtml;

            const newChildeList = Array.from(editableTag.childNodes).map(
              (node) => {
                if (node.nodeName === "SPAN") {
                  node = node.firstChild;
                }
                return node;
              }
            );

            const newRange = document.createRange();
            console.log("newChildeList: ", newChildeList);
            newRange.setStart(newChildeList[startIndex], startOffset);
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(newRange);

            updateElement(data.uuid, {
              html: newHtml,
            });
          } else {
            updateElement(data.uuid, {
              html: e.target.innerHTML,
            });
          }
        }}
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
  white-space: pre-wrap;

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
