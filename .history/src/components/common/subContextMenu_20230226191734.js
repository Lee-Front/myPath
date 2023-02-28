import React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { useRef } from "react";

const SubContextMenuWrapper = styled.div`
  position: relative;
  font-size: 1.7rem;
  line-height: 2.8rem;
  padding-left: 0.5rem;
  :hover {
    border-radius: 0.5rem;
    background: rgba(55, 53, 47, 0.1);
  }
`;

const SubContextMenu = ({
  selectMenu,
  changeSelectSubMenu,
  menuText,
  onClick,
  subMenuList,
}) => {
  const subMenuRef = useRef();
  console.log("onClick : ", onClick);
  onClick();
  return (
    <SubContextMenuWrapper
      ref={subMenuRef}
      onMouseEnter={(e) => {
        changeSelectSubMenu(e.currentTarget);
      }}
      onMouseLeave={(e) => {
        //setIsSelect(false);
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
          <div>왼쪽</div>
          <div>가운데</div>
          <div>오른쪽</div>
        </div>
      )}
    </SubContextMenuWrapper>
  );
};

export default SubContextMenu;
