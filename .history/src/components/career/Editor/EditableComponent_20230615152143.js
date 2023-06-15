import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRef } from "react";

const EditableComponent = ({ updateElement, data }) => {
  const [html, setHtml] = useState(data?.html);
  const [editPlaceHolder, setEditPlaceHolder] = useState(null);
  const editRef = useRef(null);

  const handleInput = (e) => {
    const childNodes = Array.from(e.target.childNodes);
    let newHtml = "";
    for (let i = 0; i < childNodes.length; i++) {
      if (childNodes[i] instanceof Text) {
        newHtml += childNodes[i].textContent;
      } else {
        newHtml += childNodes[i].outerHTML;
      }
    }
    updateElement(data.uuid, {
      html: newHtml,
    });
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
  font-weight: ${(props) =>
    props?.styleData["font-weight"] ? props?.styleData["font-weight"] : ""};
  font-style: ${(props) =>
    props?.styleData["font-style"] ? props?.styleData["font-style"] : ""};
  border-bottom: ${(props) =>
    props?.styleData["border-bottom"] ? props?.styleData["border-bottom"] : ""};
  text-decoration: ${(props) =>
    props?.styleData["text-decoration"]
      ? props?.styleData["text-decoration"]
      : ""};

  text-align: ${(props) =>
    props?.styleData?.textAlign ? props?.styleData?.textAlign : null};
`;
