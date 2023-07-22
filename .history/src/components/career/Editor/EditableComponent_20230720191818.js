import React, { useState } from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import useEditorStore from "../../../stores/useEditorStore";
import useTextStyler from "../../../hooks/useTextStyler";

const EditableComponent = ({ data }) => {
  const [html, setHtml] = useState(data?.html);
  const [editPlaceHolder, setEditPlaceHolder] = useState(null);
  const editRef = useRef(null);
  const editorStore = useEditorStore();
  const textStyler = useTextStyler();

  const handleInput = (e) => {
    const childNodes = Array.from(e.target.childNodes);
    let newHtml = "";
    for (let i = 0; i < childNodes.length; i++) {
      if (childNodes[i] instanceof Text) {
        newHtml += childNodes[i].textContent;
      } else {
        newHtml += childNodes[i].outerHTML;
      }
    }
    editorStore.updateBlocks([data.uuid], {
      html: newHtml,
    });
  };

  const handleClick = (e) => {
    const isAnchorElement = e.target.closest("a");

    if (isAnchorElement) {
      const href = isAnchorElement.getAttribute("href");
      if (href) {
        window.open(href, "_blank");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const nodes = Array.from(editRef.current.childNodes);
      const nodeDatas = textStyler.getNodesData(nodes);
      const caretInfo = textStyler.getCaretInfoFromNodes(nodes);
      const splited = textStyler.splitNodes(nodeDatas, caretInfo);
      console.log("splited: ", splited);

      const newblock = editorStore.createBlock({ tagName: "div" });
      const blocks = JSON.parse(JSON.stringify(editorStore.blocks));
      const block = blocks.find((block) => block.uuid === data.uuid);

      const index = blocks.findIndex((block) => block.uuid === data.uuid);
      const splitedText = splited.splitedNodeDatas[0]?.textContent;
      block.html = splitedText;
      console.log(nodes[splited.splitedDragInfo.startNodeIndex]);
      nodes[splited.splitedDragInfo.startNodeIndex].textContent = splitedText;

      blocks.splice(index + 1, 0, newblock);
      editorStore.saveBlocks(blocks);
    }
  };

  return (
    <Editable
      ref={editRef}
      styleData={data?.style || {}}
      chilcCount={editRef?.current?.childNodes?.length}
      name="editable-tag"
      contentEditable={true}
      suppressContentEditableWarning={true}
      placeholder={editPlaceHolder}
      onFocus={() => {
        setEditPlaceHolder("내용을 입력하세요");
      }}
      onBlur={() => {
        setEditPlaceHolder(null);
      }}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning={true}
    />
  );
};

export default EditableComponent;

const Editable = styled.div`
  position: relative;
  outline: none;
  flex: 1;
  word-break: break-all;
  white-space: pre-wrap;

  font-size: ${(props) =>
    props?.styleData["font-size"] ? props?.styleData["font-size"] : "1.6rem"};
  color: ${(props) =>
    props?.styleData?.color ? props?.styleData?.color : null};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};
  font-weight: ${(props) =>
    props?.styleData["font-weight"] ? props?.styleData["font-weight"] : ""};
  font-style: ${(props) =>
    props?.styleData["font-style"] ? props?.styleData["font-style"] : ""};
  border-bottom: ${(props) =>
    props?.styleData["border-bottom"] ? props?.styleData["border-bottom"] : ""};
  text-decoration: ${(props) =>
    props?.styleData["text-decoration"]
      ? props?.styleData["text-decoration"]
      : ""};
  text-align: ${(props) =>
    props?.styleData["text-align"] ? props?.styleData["text-align"] : ""};
`;