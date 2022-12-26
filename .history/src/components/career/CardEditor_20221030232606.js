import React from "react";
import styled from "@emotion/styled";
import EditComponent from "./EditComponent";
import { useState } from "react";

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: 0.5s;
  border-radius: 1rem;
  padding: 1rem;
  background-color: #f9f4e9;
  font-size: 1.6rem;
`;

const CardTitle = styled.div`
  font-size: 4rem;
`;

const CardEditorContentWrapper = styled.div`
  flex: 1;
`;

const CardEditor = () => {
  const [nearElement, setNearElement] = useState(null);
  return (
    <EditorWrapper
      onGotPointerCapture={(e) => {
        console.log(e);
      }}
      onMouseMove={(e) => {
        const { layerX, layerY } = e.nativeEvent;
        console.log(e.target);
        setNearElement(document.elementFromPoint(layerX));
      }}
      onMouseOut={() => {
        setNearElement(null);
      }}
    >
      <CardTitle>
        <EditComponent
          tagName="div"
          html=""
          defaultPlaceHolder="제목을 입력하세요"
        ></EditComponent>
      </CardTitle>
      <CardEditorContentWrapper>
        <EditComponent
          tagName="div"
          html=""
          placeholder="내용을 입력하세요"
        ></EditComponent>
        <EditComponent
          tagName="div"
          html=""
          placeholder="내용을 입력하세요"
        ></EditComponent>
      </CardEditorContentWrapper>
    </EditorWrapper>
  );
};

export default CardEditor;
