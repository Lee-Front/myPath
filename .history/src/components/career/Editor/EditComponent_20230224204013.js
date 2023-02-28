import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { memo } from "react";

const EditableTag = styled.div`
  position: relative;
  outline: none;
  line-height: 1.5;
  padding: 0.2rem 0.4rem;
  word-break: break-all;
  //white-space: pre-wrap;
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
          const childNodes = Array.from(e.target.childNodes);
          let newHtml = "";

          if (childNodes.length > 1) {
            let textCheck = false;
            for (let i = 0; i < childNodes.length; i++) {
              if (childNodes[i]?.nodeName === "SPAN") {
                newHtml += childNodes[i].outerHTML;
              } else {
                if (childNodes[i - 1]?.nodeName === "#text") {
                  textCheck = true;
                }
                newHtml += childNodes[i].textContent;
              }
            }

            const range = window.getSelection().getRangeAt(0);
            const startIndex = childNodes.indexOf(range.startContainer);
            const startOffset = range.startOffset;
            const target = document.querySelector(`[uuid="${data.uuid}"]`);
            const editableTag = target.querySelector(".editable-tag");
            editableTag.innerHTML = newHtml;

            if (textCheck) {
              const newChildeList = editableTag.childNodes;
              const newRange = document.createRange();
              newRange.setStart(newChildeList[startIndex], startOffset);
              document.getSelection().removeAllRanges();
              document.getSelection().addRange(newRange);
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
