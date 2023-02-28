import React from "react";
import styled from "@emotion/styled";

const ContextMenuWarpper = styled.div`
  z-index: 999;
  position: relative;
  left: ${(props) => props.x + "px"};
  top: ${(props) => props.y + "px"}; ;
`;

const ContextMenuPopup = ({ pointer }) => {
  console.log(pointer);
  return (
    <ContextMenuWarpper x={pointer.x} y={pointer.y}>
      123123
    </ContextMenuWarpper>
  );
};

export default ContextMenuPopup;
