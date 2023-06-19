import React, { useEffect } from "react";
import styled from "@emotion/styled";

const DraggbleSelection = ({ pointer, currentPoint }) => {
  const [point, setPoint] = { x: 0, y: 0 };
  const [size, setSize] = { width: 0, height: 0 };
  console.log({ pointer, currentPoint });
  const left = Math.min(pointer?.x, currentPoint?.x);
  const top = Math.min(pointer?.y, currentPoint?.y);
  const width = Math.abs(pointer?.x - currentPoint?.x);
  const height = Math.abs(pointer?.y - currentPoint?.y);
  const elements = document.elementsFromPoint(pointer, currentPoint);
  console.log(elements);
  useEffect(() => {}, [pointer, currentPoint]);
  return (
    <SelectionWrapper
      left={left}
      top={top}
      width={width}
      height={height}
    ></SelectionWrapper>
  );
};

export default DraggbleSelection;

const SelectionWrapper = styled.div`
  position: absolute;
  left: ${(props) => `${props?.left}px`};
  top: ${(props) => `${props?.top}px`};
  width: ${(props) => `${props?.width}px`};
  height: ${(props) => `${props?.height}px`};

  background: red;
`;
