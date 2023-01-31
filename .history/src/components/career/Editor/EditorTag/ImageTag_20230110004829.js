import React from "react";

const ImageTag = ({ hoverUuid, modifyEditDom, movementSide, data }) => {
  return <div uuid={data.uuid} style={{ position: "relative" }}></div>;
};

export default ImageTag;
