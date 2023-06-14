import React from "react";
import styled from "@emotion/styled";
import { SketchPicker } from "react-color";

const ColorPicker = ({ color, handleChange, handleChangeComplete }) => {
  return (
    <PickerContainer className="color-sketch">
      <SketchPicker
        color={color || ""}
        onChange={handleChange}
        onChangeComplete={handleChangeComplete}
      />
    </PickerContainer>
  );
};

export default ColorPicker;

const PickerContainer = styled.div`
  position: absolute;
  margintop: 0.2rem;
  top: 100%;
  left: 0;
`;
