import React from "react";
import EditComponent from "./EditComponent";
import ImageTag from "./EditorTag/ImageTag";
import MultipleTag from "./EditorTag/MultipleTag";

const EditBranchComponent = ({
  nearUuid,
  hoverUuid,
  modifyEditDom,
  movementSide,
  data,
}) => {
  const BranchTab = () => {
    let returnComponent;

    if (data?.tagName === "multiple") {
      returnComponent = (
        <MultipleTag
          data={data}
          hoverUuid={hoverUuid}
          modifyEditDom={modifyEditDom}
          movementSide={movementSide}
        />
      );
    } else if (data?.tagName === "image") {
      returnComponent = (
        <ImageTag
          data={data}
          nearUuid={nearUuid}
          hoverUuid={hoverUuid}
          modifyEditDom={modifyEditDom}
          movementSide={movementSide}
        />
      );
    } else {
      returnComponent = (
        <EditComponent
          data={data}
          nearUuid={nearUuid}
          hoverUuid={hoverUuid}
          modifyEditDom={modifyEditDom}
          movementSide={movementSide}
        />
      );
    }
    return returnComponent;
  };
  return BranchTab();
};

export default EditBranchComponent;
