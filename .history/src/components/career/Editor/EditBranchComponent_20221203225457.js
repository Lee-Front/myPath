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
}) => {
  const BranchTab = () => {
    let returnComponent;

    if (tagName === "multiple") {
      returnComponent = (
        <MultipleTag
          uuid={uuid}
          hoverUuid={hoverUuid}
          multipleData={multipleData}
          modifyEditDom={modifyEditDom}
        >
          {children}
        </MultipleTag>
      );
    } else {
      console.log("hoverUuid : ", hoverUuid);
      returnComponent = (
        <EditComponent
          hoverUuid={hoverUuid}
          uuid={uuid}
          tagName={tagName ? tagName : "div"}
          html={html}
          defaultPlaceHolder={defaultPlaceHolder}
          placeholder={placeholder}
          modifyEditDom={modifyEditDom}
        >
          {children}
        </EditComponent>
      );
    }
    return returnComponent;
  };
  return BranchTab();
};

export default EditBranchComponent;
