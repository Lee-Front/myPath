import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

const sizeList = [16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
const fontSizeReg = /[^-0-9]/g;

const FontSizeSelector = ({
  uuid,
  isSubMenu,
  defaultValue,
  fontSize,
  onMouseEnter,
  changeTextStyle,
}) => {
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const parsedFontSize =
    fontSize && parseInt(String(fontSize)?.replace(fontSizeReg, ""));
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.value = parsedFontSize || defaultValue;
  }, [parsedFontSize, defaultValue]);

  useEffect(() => {
    setIsFontSizeOpen(false);
  }, [isSubMenu]);

  const handleOutsideClick = (e) => {
    const isOutside = !e.target.closest("[name=font-size-selector]");

    if (isOutside) {
      setIsFontSizeOpen(false);
    }
  };

  const changeFontSize = async (value) => {
    let newValue = value > 16 ? value : 16;

    inputRef.current.value = newValue;
    if (newValue === defaultValue) {
      console.log("?");
      newValue = "";
    } else {
      newValue = newValue + "px";
    }

    const style = { "font-size": newValue };
    changeTextStyle(uuid, style);
  };

  const handleClick = (e) => {
    const cancelButton = e.target.closest("[name=cancel-button]");
    if (!cancelButton) {
      setIsFontSizeOpen(!isFontSizeOpen);
    }
  };

  const handleReset = () => {
    inputRef.current.value = defaultValue;
    changeFontSize(defaultValue);
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value;
      changeFontSize(value);
      setIsFontSizeOpen(false);
    }
  };

  const handleChange = (e) => {
    e.target.value = e.target.value.replace(/[^-0-9]/g, "");
  };

  return (
    <TextMenu
      name="font-size-selector"
      onMouseEnter={onMouseEnter}
      onClick={handleClick}
    >
      {fontSize && (
        <ColorCancelButton name="cancel-button" onClick={handleReset}>
          <ColorCancelButtonImg
            src={process.env.PUBLIC_URL + "/images/xmark.svg"}
          />
        </ColorCancelButton>
      )}

      <TextSizeWrapper>
        <FontInput
          ref={inputRef}
          defaultValue={parsedFontSize || defaultValue}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
        <FontSizeButton>▼</FontSizeButton>
        <FontSizeListContainer isFontSizeOpen={isFontSizeOpen}>
          <FontSizeList>
            {sizeList.map((size, index) => (
              <TextSizeOption
                key={index}
                onMouseUp={() => {
                  changeFontSize(size);
                }}
              >
                {size}
              </TextSizeOption>
            ))}
          </FontSizeList>
        </FontSizeListContainer>
      </TextSizeWrapper>
    </TextMenu>
  );
};

export default FontSizeSelector;

const TextMenu = styled.div`
  position: relative;
  min-width: 4rem;
  padding: 0 0.5rem;
  height: 4rem;
  display: flex;
  text-align: center;
  font-size: 1.5rem;

  flex-direction: column;
  justify-content: center;

  border: ${(props) =>
    props.border ? "0.2rem solid rgba(55, 53, 47, 0.2)" : null};

  border-radius: 0.3rem;
  :hover {
    background: rgba(55, 53, 47, 0.1);
    border-radius: 0.3rem;
  }
`;

const TextSizeWrapper = styled.div`
  display: flex;
  position: relative;
`;

const FontInput = styled.input`
  font-size: 1.6rem;
  border: none;
  outline: none;
  width: 100%;
  background: none;
`;

const FontSizeButton = styled.div`
  width: 2rem;
  text-align: center;
`;

const FontSizeListContainer = styled.div`
  position: absolute;
  top: 100%;
  width: 100%;
  height: ${(props) => (!props.isFontSizeOpen ? "0px" : "17rem")};
  transition: 0.1s;
  overflow: hidden;
`;

const FontSizeList = styled.div`
  border: 1px solid rgba(55, 53, 47, 0.2);
  overflow: auto;
  height: 100%;
  background: white;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }
`;

const TextSizeOption = styled.div`
  text-align: center;
  :hover {
    background: rgba(55, 53, 47, 0.2);
  }
`;

const ColorCancelButton = styled.div`
  z-index: 1;
  position: absolute;
  background: white;
  right: 0;
  top: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
`;

const ColorCancelButtonImg = styled.img`
  width: 100%;
  height: 100%;
`;
