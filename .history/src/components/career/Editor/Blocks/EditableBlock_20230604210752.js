import React, { useState } from "react";
import styled from "@emotion/styled";
import EditableComponent from "../EditableComponent";

const EditableBlock = ({ updateElement, data, style }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <BlockContainer>
      <EditableComponent data={data} updateElement={updateElement} />
      {isHover ? (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            pointerEvents: "none",
            background: "rgba(55, 53, 47, 0.1)",
          }}
        ></div>
      ) : null}
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
