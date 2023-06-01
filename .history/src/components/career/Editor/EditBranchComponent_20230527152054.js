import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRef } from "react";

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
    const getMovementStyle = (movementData) => {
      const side = movementData.position;

      const styleObject = {
        position: "absolute",
        background: "rgb(160,202,242)",
        zIndex: "999",
      };
      // <div
      //         style={{
      //           background: "rgba(35,131,226,0.43)",
      //           bottom: 0,
      //           left: 0,
      //           position: "absolute",
      //           width: "2.5rem",
      //           height: "4px",
      //         }}
      //       ></div>
      //       <div
      //         style={{
      //           background: "rgba(35,131,226,0.63)",
      //           bottom: 0,
      //           left: "2.7rem",
      //           position: "absolute",
      //           width: "calc(100% - 2.7rem)",
      //           height: "4px",
      //         }}
      //       ></div>
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

    if (data?.tagName === "multiple") {
      returnComponent = (
        <MultipleTag
          data={data}
          updateElement={updateElement}
          movementSide={movementSide}
          changeShowFileUploader={changeShowFileUploader}
          style={style}
        />
      );
    } else if (data?.tagName === "image") {
      returnComponent = (
        <ImageTag
          data={data}
          overlayWidth={overlayWidth}
          changeShowFileUploader={changeShowFileUploader}
          style={style}
        />
      );
    } else if (data?.tagName === "checkbox") {
      returnComponent = (
        <CheckBoxTag
          movementSide={movement}
          updateElement={updateElement}
          data={data}
          overlayWidth={overlayWidth}
          style={style}
        />
      );
    } else if (data?.tagName === "bullet") {
      returnComponent = (
        <BulletPointTag
          movementSide={movement}
          updateElement={updateElement}
          data={data}
          overlayWidth={overlayWidth}
          style={style}
        />
      );
    } else {
      returnComponent = (
        <EditableTag
          data={data}
          updateElement={updateElement}
          movementSide={movement}
          overlayWidth={overlayWidth}
          style={style}
        />
      );
    }
    return returnComponent;
  };

  return (
    <EditableContainer data-uuid={data.uuid} overlayWidth={overlayWidth}>
      {BranchTab()}
    </EditableContainer>
  );
};

export default EditBranchComponent;

const EditableContainer = styled.div`
  position: relative;
  width: ${(props) => props?.overlayWidth + "%"};
`;
