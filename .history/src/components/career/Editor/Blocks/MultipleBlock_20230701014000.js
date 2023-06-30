import React, { Fragment } from "react";
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
      {data?.multipleData.map((element, index) => (
        <Fragment key={element?.uuid}>
          <ColumnWrapper blockWidth={element?.width}>
            <EditBranchComponent
              key={element.uuid}
              data={element}
              movementSide={movementSide}
              changeShowFileUploader={changeShowFileUploader}
              isOverlay={isOverlay}
            />
          </ColumnWrapper>
          {index !== data?.multipleData.length - 1 && <HandleWrapper />}
        </Fragment>
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
  padding: 0.2rem 0;
`;

const ColumnWrapper = styled.div`
  width: ${(props) => (props.blockWidth ? `${props.blockWidth}%` : `100%`)};
`;

const HandleWrapper = styled.div`
  width: 2rem;
  height: 100%;
  background: gray;
`;
