import React from "react";

const CheckBoxTag = ({ style, data }) => {
  return (
    <div uuid={data.uuid} style={{ position: "relative" }}>
      <div>
        <EditComponent
          data={data}
          nearUuid={nearUuid}
          modifyEditDom={modifyEditDom}
          style={style}
        />
      </div>
    </div>
  );
};

export default CheckBoxTag;
