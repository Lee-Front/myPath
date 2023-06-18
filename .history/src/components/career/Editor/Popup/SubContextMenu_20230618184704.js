import React from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { clamp } from "lodash";

const SubContextMenu = ({
  selectMenu,
  changeSelectSubMenu,
  menuText,
  onClick,
  subMenuList,
}) => {
  const [menuPoint, setMenuPoint] = useState({ x: -80, y: 0 });
  const menuRef = useRef();
  const subMenuRef = useRef();

  useEffect(() => {
    console.log("a");
    const subMenuPopup = subMenuRef.current;
    if (subMenuPopup) {
      const { right, width } = subMenuPopup.getBoundingClientRect();

      if (right > window.innerWidth) {
        setMenuPoint({ x: right - window.innerWidth - width, y: 0 });
      }
    }
  }, [subMenuRef]);

  console.log("subMenuRef: ", subMenuRef.current?.getBoundingClientRect());

  return (
    <SubContextMenuWrapper
      ref={menuRef}
      onClick={() => {
        if (!subMenuList && onClick) {
          onClick();
        }
      }}
      onMouseEnter={changeSelectSubMenu}
    >
      <div>
        {menuText}
        {subMenuList?.length > 0 && (
          <span style={{ float: "right", paddingRight: "1rem" }}>&gt;</span>
        )}
      </div>
      {subMenuList && menuRef.current === selectMenu && (
        <SubMenuWrapper ref={subMenuRef} menuPoint={menuPoint}>
          {subMenuList?.map((menu) => (
            <div key={menu.text}>
              <SubMenuButton onClick={menu.event} isSelect={menu.isSelect}>
                {menu.text}
              </SubMenuButton>
            </div>
          ))}
        </SubMenuWrapper>
      )}
    </SubContextMenuWrapper>
  );
};

export default SubContextMenu;

const SubContextMenuWrapper = styled.div`
  position: relative;
  font-size: 1.7rem;
  line-height: 2.8rem;
  padding-left: 0.5rem;
  border-radius: 0.5rem;
  :hover {
    background: rgba(55, 53, 47, 0.1);
  }
`;

const SubMenuButton = styled.div`
  padding: 0.5rem;
  border-radius: ${(props) => (props.isSelect ? "0.3rem" : null)};
  outline: ${(props) =>
    props.isSelect ? "1px solid rgba(55, 53, 47, 0.1)" : null};
  :hover {
    background: rgba(55, 53, 47, 0.1);
    border-radius: 0.3rem;
  }
`;

const SubMenuWrapper = styled.div`
  position: absolute;
  padding: 0.5rem;
  right: ${(props) => `${props.menuPoint.x}px`};
  top: ${(props) => `${props.menuPoint.y}px`};
  background: white;
  border: 1px solid rgba(55, 53, 47, 0.2);
  border-radius: 0.5rem;
  zindex: 999;
`;
