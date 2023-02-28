import React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { useRef } from "react";

const SubContextMenuWrapper = styled.div`
  position: relative;
  font-size: 1.7rem;
  line-height: 2.8rem;
  padding-left: 0.5rem;
  border-radius: ${(props) => (props.isHover ? "0.5rem" : "")};
  background: ${(props) => (props.isHover ? "rgba(55, 53, 47, 0.1)" : "")};
`;

const SubContextMenu = ({
  selectMenu,
  changeSelectSubMenu,
  menuText,
  onClick,
  subMenuList,
}) => {
  const subMenuRef = useRef();

  const handleClick = (event) => {
    console.log("a");
    if (event.currentTarget === event.target) {
      console.log("b");
      onClick();
    }
  };

  return (
    <SubContextMenuWrapper
      ref={subMenuRef}
      isHover={subMenuRef.current === selectMenu}
      onClick={handleClick}
      onMouseEnter={(e) => {
        changeSelectSubMenu(e.currentTarget);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        console.log("e : ", e.currentTarget);

        if (!subMenuList) {
          changeSelectSubMenu(null);
        }
      }}
    >
      <div>
        {menuText}
        {subMenuList?.length > 0 && (
          <span style={{ float: "right", paddingRight: "1rem" }}>&gt;</span>
        )}
      </div>
      {subMenuList?.length > 0 && selectMenu === subMenuRef.current && (
        <div
          style={{
            position: "absolute",
            right: "-6rem",
            top: 0,
            background: "white",
            border: "1px solid rgba(55, 53, 47, 0.2)",
            borderRadius: "0.5rem",
          }}
        >
          {subMenuList.map((menu) => (
            <div key={menu.text} onClick={menu.event}>
              {menu.text}
            </div>
          ))}
        </div>
      )}
    </SubContextMenuWrapper>
  );
};

export default SubContextMenu;
