import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import StyleSpanTag from "./StyleSpanTag";
import { useEffect } from "react";

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
  const EditCaretPositioning = {};

  useEffect(() => {
    console.log("document.createRange : ", document.createRange);
    if (window.getSelection && document.createRange) {
      //saves caret position(s)
      EditCaretPositioning.saveSelection = function (containerEl) {
        var range = window.getSelection().getRangeAt(0);
        var preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        var start = preSelectionRange.toString().length;

        return {
          start: start,
          end: start + range.toString().length,
        };
      };
      //restores caret position(s)
      EditCaretPositioning.restoreSelection = function (containerEl, savedSel) {
        var charIndex = 0,
          range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var nodeStack = [containerEl],
          node,
          foundStart = false,
          stop = false;

        while (!stop && (node = nodeStack.pop())) {
          if (node.nodeType === 3) {
            var nextCharIndex = charIndex + node.length;
            if (
              !foundStart &&
              savedSel.start >= charIndex &&
              savedSel.start <= nextCharIndex
            ) {
              range.setStart(node, savedSel.start - charIndex);
              foundStart = true;
            }
            if (
              foundStart &&
              savedSel.end >= charIndex &&
              savedSel.end <= nextCharIndex
            ) {
              range.setEnd(node, savedSel.end - charIndex);
              stop = true;
            }
            charIndex = nextCharIndex;
          } else {
            var i = node.childNodes.length;
            while (i--) {
              nodeStack.push(node.childNodes[i]);
            }
          }
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      };
    } else if (document.selection && document.body.createTextRange) {
      //saves caret position(s)
      EditCaretPositioning.saveSelection = function (containerEl) {
        var selectedTextRange = document.selection.createRange();
        var preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
        var start = preSelectionTextRange.text.length;

        return {
          start: start,
          end: start + selectedTextRange.text.length,
        };
      };
      //restores caret position(s)
      EditCaretPositioning.restoreSelection = function (containerEl, savedSel) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSel.end);
        textRange.moveStart("character", savedSel.start);
        textRange.select();
      };
    }
  }, []);

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
          modifyEditDom(data.uuid, { html: e.target.innerHTML });
        }}
        dangerouslySetInnerHTML={{ __html: html }}
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

export default EditComponent;
