import React from "react";
import EditComponent from "./EditComponent";
import ImageTag from "./EditorTag/ImageTag";
import MultipleTag from "./EditorTag/MultipleTag";

const EditBranchComponent = ({
  nearUuid,
  modifyEditDom,
  movementSide,
  data,
}) => {
  const BranchTab = () => {
    let returnComponent;
    console.log("movementSide : ", movementSide);

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
          nearUuid={nearUuid}
          modifyEditDom={modifyEditDom}
          movementSide={movementSide}
        />
      );
    } else {
      if (data.uuid === movementSide.uuid) {
        console.log("movementSide: ", movementSide);
      }
      returnComponent = (
        <EditComponent
          data={data}
          nearUuid={nearUuid}
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
