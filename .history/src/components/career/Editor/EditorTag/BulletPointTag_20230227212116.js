import React from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { useState } from "react";
import EditBranchComponent from "../EditBranchComponent";

const BulletPointTagWrapper = styled.div`
  position: relative;
  //line-height: 1.5;
  outline: none;
  display: flex;
  //padding: 0.2rem 0.4rem;
  color: rgb(55, 53, 47);

  // 여기부턴 태그 설정 스타일
  justify-content: ${(props) =>
    props?.styleData?.textAlign ? props?.styleData?.textAlign : null};
  font-size: ${(props) =>
    props?.styleData?.fontSize ? props?.styleData?.fontSize + "px" : null};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};
`;

const BulletPointTag = ({
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
  const editRef = useRef(null);

  return (
    <div
      uuid={data.uuid}
      style={{
        position: "relative",
        width: overlayWidth + "%",
        background: "rgba(55, 53, 47, 0.08)",
      }}
    >
      <BulletPointTagWrapper styleData={data?.styleData}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: (data?.styleData?.fontSize || "16") + "px",
            }}
          >
            <svg style={{ width: "30%" }} viewBox="0 0 512 512">
              <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z" />
            </svg>
          </div>

          <div
            style={{ flex: 1, position: "relative" }}
            className="checkbox-text"
          >
            <div
              className="editable-tag"
              style={{
                outline: "none",
                flex: 1,
                paddingLeft: "0.4rem",
                wordBreak: "break-word",
                height: "100%",
                display: "flex",
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
              <div key={index}>
                <EditBranchComponent
                  key={element.uuid}
                  data={element}
                  hoverUuid={hoverUuid}
                  modifyEditDom={modifyEditDom}
                  movementSide={movementSide}
                />
              </div>
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
      </BulletPointTagWrapper>
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

export default BulletPointTag;
