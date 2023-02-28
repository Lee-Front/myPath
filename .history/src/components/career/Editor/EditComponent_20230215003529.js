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
              console.log("range : ", range);
              const start = range.startOffset;
              const end = range.endOffset;
              const startContainer = range.startContainer;

              //setHtml(newHtml);

              // const newRange = document.createRange();
              // newRange.setStart(start);
              // newRange.setEnd(end);
              // document.getSelection().removeAllRanges();
              // document.getSelection().addRange(newRange);
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
