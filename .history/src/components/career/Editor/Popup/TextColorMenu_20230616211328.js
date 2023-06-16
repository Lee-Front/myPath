import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import ColorPicker from "../../../common/ColorPicker";

const TextColorMenu = ({
  uuid,
  changeSelectSubMenu,
  color,
  handleColorChange,
  handleColorDelete,
  children,
}) => {
  const [isSketchOpen, setIsSketchOpen] = useState(false);
  const buttonRef = useRef(null);

  const handleOutsideClick = (e) => {
    const buttonElement = e.target.closest("[name=menu-button]");

    console.log("buttonElement: ", buttonElement);
    if (!buttonElement || buttonElement !== buttonRef.current) {
      console.log("1");
      setIsSketchOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <TextMenu
      ref={buttonRef}
      name="menu-button"
      onMouseEnter={changeSelectSubMenu}
      onClick={(e) => {
        // TextMenu버튼을 누를시에는 무조건
        // 팔레티를 눌렀을때는 아님
        const isColorPicker = e.target.closest("[name=color-picker]");
        const cancelButton = e.target.closest(".cancel-button");

        if (!isColorPicker && !cancelButton) {
          console.log("a");
          setIsSketchOpen((prev) => !prev);
        }
      }}
    >
      {color && (
        <ColorCancelButton
          className="cancel-button"
          onClick={handleColorDelete}
        >
          <ColorCancelButtonImg
            src={process.env.PUBLIC_URL + "/images/xmark.svg"}
          />
        </ColorCancelButton>
      )}
      {children}
      <PickerPreview color={color} />
      {isSketchOpen && (
        <ColorPicker
          uuid={uuid}
          color={color}
          handleChange={handleColorChange}
        />
      )}
    </TextMenu>
  );
};

export default TextColorMenu;

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
    props.isActive ? "0.2rem solid rgba(55, 53, 47, 0.2)" : null};

  border-radius: 0.3rem;
  :hover {
    background: rgba(55, 53, 47, 0.1);
    border-radius: 0.3rem;
  }
`;

const ColorCancelButton = styled.div`
  position: absolute;
  background: white;
  right: 0;
  top: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
`;

const ColorCancelButtonImg = styled.img``;

const PickerPreview = styled.div`
  width: 3rem;
  height: 1.2rem;
  border-radius: 0.2rem;
  background: ${(props) => props.color};
  border: 1px solid rgba(55, 53, 47, 0.2);
`;
