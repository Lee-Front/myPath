import React from "react";
import EditComponent from "./EditComponent";
import MultipleTag from "./EditorTag/MultipleTag";

const EditBranchComponent = ({
  hoverUuid,
  tagName,
  uuid,
  html,
  defaultPlaceHolder,
  placeholder,
  multipleData,
  children,
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
          uuid={uuid}
          hoverUuid={hoverUuid}
          multipleData={multipleData}
          modifyEditDom={modifyEditDom}
          movementSide={movementSide}
        >
          {children}
        </MultipleTag>
      );
    } else {
      returnComponent = (
        <EditComponent
          hoverUuid={hoverUuid}
          uuid={uuid}
          tagName={tagName ? tagName : "div"}
          html={html}
          defaultPlaceHolder={defaultPlaceHolder}
          placeholder={placeholder}
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
