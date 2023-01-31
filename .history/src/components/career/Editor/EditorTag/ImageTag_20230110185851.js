import React from "react";
import styled from "@emotion/styled";

const TagWrapper = styled.div`
  outline: none;
  line-height: 1.5;
  padding: 0 0.4rem;
`;
const ImageTag = ({ hoverUuid, modifyEditDom, movementSide, data }) => {
  console.log("data : ", data);
  return (
    <TagWrapper>
      <div uuid={data.uuid} style={{ position: "relative" }}>
        1
      </div>
    </TagWrapper>
  );
};

export default ImageTag;
