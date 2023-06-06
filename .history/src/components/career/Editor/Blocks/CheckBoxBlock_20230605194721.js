import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import EditBranchComponent from "../EditBranchComponent";
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

  const handleCheckChange = (e) => {
    setState((prev) => ({ ...prev, checkYn: !state.checkYn }));
    updateElement(data.uuid, {
      checkYn: !state.checkYn,
    });
  };

  return (
    <BlockContainer styleData={data?.styleData}>
      <CheckBoxWrapper onClick={handleCheckChange}>
        {!state.checkYn ? (
          <CheckBoxImage viewBox="0 0 16 16">
            <path d="M1.5,1.5 L1.5,14.5 L14.5,14.5 L14.5,1.5 L1.5,1.5 Z M0,0 L16,0 L16,16 L0,16 L0,0 Z"></path>
          </CheckBoxImage>
        ) : (
          <CheckBoxImage checkYn={state.checkYn} viewBox="0 0 14 14">
            <polygon points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"></polygon>
          </CheckBoxImage>
        )}
      </CheckBoxWrapper>
      <TextAreaWrapper className="text-area" name="text-area">
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
      </TextAreaWrapper>
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
  justify-content: center;
  align-items: center;
  width: 2.1rem;
  height: 2.1rem;
  cursor: pointer;
`;

const CheckBoxImage = styled.svg`
  display: block;
  width: 1.6rem;
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
