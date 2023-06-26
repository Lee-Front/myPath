import React from "react";
import EditBranchComponent from "../EditBranchComponent";

const MultipleBlock = ({
  updateElement,
  movementSide,
  data,
  changeShowFileUploader,
  style,
  isOverlay,
}) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: data.direction,
        flex: 1,
      }}
    >
      {data?.multipleData.map((element, index) => (
        <div
          key={index}
          style={{
            // padding: data.direction === "row" ? "0.5rem 0" : null,
            width:
              data.direction === "row" && element.width
                ? `calc(100% * ${element.width} / 100)`
                : "100%",
          }}
        >
          <EditBranchComponent
            key={element.uuid}
            data={element}
            updateElement={updateElement}
            movementSide={movementSide}
            changeShowFileUploader={changeShowFileUploader}
            isOverlay={isOverlay}
          />
        </div>
      ))}
      {style ? <div style={style}></div> : null}
    </div>
  );
};

export default MultipleBlock;
