import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import styled from "@emotion/styled";

const EditComponent = () => {
  const [state, setState] = useState({
    html: "",
  });
  const ref = useRef();

  return (
    <ContentEditable
      innerRef={ref}
      html={state.html}
      disabled={false}
      tagName="div"
      onChange={(e) => setState((prev) => ({ ...prev, html: e.target.value }))}
    >
      123
    </ContentEditable>
  );
};

export default EditComponent;
