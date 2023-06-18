import React from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

const SubContextMenu = ({
  selectMenu,
  changeSelectSubMenu,
  menuText,
  onClick,
  subMenuList,
}) => {
  const [menuPoint, setMenuPoint] = useState({ x: -80, y: 0 });
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const menuRef = useRef();
  const subMenuRef = useRef();

  useEffect(() => {
    if (subMenuList && selectMenu === menuRef.current) {
      const subMenuPopup = subMenuRef.current;
      const { right, width } = subMenuPopup.getBoundingClientRect();

      if (right > window.innerWidth) {
        setMenuPoint({ x: right - window.innerWidth - width, y: 0 });
      }
      setIsSubMenuOpen(true);
    } else {
      setIsSubMenuOpen(false);
    }
  }, [selectMenu, subMenuList]);

  return (
    <SubContextMenuWrapper
      ref={menuRef}
      onClick={() => {
        if (!subMenuList && onClick) {
          onClick();
        }
      }}
      onMouseEnter={changeSelectSubMenu}
      // onMouseLeave={(e) => {
      //   if (!subMenuList) {
      //     changeSelectSubMenu(null);
      //   }
      // }}
    >
      <div>
        {menuText}
        {subMenuList?.length > 0 && (
          <span style={{ float: "right", paddingRight: "1rem" }}>&gt;</span>
        )}
      </div>
      {isSubMenuOpen && (
        <div
          ref={subMenuRef}
          style={{
            position: "absolute",
            padding: "0.5rem",
            right: menuPoint.x + "px",
            top: menuPoint.y + "px",
            background: "white",
            border: "1px solid rgba(55, 53, 47, 0.2)",
            borderRadius: "0.5rem",
            zIndex: 999,
          }}
        >
          {subMenuList?.map((menu) => (
            <div key={menu.text}>
              <SubMenuButtonWrapper
                onClick={menu.event}
                isSelect={menu.isSelect}
              >
                {menu.text}
              </SubMenuButtonWrapper>
            </div>
          ))}
        </div>
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

const SubMenuButtonWrapper = styled.div`
  padding: 0.5rem;
  border-radius: ${(props) => (props.isSelect ? "0.3rem" : null)};
  outline: ${(props) =>
    props.isSelect ? "1px solid rgba(55, 53, 47, 0.1)" : null};
  :hover {
    background: rgba(55, 53, 47, 0.1);
    border-radius: 0.3rem;
  }
`;
