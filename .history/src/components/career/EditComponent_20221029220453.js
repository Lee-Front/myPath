import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";

const EditComponent = ({ tagName, html }) => {
  const [state, setState] = useState({
    html: "",
  });
  const ref = useRef();

  return (
    <ContentEditable
      style={{ outline: "none" }}
      innerRef={ref}
      html={state.html}
      disabled={false}
      placeholder="제목을 입력하세요"
      tagName={tagName}
      onChange={(e) => setState((prev) => ({ ...prev, html: e.target.value }))}
    />
  );
};

export default EditComponent;
