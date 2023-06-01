import React from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { useState } from "react";
import EditBranchComponent from "../EditBranchComponent";
import { useEffect } from "react";
import EditableTag from "./EditableTag";

const CheckBoxTagWrapper = styled.div`
  //position: relative;
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
const CheckBoxTag = ({
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
  const [boxHeight, setBoxHeight] = useState(16);
  const editRef = useRef(null);

  useEffect(() => {
    if (editRef.current) {
      const rect = editRef.current?.getBoundingClientRect();
      setBoxHeight(rect.height);
    }
  }, [data?.styleData?.fontSize]);

  return (
    <CheckBoxTagWrapper styleData={data?.styleData}>
      <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "2rem",
            height: boxHeight + "px",
            marginRight: "0.4rem",
            cursor: "pointer",
          }}
          onClick={() => {
            setState((prev) => ({ ...prev, checkYn: !state.checkYn }));
            updateElement(data.uuid, {
              checkYn: !state.checkYn,
            });
          }}
        >
          <div style={{ width: "1.6rem", height: "1.6rem" }}>
            {!state.checkYn ? (
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
            ) : (
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
            )}
          </div>
        </div>
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
      </div>
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
    </CheckBoxTagWrapper>
  );
};

export default CheckBoxTag;
