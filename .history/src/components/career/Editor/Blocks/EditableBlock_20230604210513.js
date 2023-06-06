import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import EditBranchComponent from "../EditBranchComponent";

const EditableBlock = ({
  updateElement,
  data,
  overlayWidth,
  movementSide,
  style,
}) => {
  const [html, setHtml] = useState(data?.html);
  const [isHover, setIsHover] = useState(false);
  const [editPlaceHolder, setEditPlaceHolder] = useState(null);
  const editRef = useRef(null);

  const handleInput = (e) => {
    const childNodes = Array.from(e.target.childNodes);
    let newHtml = "";
    if (childNodes.length > 1) {
      for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i]?.nodeName === "SPAN") {
          newHtml += childNodes[i].outerHTML;
        } else {
          console.log("childNodes[i] : ", childNodes[i]);
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

      const target = document.querySelector(`[data-uuid="${data.uuid}"]`);
      const editableTag = target.querySelector(".editable-tag");

      //editableTag.innerHTML = newHtml;

      const newChildeList = Array.from(editableTag.childNodes).map((node) => {
        if (node.nodeName === "SPAN") {
          node = node.firstChild;
        }
        return node;
      });

      const newRange = document.createRange();
      newRange.setStart(newChildeList[startIndex], startOffset);
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(newRange);

      updateElement(data.uuid, {
        html: newHtml,
      });
    } else {
      updateElement(data.uuid, {
        html: e.target.innerHTML,
      });
    }
  };

  return (
    <EditableBlockContainer>
      <EditBranchComponent />
      {isHover ? (
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
      {style ? <div style={style}></div> : null}
    </EditableBlockContainer>
  );
};

export default EditableBlock;

const EditableBlockContainer = styled.div`
  text-align: ${(props) =>
    props?.styleData?.textAlign ? props?.styleData?.textAlign : null};
  font-size: ${(props) =>
    props?.styleData?.fontSize ? props?.styleData?.fontSize + "px" : "1.6rem"};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};
`;
