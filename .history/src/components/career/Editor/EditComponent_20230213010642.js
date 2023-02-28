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

  useEffect(() => {
    const { focusOffset } = window.getSelection();
    console.log("focusOffset : ", focusOffset);
    window.getSelection().collapse(editRef.current, 2);
    console.log("focusOffset : ", focusOffset);
    console.log("data.html : ", data.html);
    setHtml(data.html);
  }, [data.html]);

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
        contentEditable={true}
        suppressContentEditableWarning={true}
        onDragStart={(e) => {
          e.preventDefault();
        }}
        onContextMenu={(e) => {
          //e.preventDefault();
        }}
        onAuxClick={(e) => {
          // 오른쪽 클릭
          //e.preventDefault();
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
      >
        {/* <StyleSpanTag data={data}></StyleSpanTag> */}
      </EditableTag>
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
