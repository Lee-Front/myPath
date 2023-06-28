import React from "react";
import EditableComponent from "../EditableComponent";

const EditableBlock = ({ data, style }) => {
  return (
    <>
      <EditableComponent data={data} />
      {style ? <div style={style}></div> : null}
    </>
  );
};

export default EditableBlock;
