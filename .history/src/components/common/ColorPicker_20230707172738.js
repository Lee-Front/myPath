import React from "react";
import styled from "@emotion/styled";
import { SketchPicker, BlockPicker } from "react-color";

const ColorPicker = ({ color, handleChange }) => {
  return (
    <PickerContainer name="color-picker">
      <BlockPicker
        triangle={"top"}
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
`;
