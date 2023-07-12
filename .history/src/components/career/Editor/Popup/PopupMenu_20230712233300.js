import axios from "axios";
import React from "react";
import { useRef } from "react";
import styled from "@emotion/styled";
import useEditorStore from "../../../../stores/useEditorStore";

const PopupMenu = ({ changeShowFileUploader, fileData }) => {
  const fileUploadRef = useRef();
  const editorStore = useEditorStore();

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
    editorStore.updateBlock(fileData.uuid, { files: upload.data });
  };

  return (
    <FileUploaderWrapper className="filePopup">
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
          onClick={(e) => {
            e.stopPropagation();
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
              changeShowFileUploader(e);
              fileUpload(e.target.files[0]);
            }}
          />
          파일 업로드
        </div>
      </div>
    </FileUploaderWrapper>
  );
};

export default PopupMenu;

const FileUploaderWrapper = styled.div`

  position: fixed;
        top: ${(props) => props?.y};
        left: ${(props) => props?.x};
        width: 40rem;
        min-width: 18rem;
        max-width: calc(100vw - 4rem);
        height: 10rem;
        zIndex: 999,
        border: 1px solid rgba(55, 53, 47, 0.3);
        border-radius: 0.5rem;
        background: white;
        //box-shadow: rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px;
`;
