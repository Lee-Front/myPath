import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { SketchPicker } from "react-color";

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
  height: 3.3rem;
  display: flex;

  flex-direction: column;
  justify-content: center;

  :hover {
    background: rgba(55, 53, 47, 0.2);
    border-radius: 0.3rem;
  }
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
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [isSketchOpen, setIsSketchOpen] = useState(false);
  const [color, setColor] = useState(popupData?.styleData?.color);
  const inputRef = useRef();

  const sizeList = [10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

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
    console.log("prevValue: ", prevValue);

    let fontSize;
    if (value < 10) {
      fontSize = prevValue;
      inputRef.current.value = prevValue;
    } else {
      fontSize = value;
    }

    if (fontSize >= 10) {
      inputRef.current.value = fontSize;
      modifyEditDom(popupData.uuid, {
        styleData: { ...popupData?.styleData, fontSize },
      });
      await axios.post("/api/editor/style/save", {
        uuid: popupData.uuid,
        fontSize,
      });
    }
  };

  const changeColor = async () => {
    if (popupData?.styleData?.color !== color) {
      modifyEditDom(popupData.uuid, {
        styleData: { ...popupData?.styleData, color },
      });
      await axios.post("/api/editor/style/save", {
        uuid: popupData.uuid,
        color,
      });
    }
  };

  return (
    <ContextMenuWarpper
      x={pointer?.x}
      y={pointer?.y}
      className="contextMenu"
      onClick={(e) => {
        if (isFontSizeOpen) {
          setIsFontSizeOpen(false);
        }

        const sketchElement = e.target.closest(".color-sketch");
        // 팔레트가 아니고 팝업이 열려있으면
        if (!sketchElement && isSketchOpen) {
          setIsSketchOpen(false);
          changeColor();
        }
      }}
    >
      <TextMenuWrapper>
        <TextMenu>
          <TextSizeWrapper>
            <div style={{ width: "2rem", position: "relative" }}>
              <input
                ref={inputRef}
                defaultValue={
                  popupData?.styleData?.fontSize
                    ? popupData?.styleData?.fontSize
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
                  fontSize: "1.8rem",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  background: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: !isFontSizeOpen ? "0px" : "17rem",
                  transition: "0.1s",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    border: "1px solid rgba(55, 53, 47, 0.2)",
                    overflow: "scroll",
                    height: "100%",
                    background: "white",
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
              onClick={() => {
                setIsFontSizeOpen(!isFontSizeOpen);
              }}
              style={{ width: "2rem", textAlign: "center" }}
            >
              ▼
            </div>
          </TextSizeWrapper>
        </TextMenu>
        <div>
          <TextMenu
            onClick={() => {
              setIsSketchOpen(!isSketchOpen);
            }}
          >
            글씨
            <div
              style={{
                width: "3rem",
                height: "1.2rem",
                borderRadius: "0.2rem",
                background: color,
              }}
            ></div>
          </TextMenu>
          {isSketchOpen ? (
            <div className="color-sketch" style={{ position: "absolute" }}>
              <SketchPicker
                color={color}
                onChange={(e) => {
                  const color = e.hex;
                  setColor(color);
                }}
              />
            </div>
          ) : null}
        </div>

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
