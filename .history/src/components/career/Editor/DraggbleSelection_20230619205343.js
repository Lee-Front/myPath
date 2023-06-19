import React, { useEffect } from "react";
import styled from "@emotion/styled";

const DraggbleSelection = () => {
  useEffect(() => {
    console.log("AAA");
  }, []);
  return <SelectionWrapper></SelectionWrapper>;
};

export default DraggbleSelection;

const SelectionWrapper = styled.div`
  position: absolute;
`;
