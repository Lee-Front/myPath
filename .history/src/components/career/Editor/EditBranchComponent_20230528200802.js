import React from "react";
import EditComponent from "./EditComponent";
import ImageTag from "./EditorTag/ImageTag";
import MultipleTag from "./EditorTag/MultipleTag";
import CheckBoxTag from "./EditorTag/CheckBoxTag";
import BulletPointTag from "./EditorTag/BulletPointTag";
import EditableTag from "./EditorTag/EditableTag";

const EditBranchComponent = ({
  updateElement,
  movementSide,
  changeShowFileUploader,
  data,
  overlayWidth,
}) => {
  const BranchTab = () => {
    let returnComponent;
    const movement = movementSide?.uuid === data.uuid ? movementSide : null;

    if (data?.tagName === "multiple") {
      returnComponent = (
        <MultipleTag
          data={data}
          updateElement={updateElement}
          movementSide={movementSide}
          changeShowFileUploader={changeShowFileUploader}
        />
      );
    } else if (data?.tagName === "image") {
      returnComponent = (
        <ImageTag
          data={data}
          overlayWidth={overlayWidth}
          movementSide={movement}
          changeShowFileUploader={changeShowFileUploader}
        />
      );
    } else if (data?.tagName === "checkbox") {
      returnComponent = (
        <CheckBoxTag
          movementSide={movement}
          updateElement={updateElement}
          data={data}
          overlayWidth={overlayWidth}
        />
      );
    } else if (data?.tagName === "bullet") {
      returnComponent = (
        <BulletPointTag
          movementSide={movement}
          updateElement={updateElement}
          data={data}
          overlayWidth={overlayWidth}
        />
      );
    } else {
      returnComponent = (
        <EditableTag
          data={data}
          updateElement={updateElement}
          movementSide={movement}
          overlayWidth={overlayWidth}
        />
      );
    }
    return returnComponent;
  };
  return BranchTab();
};

export default EditBranchComponent;