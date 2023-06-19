import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

const DraggbleSelection = ({ pointer, currentPoint }) => {
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [selectElements, setSelectElements] = useState([]);

  useEffect(() => {
    console.log({ pointer, currentPoint });
    if (pointer && currentPoint) {
      const x = Math.min(pointer?.x, currentPoint?.x);
      const y = Math.min(pointer?.y, currentPoint?.y);
      const width = Math.abs(pointer?.x - currentPoint?.x);
      const height = Math.abs(pointer?.y - currentPoint?.y);
      const elements = document.elementsFromPoint(pointer, currentPoint);
      setPoint({ x, y });
      setSize({ width, height });
      setSelectElements(elements);

      console.log(elements);
    }
  }, [pointer, currentPoint]);
  return <SelectionWrapper point={point} size={size}></SelectionWrapper>;
};

export default DraggbleSelection;

const SelectionWrapper = styled.div`
  position: absolute;
  left: ${(props) => `${props?.point.x}px`};
  top: ${(props) => `${props?.point.y}px`};
  width: ${(props) => `${props?.size.width}px`};
  height: ${(props) => `${props?.size.height}px`};

  background: red;
`;
