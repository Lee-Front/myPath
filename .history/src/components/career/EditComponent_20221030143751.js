import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import styled from "@emotion/styled";

const EditableTag = styled(ContentEditable)`
  outline: none;
`;

const EditComponent = ({ tagName, html }) => {
  const [state, setState] = useState({
    html: "",
  });
  const ref = useRef();

  return (
    <EditableTag
      innerRef={ref}
      html={state.html}
      disabled={false}
      tagName={tagName}
      onChange={(e) => setState((prev) => ({ ...prev, html: e.target.value }))}
    />
  );
};

export default EditComponent;
