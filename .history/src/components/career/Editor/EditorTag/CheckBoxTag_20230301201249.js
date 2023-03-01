import React from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { useState } from "react";
import EditBranchComponent from "../EditBranchComponent";
import { useEffect } from "react";

const CheckBoxTagWrapper = styled.div`
  //position: relative;
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
const CheckBoxTag = ({
  style,
  data,
  hoverUuid,
  movementSide,
  modifyEditDom,
  overlayWidth,
}) => {
  const [state, setState] = useState({
    html: data.html ? data.html : "",
    checkYn: data.checkYn ? data.checkYn : false,
  });
  const [boxHeight, setBoxHeight] = useState(16);
  const editRef = useRef(null);

  useEffect(() => {
    if (editRef.current) {
      const rect = editRef.current?.getBoundingClientRect();
      setBoxHeight(rect.height);
    }
  }, [data?.styleData?.fontSize]);

  return (
    <div
      uuid={data.uuid}
      style={{
        position: "relative",
        width: overlayWidth + "%",
      }}
    >
      <CheckBoxTagWrapper styleData={data?.styleData}>
        <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "2rem",
              height: boxHeight + "px",
              marginRight: "0.4rem",
              cursor: "pointer",
            }}
            onClick={() => {
              setState((prev) => ({ ...prev, checkYn: !state.checkYn }));
              modifyEditDom(data.uuid, {
                checkYn: !state.checkYn,
              });
            }}
          >
            <div style={{ width: "1.6rem", height: "1.6rem" }}>
              {!state.checkYn ? (
                <svg
                  viewBox="0 0 16 16"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    flexshrink: 0,
                    backfacevisibility: "hidden",
                  }}
                >
                  <path d="M1.5,1.5 L1.5,14.5 L14.5,14.5 L14.5,1.5 L1.5,1.5 Z M0,0 L16,0 L16,16 L0,16 L0,0 Z"></path>
                </svg>
              ) : (
                <div
                  style={{
                    background: "rgb(35, 131, 226)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg
                    viewBox="0 0 14 14"
                    style={{
                      width: "12px",
                      height: "12px",
                      display: "block",
                      fill: "white",
                      flexshrink: 0,
                      backfacevisibility: "hidden",
                    }}
                  >
                    <polygon points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"></polygon>
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div
            style={{ flex: 1, position: "relative", height: "100%" }}
            className="text-area"
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

                  const target = document.querySelector(
                    `[uuid="${data.uuid}"]`
                  );
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

                  modifyEditDom(data.uuid, {
                    html: newHtml,
                  });
                } else {
                  modifyEditDom(data.uuid, {
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
                modifyEditDom={modifyEditDom}
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
      </CheckBoxTagWrapper>
      {hoverUuid === data.uuid ? (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            pointerEvents: "none",
            background: "rgba(55, 53, 47, 0.1)",
          }}
        ></div>
      ) : null}
    </div>
  );
};

export default CheckBoxTag;
