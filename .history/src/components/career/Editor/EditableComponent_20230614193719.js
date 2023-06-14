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
    if (childNodes.length > 1) {
      for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i] instanceof Text) {
          newHtml += childNodes[i].textContent;
        } else {
          newHtml += childNodes[i].outerHTML;
        }

        while (childNodes[i] instanceof Text === false) {
          childNodes[i] = childNodes[i].firstChild;
        }
      }

      const range = window.getSelection().getRangeAt(0);
      const startIndex = childNodes.indexOf(range.startContainer);
      const startOffset = range.startOffset;

      //const target = document.querySelector(`[data-uuid="${data.uuid}"]`);
      //const editableTag = target.querySelector("[name=editable-tag]");

      // const newChildeList = Array.from(editableTag.childNodes).map((node) => {
      //   if (node.nodeName === "SPAN") {
      //     node = node.firstChild;
      //   }
      //   return node;
      // });
      const newRange = document.createRange();
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
      styleData={data?.style}
      ref={editRef}
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
  padding: 0 0.2rem;

  font-size: ${(props) => {
    console.log(props?.syleData);
  }};
  //props?.styleData["font-size"] ? props?.styleData["font-size"] : null};

  color: ${(props) =>
    props?.styleData?.color ? props?.styleData?.color : null};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};
  text-align: ${(props) =>
    props?.styleData?.textAlign ? props?.styleData?.textAlign : null};
  font-size: ${(props) =>
    props?.styleData?.fontSize ? props?.styleData?.fontSize + "px" : "1.6rem"};
`;
