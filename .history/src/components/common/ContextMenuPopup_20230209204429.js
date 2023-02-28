import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { useEffect } from "react";

const ContextMenuWarpper = styled.div`
  position: absolute;
  left: ${(props) => props.x + "px"};
  top: ${(props) => props.y + "px"};
  border-radius: 0.5rem;
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
  border-bottom: 1px solid rgba(55, 53, 47, 0.2);
`;

const TextMenu = styled.div`
  padding: 0 0.5rem;
`;

const TextSizeWrapper = styled.div`
  display: flex;
`;

const TextSizeOption = styled.div``;

const ContextMenuPopup = ({
  pointer,
  changeContextMenuYn,
  modifyEditDom,
  popupData,
}) => {
  console.log(popupData?.styleData?.fontSize);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const inputRef = useRef();

  const sizeList = [
    6, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
  ];

  const deleteMenu = () => {
    modifyEditDom(popupData.uuid, {}, "delete");
    changeContextMenuYn(false);
  };

  const changeMenu = () => {
    const tagName = prompt("tagName", "div");
    modifyEditDom(popupData.uuid, { tagName: tagName });
    changeContextMenuYn(false);
  };

  const changeFontSize = async (value) => {
    const prevValue = inputRef.current.value;

    let newValue;
    if (value <= 0) {
      newValue = prevValue;
      inputRef.current.value = prevValue;
    } else {
      newValue = value;
    }

    if (newValue > 0) {
      inputRef.current.value = newValue;
      modifyEditDom(popupData.uuid, { styleData: { fontSize: newValue } });
      await axios.post("/api/editor/style/save", {
        uuid: popupData.uuid,
        fontSize: newValue,
      });
    }
  };

  return (
    <ContextMenuWarpper
      x={pointer?.x}
      y={pointer?.y}
      className="contextMenu"
      onClick={() => {
        if (isFontSizeOpen) {
          setIsFontSizeOpen(false);
        }
      }}
    >
      <TextMenuWrapper>
        <TextMenu>
          <TextSizeWrapper>
            <div style={{ width: "2rem", position: "relative" }}>
              <input
                ref={inputRef}
                value={
                  popupData?.styleData?.fontsize
                    ? popupData?.styleData.fontsize
                    : 16
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = e.target.value;

                    changeFontSize(value);
                    setIsFontSizeOpen(false);
                  }
                }}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^-0-9]/g, "");
                }}
                style={{
                  fontSize: "1.6rem",
                  border: "none",
                  outline: "none",
                  width: "100%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  background: "white",
                  width: "100%",
                  height: !isFontSizeOpen ? "0px" : "11rem",
                  transition: "0.1s",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    border: "1px solid rgba(55, 53, 47, 0.2)",
                    overflow: "scroll",
                    height: "100%",
                  }}
                >
                  {sizeList.map((size, index) => (
                    <TextSizeOption
                      key={index}
                      onClick={() => {
                        changeFontSize(size);
                      }}
                    >
                      {size}
                    </TextSizeOption>
                  ))}
                </div>
              </div>
            </div>

            <div
              onClick={(e) => {
                setIsFontSizeOpen(!isFontSizeOpen);
              }}
              style={{ width: "2rem", textAlign: "center" }}
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
