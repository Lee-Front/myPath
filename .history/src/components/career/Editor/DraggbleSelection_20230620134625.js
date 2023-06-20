import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { throttle } from "lodash";

const DraggbleSelection = ({ startPointe, currentPoint }) => {
  const [selection, setSelection] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [selectElements, setSelectElements] = useState([]);

  useEffect(() => {
    const updateSelection = throttle((point, endPointe) => {
      if (point && endPointe) {
        const x = Math.min(point?.x, endPointe?.x);
        const y = Math.min(point?.y, endPointe?.y);
        const width = Math.abs(point?.x - endPointe?.x);
        const height = Math.abs(point?.y - endPointe?.y);
        const elements = document.querySelectorAll("[data-uuid]");

        const insideElements = Array.from(elements).filter((item) => {
          const rect = item.getBoundingClientRect();

          const overlapX = Math.max(
            0,
            Math.min(rect.right, x + width) - Math.max(rect.left, x)
          );
          const overlapY = Math.max(
            0,
            Math.min(rect.bottom, y + height) - Math.max(rect.top, y)
          );

          if (overlapX > 0 && overlapY > 0) {
            return true;
          }
        });

        setSelection({ x, y, width, height });
        setSelectElements(insideElements);
      }
    }, 2000);

    updateSelection(startPointe, currentPoint);
  }, [startPointe, currentPoint]);

  return <SelectionWrapper selection={selection}></SelectionWrapper>;
};

export default DraggbleSelection;

const SelectionWrapper = styled.div`
  position: absolute;

  left: ${(props) => `${props?.selection.x}px`};
  top: ${(props) => `${props?.selection.y}px`};
  width: ${(props) => `${props?.selection.width}px`};
  height: ${(props) => `${props?.selection.height}px`};

  background: rgba(35, 131, 226, 0.14);
`;
