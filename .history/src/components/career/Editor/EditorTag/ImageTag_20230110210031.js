import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";

const ImageTagWrapper = styled.div`
  outline: none;
  line-height: 1.5;
  padding: 1rem;
  display: flex;
  background: rgba(55, 53, 47, 0.05);
  cursor: pointer;

  :hover {
    background: rgba(55, 53, 47, 0.08);
  }
`;

const ImageWrapper = styled.div``;

const ImageTag = ({ modifyEditDom, movementSide, data }) => {
  const [popupYn, setPopupYn] = useState(false);

  return (
    <div uuid={data.uuid} style={{ position: "relative" }}>
      <ImageTagWrapper
        onClick={() => {
          console.log("click");
          setPopupYn(true);
        }}
      >
        <ImageWrapper>
          <svg
            viewBox="0 0 30 30"
            style={{
              width: "25px",
              height: "25px",
              display: "block",
              fill: "rgba(55, 53, 47, 0.45)",
              flexshrink: 0,
              backfacevisibility: "hidden",
              marginright: "12px",
            }}
          >
            <path d="M1,4v22h28V4H1z M27,24H3V6h24V24z M18,10l-5,6l-2-2l-6,8h20L18,10z M11.216,17.045l1.918,1.918l4.576-5.491L21.518,20H9 L11.216,17.045z M7,12c1.104,0,2-0.896,2-2S8.104,8,7,8s-2,0.896-2,2S5.896,12,7,12z"></path>
          </svg>
        </ImageWrapper>
        이미지를 등록해주세요.
      </ImageTagWrapper>
      <div
        style={{
          width: "54rem",
          minWidth: "18rem",
          maxWidth: "calc(100vw - 2.4rem)",
          height: "100%",
          background: "gray",
        }}
      ></div>
    </div>
  );
};

export default ImageTag;
