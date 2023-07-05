import React from "react";
import styled from "@emotion/styled";

const EditorWrapper = styled.div`
  height: 100%;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: 0.5s;
  border-radius: 1rem;
  padding: 1rem;
  background-color: #f9f4e9;
`;
const CardEditor = () => {
  return (
    <EditorWrapper>
      <div>
        <h1>제목</h1>
      </div>
    </EditorWrapper>
  );
};

export default CardEditor;