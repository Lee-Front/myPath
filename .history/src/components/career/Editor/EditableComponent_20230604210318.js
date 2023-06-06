import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRef } from "react";

const EditableBlock = ({
  updateElement,
  data,
  overlayWidth,
  movementSide,
  style,
}) => {
  const [html, setHtml] = useState(data?.html);
  const [isHover, setIsHover] = useState(false);
  const [editPlaceHolder, setEditPlaceHolder] = useState(null);
  const editRef = useRef(null);

  const handleInput = (e) => {
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

      //editableTag.innerHTML = newHtml;

      const newChildeList = Array.from(editableTag.childNodes).map((node) => {
        if (node.nodeName === "SPAN") {
          node = node.firstChild;
        }
        return node;
      });

      const newRange = document.createRange();
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
  };

  return (
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
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
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
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning={true}
    />
  );
};

export default EditableBlock;

const Editable = styled.div`
  position: relative;
  outline: none;
  word-break: break-all;
  flex: 1;
  white-space: pre-wrap;
`;
