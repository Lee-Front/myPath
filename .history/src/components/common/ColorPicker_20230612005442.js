import React from "react";
import styled from "@emotion/styled";
import { SketchPicker } from "react-color";
import axios from "axios";

const ColorPicker = ({ uuid, color, setColor, changeTextStyle }) => {
  const handleChange = (e) => {
    const rgba = e.rgb;
    const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
    setColor(rgbaText);
    const style = { color: rgbaText };
    changeTextStyle(style);
  };
  return (
    <PickerContainer className="color-sketch">
      <SketchPicker
        color={color}
        onChange={handleChange}
        onChangeComplete={async (e) => {
          const rgba = e.rgb;
          const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;

          const style = { color: rgbaText };
          changeTextStyle(style);

          await axios.post("/api/editor/style", {
            uuid: uuid,
            color: rgbaText,
          });
        }}
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