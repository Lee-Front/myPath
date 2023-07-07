import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { SketchPicker } from "react-color";

const ColorPicker = ({ color, handleChange }) => {
  const pickerRef = useRef(null);
  const [pickerPosition, setPickerPosition] = useState({
    horizontal: "bottom",
    vertical: "right",
  });
  useEffect(() => {
    const rect = pickerRef.current.getBoundingClientRect();
    const top = window.innerHeight < rect.y + rect.height;
    const left = window.innerWidth < rect.x + rect.width;
    setPickerPosition({
      horizontal: left ? "left" : "right",
      vertical: top ? "top" : "bottom",
    });
  }, []);
  return (
    <PickerContainer
      name="color-picker"
      ref={pickerRef}
      pickerPosition={pickerPosition}
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
  top: 100%;
  left: 0;
  z-index: 1;
`;
