import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";

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

const ContextMenuPopup = ({
  pointer,
  changeContextMenuYn,
  modifyEditDom,
  hoverUuid,
}) => {
  const [uuid, setUuid] = useState(hoverUuid);

  const deleteMenu = () => {
    modifyEditDom(uuid, {}, "delete");
    changeContextMenuYn(false);
  };

  const changeMenu = () => {
    const tagName = prompt("tagName", "div");
    modifyEditDom(uuid, { tagName: tagName });
    changeContextMenuYn(false);
  };
  return (
    <ContextMenuWarpper x={pointer?.x} y={pointer?.y} className="contextMenu">
      <div
        style={{
          display: "flex",
          gap: "1rem",
        }}
      >
        <div>Size</div>
        <div>색상</div>
        <div>글꼴</div>
        <div>B</div>
        <div>i</div>
        <div>U</div>
        <div>S</div>
      </div>
      <div>
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
      </div>
    </ContextMenuWarpper>
  );
};

export default ContextMenuPopup;
