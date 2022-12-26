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
  display: flex;
  flex-direction: column;
`;

const CardEditor = () => {
  const [nearElement, setNearElement] = useState(null);
  const [editDom, setEditDom] = useState([]);
  const editorRef = useRef();

  const testFn = (x, y) => {
    let Contents = Array.from(editorRef.current.children);

    if (Contents.length > 0) {
      Contents = Contents.filter((item) => {
        const { top, bottom, left, right } = item.getBoundingClientRect();
        if (top <= y && bottom >= y) {
          item.top = top;
          item.bottom = bottom;
          item.left = left;
          item.right = right;
          return item;
        }
      });
      console.log(Contents);
      for (let i = 0; i < Contents.length; i++) {}
    }
  };

  return (
    <EditorWrapper>
      <CardTitle>
        <EditComponent
          tagName="div"
          html=""
          defaultPlaceHolder="제목을 입력하세요"
        ></EditComponent>
      </CardTitle>
      <CardEditorContentWrapper
        ref={editorRef}
        onMouseMove={(e) => {
          const { clientX, clientY } = e.nativeEvent;
          testFn(clientX, clientY);
        }}
        onClick={() => {
          if (!nearElement) {
            setEditDom((prevEditDom) => [
              ...prevEditDom,
              {
                uuid: uuidv4(),
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
        {editDom.map((element) => (
          <EditComponent
            key={element.uuid}
            uuid={element.uuid}
            tagName={element.tagName ? element.tagName : "div"}
            html={element?.html}
            defaultPlaceholder={element.defaultPlaceholder}
            placeholder={element.placeholder}
          ></EditComponent>
        ))}
      </CardEditorContentWrapper>
    </EditorWrapper>
  );
};

export default CardEditor;
