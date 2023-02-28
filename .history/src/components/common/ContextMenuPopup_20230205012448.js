import React from "react";
import styled from "@emotion/styled";

const ContextMenuWarpper = styled.div`
  position: absolute;
  left: ${(props) => props.x + "px"};
  top: ${(props) => props.y + "px"};
  border-radius: 0.5rem;
  overflow: hidden;
`;

const Menu = styled.div`
  width: 20rem;
  background: rgba(55, 53, 47, 0.2);
  font-size: 2rem;
`;

const ContextMenuPopup = ({ pointer }) => {
  return (
    <ContextMenuWarpper x={pointer?.x} y={pointer?.y}>
      <Menu>삭제</Menu>
      <Menu>변경</Menu>
    </ContextMenuWarpper>
  );
};

export default ContextMenuPopup;
