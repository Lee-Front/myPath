import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";

const EditComponent = () => {
  const [state, setState] = useState({
    html: "",
  });
  const ref = useRef();
  console.log("block :", block);

  return (
    <ContentEditable
      innerRef={ref}
      html={state.html}
      disabled={false}
      tagName="div"
      onChange={(e) => setState((prev) => ({ ...prev, html: e.target.value }))}
    />
  );
};

export default EditComponent;
