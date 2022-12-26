import React from "react";
import styled from "@emotion/styled";
import EditComponent from "./EditComponent";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";

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
  const editorRef = useRef();
  const [nearElement, setNearElement] = useState(null);
  const [editDom, setEditDom] = useState([
    {
      id: uuidv4(),
      tagName: "div",
      html: "",
      defaultPlaceHolder: "",
      placeholder: "내용을 입력하세요",
    },
    {
      id: uuidv4(),
      tagName: "div",
      html: "",
      defaultPlaceHolder: "",
      placeholder: "내용을 입력하세요",
    },
  ]);

  const findNearestElement = (x, y, radius) => {
    if (!radius) radius = 10;

    const elements = [];
    for (let i = 0; i < radius; i++) {
      console.log(editorRef.current.document);
      const findEl = document.elementFromPoint(x + i, y);
      if (findEl) {
        console.log("findEl : ", findEl);
      }
    }

    elements.push(1);

    return null;
  };

  return (
    <EditorWrapper
      onMouseMove={(e) => {
        const { clientX, clientY } = e.nativeEvent;
        const element = findNearestElement(clientX, clientY);
        if (element) {
          console.log(element);
        }
      }}
      onClick={() => {
        if (!nearElement) {
          setEditDom((prevEditDom) => [
            ...prevEditDom,
            {
              id: uuidv4(),
              tagName: "div",
              html: "",
              defaultPlaceHolder: "",
              placeholder: "내용을 입력하세요",
            },
          ]);
        }
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
      <CardEditorContentWrapper ref={editorRef}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {editDom.map((element) => (
            <EditComponent
              key={element.id}
              tagName={element.tagName ? element.tagName : "div"}
              html={element?.html}
              defaultPlaceholder={element.defaultPlaceholder}
              placeholder={element.placeholder}
            ></EditComponent>
          ))}
        </div>
      </CardEditorContentWrapper>
    </EditorWrapper>
  );
};

export default CardEditor;
