import React from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

const SubContextMenu = ({
  popupData,
  changeTextStyle,
  changeTextAlignment,
  changeMenu,
  deleteMenu,
  handleLinkClick,
}) => {
  const [menuPoint, setMenuPoint] = useState({ x: -80, y: 0 });
  const [selectMenu, setSelectMenu] = useState(null);

  const menuList = [
    { menuText: "삭제", onClick: deleteMenu },
    { menuText: "변경", onClick: changeMenu },
    {
      menuText: "정렬",
      subMenuList: [
        {
          text: "왼쪽",
          isSelect: popupData?.styleData?.textAlign === "start",
          event: () => {
            changeTextAlignment("start");
          },
        },
        {
          text: "가운데",
          isSelect: popupData?.styleData?.textAlign === "center",
          event: () => {
            changeTextAlignment("center");
          },
        },
        {
          text: "오른쪽",
          isSelect: popupData?.styleData?.textAlign === "end",
          event: () => {
            changeTextAlignment("end");
          },
        },
      ],
    },
    { menuText: "링크", onClick: handleLinkClick },
  ];

  // useEffect(() => {
  //   const subMenuPopup = subMenuRef.current;
  //   if (subMenuPopup) {
  //     const { right, width } = subMenuPopup.getBoundingClientRect();

  //     if (right > window.innerWidth) {
  //       setMenuPoint({ x: right - window.innerWidth - width, y: 0 });
  //     }
  //   }
  // }, [selectMenu]);

  return (
    <SubContextWarpper>
      {menuList.map((item) => (
        <SubContextMenuWrapper onClick={item.onClick} key={item.menuText}>
          {item.menuText}
          {item.subMenuList?.length > 0 && <SubMenuArrow>&gt;</SubMenuArrow>}
          {item.subMenuList && (
            <SubMenuWrapper menuPoint={menuPoint}>
              {item.subMenuList?.map((menu) => (
                <div key={menu.text}>
                  <SubMenuButton onClick={menu.event} isSelect={menu.isSelect}>
                    {menu.text}
                  </SubMenuButton>
                </div>
              ))}
            </SubMenuWrapper>
          )}
        </SubContextMenuWrapper>
      ))}
    </SubContextWarpper>
  );
};

export default SubContextMenu;

const SubContextWarpper = styled.div`
  padding: 0.5rem;
`;

const SubContextMenuWrapper = styled.div`
  z-index: 998;
  position: relative;
  font-size: 1.7rem;
  line-height: 2.8rem;
  padding-left: 0.5rem;
  border-radius: 0.5rem;
  :hover {
    background: rgba(55, 53, 47, 0.1);
  }
`;

const SubMenuArrow = styled.span`
  float: right;
  padding-right: 1rem;
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
  z-index: 999;
`;
