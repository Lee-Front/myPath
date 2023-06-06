import React from "react";
import styled from "@emotion/styled";

import ImageBlock from "./Blocks/ImageBlock";
import MultipleBlock from "./Blocks/MultipleBlock";
import CheckBoxBlock from "./Blocks/CheckBoxBlock";
import BulletPointBlock from "./Blocks/BulletPointBlock";
import EditableBlock from "./Blocks/EditableBlock";

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
        <MultipleBlock
          data={data}
          updateElement={updateElement}
          movementSide={movementSide}
          changeShowFileUploader={changeShowFileUploader}
          style={style}
        />
      );
    } else if (data?.tagName === "image") {
      returnComponent = (
        <ImageBlock
          data={data}
          overlayWidth={overlayWidth}
          changeShowFileUploader={changeShowFileUploader}
          style={style}
        />
      );
    } else if (data?.tagName === "checkbox") {
      returnComponent = (
        <CheckBoxBlock
          movementSide={movement}
          updateElement={updateElement}
          data={data}
          overlayWidth={overlayWidth}
          style={style}
        />
      );
    } else if (data?.tagName === "bullet") {
      returnComponent = (
        <BulletPointBlock
          movementSide={movement}
          updateElement={updateElement}
          data={data}
          overlayWidth={overlayWidth}
          style={style}
        />
      );
    } else {
      returnComponent = (
        <EditableBlock
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
    <BlockContainer data-uuid={data.uuid} overlayWidth={overlayWidth}>
      {BranchTab()}
    </BlockContainer>
  );
};

export default EditBranchComponent;

const BlockContainer = styled.div`
  //display: flex;
  position: relative;
  width: ${(props) => props?.overlayWidth + "%"};
`;
