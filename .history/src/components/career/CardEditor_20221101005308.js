import React from "react";
import styled from "@emotion/styled";
import EditComponent from "./EditComponent";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import { useEffect } from "react";

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
        const { top, bottom } = item.getBoundingClientRect();
        if (top <= y && bottom >= y) {
          return item;
        }
      });

      let nearEl = null;
      for (let i = 0; i < Contents.length; i++) {
        if (!nearEl) {
          nearEl = Contents[i];
        } else {
          const { prevLeft } = nearEl.getBoundingClientRect();
          const { left } = Contents[i].getBoundingClientRect();
          if (Math.abs(x - prevLeft) > Math.abs(x - left)) {
            nearEl = Contents[i];
          }
        }
      }
      if (nearEl) {
        setNearElement(nearEl);
      }
    }
  };

  useEffect(() => {
    if (nearElement) {
      console.log("nearElement : ", nearElement.offsetTop);
    }
  }, [nearElement]);

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

        <div style={{ position: "absolute", top: 0, left: 0 }}>
          {nearElement ? (
            <div
              style={{
                position: "absolute",
                width: "18px",
                height: "24px",
                top: nearElement.offsetTop,
              }}
            >
              <div>
                <svg
                  viewBox="0 0 10 10"
                  style={{
                    width: "14px",
                    height: "14px",
                    display: "block",
                    flexShrink: 0,
                    backfaceVisibility: "hidden",
                    fill: "rgba(55, 53, 47, 0.35)",
                  }}
                >
                  <path d="M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z"></path>
                </svg>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </CardEditorContentWrapper>
    </EditorWrapper>
  );
};

export default CardEditor;
