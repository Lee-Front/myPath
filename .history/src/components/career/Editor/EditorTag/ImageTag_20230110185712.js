import React from "react";
import style from "@emotion/styled";

const EditableTag = styled.div`
  outline: none;
  line-height: 1.5;
  padding: 0 0.4rem;
`;
const ImageTag = ({ hoverUuid, modifyEditDom, movementSide, data }) => {
  return (
    <div uuid={data.uuid} style={{ position: "relative" }}>
      1
    </div>
  );
};

export default ImageTag;
