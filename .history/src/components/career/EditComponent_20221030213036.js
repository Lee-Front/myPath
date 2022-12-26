import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import styled from "@emotion/styled";

const EditableTag = styled(ContentEditable)`
  outline: none;
`;

const EditComponent = ({
  tagName,
  html,
  placeholder,
  onFocus,
  onBlur,
  init,
}) => {
  const [state, setState] = useState({
    html: "",
  });
  const [editPlaceHolder, setEditPlaceHolder] = useState(placeholder);

  const ref = useRef();

  init();
  return (
    <EditableTag
      innerRef={ref}
      html={state.html}
      disabled={false}
      placeholder={editPlaceHolder}
      tagName={tagName}
      onChange={(e) => setState((prev) => ({ ...prev, html: e.target.value }))}
    />
  );
};

export default EditComponent;
