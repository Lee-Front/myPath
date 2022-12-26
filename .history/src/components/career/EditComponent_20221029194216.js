import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import styled from "@emotion/styled";

const EditorComponentWrapper = EditComponent`

`;

const EditComponent = () => {
  const [state, setState] = useState({
    html: "",
  });
  const ref = useRef();

  return (
    <EditorComponentWrapper
      innerRef={ref}
      html={state.html}
      disabled={false}
      tagName="div"
      onChange={(e) => setState((prev) => ({ ...prev, html: e.target.value }))}
    />
  );
};

export default EditComponent;
