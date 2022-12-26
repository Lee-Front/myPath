import React from "react";
import EditBranchComponent from "../EditBranchComponent";
import EditComponent from "../EditComponent";

const MultipleTag = ({
  uuid,
  multipleData,
  children,
  hoverUuid,
  modifyEditDom,
}) => {
  return (
    <div uuid={uuid} style={{ position: "relative", padding: "0.5rem 0" }}>
      <div style={{ display: "flex", flexDirection: multipleData.direction }}>
        {multipleData.data.map((element, index) => (
          <div
            key={index}
            style={{
              // padding: multipleData.direction === "row" ? "1rem 0" : "",
              width:
                multipleData.direction === "row" && element.width
                  ? `calc(100% * ${element.width} / 100)`
                  : 100 / multipleData.data.length + "%",
            }}
          >
            {element.tagName === "multiple" &&
            element.multipleData.data.length > 0 ? (
              <EditBranchComponent
                key={element.uuid}
                uuid={element.uuid}
                tagName={element.tagName ? element.tagName : "div"}
                html={element?.html}
                defaultPlaceholder={element.defaultPlaceholder}
                placeholder={element.placeholder}
                multipleData={element.multipleData}
                modifyEditDom={modifyEditDom}
                hoverUuid={hoverUuid}
              ></EditBranchComponent>
            ) : (
              <EditComponent
                key={element.uuid}
                hoverUuid={hoverUuid}
                uuid={element.uuid}
                tagName={element.tagName || "div"}
                html={element.html}
                defaultPlaceHolder={element.defaultPlaceHolder}
                placeholder={element.placeholder}
                modifyEditDom={modifyEditDom}
              ></EditComponent>
            )}
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};

export default MultipleTag;
