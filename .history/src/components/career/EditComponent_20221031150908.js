import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import styled from "@emotion/styled";

const EditableTag = styled(ContentEditable)`
  outline: none;
`;

const EditComponent = ({
  tagName,
  html,
  defaultPlaceHolder,
  placeholder,
  setNearElement,
}) => {
  const [state, setState] = useState({
    html: html,
  });
  const [editPlaceHolder, setEditPlaceHolder] = useState(defaultPlaceHolder);
  const ref = useRef();

  return (
    <EditableTag
      innerRef={ref}
      html={state.html}
      disabled={false}
      placeholder={editPlaceHolder}
      tagName={tagName}
      onMouseEnter={() => {
        console.log(setNearElement);
        setNearElement(ref);
      }}
      onFocus={() => {
        if (placeholder) {
          setEditPlaceHolder(placeholder);
        }
      }}
      onBlur={() => {
        setEditPlaceHolder(defaultPlaceHolder);
      }}
      onChange={(e) => setState((prev) => ({ ...prev, html: e.target.value }))}
    />
  );
};

export default EditComponent;
