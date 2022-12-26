import React from "react";
import styled from "@emotion/styled";
import EditComponent from "./EditComponent";

const EditorWrapper = styled.div`
  height: 100%;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: 0.5s;
  border-radius: 1rem;
  padding: 1rem;
  background-color: #f9f4e9;
`;

const CardTitle = styled.div`
  font-size: 5rem;
  outline: none;
  & + ::after {
    content: "asdasd";
  }
`;

const CardEditor = () => {
  return (
    <EditorWrapper>
      <CardTitle>
        <EditComponent tagName="div" html=""></EditComponent>
      </CardTitle>
    </EditorWrapper>
  );
};

export default CardEditor;
