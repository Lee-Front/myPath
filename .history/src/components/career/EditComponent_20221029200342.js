import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";

const EditComponent = ({ block }) => {
  console.log("asdf");
  console.log("block : ", block);
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
    />
  );
};

export default EditComponent;
