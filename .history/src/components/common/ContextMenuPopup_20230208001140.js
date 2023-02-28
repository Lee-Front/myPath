import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";

const ContextMenuWarpper = styled.div`
  position: absolute;
  left: ${(props) => props.x + "px"};
  top: ${(props) => props.y + "px"};
  border-radius: 0.5rem;
  //padding: 0.5rem;
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

const TextMenuWrapper = styled.div`
  display: flex;
  padding: 0.5rem;
  border-bottom: 1px solid black;
`;

const TextMenu = styled.div`
  padding: 0 0.5rem;
`;

const TextSizeWrapper = styled.div`
  display: flex;
`;

const ContextMenuPopup = ({
  pointer,
  changeContextMenuYn,
  modifyEditDom,
  hoverUuid,
}) => {
  const [uuid, setUuid] = useState(hoverUuid);
  const [fontData, setFontData] = useState({});
  const [isOptionOpen, setIsOptionOpen] = useState(false);

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
      <TextMenuWrapper>
        <TextMenu>
          <TextSizeWrapper>
            <div style={{ width: "2rem" }}>
              <input
                defaultValue="10"
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^-0-9]/g, "");
                }}
                style={{
                  fontSize: "1.5rem",
                  border: "none",
                  outline: "none",
                  width: "100%",
                }}
              />
              {isOptionOpen ? (
                <div>
                  <div>1</div>
                  <div>2</div>
                  <div>3</div>
                </div>
              ) : null}
            </div>

            <div
              onClick={(e) => {
                setIsOptionOpen(!isOptionOpen);
              }}
            >
              ▼
            </div>
          </TextSizeWrapper>
        </TextMenu>
        <TextMenu>색상</TextMenu>
        <TextMenu>글꼴</TextMenu>
        <TextMenu>B</TextMenu>
        <TextMenu>i</TextMenu>
        <TextMenu>U</TextMenu>
        <TextMenu>S</TextMenu>
      </TextMenuWrapper>
      <div style={{ padding: "0.5rem" }}>
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
