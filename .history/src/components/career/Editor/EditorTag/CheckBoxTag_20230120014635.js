import React from "react";
import EditComponent from "../EditComponent";
import styled from "@emotion/styled";

const EditableTag = styled.div`
  outline: none;
  line-height: 1.5;
  padding: 0 0.4rem;
  :hover {
    background: rgba(55, 53, 47, 0.08);
  }
`;
const CheckBoxTag = ({ style, data }) => {
  return (
    <div uuid={data.uuid} style={{ position: "relative" }}>
      <div style={{ display: "flex" }}>
        <div>ㅁ</div>
        <EditComponent
          data={data}
          // nearUuid={nearUuid}
          // modifyEditDom={modifyEditDom}
          style={style}
        />
      </div>
    </div>
  );
};

export default CheckBoxTag;
