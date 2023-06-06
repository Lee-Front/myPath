import React from "react";
import EditBranchComponent from "../EditBranchComponent";

const MultipleBlock = ({
  updateElement,
  movementSide,
  data,
  changeShowFileUploader,
}) => {
  const getMovementStyle = (movementData) => {
    const side = movementData.position;
    const styleObject = {
      position: "absolute",
      background: "rgb(160,202,242)",
      zIndex: "999",
    };
    if (side === "top") {
      styleObject.top = 0;
      styleObject.left = 0;
      styleObject.width = "100%";
      styleObject.height = "4px";
    } else if (side === "bottom") {
      styleObject.bottom = 0;
      styleObject.left = 0;
      styleObject.width = "100%";
      styleObject.height = "4px";
    } else if (side === "left") {
      styleObject.top = 0;
      styleObject.left = 0;
      styleObject.width = "4px";
      styleObject.height = "100%";
    } else if (side === "right") {
      styleObject.top = 0;
      styleObject.right = 0;
      styleObject.width = "4px";
      styleObject.height = "100%";
    }
    return styleObject;
  };

  const movement = movementSide?.uuid === data.uuid ? movementSide : null;
  const style = movement && getMovementStyle(movement);

  return (
    <div style={{ display: "flex", flexDirection: data.direction, flex: 1 }}>
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
            updateElement={updateElement}
            movementSide={movementSide}
            changeShowFileUploader={changeShowFileUploader}
          />
        </div>
      ))}
      {style ? <div style={style}></div> : null}
    </div>
  );
};

export default MultipleBlock;
