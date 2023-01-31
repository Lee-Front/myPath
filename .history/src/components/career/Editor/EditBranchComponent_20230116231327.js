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

    const getMovementStyle = (movementSide) => {
      const styleObject = {
        position: "absolute",
        background: "rgba(35,131,226,0.43)",
      };
      if (movementSide === "top") {
        styleObject.top = 0;
        styleObject.left = 0;
        styleObject.width = "100%";
        styleObject.height = "4px";
      } else if (movementSide === "bottom") {
        styleObject.bottom = 0;
        styleObject.left = 0;
        styleObject.width = "100%";
        styleObject.height = "4px";
      } else if (movementSide === "left") {
        styleObject.top = 0;
        styleObject.left = 0;
        styleObject.width = "4px";
        styleObject.height = "100%";
      } else if (movementSide === "right") {
        styleObject.top = 0;
        styleObject.right = 0;
        styleObject.width = "4px";
        styleObject.height = "100%";
      }
      return styleObject;
    };

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
      let style = {};
      if (data?.uuid === movementSide?.uuid) {
        style = getMovementStyle(movementSide.position);
      }
      returnComponent = (
        <EditComponent
          data={data}
          nearUuid={nearUuid}
          modifyEditDom={modifyEditDom}
          movementSide={movementSide}
          style={style}
        />
      );
    }
    return returnComponent;
  };
  return BranchTab();
};

export default EditBranchComponent;
