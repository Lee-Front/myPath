import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { SketchPicker } from "react-color";

const ColorPicker = ({ color, handleChange }) => {
  useEffect(() => {
    console.log("피커");
  }, []);
  return (
    <PickerContainer name="color-picker">
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
  //top: 100%;
  left: 0;
  z-index: 1;
`;
