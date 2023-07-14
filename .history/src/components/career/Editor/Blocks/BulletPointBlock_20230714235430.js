import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import EditBranchComponent from "../EditBranchComponent";
import EditableBlock from "./EditableBlock";

const CheckBoxBlock = ({
  style,
  data,
  hoverUuid,
  movementSide,
  overlayWidth,
}) => {
  return (
    <BlockContainer styleData={data?.style}>
      <BulletWrapper>
        <BulletImage viewBox="0 0 512 512">
          <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z" />
        </BulletImage>
      </BulletWrapper>

      <TextAreaWrapper name="text-area">
        <EditableBlock data={data} overlayWidth={overlayWidth} />
        {data?.multipleData?.map((element) => (
          <EditBranchComponent
            key={element.uuid}
            data={element}
            hoverUuid={hoverUuid}
            movementSide={movementSide}
          />
        ))}
      </TextAreaWrapper>

      {movementSide &&
      data.uuid === movementSide?.uuid &&
      movementSide?.movementSideType === "text" ? (
        <>
          <BulletUnderLine />
          <TextUnderLine />
        </>
      ) : (
        style && <div style={style}></div>
      )}
    </BlockContainer>
  );
};

export default CheckBoxBlock;

const BlockContainer = styled.div`
  position: relative;
  flex: 1;
  outline: none;
  display: flex;
  color: rgb(55, 53, 47);

  // 여기부턴 태그 설정 스타일
  justify-content: ${(props) =>
    props?.styleData?.textAlign ? props?.styleData?.textAlign : null};
  font-size: ${(props) =>
    props?.styleData?.fontSize ? props?.styleData?.fontSize + "px" : "16px"};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};
`;

const BulletWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.1rem;
  height: 2.1rem;
`;

const BulletImage = styled.svg`
  display: block;
  width: 0.7rem;
  height: 1.6rem;
  flex-shrink: 0;
  backface-visibility: hidden;
  fill: ${(props) => props.checkYn && "white"};
  background: ${(props) => props.checkYn && "rgb(35, 131, 226)"};
`;

const TextAreaWrapper = styled.div`
  flex: 1;
  position: relative;
  height: 100%;
`;

const BulletUnderLine = styled.div`
  background: rgba(35, 131, 226, 0.43);
  bottom: 0;
  left: 0;
  position: absolute;
  width: 2.1rem;
  height: 0.4rem;
`;

const TextUnderLine = styled.div`
  background: rgba(35, 131, 226, 0.63);
  bottom: 0;
  left: 2.2rem;
  position: absolute;
  width: calc(100% - 2.7rem);
  height: 0.4rem;
`;
