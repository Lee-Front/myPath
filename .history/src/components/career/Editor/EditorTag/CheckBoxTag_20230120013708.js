import React from "react";
import EditComponent from "../EditComponent";

const CheckBoxTag = ({ style, data }) => {
  return (
    <div uuid={data.uuid} style={{ position: "relative" }}>
      <div>
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
