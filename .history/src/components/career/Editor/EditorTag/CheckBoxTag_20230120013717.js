import React from "react";
import EditComponent from "../EditComponent";

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
