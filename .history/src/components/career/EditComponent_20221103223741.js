import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import styled from "@emotion/styled";

const EditableTag = styled(ContentEditable)`
  outline: none;
  line-height: 1.5;
`;

const EditComponent = ({
  uuid,
  tagName,
  html,
  defaultPlaceHolder,
  placeholder,
  border,
  radius,
}) => {
  const [state, setState] = useState({
    html: html ? html : "",
  });
  const [editPlaceHolder, setEditPlaceHolder] = useState(defaultPlaceHolder);
  const ref = useRef();

  return (
    <EditableTag
      innerRef={ref}
      uuid={uuid}
      html={"asdasd"}
      disabled={false}
      placeholder={editPlaceHolder}
      tagName={tagName}
      style={{ borderRadius: `${radius}`, border: `${border}` }} // 임시로 표시
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
