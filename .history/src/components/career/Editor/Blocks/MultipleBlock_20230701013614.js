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
    <RowWrapper blockDirection={data?.direction} direction={data?.direction}>
      {data?.multipleData.map((element, index) => (
        <Fragment key={element?.uuid}>
          <EditBranchComponent
            key={element.uuid}
            data={element}
            movementSide={movementSide}
            changeShowFileUploader={changeShowFileUploader}
            isOverlay={isOverlay}
          />
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

const HandleWrapper = styled.div`
  width: 2rem;
  height: 100%;
  background: gray;
`;
