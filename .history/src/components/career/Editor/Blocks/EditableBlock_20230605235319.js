import React from "react";
import styled from "@emotion/styled";
import EditableComponent from "../EditableComponent";

const EditableBlock = ({ updateElement, data, style }) => {
  return (
    <>
      <EditableComponent data={data} updateElement={updateElement} />
      {style ? <div style={style}></div> : null}
    </>
  );
};

export default EditableBlock;