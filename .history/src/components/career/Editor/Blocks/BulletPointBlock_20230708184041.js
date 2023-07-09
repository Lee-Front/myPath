import React from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { useState } from "react";
import EditBranchComponent from "../EditBranchComponent";
import { useEffect } from "react";
import useEditorStore from "../../../../stores/useEditorStore";

const BlockContainer = styled.div`
  position: relative;
  //line-height: 1.5;
  outline: none;
  display: flex;
  margin: 0.4rem;
  color: rgb(55, 53, 47);

  // 여기부턴 태그 설정 스타일
  justify-content: ${(props) =>
    props?.styleData?.textAlign ? props?.styleData?.textAlign : null};
  font-size: ${(props) =>
    props?.styleData?.fontSize ? props?.styleData?.fontSize + "px" : "16px"};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};
`;
const CheckBoxBlock = ({
  style,
  data,
  hoverUuid,
  movementSide,
  overlayWidth,
}) => {
  const [state, setState] = useState({
    html: data.html ? data.html : "",
  });

  const [boxHeight, setBoxHeight] = useState(16);
  const editRef = useRef(null);
  const editorStore = useEditorStore();

  useEffect(() => {
    if (editRef.current) {
      const rect = editRef.current?.getBoundingClientRect();
      setBoxHeight(rect.height);
    }
  }, [data?.styleData?.fontSize]);

  return (
    <BlockContainer styleData={data?.style}>
      <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
        <CheckBoxWrapper>
          <BulletImage
            viewBox="0 0 512 512"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              flexshrink: 0,
              backfacevisibility: "hidden",
            }}
          >
            <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z" />
          </BulletImage>
        </CheckBoxWrapper>

        <div
          style={{ flex: 1, position: "relative", height: "100%" }}
          name="text-area"
        >
          <div
            className="editable-tag"
            style={{
              outline: "none",
              wordBreak: "break-word",
            }}
            ref={editRef}
            contentEditable={true}
            suppressContentEditableWarning={true}
            onDragStart={(e) => {
              e.preventDefault();
            }}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
            onAuxClick={(e) => {
              // 오른쪽 클릭
              e.preventDefault();
            }}
            placeholder="할 일"
            onInput={(e) => {
              const childNodes = Array.from(e.target.childNodes);
              let newHtml = "";

              if (childNodes.length > 1) {
                for (let i = 0; i < childNodes.length; i++) {
                  if (childNodes[i]?.nodeName === "SPAN") {
                    newHtml += childNodes[i].outerHTML;
                  } else {
                    newHtml += childNodes[i].textContent;
                  }

                  if (
                    childNodes[i]?.nodeName === "SPAN" ||
                    childNodes[i]?.nodeName === "B"
                  ) {
                    childNodes[i] = childNodes[i].firstChild;
                  }
                }

                const range = window.getSelection().getRangeAt(0);

                const startIndex = childNodes.indexOf(range.startContainer);
                const startOffset = range.startOffset;

                const target = document.querySelector(`[uuid="${data.uuid}"]`);
                const editableTag = target.querySelector(".editable-tag");
                editableTag.innerHTML = newHtml;
                const newChildeList = Array.from(editableTag.childNodes).map(
                  (node) => {
                    if (node.nodeName === "SPAN") {
                      node = node.firstChild;
                    }
                    return node;
                  }
                );

                const newRange = document.createRange();
                newRange.setStart(newChildeList[startIndex], startOffset);
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(newRange);

                editorStore.updateBlock(data.uuid, {
                  html: newHtml,
                });
              } else {
                editorStore.updateBlock(data.uuid, {
                  html: e.target.innerHTML,
                });
              }
            }}
            dangerouslySetInnerHTML={{ __html: state.html }}
            suppressHydrationWarning={true}
          />
          {data?.multipleData?.map((element, index) => (
            <EditBranchComponent
              key={element.uuid}
              data={element}
              hoverUuid={hoverUuid}
              movementSide={movementSide}
            />
          ))}
        </div>
      </div>

      {style ? (
        movementSide?.movementSideType === "text" ? (
          <>
            <div
              style={{
                background: "rgba(35,131,226,0.43)",
                bottom: 0,
                left: 0,
                position: "absolute",
                width: "2.5rem",
                height: "4px",
              }}
            ></div>
            <div
              style={{
                background: "rgba(35,131,226,0.63)",
                bottom: 0,
                left: "2.7rem",
                position: "absolute",
                width: "calc(100% - 2.7rem)",
                height: "4px",
              }}
            ></div>
          </>
        ) : (
          <div style={style}></div>
        )
      ) : null}
    </BlockContainer>
  );
};

export default CheckBoxBlock;

const CheckBoxWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.1rem;
  height: 2.5rem;
  cursor: pointer;
`;

const BulletImage = styled.svg`
  display: block;
  width: 1.6rem;
  height: 1.6rem;
  flex-shrink: 0;
  backface-visibility: hidden;
  fill: ${(props) => props.checkYn && "white"};
  background: ${(props) => props.checkYn && "rgb(35, 131, 226)"};
`;
