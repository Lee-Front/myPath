import React from "react";
import styled from "@emotion/styled";

const ContextMenuWarpper = styled.div`
  position: absolute;
  left: ${(props) => props.x + "px"};
  top: ${(props) => props.y + "px"};
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: rgba(55, 53, 47, 0.2);
`;

const Menu = styled.div`
  width: 20rem;
  font-size: 1.7rem;
  padding: 0.5rem;
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
