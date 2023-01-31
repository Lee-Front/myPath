import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";

const ImageTagWrapper = styled.div`
  outline: none;
  line-height: 1.5;
  padding: 1rem;
  display: flex;
  background: ${(props) => (!props.imageUrl ? "rgba(55, 53, 47, 0.05)" : "")};
  cursor: pointer;

  :hover {
    background: rgba(55, 53, 47, 0.08);
  }
`;

const ImageWrapper = styled.div`
  display: flex;
`;

const ImageTag = ({ modifyEditDom, movementSide, data }) => {
  const [popupYn, setPopupYn] = useState(false);
  const [fileId, setFileId] = useState(data?.files[0]?.fileId);
  const fileUploadRef = useRef(null);

  const fileUpload = async (file) => {
    const formData = new FormData();
    formData.append("img", file);
    formData.append("uuid", data.uuid);

    const upload = await axios.post("/api/common/upload", formData);
    setFileId(upload.data.fileId);
    modifyEditDom(data.uuid, { fileId: upload.data.fileId });
  };

  return (
    <div uuid={data.uuid} style={{ position: "relative" }}>
      <ImageTagWrapper
        imageUrl={fileId}
        onClick={(e) => {
          console.log("e : ", e);
          setPopupYn(!popupYn);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        {fileId ? (
          <img
            src={`/api/common/images/${fileId}`}
            alt="이미지"
            style={{ width: "100%" }}
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
      {popupYn && (
        <div
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            onClick={() => {
              setPopupYn(!popupYn);
            }}
            style={{
              position: "fixed",
              width: "100vw",
              height: "100vh",
              left: 0,
              top: 0,
              zIndex: 998,
            }}
          ></div>
          <div
            style={{
              position: "fixed",
              width: "54rem",
              minWidth: "18rem",
              maxWidth: "calc(100vw - 4rem)",
              height: "10rem",
              zIndex: 999,
              border: "1px solid rgba(55, 53, 47, 0.3)",
              borderRadius: "0.5rem",
              background: "white",
              boxShadow:
                "rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                padding: " 0.7rem 0.7rem 0 0.7rem",
              }}
            >
              <div
                style={{
                  cursor: "pointer",
                  height: "3rem",
                  width: "6rem",
                  textAlign: "center",
                  //borderBottom: "0.2rem solid black",
                }}
              >
                이미지
              </div>
              <div
                style={{
                  cursor: "pointer",
                  height: "3rem",
                  width: "6rem",
                  textAlign: "center",
                  //borderBottom: "0.2rem solid black",
                }}
              >
                링크
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(55, 53, 47, 0.3)" }}>
              <div
                onClick={() => {
                  fileUploadRef.current.click();
                }}
                style={{
                  cursor: "pointer",
                  margin: "1rem 1rem 0 1rem",
                  padding: "0.5rem",
                  border: "1px solid rgba(55, 53, 47, 0.3)",
                  borderRadius: "0.5rem",
                  textAlign: "center",
                }}
              >
                <input
                  type="file"
                  ref={fileUploadRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    setPopupYn(!popupYn);
                    fileUpload(e.target.files[0]);
                  }}
                />
                파일 업로드
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageTag;
