import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { useEffect } from "react";

const ImageBlock = ({ style, data, overlayWidth, changeShowFileUploader }) => {
  console.log("data: ", data);
  const [fileId, setFileId] = useState();
  const [width, setWidth] = useState();

  useEffect(() => {
    if (data?.files) {
      setFileId(data?.files[0]?.fileId);
    }
  }, [data]);

  return (
    <BlockContainer
      fileId={fileId}
      onClick={(e) => {
        changeShowFileUploader(e);
      }}
    >
      {fileId != null ? (
        <Image
          src={`${process.env.REACT_APP_API_URL}/api/common/images/${fileId}`}
          onLoad={() => {
            setWidth(data?.files[0]?.width);
          }}
          alt="이미지"
        />
      ) : (
        <UploadWrapper>
          <UploadImage viewBox="0 0 30 30">
            <path d="M1,4v22h28V4H1z M27,24H3V6h24V24z M18,10l-5,6l-2-2l-6,8h20L18,10z M11.216,17.045l1.918,1.918l4.576-5.491L21.518,20H9 L11.216,17.045z M7,12c1.104,0,2-0.896,2-2S8.104,8,7,8s-2,0.896-2,2S5.896,12,7,12z"></path>
          </UploadImage>
          <UploadText>이미지를 등록해주세요.</UploadText>
        </UploadWrapper>
      )}
      {style ? <div style={style}></div> : null}
    </BlockContainer>
  );
};

export default ImageBlock;

const BlockContainer = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  outline: none;
  line-height: 1.5;
  padding: 1rem;

  justify-content: center;
  background: ${(props) =>
    props.fileId == null
      ? "rgba(55, 53, 47, 0.05)"
      : props.hoverYn
      ? "rgba(55, 53, 47, 0.08)"
      : ""};
  cursor: pointer;
`;
const Image = styled.img`
  width: ${(props) => props.width + "px"};
  max-width: 100%;
  transition: 0.5s;
`;

const UploadWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const UploadImage = styled.svg`
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  fill: rgba(55, 53, 47, 0.45);
  backface-visibility: hidden;
  margin-right: 1.2rem;
`;

const UploadText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;
