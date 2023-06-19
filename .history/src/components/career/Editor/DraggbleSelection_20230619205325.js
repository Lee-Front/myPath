import React from "react";
import styled from "@emotion/styled";

const DraggbleSelection = () => {
  console.log("드래그");
  return <SelectionWrapper></SelectionWrapper>;
};

export default DraggbleSelection;

const SelectionWrapper = styled.div`
  position: absolute;
`;
