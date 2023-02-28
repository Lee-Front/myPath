import React from "react";
import styled from "@emotion/styled";

const ContextMenuWarpper = styled.div`
  position: absolute;
  left: ${(props) => props.x + "px"};
  top: ${(props) => props.y + "px"}; ;
`;

const ContextMenuPopup = ({ pointer }) => {
  console.log(pointer);

  return (
    <ContextMenuWarpper x={pointer?.x} y={pointer?.y}>
      <div style={{ width: "10rem", background: "black" }}>
        <div>삭제</div>
        <div>변경</div>
      </div>
    </ContextMenuWarpper>
  );
};

export default ContextMenuPopup;
