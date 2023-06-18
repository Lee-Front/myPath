import React from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

const SubContextMenu = ({
  popupData,
  changeTextStyle,
  changeTextAlignment,
}) => {
  const [menuPoint, setMenuPoint] = useState({ x: -80, y: 0 });
  const [selectMenu, setSelectMenu] = useState(null);
  const menuRef = useRef();
  const subMenuRef = useRef();

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
      {/* <SubContextMenu
        selectMenu={selectMenu}
        //changeSelectSubMenu={changeSelectSubMenu}
        menuText="삭제"
        onClick={() => {
          //deleteMenu();
        }}
      />
      <SubContextMenu
        selectMenu={selectMenu}
        //changeSelectSubMenu={changeSelectSubMenu}
        menuText="변경"
        onClick={() => {
          //changeMenu();
        }}
      />
      <SubContextMenu
        selectMenu={selectMenu}
        //changeSelectSubMenu={changeSelectSubMenu}
        menuText="정렬"
        // subMenuList={[
        //   {
        //     text: "왼쪽",
        //     isSelect: popupData?.styleData?.textAlign === "flex-start",
        //     event: () => {
        //       changeTextAlignment("start");
        //     },
        //   },
        //   {
        //     text: "가운데",
        //     isSelect: popupData?.styleData?.textAlign === "center",
        //     event: function () {
        //       changeTextAlignment("center");
        //     },
        //   },
        //   {
        //     text: "오른쪽",
        //     isSelect: popupData?.styleData?.textAlign === "flex-end",
        //     event: function () {
        //       changeTextAlignment("end");
        //     },
        //   },
        // ]}
      />
      <SubContextMenu
        selectMenu={selectMenu}
        //changeSelectSubMenu={changeSelectSubMenu}
        menuText="링크"
        onClick={() => {
          const link = prompt("링크를 입력해주세요");

          if (link && link.length > 0) {
            const style = {
              link: link,
            };
            changeTextStyle(popupData.uuid, style);
          }
        }}
      /> */}
    </SubContextWarpper>
    // <SubContextMenuWrapper
    //   name="subMenu"
    //   ref={menuRef}
    //   onClick={() => {
    //     if (!subMenuList && onClick) {
    //       onClick();
    //     }
    //   }}
    //   onMouseEnter={changeSelectSubMenu}
    // >
    //   {menuText}
    //   {subMenuList?.length > 0 && <SubMenuArrow>&gt;</SubMenuArrow>}
    //   {subMenuList && (
    //     <SubMenuWrapper ref={subMenuRef} menuPoint={menuPoint}>
    //       {subMenuList?.map((menu) => (
    //         <div key={menu.text}>
    //           <SubMenuButton onClick={menu.event} isSelect={menu.isSelect}>
    //             {menu.text}
    //           </SubMenuButton>
    //         </div>
    //       ))}
    //     </SubMenuWrapper>
    //   )}
    // </SubContextMenuWrapper>
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
