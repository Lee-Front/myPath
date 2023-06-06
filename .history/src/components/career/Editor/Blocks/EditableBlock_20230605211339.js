import React from "react";
import styled from "@emotion/styled";
import EditableComponent from "../EditableComponent";

const EditableBlock = ({ updateElement, data, style }) => {
  return (
    <BlockContainer>
      <EditableComponent data={data} updateElement={updateElement} />
      {style ? <div style={style}></div> : null}
    </BlockContainer>
  );
};

export default EditableBlock;

const BlockContainer = styled.div`
  text-align: ${(props) =>
    props?.styleData?.textAlign ? props?.styleData?.textAlign : null};
  font-size: ${(props) =>
    props?.styleData?.fontSize ? props?.styleData?.fontSize + "px" : "1.6rem"};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};
`;
