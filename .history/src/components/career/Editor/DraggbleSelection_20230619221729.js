import React, { useEffect } from "react";
import styled from "@emotion/styled";

const DraggbleSelection = ({ pointer, currentPoint }) => {
  useEffect(() => {
    console.log("pointer :", pointer);
    console.log("currentPoint: ", currentPoint);
  });
  return <SelectionWrapper></SelectionWrapper>;
};

export default DraggbleSelection;

const SelectionWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 10px;
  top: 0;
  bottom: 10px;
  /* left: ${(props) => `${props.pointer?.x}px`};
  right: ${(props) => `${props.currentPoint?.x}px`};
  top: ${(props) => `${props.pointer?.y}px`};
  bottom: ${(props) => `${props.currentPoint?.y}px`}; */
  background: red;
`;
