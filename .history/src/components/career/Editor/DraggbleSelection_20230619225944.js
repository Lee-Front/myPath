import React, { useEffect } from "react";
import styled from "@emotion/styled";

const DraggbleSelection = ({ pointer, currentPoint }) => {
  useEffect(() => {
    const [minX, maxX] = [pointer.x, currentPoint.x].sort((a, b) => a - b);
    const [minY, maxY] = [pointer.y, currentPoint.y].sort((a, b) => a - b);
  }, [pointer, currentPoint]);
  return (
    <SelectionWrapper
      pointer={pointer}
      currentPoint={currentPoint}
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
  left: ${(props) => `${props.pointer?.x}px`};
  right: ${(props) => `${props.currentPoint?.x}px`};
  top: ${(props) => `${props.pointer?.y}px`};
  bottom: ${(props) => `${props.currentPoint?.y}px`};
  background: red;
`;