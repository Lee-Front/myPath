import React, { useEffect } from "react";
import styled from "@emotion/styled";

const DraggbleSelection = ({ pointer, currentPoint }) => {
  const left = Math.min(pointer?.x, currentPoint?.x);
  const top = Math.min(pointer?.y, currentPoint?.y);
  const width = Math.abs(pointer?.x - currentPoint?.x);
  const height = Math.abs(pointer?.y - currentPoint?.y);
  useEffect(() => {}, [pointer, currentPoint]);
  return (
    <SelectionWrapper
      left={left}
      right={top}
      width={width}
      height={height}
    ></SelectionWrapper>
  );
};

export default DraggbleSelection;

const SelectionWrapper = styled.div`
  position: absolute;
  /* left: 0;
  right: 100px;
  top: 0;
  bottom: 100px; */
  left: ${(props) => `${props?.left}px`};
  top: ${(props) => `${props?.top}px`};
  width: ${(props) => `${props?.width}px`};
  height: ${(props) => `${props?.height}px`};

  background: red;
`;
