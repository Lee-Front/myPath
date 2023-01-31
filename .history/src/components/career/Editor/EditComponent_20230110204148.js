import React, { useState } from "react";
import styled from "@emotion/styled";
import { useEffect } from "react";
import { useRef } from "react";

const EditableTag = styled.div`
  outline: none;
  line-height: 1.5;
  padding: 0 0.4rem;
  :hover{
    rgba(55,53,47,0.08);
  }
`;

const EditComponent = ({ hoverUuid, modifyEditDom, movementSide, data }) => {
  const [state, setState] = useState({
    html: data.html ? data.html : "",
  });
  const [editPlaceHolder, setEditPlaceHolder] = useState(
    data.defaultPlaceHolder
  );
  const editRef = useRef(null);

  useEffect(() => {
    editRef.current.textContent = state.html;
  }, [state]);

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
    <div uuid={data.uuid} style={{ position: "relative" }}>
      <EditableTag
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
        // style={{
        //   background:
        //     hoverUuid && hoverUuid === data.uuid ? "rgba(55,53,47,0.08)" : "",
        // }}
        placeholder={editPlaceHolder}
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
  );
};

export default EditComponent;
