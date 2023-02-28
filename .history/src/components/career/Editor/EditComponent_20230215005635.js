import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import StyleSpanTag from "./StyleSpanTag";
import { memo } from "react";

const EditableTag = styled.div`
  position: relative;
  outline: none;
  line-height: 1.5;
  padding: 0.2rem 0.4rem;
  word-break: break-all;
  white-space: pre-wrap;
`;

const EditComponent = ({
  modifyEditDom,
  data,
  style,
  overlayWidth,
  hoverUuid,
}) => {
  const [html, setHtml] = useState(data?.html);
  const [editPlaceHolder, setEditPlaceHolder] = useState(null);
  const editRef = useRef(null);

  const setCaretPosition = (target, start, end) => {
    const nodes = target.childNodes;
    let currentNodeStartIndex = 0;
    let currentNodeEndIndex = 0;
    const newRange = document.createRange();

    // 노드들을 돌면서 작업 시작
    for (let i = 0; i < nodes.length; i++) {
      let textLength = nodes[i].textContent.length;

      currentNodeEndIndex += textLength;
      if (currentNodeStartIndex <= start && currentNodeEndIndex > start) {
        const textNode =
          nodes[i].nodeName === "#text" ? nodes[i] : nodes[i].firstChild;
        newRange.setStart(textNode, start - currentNodeStartIndex);
      }

      if (currentNodeStartIndex < end && currentNodeEndIndex >= end) {
        // 셀랙트 끝점이 해당 node의 범위안에 있는경우
        const textNode =
          nodes[i].nodeName === "#text" ? nodes[i] : nodes[i].firstChild;
        newRange.setEnd(textNode, textLength - (currentNodeStartIndex - start));
      }
      currentNodeStartIndex += textLength;
    }
      currentNodeStartIndex += textLength;
    }

    document.getSelection().removeAllRanges();
    document.getSelection().addRange(newRange);
  };

  return (
    <div
      uuid={data.uuid}
      style={{
        position: "relative",
        width: overlayWidth + "%",
      }}
    >
      <EditableTag
        hoverYn={hoverUuid === data.uuid}
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
        onInput={(e) => {
          const childNodes = e.target.childNodes;
          let newHtml = "";

          // 노드가 2개이상임
          if (childNodes.length > 1) {
            let isOnlyText = true;
            for (let i = 0; i < childNodes.length; i++) {
              if (childNodes[i].nodeName === "#text") {
                newHtml += childNodes[i].textContent;
              } else {
                isOnlyText = false;
              }
            }

            if (isOnlyText) {
              const range = window.getSelection().getRangeAt(0);
              const start = range.startOffset;
              const end = range.endOffset;

              setHtml(newHtml);

              const target = document.querySelector(`[uuid="${data.uuid}"]`);
              const editableTag = target.querySelector(".editable-tag");
              setCaretPosition(editableTag, start, end);
            } else {
              newHtml = e.target.innerHTML;
            }
            modifyEditDom(data.uuid, {
              html: newHtml,
            });
          } else {
            modifyEditDom(data.uuid, {
              html: e.target.innerHTML,
            });
          }
        }}
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning={true}
      />
      {hoverUuid === data.uuid ? (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            pointerEvents: "none",
            background: "rgba(55, 53, 47, 0.1)",
          }}
        ></div>
      ) : null}

      {style ? <div style={style}></div> : null}
    </div>
  );
};

export default memo(EditComponent);
