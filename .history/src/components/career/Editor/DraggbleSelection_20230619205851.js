import React, { useEffect } from "react";
import styled from "@emotion/styled";

const DraggbleSelection = ({ pointer }) => {
  useEffect(() => {
    console.log("pointer :", pointer);
  }, []);
  return <SelectionWrapper></SelectionWrapper>;
};

export default DraggbleSelection;

const SelectionWrapper = styled.div`
  position: absolute;
`;
