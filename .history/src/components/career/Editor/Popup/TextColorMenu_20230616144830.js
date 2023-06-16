import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import ColorPicker from "../../../common/ColorPicker";

const TextColorMenu = ({
  uuid,
  changeSelectSubMenu,
  color,
  setColor,
  handleToggle,
  changeTextStyle,
}) => {
  const [isSketchOpen, setIsSketchOpen] = useState(false);
  const handleOutsideClick = (e) => {
    const isOutside = !e.target.closest("[name=color-picker]");

    if (isOutside) {
      setIsSketchOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  const handleColorChange = async (e) => {
    const rgba = e.rgb;
    const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
    setColor(rgbaText);
    const style = { color: rgbaText };
    changeTextStyle(uuid, style);
  };
  return (
    <TextMenu
      onMouseEnter={changeSelectSubMenu}
      onClick={(e) => {
        const sketchElement = e.target.closest(".color-picker");
        const cancelButton = e.target.closest(".cancel-button");
        if (!sketchElement && !cancelButton) {
          setIsSketchOpen((prev) => !prev);
        }
      }}
    >
      {color && (
        <ColorCancelButton
          className="cancel-button"
          onClick={() => handleToggle(color, setColor, "color", "")}
        >
          <ColorCancelButtonImg
            src={process.env.PUBLIC_URL + "/images/xmark.svg"}
          />
        </ColorCancelButton>
      )}
      A
      <PickerPreview color={color} />
      {isSketchOpen && (
        <ColorPicker
          className="color-picker"
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
