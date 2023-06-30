import React from "react";
import styled from "@emotion/styled";

import ImageBlock from "./Blocks/ImageBlock";
import MultipleBlock from "./Blocks/MultipleBlock";
import CheckBoxBlock from "./Blocks/CheckBoxBlock";
import BulletPointBlock from "./Blocks/BulletPointBlock";
import EditableBlock from "./Blocks/EditableBlock";

const EditBranchComponent = ({
  data,
  movementSide,
  changeShowFileUploader,
  overlayWidth,
  isOverlay,
}) => {
  const getMovementStyle = (movementData) => {
    const side = movementData.position;

    const styleObject = {
      position: "absolute",
      background: "rgba(35, 131, 226, 0.28)",
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

  const BranchTab = () => {
    let returnComponent;

    if (data?.tagName === "multiple") {
      returnComponent = (
        <MultipleBlock
          data={data}
          movementSide={movementSide}
          changeShowFileUploader={changeShowFileUploader}
          style={style}
          isOverlay={isOverlay}
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
          data={data}
          overlayWidth={overlayWidth}
          style={style}
        />
      );
    } else if (data?.tagName === "bullet") {
      returnComponent = (
        <BulletPointBlock
          movementSide={movement}
          data={data}
          overlayWidth={overlayWidth}
          style={style}
        />
      );
    } else {
      returnComponent = (
        <EditableBlock
          data={data}
          movementSide={movement}
          overlayWidth={overlayWidth}
          style={style}
        />
      );
    }
    return returnComponent;
  };

  return (
    <div style={{ display: "flex" }}>
      <BlockHandle>ㅁ</BlockHandle>
      <BlockContainer
        data-uuid={!isOverlay ? data.uuid : null}
        isHoverEnabled={!isOverlay && data?.tagName !== "multiple"}
      >
        {BranchTab()}
      </BlockContainer>
    </div>
  );
};

export default EditBranchComponent;

const BlockHandle = styled.div``;
const BlockContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  width: ${(props) => props?.overlayWidth + "%"};
  :hover {
    background: ${(props) => props.isHoverEnabled && "rgba(55, 53, 47, 0.1)"};
    :before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: #000;
    }
  }
`;
