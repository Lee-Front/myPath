import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import styled from "@emotion/styled";

const EditableTag = styled(ContentEditable)`
  outline: none;
  line-height: 1.5;
  border: ${(props) => props.border};
`;

const EditComponent = ({
  uuid,
  tagName,
  html,
  defaultPlaceHolder,
  placeholder,
  $border,
  $borderRadius,
}) => {
  const [state, setState] = useState({
    html: html,
  });
  const [editPlaceHolder, setEditPlaceHolder] = useState(defaultPlaceHolder);
  const ref = useRef();

  return (
    <EditableTag
      innerRef={ref}
      uuid={uuid}
      html={state.html}
      disabled={false}
      placeholder={editPlaceHolder}
      tagName={tagName}
      $border={$border}
      $radius={$borderRadius}
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
