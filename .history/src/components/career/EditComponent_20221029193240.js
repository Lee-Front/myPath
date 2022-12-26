import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import { isBlock } from "typescript";

const EditComponent = ({ block }) => {
  const [state, setState] = useState({
    html: isBlock.contents,
    tagName: "div",
  });
  const ref = useRef();

  return (
    <ContentEditable
      innerRef={ref}
      html={state.html}
      disabled={false}
      onChange={(e) => setState((prev) => ({ ...prev, html: e.target.value }))}
    />
  );
};

export default EditComponent;
