import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { useRef } from "react";

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
  const [imageUrl, setImageUrl] = useState(null);
  const fileUploadRef = useRef(null);

  return (
    <div uuid={data.uuid} style={{ position: "relative" }}>
      <ImageTagWrapper
        onClick={() => {
          setPopupYn(!popupYn);
        }}
      >
        <ImageWrapper>
        {imageUrl ? <img src={imageUrl} /> : }
          
      </ImageTagWrapper>
      {popupYn && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            onClick={() => {
              console.log("1");
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
                    const url = URL.createObjectURL(e.target.files[0]);
                    setImageUrl(url);
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
