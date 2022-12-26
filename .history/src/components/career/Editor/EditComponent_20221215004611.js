import React, { useState } from "react";
import styled from "@emotion/styled";

const EditableTag = styled.div`
  outline: none;
  line-height: 1.5;
  padding: 0 0.4rem;
`;

const EditComponent = ({ hoverUuid, modifyEditDom, movementSide, data }) => {
  const [state, setState] = useState({
    html: data.html ? data.html : "",
  });
  const [editPlaceHolder, setEditPlaceHolder] = useState(
    data.defaultPlaceHolder
  );

  const getMovementStyle = (movementSide) => {
    const styleObject = {
      position: "absolute",
      background: "rgba(35,131,226,0.43)",
    };
    if (movementSide === "top") {
      styleObject.top = 0;
      styleObject.left = 0;
      styleObject.width = "100%";
      styleObject.height = "4px";
    } else if (movementSide === "bottom") {
      styleObject.bottom = 0;
      styleObject.left = 0;
      styleObject.width = "100%";
      styleObject.height = "4px";
    } else if (movementSide === "left") {
      styleObject.top = 0;
      styleObject.left = 0;
      styleObject.width = "4px";
      styleObject.height = "100%";
    } else if (movementSide === "right") {
      styleObject.top = 0;
      styleObject.right = 0;
      styleObject.width = "4px";
      styleObject.height = "100%";
    }
    return styleObject;
  };

  return (
    <div>
      {/* {hoverUuid && data.tagName !== "title" && data.uuid === hoverUuid ? (
        <div
          style={{
            width: "2rem",
            height: "2.4rem",
            display: "flex",
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg
            viewBox="0 0 10 10"
            style={{
              width: "14px",
              height: "14px",
              display: "block",
              flexShrink: 0,
              backfaceVisibility: "hidden",
              fill: "rgba(55, 53, 47, 0.35)",
            }}
          >
            <path d="M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z"></path>
          </svg>
        </div>
      ) : null} */}
      <div uuid={data.uuid} style={{ position: "relative" }}>
        <EditableTag
          contentEditable={true}
          onDragStart={(e) => {
            e.preventDefault();
          }}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          html={state.html}
          onAuxClick={(e) => {
            // 오른쪽 클릭
            e.preventDefault();
          }}
          style={{
            background:
              hoverUuid && hoverUuid === data.uuid ? "rgba(55,53,47,0.08)" : "",
          }}
          placeholder={editPlaceHolder}
          tagName="div"
          onFocus={() => {
            if (data.placeholder) {
              setEditPlaceHolder(data.placeholder);
            }
          }}
          onBlur={() => {
            setEditPlaceHolder(data.defaultPlaceHolder);
          }}
          onInput={(e) => {
            setState((prev) => ({ ...prev, html: e.target.textContent }));
            modifyEditDom(data.uuid, e.target.textContent);
          }}
        />
        {movementSide?.uuid === data.uuid ? (
          <div style={getMovementStyle(movementSide?.position)}></div>
        ) : null}
      </div>
    </div>
  );
};

export default EditComponent;
