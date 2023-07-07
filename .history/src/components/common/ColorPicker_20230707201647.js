import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { SketchPicker } from "react-color";

const ColorPicker = ({ color, handleChange }) => {
  const pickerRef = useRef(null);
  useEffect(() => {
    const rect = pickerRef.current.getBoundingClientRect();
    console.log("window.innerHeight: ", window.innerHeight);
    console.log("react : ", rect);
    console.log(window.innerHeight > rect.y + rect.height);
  }, []);
  return (
    <PickerContainer name="color-picker" ref={pickerRef}>
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
