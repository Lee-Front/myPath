import React from "react";
import EditBranchComponent from "../EditBranchComponent";

const MultipleTag = ({
  modifyEditDom,
  movementSide,
  data,
  style,
  hoverUuid,
}) => {
  if (data.tagName === "multiple") {
    console.log("data ; ", data);
    console.log("hoverUuid: ", hoverUuid);
  }
  return (
    <div uuid={data.uuid} style={{ position: "relative" }}>
      <div style={{ display: "flex", flexDirection: data.direction }}>
        {data.multipleData.map((element, index) => (
          <div
            key={index}
            style={{
              padding: data.direction === "row" ? "0.5rem 0" : null,
              width:
                data.direction === "row" && element.width
                  ? `calc(100% * ${element.width} / 100)`
                  : "100%",
            }}
          >
            <EditBranchComponent
              key={element.uuid}
              data={element}
              hoverUuid={hoverUuid}
              modifyEditDom={modifyEditDom}
              movementSide={movementSide}
            />
          </div>
        ))}
      </div>
      {style ? <div style={style}></div> : null}
    </div>
  );
};

export default MultipleTag;
