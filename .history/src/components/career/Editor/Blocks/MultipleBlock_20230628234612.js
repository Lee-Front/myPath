import React from "react";
import EditBranchComponent from "../EditBranchComponent";
import styled from "@emotion/styled";

const MultipleBlock = ({
  movementSide,
  data,
  changeShowFileUploader,
  style,
  isOverlay,
}) => {
  return (
    <RowWrapper blockDirection={data?.direction}>
      {data?.multipleData.map((element) => (
        <ColumnWrapper key={element?.uuid} blockWidth={element?.width}>
          <EditBranchComponent
            key={element.uuid}
            data={element}
            movementSide={movementSide}
            changeShowFileUploader={changeShowFileUploader}
            isOverlay={isOverlay}
          />
        </ColumnWrapper>
      ))}
      {style ? <div style={style}></div> : null}
    </RowWrapper>
  );
};

export default MultipleBlock;

const RowWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: ${(props) => props.blockDirection};
  flex: 1;
  padding: 0.3rem 0;
`;

const ColumnWrapper = styled.div`
  width: ${(props) => (props.blockWidth ? `${props.blockWidth}%` : `100%`)};
  /* width: ${(props) =>
    `${
      props.direction && props.width
        ? `calc(100% * ${props.width} / 100)`
        : `100%`
    }`}; */
`;
