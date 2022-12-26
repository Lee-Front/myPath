import React, { useState } from "react";
import ContentEditable from "react-contenteditable";
import styled from "@emotion/styled";
import { useEffect } from "react";
import { useCallback } from "react";

const EditableTag = styled(ContentEditable)`
  outline: none;
  line-height: 1.5;
`;

const EditComponent = ({
  uuid,
  hoverUuid,
  tagName,
  html,
  defaultPlaceHolder,
  placeholder,
  children,
  modifyEditDom,
}) => {
  const [state, setState] = useState({
    html: html ? html : "",
  });
  const [editPlaceHolder, setEditPlaceHolder] = useState(defaultPlaceHolder);

  useEffect(() => {
    if (modifyEditDom) {
      modifyEditDom(uuid, state.html);
    }
  }, [state.html]);

  return (
    <div uuid={uuid} style={{ position: "relative", paddingLeft: "1.5rem" }}>
      {tagName !== "title" ? (
        <div>
          <div
            style={{
              width: "18px",
              height: "24px",
              left: "-20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg
              viewBox="0 0 10 10"
              style={{
                width: "14px",
                height: "14px",
                display: "block",
                flexShrink: 0,
                backfaceVisibility: "hidden",
                fill: "rgba(55, 53, 47, 0.35)",
              }}
            >
              <path d="M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z"></path>
            </svg>
          </div>
        </div>
      ) : null}
      <div>
        <EditableTag
          html={state.html}
          style={{
            background: hoverUuid === uuid ? "rgba(55,53,47,0.08)" : "",
          }}
          disabled={false}
          placeholder={editPlaceHolder}
          tagName={tagName === "title" ? "div" : tagName}
          onFocus={() => {
            if (placeholder) {
              setEditPlaceHolder(placeholder);
            }
          }}
          onBlur={() => {
            setEditPlaceHolder(defaultPlaceHolder);
          }}
          onChange={(e) => {
            setState((prev) => ({ ...prev, html: e.target.value }));
          }}
        />
        {children}
      </div>
    </div>
  );
};

export default EditComponent;
