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
  style,
}) => {
  const BranchTab = () => {
    console.log("hoverUuid : ", hoverUuid);
    let returnComponent;
    if (tagName === "multiple") {
      returnComponent = (
        <MultipleTag uuid={uuid} multipleData={multipleData}>
          {children}
        </MultipleTag>
      );
    } else {
      returnComponent = (
        <EditComponent
          uuid={uuid}
          style={style}
          tagName={tagName ? tagName : "div"}
          html={html}
          defaultPlaceHolder={defaultPlaceHolder}
          placeholder={placeholder}
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
