import React from "react";
import EditComponent from "./EditComponent";
import ImageTag from "./EditorTag/ImageTag";
import MultipleTag from "./EditorTag/MultipleTag";
import CheckBoxTag from "./EditorTag/CheckBoxTag";
import BulletPointTag from "./EditorTag/BulletPointTag";

const EditBranchComponent = ({
  modifyEditDom,
  movementSide,
  data,
  overlayWidth,
}) => {
  const BranchTab = () => {
    let returnComponent;
    const movement = movementSide.uuid === data.uuid ? movementSide : null;

    if (data?.tagName === "multiple") {
      returnComponent = (
        <MultipleTag
          data={data}
          modifyEditDom={modifyEditDom}
          movementSide={movementSide}
        />
      );
    } else if (data?.tagName === "image") {
      returnComponent = (
        <ImageTag
          data={data}
          overlayWidth={overlayWidth}
          movementSide={movementSide}
        />
      );
    } else if (data?.tagName === "checkbox") {
      returnComponent = (
        <CheckBoxTag
          movementSide={movementSide}
          modifyEditDom={modifyEditDom}
          data={data}
          overlayWidth={overlayWidth}
        />
      );
    } else if (data?.tagName === "bullet") {
      returnComponent = (
        <BulletPointTag
          movementSide={movementSide.uuid === data.uuid ? movementSide : null}
          modifyEditDom={modifyEditDom}
          data={data}
          overlayWidth={overlayWidth}
        />
      );
    } else {
      returnComponent = (
        <EditComponent
          data={data}
          modifyEditDom={modifyEditDom}
          movementSide={movementSide.uuid === data.uuid ? movementSide : null}
          overlayWidth={overlayWidth}
        />
      );
    }
    return returnComponent;
  };
  return BranchTab();
};

export default EditBranchComponent;
