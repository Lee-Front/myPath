import React from "react";
import styled from "@emotion/styled";

const ContextMenuWarpper = styled.div`
  position: absolute;
  left: ${(props) => props.x + "px"};
  top: ${(props) => props.y + "px"};
  border-radius: 0.5rem;
  padding: 0.5rem;
  border: 1px solid rgba(55, 53, 47, 0.2);
  background: white;
`;

const Menu = styled.div`
  width: 20rem;
  font-size: 1.7rem;
  line-height: 2.8rem;
  padding-left: 0.5rem;
  :hover {
    border-radius: 0.5rem;
    background: rgba(55, 53, 47, 0.1);
  }
`;

const ContextMenuPopup = ({ pointer, changeContextMenuYn, draggable }) => {
  const deleteMenu = () => {
    if (!draggable) {
      changeContextMenuYn(false);
    }
  };

  const changeMenu = () => {
    if (!draggable) {
      changeContextMenuYn(false);
    }
  };
  return (
    <ContextMenuWarpper x={pointer?.x} y={pointer?.y} className="contextMenu">
      <Menu
        onClick={(e) => {
          deleteMenu();
        }}
      >
        삭제
      </Menu>
      <Menu
        onClick={(e) => {
          console.log("변경");
          changeMenu();
        }}
      >
        변경
      </Menu>
    </ContextMenuWarpper>
  );
};

export default ContextMenuPopup;
