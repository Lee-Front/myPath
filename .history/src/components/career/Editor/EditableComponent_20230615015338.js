import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";

const EditableComponent = ({ updateElement, data }) => {
  const [html, setHtml] = useState(data?.html);
  const [editPlaceHolder, setEditPlaceHolder] = useState(null);
  const editRef = useRef(null);
  const cursorPositionRef = useRef(null);

  useEffect(() => {
    // 컴포넌트가 렌더링된 후 커서 위치를 복원합니다.
    if (cursorPositionRef.current) {
      restoreCursorPosition(cursorPositionRef.current);
      cursorPositionRef.current = null;
    }
  }, []);

  const saveCursorPosition = () => {
    // 커서 위치를 저장합니다.
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      cursorPositionRef.current = range.cloneRange();
    }
  };

  const restoreCursorPosition = (range) => {
    // 저장된 커서 위치로 복원합니다.
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleInput = (e) => {
    saveCursorPosition();

    const text = e.target.innerText;
    const newHtml = text.replace(/\n/g, "<br>");
    setHtml(newHtml);
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
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          const brNode = document.createElement("br");
          range.insertNode(brNode);
          range.setStartAfter(brNode);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
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