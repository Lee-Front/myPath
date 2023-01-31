import React from "react";
import styled from "@emotion/styled";
import { useRef } from "react";

const CheckBoxTagWrapper = styled.div`
  line-height: 1.5;
  padding: 0 0.4rem;
  color: rgb(55, 53, 47);

  :hover {
    background: rgba(55, 53, 47, 0.08);
  }
`;
const CheckBoxTag = ({ style, data }) => {
  const editRef = useRef(null);

  return (
    <CheckBoxTagWrapper uuid={data.uuid} style={{ position: "relative" }}>
      <div style={{ display: "flex" }}>
        <div>
          <svg
            viewBox="0 0 14 14"
            style="width: 12px; height: 12px; display: block; fill: white; flex-shrink: 0; backface-visibility: hidden;"
          >
            <polygon points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"></polygon>
          </svg>
        </div>
        <div
          style={{ outline: "none" }}
          ref={editRef}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onDragStart={(e) => {
            e.preventDefault();
          }}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          onAuxClick={(e) => {
            // 오른쪽 클릭
            e.preventDefault();
          }}
          placeholder="할 일"
          onInput={(e) => {
            //setState((prev) => ({ ...prev, html: e.target.textContent }));
            //modifyEditDom(data.uuid, { html: e.target.textContent });
          }}
        />
      </div>
    </CheckBoxTagWrapper>
  );
};

export default CheckBoxTag;
