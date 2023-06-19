import React, { useEffect } from "react";
import styled from "@emotion/styled";

const DraggbleSelection = ({ pointer, currentPoint }) => {
  useEffect(() => {
    console.log("pointer :", pointer);
    console.log("currentPoint: ", currentPoint);
  }, []);
  return <SelectionWrapper></SelectionWrapper>;
};

export default DraggbleSelection;

const SelectionWrapper = styled.div`
  position: absolute;
`;
