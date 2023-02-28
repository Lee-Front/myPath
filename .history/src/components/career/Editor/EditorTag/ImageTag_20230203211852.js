import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { useEffect } from "react";

const ImageTagWrapper = styled.div`
  outline: none;
  line-height: 1.5;
  padding: 1rem;
  display: flex;
  justify-content: center;
  background: ${(props) => (!props.imageUrl ? "rgba(55, 53, 47, 0.05)" : "")};
  cursor: pointer;

  :hover {
    background: rgba(55, 53, 47, 0.08);
  }
`;

const ImageWrapper = styled.div`
  display: flex;
`;

const ImageTag = ({ style, data }) => {
  console.log("data : ", data);
  const file = data?.files[0];
  const [fileId, setFileId] = useState(file?.fileId);

  useEffect(() => {
    setFileId(data?.files[0]?.fileId);
  }, [data]);

  return (
    <div
      uuid={data.uuid}
      style={{
        position: "relative",
      }}
    >
      <ImageTagWrapper
        imageUrl={fileId}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        {fileId != null ? (
          <img
            src={`/api/common/images/${fileId}`}
            alt="이미지"
            style={{
              width: file.width * (data.width / 100) + "px",
              maxWidth: "100%",
            }}
          />
        ) : (
          <ImageWrapper>
            <svg
              viewBox="0 0 30 30"
              style={{
                width: "25px",
                height: "25px",
                display: "block",
                marginRight: "1.5rem",
                fill: "rgba(55, 53, 47, 0.45)",
                flexshrink: 0,
                backfacevisibility: "hidden",
                marginright: "12px",
              }}
            >
              <path d="M1,4v22h28V4H1z M27,24H3V6h24V24z M18,10l-5,6l-2-2l-6,8h20L18,10z M11.216,17.045l1.918,1.918l4.576-5.491L21.518,20H9 L11.216,17.045z M7,12c1.104,0,2-0.896,2-2S8.104,8,7,8s-2,0.896-2,2S5.896,12,7,12z"></path>
            </svg>
            이미지를 등록해주세요.
          </ImageWrapper>
        )}
      </ImageTagWrapper>
      {style ? <div style={style}></div> : null}
    </div>
  );
};

export default ImageTag;
