import React from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { useState } from "react";
import EditBranchComponent from "../EditBranchComponent";
import { useEffect } from "react";
import EditableTag from "./EditableBlock";

const CheckBoxBlock = ({
  style,
  data,
  hoverUuid,
  movementSide,
  updateElement,
  overlayWidth,
}) => {
  const [state, setState] = useState({
    html: data.html ? data.html : "",
    checkYn: data.checkYn ? data.checkYn : false,
  });

  return (
    <BlockContainer styleData={data?.styleData}>
      <CheckBoxWrapper
        onClick={() => {
          setState((prev) => ({ ...prev, checkYn: !state.checkYn }));
          updateElement(data.uuid, {
            checkYn: !state.checkYn,
          });
        }}
      >
        <div
          style={{
            background: "rgb(35, 131, 226)",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg
            viewBox="0 0 16 16"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              flexshrink: 0,
              backfacevisibility: "hidden",
            }}
          >
            <path d="M1.5,1.5 L1.5,14.5 L14.5,14.5 L14.5,1.5 L1.5,1.5 Z M0,0 L16,0 L16,16 L0,16 L0,0 Z"></path>
          </svg>
          <svg
            viewBox="0 0 14 14"
            style={{
              width: "12px",
              height: "12px",
              display: "block",
              fill: "white",
              flexshrink: 0,
              backfacevisibility: "hidden",
            }}
          >
            <polygon points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"></polygon>
          </svg>
        </div>
      </CheckBoxWrapper>
      <div
        style={{ flex: 1, position: "relative", height: "100%" }}
        className="text-area"
      >
        <EditableTag
          updateElement={updateElement}
          data={data}
          overlayWidth={overlayWidth}
        />
        {data?.multipleData?.map((element, index) => (
          <EditBranchComponent
            key={element.uuid}
            data={element}
            hoverUuid={hoverUuid}
            updateElement={updateElement}
            movementSide={movementSide}
          />
        ))}
      </div>
      {movementSide?.movementSideType === "text" ? (
        <>
          <CheckBoxUnderLine />
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
  display: flex;
  margin: 0.5rem;

  // 여기부턴 태그 설정 스타일
  justify-content: ${(props) =>
    props?.styleData?.textAlign ? props?.styleData?.textAlign : null};
  font-size: ${(props) =>
    props?.styleData?.fontSize ? props?.styleData?.fontSize + "px" : "16px"};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 2rem;
  margin-right: 0.4rem;
  cursor: pointer;
`;
const CheckBoxUnderLine = styled.div`
  background: rgba(35, 131, 226, 0.43);
  bottom: 0;
  left: 0;
  position: absolute;
  width: 2.5rem;
  height: 0.4rem;
`;

const TextUnderLine = styled.div`
  background: rgba(35, 131, 226, 0.63);
  bottom: 0;
  left: 2.7rem;
  position: absolute;
  width: calc(100% - 2.7rem);
  height: 0.4rem;
`;
