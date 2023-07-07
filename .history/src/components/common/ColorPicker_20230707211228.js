import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { SketchPicker } from "react-color";

const ColorPicker = ({ color, handleChange }) => {
  const pickerRef = useRef(null);
  const [orientation, setOrientation] = useState({
    horizontal: "bottom",
    vertical: "right",
  });
  console.log("orientation : ", orientation);
  useEffect(() => {
    const rect = pickerRef.current.getBoundingClientRect();
    console.log("rect : ", rect);
    const top = window.innerHeight < rect.y + rect.height;
    const left = window.innerWidth < rect.x + rect.width;

    setOrientation({
      horizontal: left ? "left" : "right",
      vertical: top ? "top" : "bottom",
    });
  }, []);
  return (
    <PickerContainer
      name="color-picker"
      ref={pickerRef}
      pickerOrientation={orientation}
    >
      <SketchPicker
        color={color || ""}
        onChange={handleChange}
        onChangeComplete={handleChange}
      />
    </PickerContainer>
  );
};

export default ColorPicker;

const PickerContainer = styled.div`
  position: absolute;
  margin-top: 0.2rem;
  ${(props) => {
    return props.pickerOrientation.horizontal === "left"
      ? "left: 100%"
      : "left: -100%";
  }};
  ${(props) => {
    return props.pickerOrientation.vertical === "top"
      ? "bottom: 100%"
      : "top: 100%";
  }};
  z-index: 1;
`;
