import React from "react";
import styled from "@emotion/styled";

import ImageBlock from "./Blocks/ImageBlock";
import MultipleBlock from "./Blocks/MultipleBlock";
import CheckBoxBlock from "./Blocks/CheckBoxBlock";
import BulletPointBlock from "./Blocks/BulletPointBlock";
import EditableBlock from "./Blocks/EditableBlock";
import useEditorStore from "../../../stores/useEditorStore";

const EditBranchComponent = ({
  data,
  movementSide,
  changeShowFileUploader,
  overlayWidth,
  isOverlay,
}) => {
  const getMovementStyle = (side) => {
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
  console.log("movementSide : ", movementSide);
  const movement =
    movementSide?.data.uuid === data.uuid ? movementSide.position : null;
  const style = movement && getMovementStyle(movement);
  const editorStore = useEditorStore();
  const isSelection = editorStore.selectBlocks?.filter((block) => {
    if (block.tagName === "multiple") return false;
    const parentBlock = editorStore.findBlock(block.parentId);
    if (parentBlock) {
      if (
        (parentBlock?.tagName === "checkbox" ||
          parentBlock?.tagName === "bullet") &&
        editorStore.selectBlocks.includes(parentBlock)
      )
        return false;
    }
    return true;
  });

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
          movementSide={movementSide}
          data={data}
          overlayWidth={overlayWidth}
          style={style}
        />
      );
    } else if (data?.tagName === "bullet") {
      returnComponent = (
        <BulletPointBlock
          movementSide={movementSide}
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
    <BlockContainer
      data-uuid={!isOverlay ? data.uuid : null}
      tagName={data?.tagName}
    >
      {BranchTab()}
      {!isOverlay && isSelection.find((block) => block.uuid === data.uuid) && (
        <SelectionHalo />
      )}
      {editorStore.hoverBlock?.uuid === data.uuid && <HoverBlock />}
    </BlockContainer>
  );
};

export default EditBranchComponent;

const BlockContainer = styled.div`
  display: flex;
  position: relative;
`;

const SelectionHalo = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(35, 131, 226, 0.14);
  pointer-events: none;
`;

const HoverBlock = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  pointer-events: none;
  background: rgba(55, 53, 47, 0.1);
`;
