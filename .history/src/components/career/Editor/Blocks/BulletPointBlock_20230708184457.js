import React from "react";
import styled from "@emotion/styled";
import { useState, useEffect, useRef } from "react";
import EditBranchComponent from "../EditBranchComponent";
import EditableBlock from "./EditableBlock";
import useEditorStore from "../../../../stores/useEditorStore";

const BlockContainer = styled.div`
  position: relative;
  //line-height: 1.5;
  outline: none;
  display: flex;
  margin: 0.4rem;
  color: rgb(55, 53, 47);

  // 여기부턴 태그 설정 스타일
  justify-content: ${(props) =>
    props?.styleData?.textAlign ? props?.styleData?.textAlign : null};
  font-size: ${(props) =>
    props?.styleData?.fontSize ? props?.styleData?.fontSize + "px" : "16px"};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};
`;
const CheckBoxBlock = ({
  style,
  data,
  hoverUuid,
  movementSide,
  overlayWidth,
}) => {
  const [state, setState] = useState({
    html: data.html ? data.html : "",
  });

  const [boxHeight, setBoxHeight] = useState(16);
  const editRef = useRef(null);
  const editorStore = useEditorStore();

  useEffect(() => {
    if (editRef.current) {
      const rect = editRef.current?.getBoundingClientRect();
      setBoxHeight(rect.height);
    }
  }, [data?.styleData?.fontSize]);

  return (
    <BlockContainer styleData={data?.style}>
      <BulletWrapper>
        <BulletImage
          viewBox="0 0 512 512"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            flexshrink: 0,
            backfacevisibility: "hidden",
          }}
        >
          <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z" />
        </BulletImage>
      </BulletWrapper>

      <TextAreaWrapper className="text-area" name="text-area">
        <EditableBlock data={data} overlayWidth={overlayWidth} />
        {data?.multipleData?.map((element, index) => (
          <EditBranchComponent
            key={element.uuid}
            data={element}
            hoverUuid={hoverUuid}
            movementSide={movementSide}
          />
        ))}
      </TextAreaWrapper>

      {style ? (
        movementSide?.movementSideType === "text" ? (
          <>
            <div
              style={{
                background: "rgba(35,131,226,0.43)",
                bottom: 0,
                left: 0,
                position: "absolute",
                width: "2.5rem",
                height: "4px",
              }}
            ></div>
            <div
              style={{
                background: "rgba(35,131,226,0.63)",
                bottom: 0,
                left: "2.7rem",
                position: "absolute",
                width: "calc(100% - 2.7rem)",
                height: "4px",
              }}
            ></div>
          </>
        ) : (
          <div style={style}></div>
        )
      ) : null}
    </BlockContainer>
  );
};

export default CheckBoxBlock;

const BulletWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.1rem;
  height: 2.5rem;
`;

const BulletImage = styled.svg`
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
