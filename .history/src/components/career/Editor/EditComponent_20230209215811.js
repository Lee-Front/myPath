import React, { useState } from "react";
import styled from "@emotion/styled";
import { useEffect } from "react";
import { useRef } from "react";

const EditableTag = styled.div`
  outline: none;
  line-height: 1.5;
  padding: 0.2rem 0.4rem;
  background: ${(props) => (props.hoverYn ? "rgba(55, 53, 47, 0.08)" : "")};
  word-break: break-all;
  white-space: pre-wrap;

  // 여기부턴 태그 설정 스타일
  font-size: ${(props) =>
    props?.styleData?.fontSize ? props?.styleData?.fontSize + "px" : null};
`;

const EditComponent = ({
  modifyEditDom,
  data,
  style,
  overlayWidth,
  hoverUuid,
}) => {
  const [state, setState] = useState({
    html: data.html ? data.html : "",
  });

  const [editPlaceHolder, setEditPlaceHolder] = useState(null);
  const editRef = useRef(null);

  useEffect(() => {
    editRef.current.textContent = state.html;
  }, [state]);

  return (
    <div
      uuid={data.uuid}
      style={{ position: "relative", width: overlayWidth + "%" }}
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
          setState((prev) => ({ ...prev, html: e.target.textContent }));
          modifyEditDom(data.uuid, { html: e.target.textContent });
        }}
      />
      {style ? <div style={style}></div> : null}
    </div>
  );
};

export default EditComponent;
