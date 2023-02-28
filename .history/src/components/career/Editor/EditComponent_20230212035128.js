import React, { useState } from "react";
import styled from "@emotion/styled";
import { useEffect } from "react";
import { useRef } from "react";

const EditableTag = styled.div`
  position: relative;
  outline: none;
  line-height: 1.5;
  padding: 0.2rem 0.4rem;
  word-break: break-all;
  white-space: pre-wrap;

  // 여기부턴 태그 설정 스타일
  font-size: ${(props) =>
    props?.styleData?.fontSize ? props?.styleData?.fontSize + "px" : null};
  color: ${(props) =>
    props?.styleData?.color ? props?.styleData?.color : null};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};
  font-weight: ${(props) => (props?.styleData?.bold ? "bold" : null)};
  font-style: ${(props) => (props?.styleData?.italic ? "italic" : null)};
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
        styleData={data?.styleData}
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
          modifyEditDom(data.uuid, { html: e.target.textContent });
        }}
      >
        {data.styleData?.bold ||
        data.styleData?.italic ||
        data.styleData?.underLine ||
        data.styleData?.strikethrough ? (
          <span
            style={{
              borderBottom: data.styleData?.underLine
                ? "1px solid black"
                : null,
              textDecoration: data.styleData?.strikethrough
                ? "line-through"
                : null,
            }}
          >
            {html}
          </span>
        ) : (
          html
        )}
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
