import axios from "axios";
import React from "react";
import { useRef } from "react";

const PopupMenu = ({ changeShowFileUploader, fileData, updateElement }) => {
  const fileUploadRef = useRef();

  const fileUpload = async (file) => {
    const formData = new FormData();
    const reader = new FileReader();

    formData.append("img", file);
    formData.append("uuid", fileData.uuid);

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const { width } = img;
        formData.append("width", width);

        fileUploadSend(formData);
      };
    };
  };

  const fileUploadSend = async (formData) => {
    const upload = await axios.post("/api/common/upload", formData);
    updateElement(fileData.uuid, { files: upload.data });
  };

  return (
    <>
      <div
        className="filePopup"
        style={{
          position: "fixed",
          top: fileData?.y,
          left: fileData?.x,
          width: "40rem",
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
              //fileUploadRef.current.click();
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
                console.log("1");
                changeShowFileUploader(e);
                fileUpload(e.target.files[0]);
              }}
            />
            파일 업로드
          </div>
        </div>
      </div>
    </>
  );
};

// 1부터 10까지 더하는 함수
export default PopupMenu;
