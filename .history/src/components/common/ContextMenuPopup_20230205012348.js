import React from "react";
import styled from "@emotion/styled";

const ContextMenuWarpper = styled.div`
  position: absolute;
  left: ${(props) => props.x + "px"};
  top: ${(props) => props.y + "px"}; ;
`;

const MenuWarpper = styled.div`
  width: 20rem;
  background: rgba(55, 53, 47, 0.2);
  font-size: 2rem;
`;

const ContextMenuPopup = ({ pointer }) => {
  console.log(pointer);

  return (
    <ContextMenuWarpper x={pointer?.x} y={pointer?.y}>
      <div>
        <MenuWarpper>삭제</MenuWarpper>
        <MenuWarpper>변경</MenuWarpper>
      </div>
    </ContextMenuWarpper>
  );
};

export default ContextMenuPopup;
