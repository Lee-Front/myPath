import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRef } from "react";

const EditableComponent = ({ updateElement, data }) => {
  const [html, setHtml] = useState(data?.html);
  const [editPlaceHolder, setEditPlaceHolder] = useState(null);
  const editRef = useRef(null);

  const handleInput = (e) => {
    const childNodes = Array.from(e.target.childNodes).filter(
      (item) => item.nodeName !== "BR"
    );
    console.log("childNodes: ", childNodes);
    let newHtml = "";
    if (childNodes.length > 1) {
      for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i] instanceof Text) {
          if (childNodes[i].textContent.trim() !== "") {
            newHtml += childNodes[i].textContent;
          }
        } else {
          if (childNodes[i].nodeName !== "BR") {
            newHtml += childNodes[i].outerHTML;
          }
        }

        while (childNodes[i].firstChild) {
          childNodes[i] = childNodes[i].firstChild;
        }
      }

      const range = window.getSelection().getRangeAt(0);
      const startIndex = childNodes.indexOf(range.startContainer);
      const startOffset = range.startOffset;

      const newRange = document.createRange();
      console.log("childNodes: ", childNodes);
      console.log("startIndex: ", startIndex);
      console.log("startOffset: ", startOffset);
      newRange.setStart(childNodes[startIndex], startOffset);
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

  const handleClick = (e) => {
    const isAnchorElement = e.target.closest("a");

    if (isAnchorElement) {
      const href = isAnchorElement.getAttribute("href");
      if (href) {
        window.open(href, "_blank");
      }
    }
  };

  return (
    <Editable
      ref={editRef}
      styleData={data?.style || {}}
      chilcCount={editRef?.current?.childNodes?.length}
      name="editable-tag"
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
          e.preventDefault();
          // block 분리작업
        }
      }}
      onInput={handleInput}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning={true}
    />
  );
};

export default EditableComponent;

const Editable = styled.div`
  position: relative;
  outline: none;
  word-break: break-all;
  white-space: pre-wrap;

  font-size: ${(props) =>
    props?.styleData["font-size"] ? props?.styleData["font-size"] : "1.6rem"};
  color: ${(props) =>
    props?.styleData?.color ? props?.styleData?.color : null};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};
  text-align: ${(props) =>
    props?.styleData?.textAlign ? props?.styleData?.textAlign : null};
`;
